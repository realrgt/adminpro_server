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

// ================================
// POST
// ================================
router.post("/", (req, res, next) => {
  const hospital = new Hospital({
    name: req.body.name,
    user: req.body.user,
    img: req.body.img,
  });

  hospital
    .save()
    .then(result => {
      res.status(201).json({
        ok: true,
        message: "created successfully",
        hospital: result
      });
    })
    .catch(err => {
      res.status(400).json({
        ok: false,
        message: "Error creating hospital",
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
  Hospital.findById(id, "name user img", (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error finding hospital",
        error: err
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        message: "No hospital found for provided ID",
        id: id
      });
    }

    // Updating user data
    hospital.name = body.name;
    // hospital.user = body.user;
    // hospital.img = body.img;

    // Saving changes
    hospital.save((err, hospitalSaved) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error updating hospital",
          error: err
        });
      }

      res.status(200).json({
        ok: true,
        hospital: hospitalSaved
      });
    });
  });
});

// ================================
// DELETE
// ================================
router.delete("/:id", (req, res, next) => {
    const id = req.params.id;
  
    Hospital.deleteOne({ _id: id })
      .exec()
      .then(() => {
        res.status(200).json({
          ok: true,
          message: "Hospital deleted successfully"
        });
      })
      .catch(err => {
        res.status(500).json({
          ok: false,
          message: `Error deleting hospital with provided ID: ${id}`,
          error: err
        });
      });
  });

module.exports = router;
