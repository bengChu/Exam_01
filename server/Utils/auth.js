// server/utils/auth.js
require('dotenv').config(); // เพิ่มบรรทัดนี้ด้านบนไฟล์

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// เข้ารหัส Password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// ตรวจสอบ Password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// สร้าง JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// ตรวจสอบ JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Middleware สำหรับตรวจสอบ Token
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (decoded) {
      req.userId = decoded.userId;
      return next();
    }
  }

  return res.status(401).json({
    success: false,
    message: "Unauthorized: Invalid or missing token"
  });
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  authenticateJWT
};