import { Schema, model, Document, Types } from 'mongoose';

export type InteractionSeverity = 'minor' | 'moderate' | 'major' | 'contraindicated';

export interface IDrugInteraction extends Document {
  _id: Types.ObjectId;
  /** Normalised lowercase generic/ingredient names - order-independent pair. */
  ingredientA: string;
  ingredientB: string;
  severity: InteractionSeverity;
  mechanism?: string;
  effect: { en: string; hi: string };
  advice: { en: string; hi: string };
  references: string[];
  reviewedBy?: Types.ObjectId | null;
  reviewedAt?: Date | null;
  dataVersion: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const drugInteractionSchema = new Schema<IDrugInteraction>(
  {
    ingredientA: { type: String, required: true, lowercase: true, trim: true, index: true },
    ingredientB: { type: String, required: true, lowercase: true, trim: true, index: true },
    severity: {
      type: String,
      enum: ['minor', 'moderate', 'major', 'contraindicated'],
      required: true,
      index: true,
    },
    mechanism: String,
    effect: { en: { type: String, required: true }, hi: { type: String, default: '' } },
    advice: { en: { type: String, required: true }, hi: { type: String, default: '' } },
    references: { type: [String], default: [] },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    dataVersion: { type: Number, default: 1, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'drugInteractions' },
);

drugInteractionSchema.index({ ingredientA: 1, ingredientB: 1 }, { unique: true });

/** Always store pairs sorted so lookups never need both orderings. */
drugInteractionSchema.pre('validate', function (next) {
  if (this.ingredientA && this.ingredientB && this.ingredientA.toLowerCase() > this.ingredientB.toLowerCase()) {
    const a = this.ingredientA;
    this.ingredientA = this.ingredientB;
    this.ingredientB = a;
  }
  next();
});

export const DrugInteraction = model<IDrugInteraction>('DrugInteraction', drugInteractionSchema);
