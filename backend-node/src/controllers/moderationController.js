const { Review } = require('../models');

/** Endpoints trusted community Moderators use: "verify reviews, flag misinformation" per spec. */

async function flagged(req, res, next) {
  try {
    res.json(await Review.findAll({ where: { status: 'FLAGGED' } }));
  } catch (err) { next(err); }
}

async function flag(req, res, next) {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ status: 400, message: 'reason is required' });

    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ status: 404, message: 'Review not found' });

    review.status = 'FLAGGED';
    review.flagReason = reason;
    await review.save();
    res.json(review);
  } catch (err) { next(err); }
}

async function verify(req, res, next) {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ status: 404, message: 'Review not found' });
    review.status = 'APPROVED';
    review.flagReason = null;
    await review.save();
    res.json(review);
  } catch (err) { next(err); }
}

module.exports = { flagged, flag, verify };
