const express = require("express");
const router = express.Router();

const Hospital = require("../models/hospital");
const Doctor = require("../models/doctor");
const User = require("../models/user");

// ==========================
// Collection search
// ==========================
router.get("/collection/:table/:keyword", (req, res, next) => {
  var table = req.params.table;
  var keyword = req.params.keyword;
  var regex = new RegExp(keyword, "i");

  let promise;

  switch (table) {
    case "users":
      promise = findUsers(regex);
      break;

    case "hospitals":
      promise = findHospitals(regex);
      break;

    case "doctors":
      promise = findDoctors(regex);
      break;

    default:
      return res.status(400).json({
        ok: false,
        message: "The kind of search are: users, hospitals and doctors",
        error: { message: "Invalid collection provided" }
      });
      break;
  }

  promise.then(docs => {

    res.status(200).json({
        ok: true,
        [table]: docs
    });

  });

});

// ==========================
// GENERAL SEARCH
// ==========================
router.get("/all/:keyword", (req, res, next) => {
  var keyword = req.params.keyword;
  var regex = new RegExp(keyword, "i");

  Promise.all([
    findHospitals(regex),
    findDoctors(regex),
    findUsers(regex, regex)
  ]).then(docs => {
    res.status(200).json({
      ok: true,
      hospitals: docs[0],
      doctors: docs[1],
      users: docs[2]
    });
  });
});

function findHospitals(name) {
  return new Promise((resolve, reject) => {
    // Hospital.find({ name: name }, "name user", (err, hospitals) => {
    //   if (err) {
    //     reject("Error fetching hospitals", err);
    //   } else {
    //     resolve(hospitals);
    //   }
    // });

    Hospital.find({ name })
      .select("name user")
      .exec()
      .then(docs => resolve(docs))
      .catch(err => reject("Error fetching hospitals", err));
  });
}

function findDoctors(name) {
  return new Promise((resolve, reject) => {
    Doctor.find({ name })
      .select("name user")
      .exec()
      .then(docs => resolve(docs))
      .catch(err => reject("Error fetching hospitals", err));
  });
}

function findUsers(name, email) {
  return new Promise((resolve, reject) => {
    User.find()
      .or([{ name }, { email }])
      .select("name email")
      .exec()
      .then(docs => resolve(docs))
      .catch(err => reject("Error fetching users", err));
  });
}

module.exports = router;
