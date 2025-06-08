import mongoose from 'mongoose';

const memeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl: String,
  topText: String,
  bottomText: String,
  isPublic: Boolean,
  likes: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Meme', memeSchema);