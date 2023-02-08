import mongoose from "mongoose";

import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await PostMessage.countDocuments({});

    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const getPostsBySearch = async (req, res) => {
  try {
    const { searchQuery, tags } = req.query;
    const title = new RegExp(searchQuery, "i"); // title,Title -> title
    const posts = await PostMessage.find({
      $or: [
        { title },
        { tags: { $in: tags.split(",") } },
        { name: title },
        { message: title },
      ], //  {$or} -> find  either title or tags , {$in}-> check input tags in tags
    }).limit(10);

    res.json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

export const getUserPosts = async (req, res) => {
  const { id } = req.params;
  try {
    const userPost = await PostMessage.find({ creator: id });
    res.json(userPost);
  } catch (error) {
    res.json(error);
  }
};

export const createPosts = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (e) {
    res.status(409).json({ message: e.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("no post with this id");

  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("no post with this id");

  await PostMessage.findByIdAndRemove(id);
  res.json({ message: "deleted succesfully" });
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  if (!req.userId) return res.json({ message: "unauthencated" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("no post with this id");
  const post = await PostMessage.findById(id);
  const index = post.likes.findIndex((id) => id === String(req.userId));
  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });
  res.json(updatedPost);
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const post = await PostMessage.findById(id);
  post.comments.push(value);
  const updatePost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatePost);
};
