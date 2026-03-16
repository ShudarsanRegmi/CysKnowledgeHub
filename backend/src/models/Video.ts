import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    video_id: { type: String, required: true },
    category: { type: String, required: true },
    tag: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    author_id: { type: String, required: true },
    date: { type: String, required: true },
    base_upvotes: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'published', 'rejected'], default: 'pending' }
});

export default mongoose.model('Video', videoSchema);