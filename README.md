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
- 😃 **Customer mood logic:** Each restaurant customer tracks their mood, which decays slowly and is affected by service speed. Mood, tip, and service quality are logged for analytics.
- 📦 **Downloadable session analytics:** Click "Download Report" to save a .json summary of the day, including:
  - Revenue, table stats, and capacity
  - Detailed customer info (mood, tip, wait time, service quality, time seated, time eating)
  - Worker stats (waiters, avg. orders handled, avg. time per table)
  - Mood breakdown, wasted orders, bottleneck alerts
  - Visualization-ready for BI tools
- 🌐 **Local network deployment:** Access the simulation from any device on your WiFi
- 🍽️ **Default scene:** Restaurant is now the default on load
- 🍽️ **Restaurant Agent Color Legend**

  - <span style="color:#1976d2;font-weight:bold;">Host</span>: Blue
  - <span style="color:#43a047;font-weight:bold;">Waiter</span>: Green
  - <span style="color:#ffb300;font-weight:bold;">Busser</span>: Yellow
  - <span style="color:#d32f2f;font-weight:bold;">Cook</span>: Red
  - <span style="color:#4caf50;font-weight:bold;">Customer</span>: Light Green

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
  │   │   ├── main.js       # Main entry point
  │   │   └── style.css     # Styles
  │   ├── logs/             # Progress and session logs
  │   └── index.html        # App entry
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
- After a restaurant session, click the **Download Report** button below the scene dropdown to save a `.json` file with:
  - Revenue, table stats, and capacity
  - Detailed `customers` array (order, mood, tip, wait time, service quality, time seated, time eating)
  - Worker stats, mood breakdown, wasted orders, bottleneck alerts
  - Visualization-ready for BI tools

### 📊 Example Log Structure
```json
{
  "avgTimeSeated": 280,
  "avgWaitTime": 75,
  "avgConsumptionTime": 180,
  "avgTip": 3.5,
  "moodBreakdown": {
    "happy": 14,
    "neutral": 4,
    "frustrated": 1
  },
  "wastedOrders": 2,
  "workerStats": {
    "waiters": 2,
    "avgOrdersHandled": 8,
    "avgTimePerTable": 160
  },
  "alerts": [
    "Table 3 had a delayed delivery (Customer #12)",
    "Table 2 had a delayed delivery (Customer #7)"
  ],
  ...
}
```

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
