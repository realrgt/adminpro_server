const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/", (req, res, next) => {
  const body = req.body;

  User.findOne({ email: body.email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({
          ok: false,
          message: `Incorrect email - ${body.email}`
        });
      }

      if (!bcrypt.compareSync(body.password, user.password)) {
        return res.status(401).json({
          ok: false,
          message: `Incorrect password - ${body.password}`
        });
      }

      // create token
      const token = jwt.sign({ user }, process.env.JWT_KEY, {
        expiresIn: "4h"
      });

      user.password = ':-)';    // hided response password

      res.status(200).json({
        ok: true,
        message: "User found",
        user,
        token,
        id: user._id
      });
    })
    .catch(err => {
      res.status(500).json({
        ok: false,
        message: "Internal server error",
        error: err
      });
    });
});

module.exports = router;
