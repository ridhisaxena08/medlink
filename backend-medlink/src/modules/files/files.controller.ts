import { created, ok } from '../../shared/utils/apiResponse';
import { authedHandler } from '../../shared/utils/asyncHandler';
import { ApiError } from '../../shared/utils/ApiError';
import * as service from './files.service';

export const upload = authedHandler(async (req, res) => {
  const file = req.file;
  if (!file) throw ApiError.badRequest('A file is required under the "file" field');

  const doc = await service.uploadDocument(req.user, {
    buffer: file.buffer,
    originalName: file.originalname,
    mimeType: file.mimetype,
    ...req.body,
  });
  return created(res, doc);
});

export const list = authedHandler(async (req, res) => {
  const { items, meta } = await service.listDocuments(req.user, req.query as never);
  return ok(res, items, meta as unknown as Record<string, unknown>);
});

export const getMeta = authedHandler(async (req, res) =>
  ok(res, await service.getDocumentMeta(req.user, req.params.id)),
);

export const download = authedHandler(async (req, res) => {
  const { doc, buffer } = await service.downloadDocument(req.user, req.params.id);
  res.setHeader('Content-Type', doc.mimeType);
  res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(doc.title)}"`);
  res.setHeader('Cache-Control', 'private, no-store');
  return res.send(buffer);
});

export const archive = authedHandler(async (req, res) =>
  ok(res, await service.archiveDocument(req.user, req.params.id)),
);
