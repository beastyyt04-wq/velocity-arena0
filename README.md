# 🏁 VELOCITY ARENA v2.0
### Solapur's Premier Go-Kart Racing Booking Platform
**Full-Stack Web Development Project**

---

## 🚀 Project Overview

Velocity Arena is a full-stack web application for Solapur's premier go-kart racing facility. Customers can browse kart classes, study circuit maps, book time slots online, and leave reviews. Staff manage everything via the Admin Dashboard.

---

## 📍 Business Info

| Detail | Info |
|--------|------|
| **Location** | C70 Indira Nagar, Vijapur Road, Solapur — 413004 |
| **Phone / WhatsApp** | +91 79726 86940 |
| **Email** | VelocityArena@gmail.com |
| **Hours** | Mon–Fri: 10AM–10PM · Sat–Sun: 9AM–10PM |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js + Express.js |
| Database | JSON file-based (bookings.json, reviews.json) |
| Fonts | Google Fonts (Orbitron, Barlow, Bebas Neue) |

---

## 📦 Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Start server
npm start

# 3. Open in browser
http://localhost:3000
```

For auto-reload dev mode:
```bash
npm run dev
```

---

## 🌐 GitHub Pages Deployment (Static / Frontend Only)

The frontend is **fully self-contained** and works on GitHub Pages without a backend:
- Bookings and reviews are saved to **localStorage**
- All kart/track data is built-in to the HTML

**To deploy on GitHub Pages:**
1. Upload `index.html`, `logo_png.png`, and `karts_png.png` to your GitHub repo
2. Go to **Settings → Pages → Deploy from branch (main)**
3. Your site will be live at `https://yourusername.github.io/your-repo/`

**For full backend (bookings stored server-side):**
- Deploy to [Railway](https://railway.app) or [Render](https://render.com)
- Both offer free Node.js hosting

---

## 🌐 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/karts` | Get all 3 kart classes |
| `GET` | `/api/tracks` | Get all 3 race circuits |
| `GET` | `/api/packages` | Get all packages & pricing |
| `GET` | `/api/slots` | Get all time slots |
| `POST` | `/api/bookings` | **Create a booking** |
| `GET` | `/api/bookings` | All bookings (admin) |
| `GET` | `/api/bookings/:ref` | Single booking by reference |
| `PUT` | `/api/bookings/:ref/status` | Update booking status |
| `DELETE` | `/api/bookings/:ref` | Delete a booking |
| `GET` | `/api/reviews` | All customer reviews |
| `POST` | `/api/reviews` | Submit a new review |
| `DELETE` | `/api/reviews/:id` | Delete a review (admin) |
| `GET` | `/api/admin/stats` | Full dashboard statistics |

---

## 🏎️ Kart Classes

| Class | Name | Number | Speed | Top Speed |
|-------|------|--------|-------|-----------|
| Class 1 | Sprint Blade | #07 | ★★★★★ | 95 km/h |
| Class 2 | Drift King | #12 | ★★★ | 88 km/h |
| Class 3 | Thunder Beast | #03 | ★★★★★ | 92 km/h |

---

## 🛣️ Race Circuits (3 Tracks)

| Track | Type | Length | Corners | Difficulty |
|-------|------|--------|---------|------------|
| Velocity Oval | High-speed | 0.9 km | 4 | Beginner |
| Dragon Circuit | Technical | 1.2 km | 9 | Intermediate |
| Night Serpent | Night (7PM+) | 1.1 km | 11 | Expert |

---

## ⏰ Time Slots

| Period | Slots |
|--------|-------|
| ☀️ Morning | 9AM, 10AM, 11AM |
| 🌤 Afternoon | 12PM, 2PM, 4PM |
| 🌙 Evening/Night | 6PM, 7PM*, 8PM* |

*Night Serpent track only (7PM+)

---

## 💰 Pricing

| Package | Duration | Price |
|---------|----------|-------|
| Sprint Race | 10 min | ₹499 |
| Grand Prix | 20 min | ₹899 |
| Championship | 30 min | ₹1299 |
| Night Race | 20 min | ₹999 |
| Junior Race | 10 min | ₹349 |
| Corporate Event | Custom | Contact |

**Kart add-ons:** Sprint Blade +₹0 · Drift King +₹200 · Thunder Beast +₹400

---

## ✅ Features

- [x] Logo & kart images (logo_png.png, karts_png.png)
- [x] 3 kart classes with performance stats
- [x] 3 circuit maps (interactive SVG game-style layouts)
- [x] Time slot booking system (9 slots across morning/afternoon/night)
- [x] Customer review system with star ratings
- [x] Real business contact info (phone, email, address)
- [x] WhatsApp floating button (+91 79726 86940)
- [x] Live booking summary with price calculation
- [x] Admin Dashboard with revenue tracking & delete
- [x] LocalStorage fallback (works on GitHub Pages)
- [x] Full REST API (GET, POST, PUT, DELETE)
- [x] Reviews API (GET, POST, DELETE)
- [x] Admin stats: total revenue, today's revenue, per-kart revenue
- [x] Custom cursor, scroll animations, ticker tape
- [x] Responsive design (mobile friendly)

---

## 📁 Project Structure

```
velocity-arena/
├── index.html         ← Frontend (complete single-page app)
├── server.js          ← Backend (Express REST API)
├── package.json       ← Node.js config
├── logo_png.png       ← Velocity Arena logo
├── karts_png.png      ← Kart classes hero image
├── bookings.json      ← Auto-generated bookings database
├── reviews.json       ← Auto-generated reviews database
└── README.md          ← This file
```

---

*Built with ❤️ for Velocity Arena, Solapur — 2026*
