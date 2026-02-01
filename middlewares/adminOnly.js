const User = require("../models/User");

exports.adminOnly = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only!" }); // <- return important
  }
  next();
};
