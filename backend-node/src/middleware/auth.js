const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

/**
 * Reads the Bearer token, verifies it, and attaches the corresponding
 * User (without password) to req.user. Routes that don't require login
 * (browsing places) never call this; routes that do (creating a place,
 * submitting a review, admin actions) put this first in their chain.
 */
async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ status: 401, message: 'Missing or malformed Authorization header' });
  }

  const token = header.substring(7);
  try {
    const payload = verifyToken(token);
    const user = await User.findOne({ where: { username: payload.sub } });
    if (!user) {
      return res.status(401).json({ status: 401, message: 'User no longer exists' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ status: 401, message: 'Invalid or expired token' });
  }
}

/**
 * authorize('ADMIN') or authorize('ADMIN', 'MODERATOR') — must run after
 * authenticate() so req.user is populated. Mirrors the
 * hasRole('ADMIN') / hasAnyRole('ADMIN','MODERATOR') rules from the spec.
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ status: 403, message: 'You do not have permission to do that' });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
