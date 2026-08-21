const sequelize = require('../config/db');
const User = require('./User');
const Place = require('./Place');
const Review = require('./Review');
const Media = require('./Media');

// ---- Place ↔ User (creator) ----
Place.belongsTo(User, { as: 'createdBy', foreignKey: 'createdById' });
User.hasMany(Place, { as: 'places', foreignKey: 'createdById' });

// ---- Review ↔ Place / User ----
Review.belongsTo(Place, { as: 'place', foreignKey: 'placeId', onDelete: 'CASCADE' });
Place.hasMany(Review, { as: 'reviews', foreignKey: 'placeId' });

Review.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
User.hasMany(Review, { as: 'reviews', foreignKey: 'authorId' });

// ---- Media ↔ Place / Review / User ----
Media.belongsTo(Place, { as: 'place', foreignKey: 'placeId', allowNull: true });
Place.hasMany(Media, { as: 'photos', foreignKey: 'placeId' });

Media.belongsTo(Review, { as: 'review', foreignKey: 'reviewId', allowNull: true });
Review.hasMany(Media, { as: 'photos', foreignKey: 'reviewId' });

Media.belongsTo(User, { as: 'uploadedBy', foreignKey: 'uploadedById' });
User.hasMany(Media, { as: 'uploads', foreignKey: 'uploadedById' });

module.exports = { sequelize, User, Place, Review, Media };
