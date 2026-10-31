import { Schema, model, Document, Types } from 'mongoose';

export interface IMedicineIngredient {
  name: string;
  strength?: string;
  unit?: string;
}

export interface IMedicine extends Document {
  _id: Types.ObjectId;
  name: string;
  genericName: string;
  brandNames: string[];
  manufacturer?: string;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'ointment' | 'drops' | 'inhaler' | 'powder' | 'other';
  strength?: string;
  ingredients: IMedicineIngredient[];
  therapeuticClass?: string;
  prescriptionRequired: boolean;
  /** Short, plain-language explanations - curated, not model-generated. */
  explanation: {
    en: { uses: string; howToTake?: string; commonSideEffects: string[]; warnings: string[] };
    hi: { uses: string; howToTake?: string; commonSideEffects: string[]; warnings: string[] };
  };
  storageInstructions?: string;
  pregnancyCategory?: string;
  searchTokens: string[];
  isVerified: boolean;
  verifiedBy?: Types.ObjectId | null;
  dataVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const explanationBlock = {
  uses: { type: String, default: '' },
  howToTake: String,
  commonSideEffects: { type: [String], default: [] },
  warnings: { type: [String], default: [] },
};

const medicineSchema = new Schema<IMedicine>(
  {
    name: { type: String, required: true, trim: true, index: true },
    genericName: { type: String, required: true, trim: true, index: true },
    brandNames: { type: [String], default: [], index: true },
    manufacturer: String,
    form: {
      type: String,
      enum: ['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drops', 'inhaler', 'powder', 'other'],
      default: 'tablet',
    },
    strength: String,
    ingredients: [{ name: { type: String, required: true }, strength: String, unit: String }],
    therapeuticClass: { type: String, index: true },
    prescriptionRequired: { type: Boolean, default: true },
    explanation: { en: explanationBlock, hi: explanationBlock },
    storageInstructions: String,
    pregnancyCategory: String,
    searchTokens: { type: [String], default: [], index: true },
    isVerified: { type: Boolean, default: false, index: true },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    dataVersion: { type: Number, default: 1, index: true },
  },
  { timestamps: true, collection: 'medicines' },
);

medicineSchema.index({ name: 'text', genericName: 'text', brandNames: 'text' });

medicineSchema.pre('save', function (next) {
  const tokens = new Set<string>();
  [this.name, this.genericName, ...this.brandNames, ...this.ingredients.map((i) => i.name)]
    .filter(Boolean)
    .forEach((value) => value.toLowerCase().split(/[^a-z0-9]+/i).filter(Boolean).forEach((t) => tokens.add(t)));
  this.searchTokens = Array.from(tokens);
  next();
});

export const Medicine = model<IMedicine>('Medicine', medicineSchema);
