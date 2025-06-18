# Biz Sim

A Three.js-powered business operations simulator featuring a restaurant and a grocery store. Upcoming scenes include: airport, hotel, drive thru, and commercial strip. 

This project is version 2 of [Grocery Store Sim](https://github.com/Photon1c/grocerystoresim)

## Grocery Store & Restaurant Simulation 🍎🍔

A modular, interactive 3D simulation built with Vite and Three.js. Simulates customer and worker agents, dynamic behaviors, collision detection, and real-time stats tracking for both a grocery store and a restaurant.

## ✨ Features
- 🔄 **Scene switching:** Choose between Grocery Store and Restaurant simulations
- 🏪 **3D layouts:** Grocery aisles, bakery, deli, restrooms, warehouse, self-checkout; Restaurant with tables, host stand, kitchen, restrooms, waiting area
- 🎮 **Navigation:** WASD + Q/E + arrow keys, isometric/top-down/angled camera
- 🧑‍🤝‍🧑 **Customer and worker agents:** Pathfinding, queueing, and collision logic
- 🛒 **Grocery:** Customers pick up baskets, browse aisles, check out, and exit (looping)
- 🍽️ **Restaurant:** Customers are seated at tables, workers have roles (host, waiter, busser, cook), and each customer has an order
- 📝 **Shopping lists & orders:** Distributed across aisles; restaurant orders assigned per customer
- 🧭 **Clue mechanic:** Ensures grocery customers find their items
- 📊 **Unified Show/Hide Stats button:** Toggles the correct overlay for the current scene
- 👤 **Customer stats card & overlay:** Real-time, always display item names and aisles/orders
- 📉 **MB Stats panel:** Bottom left, shows FPS, agent count, and memory usage
- 🖥️ **Real-time overlays:** Interactive stats card (click a customer to view details)
- 🧩 **Modular codebase:** Logic, agents, maps, GUI, assets, separated for grocery and restaurant
- 🏆 **Restaurant stats overlay:** Lists table numbers and customer numbers for easy occupancy tracking
- 📦 **Downloadable session analytics:** Click "Download Report" to save a .json summary of the day (revenue, table stats, capacity, etc.)
- 🌐 **Local network deployment:** Access the simulation from any device on your WiFi
- 🍽️ **Default scene:** Restaurant is now the default on load

## 🗂️ Project Structure
```
bizsim/
  ├── public/           # Static assets (SVGs, images, etc.)
  ├── src/
  │   ├── agents/       # Agent classes and logic
  │   ├── assets/
  │   │   ├── gui/
  │   │   │   ├── grocery/      # Grocery UI overlays and stats
  │   │   │   └── restaurant/   # Restaurant UI overlays and stats
  │   │   ├── logic/
  │   │   │   ├── grocery/      # Grocery logic (controllers, pathfinding, inventory, etc.)
  │   │   │   └── restaurant/   # Restaurant logic
  │   │   ├── maps/
  │   │   │   ├── grocery/      # Grocery store layout and fixtures
  │   │   │   └── restaurant/   # Restaurant layout and fixtures
  │   ├── main.js       # Main entry point
  │   └── style.css     # Styles
  ├── logs/             # Progress and session logs
  ├── index.html        # App entry
  └── package.json      # Dependencies
```

## 🚀 How to Run
1. Install dependencies:
   ```
   npm install
   ```
2. Start the dev server (local + WiFi):
   ```
   npx vite --host
   ```
3. Open [http://localhost:5173](http://localhost:5173) or the Network URL (e.g., `http://{your_ip}:5173/`) on any device on your WiFi.

## 📥 Downloading Analytics
- After a restaurant session, click the **Download Report** button below the scene dropdown to save a `.json` file with revenue, table stats, and capacity analytics.

## 📝 Next Steps
- 🛒 Implement item pickup and basket return
- 😃 Add more agent behaviors and mood effects
- 🖼️ Visual improvements: 3D models for agents, shelves, counters, and items
- 🧑‍💻 UI/UX enhancements for stats and controls
- 🚀 Performance optimization for larger agent counts
- 🌍 Prepare for deployment (Netlify, asset optimization)
- 🔊 Add sound effects or background music
- 💾 Save/load simulation state or session logs

---
_Last updated: after modularization, restaurant sim, unified UI, analytics download, and WiFi deployment milestone_ 🍽️📊🌐

