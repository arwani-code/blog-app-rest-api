const router = require("express").Router();
const Post = require("../models/Post");

router.post("/", async (req, res) => {
  const post = await new Post(req.body);
  try {
    const savedPosts = await post.save();
    return res.status(200).json(savedPosts);
  } catch (error) {
    return res.status(404).send("not found request");
  }
});

router.put("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    try {
      const updatePost = await post.updateOne({ $set: req.body });
      return res.status(200).json({ message: "Your posts has been updated" });
    } catch (err) {
      return res.status(500).send("failed update your posts");
    }
  } else {
    return res.status(404).send("your only has been update your post");
  }
});

router.delete("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId === req.body.userId) {
    try {
      await post.deleteOne();
      return res.status(200).send("Your posts has been deleted");
    } catch (error) {
      return res.status(200).send("Failed deleted your post");
    }
  } else {
    res.status(404).send("Not found post deleted");
  }
});

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      return res.status(200).json({ msg: "Post has been updated" });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      return res.status(200).json({ msg: "post has been disliked" });
    }
  } catch (error) {
    return res.status(404).json({ msg: "Request post not found" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    return res.status(404).json({ message: "Get post failed" });
  }
});

module.exports = router;
