const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let authToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    authToken = req.headers.authorization.split(" ")[1];
  }
  console.log("token from header:", authToken);

  if (!authToken)
    return res.status(401).json({ message: "Not authorized , Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("this is decoded user id:", decoded);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalid or Expired" });
  }
};
