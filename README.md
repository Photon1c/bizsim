# Biz Sim

A Three.js-powered business operations simulator featuring a restaurant and a grocery store. Upcoming scenes include: airport, hotel, drive thru, and commercial strip. 

This project is now live [here](https://bizsim.netlify.app) 💡🔌

<details>

<summary>Project Updates</summary>

---
Grocery Store & Restaurant Simulation Progress Log 🚀🍽️
---

Milestones Completed:
1. 📁 Project structure organized with /src, /assets, /public, /logs, etc.
2. 🌟 Three.js scene set up with camera, lighting, and renderer.
3. 🏪 Realistic grocery store layout: perimeter walls, aisles, bakery, deli, restrooms, warehouse, and self-checkout area.
4. 🎮 Navigation controls: WASD to move, Q/E to move up/down, arrow keys to look, Shift for speed boost.
5. 🧑‍🤝‍🧑 Worker and customer agents added to the scene.
6. 🚪 Store entrance and self-checkout area implemented.
7. 🛒 Customer agents now enter, wander aisles, check out, and exit with pathfinding, queueing, and collision logic.
8. 👷 Worker agents hover near self-checkout counters.
9. 🎥 Camera view optimized for a clear, centered, downward angle.
10. 🧩 Project logic modularized into agentController, pathfinding, and fixtureLoader modules.
11. 🧺 Customers pick up baskets, browse dynamically throughout the store, and return baskets.
12. 👤 Interactive customer stats: click any customer to view a real-time stats card (time in store, money, mood, shopping list, etc.).
13. 📊 Stats overlay displays live data for all customers.
14. 🗂️ Shopping lists are now distributed evenly across all aisles, and each item is associated with a specific aisle.
15. 🧭 Customers' waypoints are generated to visit the correct aisles for their shopping list.
16. 💡 A 'clue' mechanic ensures customers find their items as time passes at an aisle, preventing them from getting lost.
17. 👁️ Stats overlay now has a Show/Hide button and is hidden by default.
18. 📝 Customer stats card and overlay always display item names and aisles, never [object Object].
19. 📉 MB Stats panel at the bottom left shows FPS, agent count, and memory usage.
20. 🧩 Codebase modularized: logic, maps, and GUI now separated for grocery and restaurant (e.g., /logic/grocery, /logic/restaurant, /gui/grocery, /gui/restaurant)
21. 🍽️ Restaurant simulation added: new map, customer and worker agents (host, waiter, busser, cook), table seating, and order assignment
22. 🔄 Unified Show/Hide Stats button and overlay logic for both scenes
23. 🖥️ Scene switching via dropdown; overlays and UI now context-aware and extensible
24. 📊 Dual progress bars per restaurant customer: order lifecycle (placed → cooking → delivering → served) and consumption, with dynamic UI and analytics-ready state.
25. 🔁 Restaurant customer looping: customers leave when done eating, new customers are seated at the same table, and the process repeats indefinitely.
26. 📝 Session logging at restaurant closing: logs total revenue, customers served, and order breakdown. Menu and pricing logic modularized for analytics.
27. 🏆 Restaurant stats overlay now lists table numbers and customer numbers for easy occupancy tracking (orders are shown in a separate overlay)
28. 📦 Downloadable session analytics: "Download Report" button saves a .json summary of the day (revenue, table stats, capacity, etc.)
29. 🌐 Local network deployment: run with `npx vite --host` and access from any device on your WiFi
30. 🍽️ Default scene is now Restaurant for quick demo and analytics
31. 😃 Customer mood logic: Each restaurant customer tracks mood, which decays slowly and is affected by service speed. Mood and service quality are logged for analytics.
32. 📊 Session logs now include a detailed 'customers' array with order, mood, wait time, and service quality for each customer.
33. 🚀 Deployed to Netlify: The simulation is now live and accessible online for easy sharing and demoing.
    - URL: https://bizsim.netlify.app/
34. 📊 Phase 3 Analytics: Session logs now include customer timing stats (avgTimeSeated, avgWaitTime, avgConsumptionTime), mood/tip analytics, worker stats, wasted orders, bottleneck alerts, and are ready for visualization.
35. 🚪 Improved Restaurant Entrance: Customers now always enter through the front entrance and follow waypoints to their table, never walking through walls.
36. 🟢 All Bugs Fixed: Entry/exit logic, agent speed, and wall-walking issues are fully resolved. Simulation is robust and polished.
37. 📊 Interactive Analytics Dashboard: Live charts (Chart.js), uploadable .json reports, and a resizable analytics window for restaurant analytics. The main chart is now 3x larger (1140x660) for easier viewing and analysis.

Current State:
- The simulation is live on Netlify and accessible from anywhere 🌍
- Restaurant customers now always enter through the front entrance and follow waypoints to their table, never walking through walls.
- Phase 3 analytics: Downloadable logs now include customer timing, mood/tip, worker stats, wasted orders, bottleneck alerts, and are ready for BI visualization.
- Both grocery and restaurant simulations are fully modular, with clear separation of logic, maps, and GUI overlays.
- Unified UI and stats overlays adapt to the current scene.
- Codebase is organized for future expansion and maintainability.
- Analytics and session logs are easily downloadable for business intelligence and charting, including detailed customer mood and service quality analytics.
- All major bugs are fixed: agent movement, entry/exit, and speed are now robust and reliable. Simulation is polished and ready for further features or deployment.
- Interactive analytics dashboard: live charts, uploadable reports, and a resizable analytics window for restaurant analytics.
- The analytics dashboard chart is now 3x larger (1140x660), making analytics easier to view and analyze. The panel is resizable and the chart is interactive and visualization-ready.

Pending/Next Steps:
- 🛒 Implement item pickup and basket return logic.
- 😃 Add more agent behaviors (shopping lists, mood effects, etc.).
- 🖼️ Visual improvements: 3D models for agents, shelves, counters, and items.
- 🧑‍💻 UI/UX enhancements for stats and controls.
- 🚀 Performance optimization for larger agent counts.
- 🔊 Add sound effects or background music for immersion.
- 💾 Save/load simulation state or session logs.

---
Last updated: after modularization, restaurant sim, unified UI, analytics download, and WiFi deployment milestone 🍽️📊🌐 

</details>

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
