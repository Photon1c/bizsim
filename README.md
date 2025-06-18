# Biz Sim

A Three.js-powered business operations simulator featuring a restaurant and a grocery store. Upcoming scenes include: airport, hotel, drive thru, and commercial strip. 

This project is version 2 of [Grocery Store Sim](https://github.com/Photon1c/grocerystoresim)

Check back later once the final debugged version is up and running. 🚧👷

Current progress:

---
Grocery Store Simulation Progress Log
---

Milestones Completed:
1. Project structure organized with /src, /assets, /public, /logs, etc.
2. Three.js scene set up with camera, lighting, and renderer.
3. Realistic grocery store layout: perimeter walls, aisles, bakery, deli, restrooms, warehouse, and self-checkout area.
4. Navigation controls: WASD to move, Q/E to move up/down, arrow keys to look, Shift for speed boost.
5. Worker and customer agents added to the scene.
6. Store entrance and self-checkout area implemented.
7. Customer agents now enter, wander aisles, check out, and exit with pathfinding, queueing, and collision logic.
8. Worker agents hover near self-checkout counters.
9. Camera view optimized for a clear, centered, downward angle.
10. Project logic modularized into agentController, pathfinding, and fixtureLoader modules.
11. Customers pick up baskets, browse dynamically throughout the store, and return baskets.
12. Interactive customer stats: click any customer to view a real-time stats card (time in store, money, mood, shopping list, etc.).
13. Stats overlay displays live data for all customers.
14. Shopping lists are now distributed evenly across all aisles, and each item is associated with a specific aisle.
15. Customers' waypoints are generated to visit the correct aisles for their shopping list.
16. A 'clue' mechanic ensures customers find their items as time passes at an aisle, preventing them from getting lost.
17. Stats overlay now has a Show/Hide button and is hidden by default.
18. Customer stats card and overlay always display item names and aisles, never [object Object].
19. MB Stats panel at the bottom left shows FPS, agent count, and memory usage.
20. Codebase modularized: logic, maps, and GUI now separated for grocery and restaurant (e.g., /logic/grocery, /logic/restaurant, /gui/grocery, /gui/restaurant)
21. Restaurant simulation added: new map, customer and worker agents (host, waiter, busser, cook), table seating, and order assignment
22. Unified Show/Hide Stats button and overlay logic for both scenes
23. Scene switching via dropdown; overlays and UI now context-aware and extensible
24. Dual progress bars per restaurant customer: order lifecycle (placed → cooking → delivering → served) and consumption, with dynamic UI and analytics-ready state.
25. Restaurant customer looping: customers leave when done eating, new customers are seated at the same table, and the process repeats indefinitely.

Current State:
- Both grocery and restaurant simulations are fully modular, with clear separation of logic, maps, and GUI overlays.
- Unified UI and stats overlays adapt to the current scene.
- Codebase is organized for future expansion and maintainability.

Pending/Next Steps:
- Implement item pickup and basket return logic.
- Add more agent behaviors (shopping lists, mood effects, etc.).
- Visual improvements: 3D models for agents, shelves, counters, and items.
- UI/UX enhancements for stats and controls.
- Performance optimization for larger agent counts.
- Prepare for deployment (Netlify, asset optimization).
- Add sound effects or background music for immersion.
- Save/load simulation state or session logs.

---
Last updated: 6/17/2025

