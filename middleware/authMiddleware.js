const jwt = require("jsonwebtoken");   // 👈 ye import zaroori hai

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded; 

      // if (roles.length && !roles.includes(decoded.role)) {
      //   return res.status(403).json({ message: "Forbidden: insufficient role" });
      // }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized", error: error.message });
    }
  };
};

module.exports = authMiddleware;   // 👈 is line ke bina import kaam nahi karega
