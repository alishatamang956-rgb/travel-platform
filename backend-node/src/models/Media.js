const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * A photo attached to a Place or a Review. MVP stores files on local
 * disk (see middleware/upload.js) — filePath is a relative URL, not
 * an absolute local path, so swapping to S3 / Cloudflare R2 later only
 * means changing the upload middleware, not this model or any caller.
 */
const Media = sequelize.define('Media', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fileName: { type: DataTypes.STRING(255), allowNull: false },
  filePath: { type: DataTypes.STRING(500), allowNull: false },
}, {
  tableName: 'media',
  timestamps: true,
  updatedAt: false,
});

module.exports = Media;
