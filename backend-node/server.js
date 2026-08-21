const app = require('./src/app');
const { sequelize, User, Place, Review } = require('./src/models');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 8080;

async function seed() {
  const count = await User.count();
  if (count > 0) {
    console.log('Database already has data — skipping seed.');
    return;
  }

  console.log('Seeding demo data...');

  const hash = await bcrypt.hash('password123', 10);

  const admin = await User.create({
    username: 'admin',
    email: 'admin@yatrabata.com',
    password: hash,
    role: 'ADMIN',
    contributionScore: 100,
    tripsTaken: 12,
  });
  const moderator = await User.create({
    username: 'moderator',
    email: 'mod@yatrabata.com',
    password: hash,
    role: 'MODERATOR',
    contributionScore: 40,
    tripsTaken: 5,
  });
  const sabin = await User.create({
    username: 'sabin_k',
    email: 'sabin@example.com',
    password: hash,
    role: 'USER',
    contributionScore: 15,
    tripsTaken: 3,
  });
  const demo = await User.create({
    username: 'demo',
    email: 'demo@example.com',
    password: hash,
    role: 'USER',
    contributionScore: 0,
    tripsTaken: 0,
  });

  // 5 approved places
  const p1 = await Place.create({
    name: 'Annapurna Base Camp Trek',
    overview: 'Classic Himalayan trek through rhododendron forests to the amphitheatre of Annapurna sanctuary.',
    province: 'Gandaki',
    district: 'Kaski',
    type: 'TREK',
    duration: '7N/8D',
    difficulty: 'MODERATE',
    bestSeason: 'AUTUMN',
    budgetMin: 25000,
    budgetMax: 45000,
    altitudeMeters: 4130,
    vehicleAccess: ['WALK_ONLY'],
    crowdLevel: 'HIGH',
    networkAvailable: false,
    familyFriendly: false,
    soloFriendly: true,
    emergencyNetworkInfo: 'Limited to lower villages',
    nearestPolicePost: 'Chomrong',
    nearestHealthPost: 'Ghorepani',
    status: 'APPROVED',
    featured: true,
    createdById: sabin.id,
  });

  const p2 = await Place.create({
    name: 'Phewa Lake Kayaking',
    overview: 'Peaceful paddling on Phewa Lake with views of Machhapuchhre.',
    province: 'Gandaki',
    district: 'Kaski',
    type: 'ROAD_TRIP',
    duration: '1D',
    difficulty: 'EASY',
    bestSeason: 'SPRING',
    budgetMin: 1500,
    budgetMax: 4000,
    altitudeMeters: 800,
    vehicleAccess: ['CAR', 'BIKE', 'BUS'],
    crowdLevel: 'MEDIUM',
    networkAvailable: true,
    familyFriendly: true,
    soloFriendly: true,
    status: 'APPROVED',
    featured: true,
    createdById: sabin.id,
  });

  const p3 = await Place.create({
    name: 'Langtang Valley Trek',
    overview: 'Beautiful valley trek close to Kathmandu with cheese factories and glaciers.',
    province: 'Bagmati',
    district: 'Rasuwa',
    type: 'TREK',
    duration: '6N/7D',
    difficulty: 'MODERATE',
    bestSeason: 'AUTUMN',
    budgetMin: 18000,
    budgetMax: 35000,
    altitudeMeters: 3870,
    vehicleAccess: ['WALK_ONLY'],
    crowdLevel: 'MEDIUM',
    networkAvailable: false,
    familyFriendly: false,
    soloFriendly: true,
    status: 'APPROVED',
    featured: false,
    createdById: demo.id,
  });

  const p4 = await Place.create({
    name: 'Chitwan Jungle Safari',
    overview: 'Jeep safari and canoe rides in Chitwan National Park to see rhinos and birds.',
    province: 'Bagmati',
    district: 'Chitwan',
    type: 'ROAD_TRIP',
    duration: '2N/3D',
    difficulty: 'EASY',
    bestSeason: 'WINTER',
    budgetMin: 8000,
    budgetMax: 18000,
    altitudeMeters: 150,
    vehicleAccess: ['CAR', 'BUS'],
    crowdLevel: 'HIGH',
    networkAvailable: true,
    familyFriendly: true,
    soloFriendly: true,
    status: 'APPROVED',
    featured: true,
    createdById: sabin.id,
  });

  const p5 = await Place.create({
    name: 'Gosaikunda Lake Trek',
    overview: 'Sacred alpine lake trek popular with Hindu and Buddhist pilgrims.',
    province: 'Bagmati',
    district: 'Rasuwa',
    type: 'TREK',
    duration: '5N/6D',
    difficulty: 'HARD',
    bestSeason: 'AUTUMN',
    budgetMin: 15000,
    budgetMax: 28000,
    altitudeMeters: 4380,
    vehicleAccess: ['WALK_ONLY'],
    crowdLevel: 'MEDIUM',
    networkAvailable: false,
    familyFriendly: false,
    soloFriendly: false,
    status: 'APPROVED',
    featured: false,
    createdById: demo.id,
  });

  // 1 pending place (for live admin demo)
  await Place.create({
    name: 'Panchase Hike',
    overview: 'Short scenic hike near Pokhara with panoramic mountain views. Great for a day trip.',
    province: 'Gandaki',
    district: 'Kaski',
    type: 'HIKE',
    duration: '1D',
    difficulty: 'EASY',
    bestSeason: 'SPRING',
    budgetMin: 1000,
    budgetMax: 3000,
    altitudeMeters: 2500,
    vehicleAccess: ['BIKE', 'WALK_ONLY'],
    crowdLevel: 'LOW',
    networkAvailable: true,
    familyFriendly: true,
    soloFriendly: true,
    status: 'PENDING',
    featured: false,
    createdById: sabin.id,
  });

  // Reviews
  await Review.create({
    placeId: p1.id,
    authorId: sabin.id,
    trailReview: { difficultyRating: 3, pavedPercent: 10, comments: 'Amazing sunrise at ABC' },
    status: 'APPROVED',
  });
  await Review.create({
    placeId: p2.id,
    authorId: demo.id,
    stayReview: { stayType: 'None', cleanlinessRating: 4 },
    seasonReview: { bestSeason: 'SPRING' },
    status: 'APPROVED',
  });
  await Review.create({
    placeId: p4.id,
    authorId: sabin.id,
    safetyTip: { wishTheyKnewEarlier: 'Bring binoculars for birds and rhinos' },
    status: 'APPROVED',
  });
  // one pending review
  await Review.create({
    placeId: p3.id,
    authorId: demo.id,
    trailReview: { difficultyRating: 3, comments: 'Nice valley, quiet' },
    status: 'PENDING',
  });

  console.log('Seed complete.');
  console.log('Demo accounts (password for all = password123):');
  console.log('  admin / moderator / sabin_k / demo');
}

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Connected to SQLite.');

    // Plain sync (no alter) — avoids the SQLite copy-and-drop bug that wiped data.
    await sequelize.sync();
    console.log('Models synced.');

    await seed();

    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
