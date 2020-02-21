// requires
const express = require("express");
const mongoose = require("mongoose");

// initializations
const app = express();

// importing routes
const appRoutes = require('./routes/app');
const userRoutes = require('./routes/user');

// database connection
const uri = "mongodb://localhost:27017/hospitalDB";
mongoose.connection.openUri(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) throw err;
    console.log("Database: \x1b[32m%s\x1b[0m", "online");
  }
);

// routes
app.use("/users", userRoutes);
app.use("/", appRoutes);

// executes queries
app.listen(3000, () => {
  console.log("Server in port 3000: \x1b[32m%s\x1b[0m", "online");
});
