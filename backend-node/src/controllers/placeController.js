const { Op, fn, col, where: sequelizeWhere } = require('sequelize');
const { Place, Media, sequelize } = require('../models');

const PLACE_FIELDS = [
  'name', 'overview', 'province', 'district', 'type', 'duration', 'difficulty',
  'bestSeason', 'budgetMin', 'budgetMax', 'altitudeMeters', 'vehicleAccess',
  'crowdLevel', 'networkAvailable', 'familyFriendly', 'soloFriendly',
  'emergencyNetworkInfo', 'nearestPolicePost', 'nearestHealthPost',
];

function pick(body, fields) {
  const out = {};
  for (const f of fields) if (body[f] !== undefined) out[f] = body[f];
  return out;
}

/**
 * GET /api/places?type=TREK&difficulty=MODERATE&season=AUTUMN&budgetMin=5000&
 *   budgetMax=15000&vehicleAccess=BIKE&province=Gandaki&duration=2N/3D&
 *   networkAvailable=true&familyFriendly=true&soloFriendly=false&keyword=lake
 *
 * Every param is optional. Builds one dynamic WHERE clause — the same
 * idea as PlaceSpecifications in the Java version, just expressed as a
 * plain Sequelize `where` object instead of composable Specifications.
 */
async function search(req, res, next) {
  try {
    const {
      type, difficulty, season, budgetMin, budgetMax, vehicleAccess,
      province, duration, networkAvailable, familyFriendly, soloFriendly, keyword,
    } = req.query;

    const clauses = [{ status: 'APPROVED' }];

    if (type) clauses.push({ type });
    if (difficulty) clauses.push({ difficulty });
    if (season) clauses.push({ bestSeason: season });
    if (duration) clauses.push({ duration });
    if (province) clauses.push(sequelizeWhere(fn('LOWER', col('province')), province.toLowerCase()));
    if (keyword) clauses.push({ name: { [Op.like]: `%${keyword}%` } });
    if (networkAvailable !== undefined) clauses.push({ networkAvailable: networkAvailable === 'true' });
    if (familyFriendly !== undefined) clauses.push({ familyFriendly: familyFriendly === 'true' });
    if (soloFriendly !== undefined) clauses.push({ soloFriendly: soloFriendly === 'true' });

    // A place's own [budgetMin, budgetMax] range must overlap the requested range.
    if (budgetMin !== undefined) clauses.push({ budgetMax: { [Op.gte]: Number(budgetMin) } });
    if (budgetMax !== undefined) clauses.push({ budgetMin: { [Op.lte]: Number(budgetMax) } });

    // vehicleAccess is stored as JSON. SQLite has limited JSON operators,
    // so we filter in application code after the main query (fine for demo size).
    const places = await Place.findAll({ where: { [Op.and]: clauses }, order: [['createdAt', 'DESC']] });

    let result = places;
    if (vehicleAccess) {
      result = places.filter((pl) => {
        const arr = Array.isArray(pl.vehicleAccess) ? pl.vehicleAccess : [];
        return arr.includes(vehicleAccess);
      });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function featured(req, res, next) {
  try {
    const places = await Place.findAll({ where: { featured: true, status: 'APPROVED' } });
    res.json(places);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const place = await Place.findByPk(req.params.id, { include: [{ model: Media, as: 'photos' }] });
    if (!place) return res.status(404).json({ status: 404, message: 'Place not found' });
    res.json(place);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = pick(req.body, PLACE_FIELDS);
    if (!data.name || !data.province || !data.district || !data.type) {
      return res.status(400).json({ status: 400, message: 'name, province, district, and type are required' });
    }
    // New listings need admin approval before showing up in public search.
    const place = await Place.create({ ...data, status: 'PENDING', createdById: req.user.id });
    res.json(place);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const place = await Place.findByPk(req.params.id);
    if (!place) return res.status(404).json({ status: 404, message: 'Place not found' });
    await place.update(pick(req.body, PLACE_FIELDS));
    res.json(place);
  } catch (err) {
    next(err);
  }
}

async function uploadPhoto(req, res, next) {
  try {
    const place = await Place.findByPk(req.params.id);
    if (!place) return res.status(404).json({ status: 404, message: 'Place not found' });
    if (!req.file) return res.status(400).json({ status: 400, message: 'No file uploaded (field name must be "file")' });

    const media = await Media.create({
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
      placeId: place.id,
      uploadedById: req.user.id,
    });
    res.json(media);
  } catch (err) {
    next(err);
  }
}

module.exports = { search, featured, getOne, create, update, uploadPhoto };
