const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  console.log("COOKIES:", req.cookies);

  const token = req.cookies?.jwt;

  console.log("JWT:", token);

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized - no token",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      console.log("JWT ERROR:", err.message);

      return res.status(401).json({
        message: "Unauthorized - invalid token",
      });
    }

    console.log("VALID TOKEN:", decodedToken);

    req.user = decodedToken;

    next();
  });
};

module.exports = requireAuth;