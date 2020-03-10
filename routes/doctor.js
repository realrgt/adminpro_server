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

// ================================
// PUT
// ================================
router.put("/:id", (req, res, next) => {

    const id = req.params.id;
    let body = req.body;
  
    // Finding users for provided ID
    Doctor.findById(id, "name user img hospital", (err, doctor) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error finding doctor",
          error: err
        });
      }
  
      if (!doctor) {
        return res.status(400).json({
          ok: false,
          message: "No doctor found for provided ID",
          id: id
        });
      }
  
      // Updating user data
      doctor.name = body.name;
      // hospital.user = body.user;
      // hospital.img = body.img;
      // hospital.hospital = body.hospital;
  
      // Saving changes
      doctor.save((err, doctorSaved) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            message: "Error updating doctors data",
            error: err
          });
        }
  
        res.status(200).json({
          ok: true,
          doctor: doctorSaved
        });
      });
    });
  });

// ================================
// DELETE
// ================================
router.delete("/:id", (req, res, next) => {
  const id = req.params.id;

  Doctor.deleteOne({ _id: id })
    .exec()
    .then(() => {
      res.status(200).json({
        ok: true,
        message: "Doctor deleted successfully"
      });
    })
    .catch(err => {
      res.status(500).json({
        ok: false,
        message: `Error deleting the doctor with provided ID: ${id}`,
        error: err
      });
    });
});

module.exports = router;
