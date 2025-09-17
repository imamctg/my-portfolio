import mongoose from 'mongoose'

const LectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: { type: Number, default: 0 },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
  resources: [{ type: String }], // For resource files
  order: { type: Number, default: 0 },
})

export default mongoose.model('Lecture', LectureSchema)
