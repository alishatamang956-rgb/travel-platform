const jwt = require('jsonwebtoken');

function signToken(user) {
  return jwt.sign(
    { sub: user.username, role: user.role, id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { signToken, verifyToken };
