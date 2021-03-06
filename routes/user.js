const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const mdAuth = require('../middlewares/auth');

// ================================
// GET
// ================================
router.get("/", (req, res, next) => {

  let fromIndex = req.query.fromIndex || 0;
  fromIndex = Number(fromIndex);
  console.log(`fromIndex: ${fromIndex}`);

  User.find()
    .skip(fromIndex)
    .limit(5)
    .select("name email role img")
    .exec()
    .then(docs => {
      res.status(200).json({
        ok: true,
        count: docs.length, 
        users: docs
      });
    })
    .catch(err => {
      res.status(500).json({
        ok: false,
        message: "Error getting users",
        error: err
      });
    });
});

// ================================
// POST - create new user {SIGNUP}
// ================================
router.post("/", (req, res, next) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    // img: req.body.img,
    password: bcrypt.hashSync(req.body.password, 10)
  });

  user
    .save()
    .then(result => {
      res.status(201).json({
        ok: true,
        message: "created successfully",
        user: result
      });
    })
    .catch(err => {
      res.status(400).json({
        ok: false,
        message: "Error creating users",
        error: err
      });
    });
});

// ================================
// PUT
// ================================
router.put("/:id", mdAuth.verifyToken, (req, res, next) => {

  const id = req.params.id;
  let body = req.body;

  // Finding users for provided ID
  User.findById(id, "name email role img", (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error finding user",
        error: err
      });
    }

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "No user found for provided ID",
        id: id
      });
    }

    // Updating user data
    user.name = body.name;
    user.email = body.email;
    user.role = body.role;

    // Saving changes
    user.save((err, userSaved) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error updating user",
          error: err
        });
      }

      res.status(200).json({
        ok: true,
        user: userSaved
      });
    });
  });
});

// ================================
// DELETE
// ================================
router.delete("/:id", mdAuth.verifyToken, (req, res, next) => {
  const id = req.params.id;

  User.deleteOne({ _id: id })
    .exec()
    .then(() => {
      res.status(200).json({
        ok: true,
        message: "User deleted successfully"
      });
    })
    .catch(err => {
      res.status(500).json({
        ok: false,
        message: `Error deleting user with provided ID: ${id}`,
        error: err
      });
    });
});

module.exports = router;
