const jwt = require("jsonwebtoken");

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Not Access" });

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;

      if (roles.length && !roles.includes(verified.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      next();
    } catch (err) {
      res.status(400).json({ message: "Invalid Token" });
    }
  };
};

module.exports = authMiddleware;
