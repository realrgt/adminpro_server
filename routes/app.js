const express = require('express');

const route = express.Router();

route.get("/", (req, res, next) => {
  res.status(200).json({
    ok: true,
    message: "Request executed successfully"
  });
});

module.exports = route;