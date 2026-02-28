import { Schema, model, Document } from 'mongoose';

const QuestionSchema = new Schema(
  {
    statement:  { type: String },
    topic:      { type: String },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
    followUps:  [{ type: String }],
  },
  { _id: false }
);

const RoundSchema = new Schema(
  {
    name:       { type: String },
    mode:       { type: String },
    duration:   { type: String },
    platform:   { type: String },
    topics:     [{ type: String }],
    difficulty: { type: String },
    questions:  [QuestionSchema],
    feedback:   { type: String },
    dayOffset:  { type: Number },
  },
  { _id: false }
);

const InsightsSchema = new Schema(
  {
    prepStrategy: { type: String },
    mistakes:     [{ type: String }],
    tips:         [{ type: String }],
    resources:    [{ type: String }],
    timeGap:      { type: String },
  },
  { _id: false }
);

export interface IInterview extends Document {
  studentName:  string;
  batch:        string;
  company:      string;
  role:         string;
  domain:       string;
  type:         string;
  result:       string;
  difficulty:   string;
  rounds:       any[];
  insights:     any;
  date:         string;
  views:        number;
  helpfulCount: number;
  tags:         string[];
  createdAt:    Date;
  updatedAt:    Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    studentName:  { type: String, required: true },
    batch:        { type: String, default: '' },
    company:      { type: String, required: true },
    role:         { type: String, required: true },
    domain:       { type: String, default: '' },
    type:         { type: String, default: 'Internship' },
    result:       { type: String, default: 'Selected' },
    difficulty:   { type: String, default: 'Medium' },
    rounds:       [RoundSchema],
    insights:     { type: InsightsSchema },
    date:         { type: String, default: '' },
    views:        { type: Number, default: 0 },
    helpfulCount: { type: Number, default: 0 },
    tags:         [{ type: String }],
  },
  { timestamps: true }
);

InterviewSchema.index({ company: 1 });
InterviewSchema.index({ domain: 1 });
InterviewSchema.index({ result: 1 });

export const Interview = model<IInterview>('Interview', InterviewSchema);
