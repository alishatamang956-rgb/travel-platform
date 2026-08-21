const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Core listing entity. Every column here backs either a "must-have" or
 * "nice-to-have" filter from the project spec. vehicleAccess is stored
 * as a JSON array of strings (e.g. ["BIKE","WALK_ONLY"]) since MySQL
 * has no native array type — filtering against it is handled with
 * JSON_CONTAINS in placeController.
 */
const Place = sequelize.define('Place', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  overview: { type: DataTypes.TEXT },
  province: { type: DataTypes.STRING(100), allowNull: false },
  district: { type: DataTypes.STRING(100), allowNull: false },
  type: {
    type: DataTypes.ENUM('TREK', 'ROAD_TRIP', 'HIKE', 'CAMPING'),
    allowNull: false,
  },
  duration: { type: DataTypes.STRING(20) }, // e.g. "2N/3D"
  difficulty: { type: DataTypes.ENUM('EASY', 'MODERATE', 'HARD') },
  bestSeason: { type: DataTypes.ENUM('SPRING', 'SUMMER', 'MONSOON', 'AUTUMN', 'WINTER') },
  budgetMin: { type: DataTypes.FLOAT },
  budgetMax: { type: DataTypes.FLOAT },
  altitudeMeters: { type: DataTypes.INTEGER }, // null for non-trek places

  vehicleAccess: {
    type: DataTypes.JSON,
    defaultValue: [], // subset of BIKE / CAR / BUS / WALK_ONLY
  },

  // ---- nice-to-have filters ----
  crowdLevel: { type: DataTypes.STRING(20) }, // LOW / MEDIUM / HIGH
  networkAvailable: { type: DataTypes.BOOLEAN },
  familyFriendly: { type: DataTypes.BOOLEAN },
  soloFriendly: { type: DataTypes.BOOLEAN },

  // ---- emergency info ----
  emergencyNetworkInfo: { type: DataTypes.STRING(300) },
  nearestPolicePost: { type: DataTypes.STRING(300) },
  nearestHealthPost: { type: DataTypes.STRING(300) },

  // ---- moderation workflow ----
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED'),
    allowNull: false,
    defaultValue: 'PENDING',
  },
  featured: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'places',
  timestamps: true,
});

module.exports = Place;
