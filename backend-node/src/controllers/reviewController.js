const { Review, Place, Media, User } = require('../models');

const SECTION_FIELDS = [
  'trailReview', 'transportReview', 'stayReview', 'seasonReview', 'budgetReview', 'safetyTip',
];

async function submit(req, res, next) {
  try {
    const { placeId } = req.body;
    if (!placeId) return res.status(400).json({ status: 400, message: 'placeId is required' });

    const place = await Place.findByPk(placeId);
    if (!place) return res.status(404).json({ status: 404, message: 'Place not found' });

    const sections = {};
    for (const f of SECTION_FIELDS) if (req.body[f] !== undefined) sections[f] = req.body[f];

    const review = await Review.create({
      placeId: place.id,
      authorId: req.user.id,
      status: 'PENDING', // held for admin approval, same as new places
      ...sections,
    });

    req.user.contributionScore += 1;
    await req.user.save();

    res.json(review);
  } catch (err) {
    next(err);
  }
}

async function getForPlace(req, res, next) {
  try {
    const reviews = await Review.findAll({
      where: { placeId: req.params.placeId, status: 'APPROVED' },
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Media, as: 'photos' },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
}

async function uploadPhoto(req, res, next) {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ status: 404, message: 'Review not found' });
    if (!req.file) return res.status(400).json({ status: 400, message: 'No file uploaded (field name must be "file")' });

    const media = await Media.create({
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
      reviewId: review.id,
      uploadedById: req.user.id,
    });
    res.json(media);
  } catch (err) {
    next(err);
  }
}

module.exports = { submit, getForPlace, uploadPhoto };
