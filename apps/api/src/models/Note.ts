import { Schema, model, type InferSchemaType, type Types } from 'mongoose'

const practiceQuestionSchema = new Schema(
  {
    id: { type: String, required: true },
    question: { type: String, required: true },
    score: { type: Number, min: 0, max: 10 },
    adopted: { type: Boolean, default: true },
    source: { type: String, enum: ['ai', 'user'], default: 'ai' },
    lastAnsweredAt: { type: Date },
  },
  { _id: false },
)

const noteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    icon: { type: String, default: 'file-text', trim: true },
    content: { type: String, required: true },
    lectorScore: { type: Number },
    practiceCount: { type: Number, default: 0 },
    lastPracticed: { type: Date },
    retentionHealth: { type: Number, default: 70, min: 0, max: 100 },
    nextReviewDate: { type: Date },
    easinessFactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 0 },
    repetition: { type: Number, default: 0 },
    practiceQuestions: { type: [practiceQuestionSchema], default: [] },
    embedding: { type: [Number], default: undefined, select: false },
    embeddingModel: { type: String, trim: true },
    embeddedAt: { type: Date },
  },
  { timestamps: true },
)

noteSchema.index({ userId: 1, nextReviewDate: 1 })
noteSchema.index({ userId: 1, subject: 1 })
noteSchema.index({ title: 'text', content: 'text' })

export type NoteDocument = InferSchemaType<typeof noteSchema> & {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export const Note = model('Note', noteSchema)
