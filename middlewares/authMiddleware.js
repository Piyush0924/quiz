const jwt = require("jsonwebtoken");

// after the login ,having the cookies in the browser so while making the request they send cookies with token 
const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) 
  return res.status(401).json({ message: "Access Denied !!!" });
  //check the token present in the cookies valid or not
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = authMiddleware;
