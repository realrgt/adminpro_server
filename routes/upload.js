const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const fs = require("fs");

// default options
router.use(fileUpload());

// models
const User = require("../models/user");
const Hospital = require("../models/hospital");
const Doctor = require("../models/doctor");

router.put("/:type/:id", (req, res, next) => {
  const type = req.params.type; // is user || doctor || hospital
  const id = req.params.id;

  const validTypes = ["users", "doctors", "hospitals"];

  if (validTypes.indexOf(type) < 0) {
    return res.status(400).json({
      ok: false,
      message: "Invalid collection type",
      errors: { message: `Valid collections are ${validTypes.join(", ")}` }
    });
  }

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      message: "No file selected",
      errors: { message: "Must provide an image" }
    });
  }

  // Get image name
  const archive = req.files.image;
  const splittedName = archive.name.split(".");
  const archiveExtension = splittedName[splittedName.length - 1];

  // Only this extensions accepted
  const validExtensions = ["png", "jpg", "gif", "jpeg"];

  if (validExtensions.indexOf(archiveExtension) < 0) {
    return res.status(400).json({
      ok: false,
      message: "File-type not supported",
      errors: {
        message: `Supported extensions are ${validExtensions.join(", ")}`
      }
    });
  }

  // unique archive name
  // Ex: 12343555664-23434.png - ID-milliseconds.ext
  const archiveName = `${id}-${new Date().getMilliseconds()}.${archiveExtension}`;

  // Move file from temp to a path
  const path = `./uploads/${type}/${archiveName}`;

  archive.mv(path, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error moving file",
        errors: err
      });
    }

    uploadByType(type, id, archiveName, res);

  });

});

function uploadByType(type, id, archiveName, res) {

  if (type === 'users') {
    return User.findById(id, (err, user) => {

      if (!user) {
        return res.status(400).json({
          ok: false,
          message: "User doesn\'t exist",
          errors: {message: 'User doesn\'t exist'}
        })
      }

      const filePath = "./uploads/users/" + user.img;
      // if exists, removes old file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      user.img = archiveName;

      user.save((err, updatedUser) => {

        updatedUser.password = ':)';

        res.status(200).json({
          ok: true,
          message: "User image updated",
          user: updatedUser
        });

      });

    });

  }

  if (type === 'doctors') {
    return Doctor.findById(id, (err, doctor) => {

      if (!doctor) {
        return res.status(400).json({
          ok: false,
          message: "Doctor doesn\'t exist",
          errors: {message: 'Doctor doesn\'t exist'}
        })
      }

      const filePath = "./uploads/doctors/" + doctor.img;
      // if exists, removes old file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      doctor.img = archiveName;

      doctor.save((err, updatedDoctor) => {

        res.status(200).json({
          ok: true,
          message: "Doctor\'s image updated",
          doctor: updatedDoctor
        });

      });

    });

  }

  if (type === 'hospitals') {
    return Hospital.findById(id, (err, hospital) => {

      if (!hospital) {
        return res.status(400).json({
          ok: false,
          message: "Hospital doesn\'t exist",
          errors: {message: 'Hospital doesn\'t exist'}
        })
      }

      const filePath = "./uploads/hospitals/" + hospital.img;
      // if exists, removes old file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      hospital.img = archiveName;

      hospital.save((err, updatedHospital) => {

        res.status(200).json({
          ok: true,
          message: "Hospital\'s image updated",
          hospital: updatedHospital
        });

      });

    });

  }

}

module.exports = router;
