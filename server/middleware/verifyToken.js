const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(401).json({ message: 'Missing token' });

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'Invalid token format' });

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Token expired or invalid' });

    req.user = user;
    next();
  });
};

module.exports = verifyToken;
