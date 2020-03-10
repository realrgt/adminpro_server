const express = require("express");
const router = express.Router();

const Doctor = require("../models/doctor");
const mdAuth = require('../middlewares/auth');

// ================================
// GET
// ================================
router.get("/", (req, res, next) => {
    Doctor.find()
    .select("name img user hospital")
    .exec()
    .then(docs => {
      res.status(200).json({
        ok: true,
        doctors: docs
      });
    })
    .catch(err => {
      res.status(500).json({
        ok: false,
        message: "Error getting doctors",
        error: err
      });
    });
});



module.exports = router;