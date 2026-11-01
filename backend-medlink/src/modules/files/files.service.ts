import { Types } from 'mongoose';
import { storage } from '../../config/storage';
import { CONSENT_SCOPES, ROLES } from '../../shared/constants';
import { AuthenticatedUser } from '../../shared/types';
import { ApiError } from '../../shared/utils/ApiError';
import { pageMeta, parsePagination } from '../../shared/utils/pagination';
import { assertPatientAccess } from '../../shared/services/access.service';
import { auditAsync } from '../../shared/services/audit.service';
import { DocumentCategory, DocumentModel, IDocument } from './document.model';

export interface UploadInput {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  category: DocumentCategory;
  title: string;
  description?: string;
  tags?: string[];
  documentDate?: Date;
  patient?: string;
  relatedConsultation?: string;
  relatedAppointment?: string;
}

/**
 * Binaries go to object storage; MongoDB keeps only metadata and the key.
 * Uploading on behalf of a patient requires an access decision first.
 */
export const uploadDocument = async (actor: AuthenticatedUser, input: UploadInput): Promise<IDocument> => {
  const patientId = input.patient ?? (actor.role === ROLES.PATIENT ? actor.id : undefined);

  if (patientId && patientId !== actor.id) {
    await assertPatientAccess(actor, patientId, CONSENT_SCOPES.DOCUMENTS, 'document');
  }

  const folder = patientId ? `patients/${patientId}` : `users/${actor.id}`;
  const stored = await storage.put(input.buffer, input.originalName, input.mimeType, folder);

  const doc = await DocumentModel.create({
    patient: patientId ? new Types.ObjectId(patientId) : null,
    owner: new Types.ObjectId(patientId ?? actor.id),
    uploadedBy: new Types.ObjectId(actor.id),
    uploadedByRole: actor.role,
    category: input.category,
    title: input.title,
    description: input.description,
    storageKey: stored.key,
    url: stored.url,
    mimeType: stored.mimeType,
    sizeBytes: stored.size,
    checksum: stored.checksum,
    tags: input.tags ?? [],
    documentDate: input.documentDate ?? null,
    relatedConsultation: input.relatedConsultation ? new Types.ObjectId(input.relatedConsultation) : null,
    relatedAppointment: input.relatedAppointment ? new Types.ObjectId(input.relatedAppointment) : null,
  });

  auditAsync({
    actor, action: 'create', resourceType: 'document', resourceId: String(doc._id),
    subject: patientId ?? null, metadata: { category: input.category },
  });

  return doc;
};

export const listDocuments = async (
  actor: AuthenticatedUser,
  query: { patient?: string; category?: string; page?: number; limit?: number },
) => {
  const patientId = query.patient ?? actor.id;
  if (patientId !== actor.id) {
    await assertPatientAccess(actor, patientId, CONSENT_SCOPES.DOCUMENTS, 'document');
  }

  const page = parsePagination(query as Record<string, unknown>);
  const filter: Record<string, unknown> = {
    $or: [{ patient: new Types.ObjectId(patientId) }, { owner: new Types.ObjectId(patientId) }],
    isArchived: false,
  };
  if (query.category) filter.category = query.category;

  const [items, total] = await Promise.all([
    DocumentModel.find(filter)
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 })
      .skip(page.skip)
      .limit(page.limit)
      .lean(),
    DocumentModel.countDocuments(filter),
  ]);

  return { items, meta: pageMeta(total, page) };
};

const assertCanReadDocument = async (actor: AuthenticatedUser, doc: IDocument) => {
  if (String(doc.owner) === actor.id || String(doc.uploadedBy) === actor.id) return;
  if (doc.patient) {
    await assertPatientAccess(actor, doc.patient, CONSENT_SCOPES.DOCUMENTS, 'document');
    return;
  }
  if (actor.role === ROLES.ADMIN) return;
  throw ApiError.forbidden('You do not have access to this document');
};

export const getDocumentMeta = async (actor: AuthenticatedUser, documentId: string) => {
  const doc = await DocumentModel.findById(documentId);
  if (!doc || doc.isArchived) throw ApiError.notFound('Document not found');
  await assertCanReadDocument(actor, doc);
  return doc;
};

export const downloadDocument = async (actor: AuthenticatedUser, documentId: string) => {
  const doc = await getDocumentMeta(actor, documentId);
  const buffer = await storage.get(doc.storageKey);
  auditAsync({
    actor, action: 'read', resourceType: 'document', resourceId: documentId,
    subject: doc.patient ?? null, metadata: { download: true },
  });
  return { doc, buffer };
};

export const archiveDocument = async (actor: AuthenticatedUser, documentId: string) => {
  const doc = await DocumentModel.findById(documentId);
  if (!doc) throw ApiError.notFound('Document not found');
  if (String(doc.owner) !== actor.id && actor.role !== ROLES.ADMIN) {
    throw ApiError.forbidden('Only the document owner can archive it');
  }
  doc.isArchived = true;
  await doc.save();
  auditAsync({ actor, action: 'delete', resourceType: 'document', resourceId: documentId, subject: doc.patient ?? null });
  return doc;
};
