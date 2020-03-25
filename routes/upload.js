const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');

// default options
router.use(fileUpload());

router.put("/:type/:id", (req, res, next) => {

  const type = req.params.type; // is user || doctor || hospital
  const id = req.params.id;

  const validTypes = ['users', 'doctors', 'hospitals'];

  if (validTypes.indexOf( type ) < 0) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid collection type',
      errors: {message: `Valid collections are ${validTypes.join(', ')}`}
    });
  }

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      message: 'No file selected',
      errors: {message: 'Must provide an image'}
    });
  }

  // Get image name
  const archive = req.files.image;
  const splittedName = archive.name.split('.');
  const archiveExtension = splittedName[splittedName.length - 1];

  // Only this extensions accepted
  const validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

  if (validExtensions.indexOf(archiveExtension) < 0) {
    
    return res.status(400).json({
      ok: false,
      message: 'File-type not supported',
      errors: {message: `Supported extensions are ${validExtensions.join(', ')}`}
    });

  }

  // unique archive name
  // Ex: 12343555664-23434.png - ID-milliseconds.ext
  const archiveName = `${ id }-${ new Date().getMilliseconds }.${archiveExtension}`;

  // Move file from temp to a path
  const path = `./uploads/${type}/${archiveName}`;
  archive.mv(path, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'Error moving file',
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      message: "Request executed successfully",
      archiveExtension
    });

  });

});

module.exports = router;