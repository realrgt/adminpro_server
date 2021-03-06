const express = require("express");
const router = express.Router();

const Hospital = require("../models/hospital");
const mdAuth = require("../middlewares/auth");

// ================================
// GET
// ================================
router.get("/", (req, res, next) => {
  
  let fromIndex = req.query.fromIndex || 0;
  fromIndex = Number(fromIndex);
  console.log(`fromIndex: ${fromIndex}`);

  Hospital.find()
    .skip(fromIndex)
    .limit(5)
    .select("name img user")
    .populate('user', 'name email')
    .exec()
    .then(docs => {
      res.status(200).json({
        ok: true,
        count: docs.length,
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
router.post("/", mdAuth.verifyToken, (req, res, next) => {
  const hospital = new Hospital({
    name: req.body.name,
    user: req.user._id
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
router.put("/:id", mdAuth.verifyToken, (req, res, next) => {
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

    // Updating hospital data
    hospital.name = body.name;
    hospital.user = req.user._id;

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
router.delete("/:id", mdAuth.verifyToken, (req, res, next) => {
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
