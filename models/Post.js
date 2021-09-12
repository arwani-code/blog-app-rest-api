const mongoose = require("mongoose");

const Post = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    desc: { type: String, max: 500 },
    img: { type: String },
    likes: { type: Array, default: [] },
  },
  { timestamps: true }
);

const ModelPost = mongoose.model("post", Post);

module.exports = ModelPost;
