const express = require("express");
const router = express.Router();

const Doctor = require("../models/doctor");
const mdAuth = require("../middlewares/auth");

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

// ================================
// POST
// ================================
router.post("/", (req, res, next) => {
  const doctor = new Doctor({
    name: req.body.name,
    user: req.body.user,
    img: req.body.img,
    hospital: req.body.hospital
  });

  doctor
    .save()
    .then(result => {
      res.status(201).json({
        ok: true,
        message: "created successfully",
        doctor: result
      });
    })
    .catch(err => {
      res.status(400).json({
        ok: false,
        message: "Error creating a doctor",
        error: err
      });
    });
});



module.exports = router;
