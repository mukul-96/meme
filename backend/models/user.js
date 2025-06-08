import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  memes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meme' }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);