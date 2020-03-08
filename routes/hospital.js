const express = require("express");
const router = express.Router();

const Hospital = require("../models/hospital");
const mdAuth = require('../middlewares/auth');

// ================================
// GET
// ================================
router.get("/", (req, res, next) => {
  Hospital.find()
    .select("name img user")
    .exec()
    .then(docs => {
      res.status(200).json({
        ok: true,
        hospitals: docs
      });
    })
    .catch(err => {
      res.status(500).json({
        ok: false,
        message: "Error getting hospitals",
        error: err
      });
    });
});

module.exports = router;
