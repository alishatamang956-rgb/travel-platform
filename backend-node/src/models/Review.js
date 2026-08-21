const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * A single review a user leaves for a Place. Instead of one big free-text
 * comment, it is built from six independent, optional JSON sections —
 * a reviewer fills in only what applies to their trip. Each column
 * maps 1:1 to a section from the spec:
 *
 *   trailReview:     { difficultyRating, pavedPercent, landslideRisk, fitnessLevelRequired, comments }
 *   transportReview: { mode, roadConditionBlacktopPercent, travelTimeHours, cost, seasonalIssues }
 *   stayReview:      { stayType, costPerNight, cleanlinessRating, foodQualityRating, hotWaterAvailable, chargingAvailable }
 *   seasonReview:    { bestSeason, avoidSeason, avoidReason, weatherConditions }
 *   budgetReview:    { plannedBudget, actualSpend, emergencyBufferNeeded, hiddenCosts }
 *   safetyTip:       { wishTheyKnewEarlier, scamsOrRisks, emergencyContacts }
 *
 * Storing each section as JSON (rather than a wide flat table, or six
 * separate join tables) keeps the "modular" design intact while staying
 * simple to validate and render on the React side — the frontend already
 * works with these as plain JS objects.
 */
const Review = sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  trailReview: { type: DataTypes.JSON, allowNull: true },
  transportReview: { type: DataTypes.JSON, allowNull: true },
  stayReview: { type: DataTypes.JSON, allowNull: true },
  seasonReview: { type: DataTypes.JSON, allowNull: true },
  budgetReview: { type: DataTypes.JSON, allowNull: true },
  safetyTip: { type: DataTypes.JSON, allowNull: true },

  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED'),
    allowNull: false,
    defaultValue: 'PENDING',
  },
  flagReason: { type: DataTypes.STRING(500) },
}, {
  tableName: 'reviews',
  timestamps: true,
});

module.exports = Review;
