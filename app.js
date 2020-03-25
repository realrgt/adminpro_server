// requires
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

// initializations
const app = express();

// importing routes
const appRoutes = require('./routes/app');
const userRoutes = require('./routes/user');
const loginRoutes = require('./routes/login');
const hospitalRoutes = require('./routes/hospital');
const doctorRoutes = require('./routes/doctor');
const searchRoutes = require('./routes/search');
const uploadRoutes = require('./routes/upload');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// database connection
const uri = "mongodb://localhost:27017/hospitalDB";
mongoose.connection.openUri(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err, res) => {
    if (err) throw err;
    console.log("Database: \x1b[32m%s\x1b[0m", "online");
  }
);

// routes
app.use("/users", userRoutes);
app.use('/login', loginRoutes);
app.use('/hospitals', hospitalRoutes);
app.use('/doctors', doctorRoutes);
app.use('/search', searchRoutes);
app.use('/uploads', uploadRoutes);

app.use("/", appRoutes);

// executes queries
app.listen(3000, () => {
  console.log("Server in port 3000: \x1b[32m%s\x1b[0m", "online");
});
