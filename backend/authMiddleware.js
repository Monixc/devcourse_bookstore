const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const authMiddleware = (req, res, next) => {
  let token;
  // 1. Authorization 헤더에서 추출
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    // 2. 쿠키에서 추출
    token = req.cookies.token;
  }
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "인증 토큰이 필요합니다." });
  }
  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    req.user = { email: decoded.email };
    next();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "유효하지 않은 토큰입니다." });
  }
};

module.exports = authMiddleware; 