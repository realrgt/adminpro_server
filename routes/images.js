const express = require("express");
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get("/:type/:img", (req, res, next) => {

  const type = req.params.type;
  const img = req.params.img;

  const imagePath = path.resolve( __dirname, `../uploads/${ type }/${ img }` );

  if (fs.existsSync( imagePath )) {
    res.sendFile( imagePath );
  } else {
    const pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
    res.sendFile(pathNoImage);
  }

  // res.status(200).json({
  //   ok: true,
  //   message: "Request executed successfully"
  // });

});

module.exports = router;
