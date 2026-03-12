/**
 * VELOCITY ARENA — Backend Server
 * Node.js + Express REST API
 * 
 * Run: npm install && node server.js
 * API runs on http://localhost:3000
 */

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ─── FILE-BASED DATABASE ─────────────────────────────────────────────────────
const DB_BOOKINGS = path.join(__dirname, 'bookings.json');
const DB_REVIEWS  = path.join(__dirname, 'reviews.json');

function readDB(file) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, '[]');
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch(e) { return []; }
}

function writeDB(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const KARTS = [
  {
    id: 1, class: 'Class 1', name: 'Sprint Blade', kartNumber: '07',
    description: 'Speed-focused. Lightweight chassis engineered for raw acceleration and maximum top-end velocity.',
    specs: { speed: 5, handling: 2, weight: 'Lightweight', stability: 2 },
    priceAddon: 0, topSpeed: '95 km/h', bestFor: 'Straight-line tracks'
  },
  {
    id: 2, class: 'Class 2', name: 'Drift King', kartNumber: '12',
    description: 'Smooth handling meets a lightweight build — the perfect weapon for technical, corner-heavy tracks.',
    specs: { speed: 3, handling: 5, weight: 'Lightweight', stability: 4 },
    priceAddon: 200, topSpeed: '88 km/h', bestFor: 'Technical circuits'
  },
  {
    id: 3, class: 'Class 3', name: 'Thunder Beast', kartNumber: '03',
    description: 'Heavyweight champion. Massive grip, smooth cornering, and brutal top-speed — the full package.',
    specs: { speed: 5, handling: 4, weight: 'Heavy', stability: 5 },
    priceAddon: 400, topSpeed: '92 km/h', bestFor: 'Championship layouts'
  }
];

const TRACKS = [
  {
    id: 'A', name: 'Velocity Oval', type: 'High-speed',
    length: '0.9 km', corners: 4, lapRecord: '54s', difficulty: 'Beginner',
    description: 'Classic oval circuit built for pure speed. Four wide, sweeping corners — ideal for Sprint Blade.'
  },
  {
    id: 'B', name: 'Dragon Circuit', type: 'Technical',
    length: '1.2 km', corners: 9, lapRecord: '58s', difficulty: 'Intermediate',
    description: '9 technical corners rewarding precision driving. The Drift King\'s natural habitat.'
  },
  {
    id: 'C', name: 'Night Serpent', type: 'Night',
    length: '1.1 km', corners: 11, lapRecord: '61s', difficulty: 'Expert',
    description: 'Undulating serpentine layout under floodlights. Available 7PM+ only.'
  }
];

const PACKAGES = [
  { id: 'sprint',       name: 'Sprint Race',      duration: '10 min',  price: 499  },
  { id: 'grandprix',    name: 'Grand Prix',        duration: '20 min',  price: 899  },
  { id: 'championship', name: 'Championship',      duration: '30 min',  price: 1299 },
  { id: 'night',        name: 'Night Race',        duration: '20 min',  price: 999  },
  { id: 'junior',       name: 'Junior Race',       duration: '10 min',  price: 349  },
  { id: 'corporate',    name: 'Corporate Event',   duration: 'Custom',  price: null }
];

const TIME_SLOTS = [
  { id: 'slot-1', time: '09:00 AM', period: 'Morning' },
  { id: 'slot-2', time: '10:00 AM', period: 'Morning' },
  { id: 'slot-3', time: '11:00 AM', period: 'Morning' },
  { id: 'slot-4', time: '12:00 PM', period: 'Afternoon' },
  { id: 'slot-5', time: '02:00 PM', period: 'Afternoon' },
  { id: 'slot-6', time: '04:00 PM', period: 'Afternoon' },
  { id: 'slot-7', time: '06:00 PM', period: 'Evening' },
  { id: 'slot-8', time: '07:00 PM', period: 'Night', note: 'Night Serpent only' },
  { id: 'slot-9', time: '08:00 PM', period: 'Night', note: 'Night Serpent only' }
];

// ─── BOOKING ROUTES ───────────────────────────────────────────────────────────

app.get('/api/karts',    (req, res) => res.json({ success: true, data: KARTS }));
app.get('/api/tracks',   (req, res) => res.json({ success: true, data: TRACKS }));
app.get('/api/packages', (req, res) => res.json({ success: true, data: PACKAGES }));
app.get('/api/slots',    (req, res) => res.json({ success: true, data: TIME_SLOTS }));

// GET all bookings (admin)
app.get('/api/bookings', (req, res) => {
  const bookings = readDB(DB_BOOKINGS);
  res.json({ success: true, count: bookings.length, data: bookings });
});

// GET single booking by reference
app.get('/api/bookings/:ref', (req, res) => {
  const bookings = readDB(DB_BOOKINGS);
  const booking = bookings.find(b => b.ref === req.params.ref);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, data: booking });
});

// POST create a new booking
app.post('/api/bookings', (req, res) => {
  const { firstName, lastName, email, phone, riders, kart, track, package: pkg, date, timeSlot, notes } = req.body;

  if (!firstName || !lastName || !email || !kart || !track || !date || !pkg || !timeSlot) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: firstName, lastName, email, kart, track, package, date, timeSlot'
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  const today = new Date(); today.setHours(0,0,0,0);
  const bookDate = new Date(date);
  if (bookDate < today) {
    return res.status(400).json({ success: false, message: 'Booking date must be today or in the future' });
  }

  const kartData    = KARTS.find(k => k.name === kart);
  const packageData = PACKAGES.find(p => p.name === pkg || p.id === pkg);
  const basePrice   = packageData ? (packageData.price || 0) : 0;
  const kartAddon   = kartData ? kartData.priceAddon : 0;
  const totalPrice  = basePrice + kartAddon;

  const ref = 'VA-' + Date.now().toString().slice(-6) + Math.random().toString(36).slice(2,4).toUpperCase();

  const booking = {
    ref, firstName, lastName, email,
    phone: phone || '',
    riders: riders || '1 Rider',
    kart, track,
    package: pkg,
    timeSlot,
    date,
    notes: notes || '',
    basePrice, kartAddon, totalPrice,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  const bookings = readDB(DB_BOOKINGS);
  bookings.push(booking);
  writeDB(DB_BOOKINGS, bookings);

  console.log(`✅ Booking: ${ref} — ${firstName} ${lastName} | ${kart} | ${track} | ${date} @ ${timeSlot} | ₹${totalPrice}`);

  res.status(201).json({
    success: true,
    message: `Booking confirmed! Reference: ${ref}`,
    data: booking
  });
});

// PUT update booking status
app.put('/api/bookings/:ref/status', (req, res) => {
  const { status } = req.body;
  if (!['Confirmed','Pending','Cancelled','Completed'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  const bookings = readDB(DB_BOOKINGS);
  const idx = bookings.findIndex(b => b.ref === req.params.ref);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Booking not found' });
  bookings[idx].status = status;
  writeDB(DB_BOOKINGS, bookings);
  res.json({ success: true, data: bookings[idx] });
});

// DELETE booking
app.delete('/api/bookings/:ref', (req, res) => {
  const bookings = readDB(DB_BOOKINGS);
  const filtered = bookings.filter(b => b.ref !== req.params.ref);
  if (filtered.length === bookings.length) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  writeDB(DB_BOOKINGS, filtered);
  res.json({ success: true, message: 'Booking deleted' });
});

// ─── REVIEWS ROUTES ───────────────────────────────────────────────────────────

// GET all reviews
app.get('/api/reviews', (req, res) => {
  const reviews = readDB(DB_REVIEWS);
  res.json({ success: true, count: reviews.length, data: reviews });
});

// POST add a review
app.post('/api/reviews', (req, res) => {
  const { name, rating, kart, text } = req.body;
  if (!name || !text || !rating) {
    return res.status(400).json({ success: false, message: 'Missing required fields: name, rating, text' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
  }
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();
  const review = {
    id: Date.now(),
    name: name.trim(),
    rating: parseInt(rating),
    kart: kart || '',
    text: text.trim(),
    date: months[now.getMonth()] + ' ' + now.getFullYear(),
    createdAt: now.toISOString()
  };
  const reviews = readDB(DB_REVIEWS);
  reviews.unshift(review);
  writeDB(DB_REVIEWS, reviews);
  res.status(201).json({ success: true, message: 'Review added!', data: review });
});

// DELETE review (admin)
app.delete('/api/reviews/:id', (req, res) => {
  const reviews = readDB(DB_REVIEWS);
  const filtered = reviews.filter(r => r.id !== parseInt(req.params.id));
  writeDB(DB_REVIEWS, filtered);
  res.json({ success: true, message: 'Review deleted' });
});

// ─── ADMIN STATS ──────────────────────────────────────────────────────────────
app.get('/api/admin/stats', (req, res) => {
  const bookings = readDB(DB_BOOKINGS);
  const reviews  = readDB(DB_REVIEWS);

  const confirmed   = bookings.filter(b => b.status === 'Confirmed').length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const todayStr    = new Date().toISOString().split('T')[0];
  const todayRevenue = bookings
    .filter(b => b.createdAt && b.createdAt.startsWith(todayStr))
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const kartCounts  = { 'Sprint Blade': 0, 'Drift King': 0, 'Thunder Beast': 0 };
  const trackCounts = { 'Velocity Oval': 0, 'Dragon Circuit': 0, 'Night Serpent': 0 };
  const slotCounts  = {};
  const revByKart   = { 'Sprint Blade': 0, 'Drift King': 0, 'Thunder Beast': 0 };

  bookings.forEach(b => {
    if (kartCounts[b.kart]  !== undefined) { kartCounts[b.kart]++;  revByKart[b.kart] += (b.totalPrice || 0); }
    if (trackCounts[b.track] !== undefined) trackCounts[b.track]++;
    if (b.timeSlot) slotCounts[b.timeSlot] = (slotCounts[b.timeSlot] || 0) + 1;
  });

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  res.json({
    success: true,
    data: {
      totalBookings: bookings.length,
      confirmedBookings: confirmed,
      totalRevenue,
      todayRevenue,
      avgRating,
      reviewCount: reviews.length,
      popularKart:  Object.entries(kartCounts).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A',
      popularTrack: Object.entries(trackCounts).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A',
      popularSlot:  Object.entries(slotCounts).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A',
      kartBreakdown: kartCounts,
      trackBreakdown: trackCounts,
      revenueByKart: revByKart,
      slotBreakdown: slotCounts
    }
  });
});

// Serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ██╗   ██╗███████╗██╗      ██████╗  ██████╗██╗████████╗██╗   ██╗');
  console.log('  ██║   ██║██╔════╝██║     ██╔═══██╗██╔════╝██║╚══██╔══╝╚██╗ ██╔╝');
  console.log('  ██║   ██║█████╗  ██║     ██║   ██║██║     ██║   ██║    ╚████╔╝ ');
  console.log('  ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██║     ██║   ██║     ╚██╔╝  ');
  console.log('   ╚████╔╝ ███████╗███████╗╚██████╔╝╚██████╗██║   ██║      ██║   ');
  console.log('    ╚═══╝  ╚══════╝╚══════╝ ╚═════╝  ╚═════╝╚═╝   ╚═╝      ╚═╝   ');
  console.log('');
  console.log(`  🏁  VELOCITY ARENA — Server running on http://localhost:${PORT}`);
  console.log('  📍  C70 Indira Nagar, Vijapur Road, Solapur — 413004');
  console.log('  📞  +91 79726 86940 | VelocityArena@gmail.com');
  console.log('');
  console.log('  API Endpoints:');
  console.log(`  GET    /api/karts              — 3 kart classes`);
  console.log(`  GET    /api/tracks             — 3 race circuits`);
  console.log(`  GET    /api/packages           — all packages & pricing`);
  console.log(`  GET    /api/slots              — available time slots`);
  console.log(`  POST   /api/bookings           — create a booking`);
  console.log(`  GET    /api/bookings           — all bookings (admin)`);
  console.log(`  GET    /api/bookings/:ref      — single booking`);
  console.log(`  PUT    /api/bookings/:ref/status — update status`);
  console.log(`  DELETE /api/bookings/:ref      — delete booking`);
  console.log(`  GET    /api/reviews            — all reviews`);
  console.log(`  POST   /api/reviews            — submit a review`);
  console.log(`  DELETE /api/reviews/:id        — delete review (admin)`);
  console.log(`  GET    /api/admin/stats        — full dashboard stats`);
  console.log('');
});
