const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { signToken } = require('../utils/jwt');

async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ status: 400, message: 'username, email, and password are all required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ status: 400, message: 'Password must be at least 6 characters' });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ status: 400, message: 'Username already taken' });
    }
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ status: 400, message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    // New signups are always plain USER; promote to MODERATOR/ADMIN
    // manually in the database — there is no public "become an admin" endpoint.
    const user = await User.create({ username, email, password: hashed, role: 'USER' });

    const token = signToken(user);
    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 400, message: 'username and password are required' });
    }

    const user = await User.unscoped().findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ status: 401, message: 'Invalid username or password' });
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return res.status(401).json({ status: 401, message: 'Invalid username or password' });
    }

    const token = signToken(user);
    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
