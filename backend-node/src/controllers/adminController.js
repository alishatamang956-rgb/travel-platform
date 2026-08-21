const { Place, Review, User } = require('../models');

async function pendingPlaces(req, res, next) {
  try {
    res.json(await Place.findAll({ where: { status: 'PENDING' } }));
  } catch (err) { next(err); }
}

async function approvePlace(req, res, next) {
  try {
    const place = await Place.findByPk(req.params.id);
    if (!place) return res.status(404).json({ status: 404, message: 'Place not found' });
    place.status = 'APPROVED';
    await place.save();
    res.json(place);
  } catch (err) { next(err); }
}

async function rejectPlace(req, res, next) {
  try {
    const place = await Place.findByPk(req.params.id);
    if (!place) return res.status(404).json({ status: 404, message: 'Place not found' });
    place.status = 'REJECTED';
    await place.save();
    res.json(place);
  } catch (err) { next(err); }
}

async function featurePlace(req, res, next) {
  try {
    const place = await Place.findByPk(req.params.id);
    if (!place) return res.status(404).json({ status: 404, message: 'Place not found' });
    place.featured = req.query.value === 'true';
    await place.save();
    res.json(place);
  } catch (err) { next(err); }
}

async function deletePlace(req, res, next) {
  try {
    const place = await Place.findByPk(req.params.id);
    if (!place) return res.status(404).json({ status: 404, message: 'Place not found' });
    await place.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
}

async function pendingReviews(req, res, next) {
  try {
    res.json(await Review.findAll({
      where: { status: 'PENDING' },
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }, { model: Place, as: 'place', attributes: ['id', 'name'] }],
    }));
  } catch (err) { next(err); }
}

async function approveReview(req, res, next) {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ status: 404, message: 'Review not found' });
    review.status = 'APPROVED';
    await review.save();
    res.json(review);
  } catch (err) { next(err); }
}

async function rejectReview(req, res, next) {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ status: 404, message: 'Review not found' });
    review.status = 'REJECTED';
    await review.save();
    res.json(review);
  } catch (err) { next(err); }
}

/** Simple analytics endpoint mentioned in the spec's Admin Panel section. */
async function analytics(req, res, next) {
  try {
    const [totalPlaces, pendingPlacesCount, totalReviews, pendingReviewsCount, totalUsers] = await Promise.all([
      Place.count({ where: { status: 'APPROVED' } }),
      Place.count({ where: { status: 'PENDING' } }),
      Review.count({ where: { status: 'APPROVED' } }),
      Review.count({ where: { status: 'PENDING' } }),
      User.count(),
    ]);
    res.json({ totalPlaces, pendingPlacesCount, totalReviews, pendingReviewsCount, totalUsers });
  } catch (err) { next(err); }
}

module.exports = {
  pendingPlaces, approvePlace, rejectPlace, featurePlace, deletePlace,
  pendingReviews, approveReview, rejectReview, analytics,
};
