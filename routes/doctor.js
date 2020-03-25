const express = require("express");
const router = express.Router();

const Doctor = require("../models/doctor");
const mdAuth = require("../middlewares/auth");

// ================================
// GET
// ================================
router.get("/", (req, res, next) => {

  let fromIndex = req.query.fromIndex || 0;
  fromIndex = Number(fromIndex);
  console.log(`fromIndex: ${fromIndex}`);

  Doctor.find()
    .skip(fromIndex)
    .limit(5)
    .select("name img user hospital")
    .populate('user', 'name email')
    .populate('hospital', 'name user')
    .exec()
    .then(docs => {
      res.status(200).json({
        ok: true,
        count: docs.length,
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
router.post("/", mdAuth.verifyToken, (req, res, next) => {
  const doctor = new Doctor({
    name: req.body.name,
    user: req.user._id,
    hospital: req.body.hospital   // hosts hospital ID
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
        message: "Error creating doctor",
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

    // Updating doctor data
    doctor.name = body.name;
    doctor.hospital = body.hospital;
    doctor.user = req.user._id;

    // Saving changes
    doctor.save((err, doctorSaved) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error updating doctor",
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
router.delete("/:id", mdAuth.verifyToken, (req, res, next) => {
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
        message: `Error deleting doctor with provided ID: ${id}`,
        error: err
      });
    });
});

module.exports = router;
