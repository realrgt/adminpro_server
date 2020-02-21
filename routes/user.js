const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.get("/", (req, res, next) => {

    User.find()
    .select('name email role img')
    .exec()
    .then(docs => {
        res.status(200).json({
            ok: true,
            users: docs
        });
    })
    .catch(err => {
        res.status(500).json(err => {
            console.log(err);
            error: err
        })
    });

});

module.exports = router;
