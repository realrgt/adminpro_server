const jwt = require("jsonwebtoken");

// ================================
// Verify Token
// ================================
exports.verifyToken = (req, res, next) => {

    const token = req.query.token;

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
  
      if (err) {
          return res.status(401).json({
              ok: false,
              message: 'Invalid token',
              error: err
          });
      }

      req.user = decoded.user; // assigning decoded user to the request
  
      next();
  
    });

}
