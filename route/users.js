const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.admin) {
    if (req.body.password) {
      try {
        const selt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, selt);
      } catch (error) {
        return res.status(500).json({ message: "Erorr update" });
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.status(200).json({ message: "Data berhasil di update" });
    } catch (error) {
      return res.status(500).json({ message: "Data gagal di update" });
    }
  } else {
    return res.status(404).json({ message: "Data belum berhasil di update" });
  }
});

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "User has been deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Gagal menghapus..." });
    }
  } else {
    return res.status(404).json({ message: "Undefined deleted by id" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (error) {
    return res.status(404).json({ message: "Data user tidak ditemukan" });
  }
});

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: { followers: req.body.userId },
        });
        await currentUser.updateOne({
          $push: { following: req.params.id },
        });
        return res.status(200).json({ message: "user has been followed!!" });
      }
    } catch (error) {
      return res.status(403).json({ message: "you already follow this user" });
    }
  } else {
    return res.status(403).json({ message: "you cannot follow yourself.." });
  }
});

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        return res.status(200).send("user has been unfollowed");
      }
    } catch (error) {
      res.status(403).send("you already unfollow this user");
    }
  } else {
    return res.status.json({ message: "you cannot unfollow yourself.." });
  }
});

module.exports = router;
