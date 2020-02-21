const express = require("express");
const router = express.Router();
const bcrypt =  require('bcryptjs');

const User = require("../models/user");

router.get("/", (req, res, next) => {
  User.find()
    .select("name email role img")
    .exec()
    .then(docs => {
      res.status(200).json({
        ok: true,
        users: docs
      });
    })
    .catch(err => {
      res.status(500).json({
        ok: false,
        message: 'Error getting users',
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    img: req.body.img,
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
            message: 'Error creating users',
            error: err
        })
    });
});

module.exports = router;
