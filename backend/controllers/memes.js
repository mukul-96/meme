import Meme from '../models/meme.js';

export const getPublicMemes = async (req, res) => {
  const memes = await Meme.find({ isPublic: true }).sort({ createdAt: -1 });
  res.json(memes);
};

export const createMeme = async (req, res) => {
  const { imageUrl, topText, bottomText, isPublic, owner } = req.body;
  const meme = await Meme.create({ imageUrl, topText, bottomText, isPublic, owner });
  res.status(201).json(meme);
};