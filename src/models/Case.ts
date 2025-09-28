// In: models/Case.ts

import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for your document
export interface ICase extends Document {
  patientName: string;
  patientId: string;
  analysisDate: Date;
  scanType: 'brain' | 'chest' | 'skin'; // Updated to match your project
  primaryDiagnosis: string;
  confidenceScore: number;
  narrativeReport: string;
  imageUrl: string;
  heatmapUrl: string;
  status: 'pending' | 'completed'; // Updated to match your project
}

// Define the schema that maps to your MongoDB collection
const CaseSchema: Schema = new Schema({
  patientName: { type: String, required: true },
  patientId: { type: String, required: true },
  analysisDate: { type: Date, default: Date.now },
  scanType: { type: String, required: true },
  primaryDiagnosis: { type: String, required: true },
  confidenceScore: { type: Number, required: true },
  narrativeReport: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heatmapUrl: { type: String, required: true },
  status: { type: String, required: true, default: 'pending' },
});

// This prevents Mongoose from redefining the model on hot reloads in development
const CaseModel = mongoose.models.Case || mongoose.model<ICase>('Case', CaseSchema);

export default CaseModel;