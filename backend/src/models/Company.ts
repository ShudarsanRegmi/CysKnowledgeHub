import { Schema, model, Document } from 'mongoose';

export interface ICompany extends Document {
  companyName:        string;
  logo:               string;
  industry:           string;
  location:           string;
  website:            string;
  roles:              string[];
  eligibilityCriteria: string;
  salaryPackage:      string;
  ctc?:               number;
  opportunityType:    string[];
  selectionProcess:   string[];
  interviewExperience?: string;
  notesTips:          string;
  createdAt:          Date;
  updatedAt:          Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    companyName:         { type: String, required: true, trim: true },
    logo:                { type: String, default: '' },
    industry:            { type: String, default: '' },
    location:            { type: String, default: '' },
    website:             { type: String, default: '' },
    roles:               [{ type: String }],
    eligibilityCriteria: { type: String, default: '' },
    salaryPackage:       { type: String, default: '' },
    ctc:                 { type: Number },
    opportunityType:     [{ type: String }],
    selectionProcess:    [{ type: String }],
    interviewExperience: { type: String },
    notesTips:           { type: String, default: '' },
  },
  { timestamps: true }
);

CompanySchema.index({ industry: 1 });

export const Company = model<ICompany>('Company', CompanySchema);
