require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

// SQLite = zero setup for judges / teammates. File lives next to package.json.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), 'travel.db'),
  logging: false,
});

module.exports = sequelize;
