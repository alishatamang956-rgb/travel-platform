const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * A registered user. contributionScore is a simple counter for now —
 * Phase 2 could turn this into a weighted "trust score" that affects
 * whether a user's reviews get auto-approved.
 */
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false }, // bcrypt hash, never returned in API responses
  role: {
    type: DataTypes.ENUM('USER', 'MODERATOR', 'ADMIN'),
    allowNull: false,
    defaultValue: 'USER',
  },
  tripsTaken: { type: DataTypes.INTEGER, defaultValue: 0 },
  contributionScore: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'users',
  timestamps: true,
  defaultScope: {
    attributes: { exclude: ['password'] }, // never leak password hash by default
  },
  // To read the password hash (e.g. during login), query with User.unscoped()
  // rather than adding a scope here — Sequelize scopes don't cleanly "undo"
  // an attribute exclusion from defaultScope.
});

module.exports = User;
