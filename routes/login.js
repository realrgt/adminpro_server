const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/user");

router.post("/", (req, res, next) => {
  const body = req.body;

  User.findOne({ email: body.email })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(400).json({
          ok: false,
          message: `Incorrect email - ${body.email}`
        });
      }

      if ( !bcrypt.compareSync(body.password, user.password) ) {
        return res.status(400).json({
          ok: false,
          message: `Incorrect password - ${body.password}`
        });
      }

      // create token

      res.status(200).json({
        ok: true,
        message: "User found",
        user: user,
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
