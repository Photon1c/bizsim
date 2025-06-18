import * as THREE from 'three';
import { createGroceryMap } from './assets/maps/grocery/grocerymap.js';
import { createRestaurantMap, TABLE_POSITIONS } from './assets/maps/restaurant/restaurantmap.js';
import { addWorkerAgents } from './assets/agents/worker_agents.js';
import { createCustomerAgents } from './assets/agents/customer_agents.js';
import { createRestaurantAgents, updateRestaurantAgents, setSimTimeGetter, seatGroup as origSeatGroup, TABLE_STATE } from './assets/logic/restaurant/restaurantlogic.js';
import { updateAllAgents } from './assets/logic/grocery/agentController.js';
import { getRandomItems } from './assets/logic/grocery/inventory.js';
import { initCustomerStats, updateCustomerStats, renderStatsOverlay, enableCustomerClickStats, updateStatsCardRealtime } from './assets/gui/grocery/stats.js';
import { INSTRUCTIONS_HTML } from './assets/gui/instructions.js';
import { renderRestaurantStatsOverlay, setRestaurantStatsVisible } from './assets/gui/restaurant/restaurantStats.js';
import { getOrderTotal } from './assets/logic/restaurant/orderlogic.js';

let fs;
try { fs = require('fs'); } catch {}

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 40, 40); // Above and behind, centered
camera.lookAt(0, 0, 0);
let cameraRotation = { x: -Math.atan(40/40), y: 0 };

// Renderer (create only ONCE, never recreate or re-append)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Do NOT recreate or re-append the renderer on scene switch!

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

// --- Scene Switching Logic ---
let currentScene = 'grocery';
let customers = [];
let workers = [];
let restaurantCustomers = [];
let restaurantWorkers = [];

function clearScene() {
  // Remove all children except camera and light
  for (let i = scene.children.length - 1; i >= 0; i--) {
    const obj = scene.children[i];
    if (obj !== camera && obj !== light) {
      scene.remove(obj);
    }
  }
}

function loadGroceryScene() {
  clearScene();
  createGroceryMap(scene);
  workers = addWorkerAgents(scene, 3);
  customers = createCustomerAgents(scene, 8);
  // Initialize stats for each customer with a random shopping list
  customers.forEach((agent, i) => {
    const items = getRandomItems(2 + Math.floor(Math.random() * 6));
    initCustomerStats(agent, i, items);
  });
  enableCustomerClickStats(customers, camera, renderer);
}

function loadRestaurantScene() {
  clearScene();
  camera.position.set(0, 32, 32);
  camera.lookAt(0, 0, 0);
  const agents = createRestaurantAgents(scene, 8, 4); // 8 customers, 4 workers
  restaurantCustomers = agents.customers;
  restaurantWorkers = agents.workers;
  customers = [];
  workers = [];
  createRestaurantMap(scene);
  // TODO: Add restaurant stats/init logic if needed
}

function handleSceneChange(e) {
  const value = e.target.value;
  window.currentScene = value;
  statsVisible = false;
  updateStatsVisibility();
  if (value === 'grocery') {
    currentScene = 'grocery';
    loadGroceryScene();
  } else if (value === 'restaurant') {
    currentScene = 'restaurant';
    loadRestaurantScene();
  }
}

document.getElementById('scene-select').addEventListener('change', handleSceneChange);

// Set default scene to restaurant
const sceneSelect = document.getElementById('scene-select');
sceneSelect.value = 'restaurant';
window.currentScene = 'restaurant';
currentScene = 'restaurant';
loadRestaurantScene();

// --- Navigation Controls ---
const keys = {};
window.addEventListener('keydown', (e) => { keys[e.code] = true; });
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

function updateCameraControls(delta) {
  // Movement
  let speed = keys['ShiftLeft'] || keys['ShiftRight'] ? 12 : 4; // units per second
  let moveX = 0, moveY = 0, moveZ = 0;
  if (keys['KeyW']) moveZ -= 1;
  if (keys['KeyS']) moveZ += 1;
  if (keys['KeyA']) moveX -= 1;
  if (keys['KeyD']) moveX += 1;
  if (keys['KeyQ']) moveY -= 1;
  if (keys['KeyE']) moveY += 1;

  // Normalize movement
  const len = Math.hypot(moveX, moveY, moveZ);
  if (len > 0) {
    moveX /= len; moveY /= len; moveZ /= len;
  }

  // Camera rotation (arrow keys)
  const lookSpeed = 1.5 * delta;
  if (keys['ArrowLeft']) cameraRotation.y += lookSpeed;
  if (keys['ArrowRight']) cameraRotation.y -= lookSpeed;
  if (keys['ArrowUp']) cameraRotation.x += lookSpeed;
  if (keys['ArrowDown']) cameraRotation.x -= lookSpeed;
  cameraRotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, cameraRotation.x));

  // Apply rotation
  camera.rotation.order = 'YXZ';
  camera.rotation.y = cameraRotation.y;
  camera.rotation.x = cameraRotation.x;

  // Move in the direction the camera is facing
  const forward = new THREE.Vector3(0, 0, -1).applyEuler(camera.rotation);
  const right = new THREE.Vector3(1, 0, 0).applyEuler(camera.rotation);
  camera.position.addScaledVector(forward, moveZ * speed * delta);
  camera.position.addScaledVector(right, moveX * speed * delta);
  camera.position.y += moveY * speed * delta;
}

let lastTime = performance.now();
let frameCount = 0;
let fps = 0;
let lastFpsUpdate = performance.now();

// --- MB Stats Panel ---
let mbStatsDiv = null;
function updateMbStatsPanel(fps, agentCount) {
  if (!mbStatsDiv) {
    mbStatsDiv = document.createElement('div');
    mbStatsDiv.style.position = 'fixed';
    mbStatsDiv.style.left = '10px';
    mbStatsDiv.style.bottom = '10px';
    mbStatsDiv.style.background = 'rgba(30,30,40,0.92)';
    mbStatsDiv.style.color = '#fff';
    mbStatsDiv.style.padding = '10px 18px';
    mbStatsDiv.style.fontFamily = 'monospace';
    mbStatsDiv.style.fontSize = '1.1em';
    mbStatsDiv.style.borderRadius = '10px';
    mbStatsDiv.style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)';
    mbStatsDiv.style.zIndex = 1001;
    document.body.appendChild(mbStatsDiv);
  }
  let mem = '';
  if (performance && performance.memory) {
    const used = performance.memory.usedJSHeapSize / 1048576;
    const total = performance.memory.totalJSHeapSize / 1048576;
    mem = ` | Mem: ${used.toFixed(1)} / ${total.toFixed(1)} MB`;
  }
  mbStatsDiv.innerHTML = `FPS: <b>${fps}</b> | Agents: <b>${agentCount}</b>${mem}`;
}

// --- Unified Show/Hide Stats Button ---
let unifiedStatsBtn = null;
let statsVisible = false;
function ensureUnifiedStatsButton() {
  if (!unifiedStatsBtn) {
    unifiedStatsBtn = document.createElement('button');
    unifiedStatsBtn.id = 'unified-stats-toggle';
    unifiedStatsBtn.textContent = 'Show Stats';
    unifiedStatsBtn.style.position = 'fixed';
    unifiedStatsBtn.style.top = '10px';
    unifiedStatsBtn.style.right = '10px';
    unifiedStatsBtn.style.zIndex = '1001';
    unifiedStatsBtn.style.padding = '6px 16px';
    unifiedStatsBtn.style.background = '#222';
    unifiedStatsBtn.style.color = '#fff';
    unifiedStatsBtn.style.border = 'none';
    unifiedStatsBtn.style.borderRadius = '8px';
    unifiedStatsBtn.style.fontSize = '1em';
    unifiedStatsBtn.style.cursor = 'pointer';
    unifiedStatsBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
    unifiedStatsBtn.addEventListener('click', () => {
      statsVisible = !statsVisible;
      updateStatsVisibility();
    });
    document.body.appendChild(unifiedStatsBtn);
  }
}
function updateStatsVisibility() {
  if (currentScene === 'grocery') {
    if (window.statsDiv) window.statsDiv.style.display = statsVisible ? 'block' : 'none';
    if (typeof window.statsToggleBtn !== 'undefined') window.statsToggleBtn.style.display = 'none';
    setRestaurantStatsVisible(false);
  } else if (currentScene === 'restaurant') {
    setRestaurantStatsVisible(statsVisible);
    if (window.statsDiv) window.statsDiv.style.display = 'none';
    if (typeof window.statsToggleBtn !== 'undefined') window.statsToggleBtn.style.display = 'none';
  }
  unifiedStatsBtn.textContent = statsVisible ? 'Hide Stats' : 'Show Stats';
}

// --- Simulation Clock and Speed ---
let simTime = 11 * 60 * 60; // seconds since midnight, start at 11:00
const OPEN_TIME = 11 * 60 * 60; // 11:00
const CLOSE_TIME = 23 * 60 * 60; // 23:00
let clockDiv = null;
let speedSlider = null;
let simSpeed = 60; // 1s = 1min by default
function updateSimClock(delta) {
  // Advance time at simSpeed (1s = simSpeed seconds)
  simTime += delta * simSpeed;
  if (simTime > 24 * 60 * 60) simTime = 0;
  // Display
  if (!clockDiv) {
    clockDiv = document.createElement('div');
    clockDiv.id = 'sim-clock';
    clockDiv.style.position = 'fixed';
    clockDiv.style.top = '10px';
    clockDiv.style.left = '50%';
    clockDiv.style.transform = 'translateX(-50%)';
    clockDiv.style.background = 'rgba(30,30,40,0.92)';
    clockDiv.style.color = '#fff';
    clockDiv.style.padding = '6px 18px';
    clockDiv.style.fontFamily = 'monospace';
    clockDiv.style.fontSize = '1.2em';
    clockDiv.style.borderRadius = '8px';
    clockDiv.style.zIndex = 2002;
    document.body.appendChild(clockDiv);
  }
  if (!speedSlider) {
    speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.min = 1;
    speedSlider.max = 240;
    speedSlider.value = simSpeed;
    speedSlider.style.position = 'fixed';
    speedSlider.style.top = '48px';
    speedSlider.style.left = '50%';
    speedSlider.style.transform = 'translateX(-50%)';
    speedSlider.style.zIndex = 2002;
    speedSlider.title = 'Simulation Speed';
    document.body.appendChild(speedSlider);
    const label = document.createElement('div');
    label.id = 'sim-speed-label';
    label.style.position = 'fixed';
    label.style.top = '70px';
    label.style.left = '50%';
    label.style.transform = 'translateX(-50%)';
    label.style.color = '#fff';
    label.style.fontFamily = 'monospace';
    label.style.fontSize = '1em';
    label.style.zIndex = 2002;
    document.body.appendChild(label);
    speedSlider.oninput = () => {
      simSpeed = Number(speedSlider.value);
      label.textContent = `Speed: ${simSpeed}x`;
    };
    label.textContent = `Speed: ${simSpeed}x`;
  }
  const h = Math.floor(simTime / 3600);
  const m = Math.floor((simTime % 3600) / 60);
  clockDiv.textContent = `Time: ${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
}

// --- Session Orders Tracking ---
let sessionOrders = [];
function resetSessionOrders() { sessionOrders = []; }
function addSessionOrder(order, tableId) {
  sessionOrders.push({ order, tableId });
}

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const delta = (now - lastTime) / 1000;
  lastTime = now;
  frameCount++;
  updateSimClock(delta);
  let agentCount = currentScene === 'grocery' ? customers.length : (restaurantCustomers.length + restaurantWorkers.length);
  if (now - lastFpsUpdate > 1000) {
    fps = frameCount;
    frameCount = 0;
    lastFpsUpdate = now;
    console.log(`FPS: ${fps} | Active: ${agentCount}`);
    updateMbStatsPanel(fps, agentCount);
  }
  updateCameraControls(delta);
  ensureUnifiedStatsButton();
  if (currentScene === 'grocery') {
    updateAllAgents({ customers, workers }, delta, scene, now / 1000);
    customers.forEach((agent, i) => {
      updateCustomerStats(i, delta, agent.mood);
    });
    renderStatsOverlay(customers);
    updateStatsCardRealtime();
    setRestaurantStatsVisible(false);
    if (window.statsDiv) window.statsDiv.style.display = statsVisible ? 'block' : 'none';
  } else if (currentScene === 'restaurant') {
    updateRestaurantAgents({ customers: restaurantCustomers, workers: restaurantWorkers }, delta, scene);
    renderRestaurantStatsOverlay(restaurantCustomers, restaurantWorkers);
    setRestaurantStatsVisible(statsVisible);
    if (window.statsDiv) window.statsDiv.style.display = 'none';
  }
  updateStatsVisibility();
  renderer.render(scene, camera);

  // After scene setup, wire up open/close logic
  setSimTimeGetter(() => simTime >= OPEN_TIME && simTime < CLOSE_TIME);

  // In animate(), after advancing simTime:
  if (currentScene === 'restaurant' && simTime >= CLOSE_TIME && !window._sessionLogged) {
    window._sessionLogged = true;
    // Log session summary
    let totalRevenue = 0;
    let totalCustomers = 0;
    let orderCounts = {};
    let tableStats = {};
    for (const entry of sessionOrders) {
      const { order, tableId } = entry;
      if (!tableStats[tableId]) tableStats[tableId] = { revenue: 0, orders: [], customers: 0 };
      const orderTotal = getOrderTotal(order);
      tableStats[tableId].revenue += orderTotal;
      tableStats[tableId].orders.push(order);
      tableStats[tableId].customers++;
      totalRevenue += orderTotal;
      totalCustomers++;
      for (const item of order) {
        orderCounts[item] = (orderCounts[item] || 0) + 1;
      }
    }
    const totalTables = TABLE_POSITIONS.length;
    const occupiedTables = TABLE_STATE.filter(t => t.occupied).length;
    const percentFull = totalTables > 0 ? Math.round((occupiedTables / totalTables) * 100) : 0;
    const summary = {
      timestamp: new Date().toISOString(),
      totalRevenue,
      totalCustomers,
      orderCounts,
      tableStats,
      capacity: {
        totalTables,
        occupiedTables,
        percentFull
      }
    };
    console.log('[SESSION LOG]', summary);
    if (fs) {
      const now = new Date();
      const day = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
      const fname = `logs/sessions/session_${day}.log`;
      fs.appendFileSync(fname, JSON.stringify(summary) + '\n');
      console.log('[SESSION LOG] Appended to', fname);
    }
  }
  if (currentScene === 'restaurant' && simTime < CLOSE_TIME) {
    window._sessionLogged = false;
  }
}
animate();

// Session logging placeholder
function saveSessionLog() {
  // Calculate stats
  const agentsServed = currentScene === 'grocery' ? customers.length : (restaurantCustomers.length + restaurantWorkers.length);
  const avgTime = (currentScene === 'grocery' ? customers.reduce((sum, a, i) => sum + (window.getCustomerStats ? getCustomerStats(i).timeInStore : 0), 0) : 0) / agentsServed || 0;
  const avgMood = (currentScene === 'grocery' ? customers.reduce((sum, a, i) => sum + (window.getCustomerStats ? getCustomerStats(i).mood : 0), 0) : 0) / agentsServed || 0;
  const timestamp = new Date().toISOString();
  const log = {
    agents_served: agentsServed,
    average_time: `${Math.floor(avgTime/60)}m ${Math.round(avgTime%60)}s`,
    avg_mood: `${Math.round(avgMood)}%`,
    timestamp
  };
  // TODO: Save log to /logs/session_TIMESTAMP.json (requires backend or download)
  console.log('Session log:', log);
}
window.saveSessionLog = saveSessionLog;

// --- Title and Info Banner ---
function showTitleAndInfo() {
  // Title
  const titleDiv = document.createElement('div');
  titleDiv.id = 'gsim-title';
  titleDiv.style.position = 'fixed';
  titleDiv.style.top = '18px';
  titleDiv.style.left = '50%';
  titleDiv.style.transform = 'translateX(-50%)';
  titleDiv.style.fontFamily = 'system-ui,sans-serif';
  titleDiv.style.fontSize = '2.1em';
  titleDiv.style.fontWeight = 'bold';
  titleDiv.style.letterSpacing = '0.04em';
  titleDiv.style.color = '#222';
  titleDiv.style.background = 'rgba(255,255,255,0.92)';
  titleDiv.style.padding = '10px 32px 10px 24px';
  titleDiv.style.borderRadius = '16px';
  titleDiv.style.boxShadow = '0 2px 16px rgba(0,0,0,0.10)';
  titleDiv.style.zIndex = 3000;
  titleDiv.style.display = 'flex';
  titleDiv.style.alignItems = 'center';
  titleDiv.innerHTML = `Biz Sim <span id="gsim-info-blink" style="margin-left:24px;font-size:0.6em;font-weight:normal;color:#1976d2;animation: gsim-blink 1s steps(2, start) infinite;cursor:pointer;">press i for info</span>`;
  document.body.appendChild(titleDiv);
  // Blinking animation
  const style = document.createElement('style');
  style.innerHTML = `@keyframes gsim-blink { 0% { opacity: 1; } 50% { opacity: 0.2; } 100% { opacity: 1; } }`;
  document.head.appendChild(style);
  // Hide after 10 seconds
  setTimeout(() => { titleDiv.style.display = 'none'; }, 10000);
}
showTitleAndInfo();

// --- Instructions Modal ---
let infoModal = null;
let infoVisible = false;
function showInfoModal() {
  if (!infoModal) {
    infoModal = document.createElement('div');
    infoModal.id = 'gsim-info-modal';
    infoModal.style.position = 'fixed';
    infoModal.style.top = '50%';
    infoModal.style.left = '50%';
    infoModal.style.transform = 'translate(-50%,-50%)';
    infoModal.style.background = 'rgba(255,255,255,0.98)';
    infoModal.style.color = '#222';
    infoModal.style.padding = '32px 36px 28px 36px';
    infoModal.style.borderRadius = '18px';
    infoModal.style.boxShadow = '0 8px 48px rgba(0,0,0,0.18)';
    infoModal.style.zIndex = 4000;
    infoModal.style.maxWidth = '90vw';
    infoModal.style.maxHeight = '80vh';
    infoModal.style.overflowY = 'auto';
    infoModal.innerHTML = INSTRUCTIONS_HTML + '<div style="text-align:center;margin-top:18px;"><button id="gsim-info-close" style="padding:8px 24px;font-size:1em;border-radius:8px;border:none;background:#1976d2;color:#fff;cursor:pointer;">Close</button></div>';
    document.body.appendChild(infoModal);
    document.getElementById('gsim-info-close').onclick = () => { infoModal.style.display = 'none'; infoVisible = false; };
  }
  infoModal.style.display = 'block';
  infoVisible = true;
}
function hideInfoModal() {
  if (infoModal) infoModal.style.display = 'none';
  infoVisible = false;
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'i' || e.key === 'I') {
    if (infoVisible) {
      hideInfoModal();
    } else {
      showInfoModal();
    }
  }
});
// Also allow clicking the blinking text to show info
setTimeout(() => {
  const blink = document.getElementById('gsim-info-blink');
  if (blink) blink.onclick = showInfoModal;
}, 100);

// Patch seatGroup in restaurantlogic.js to call addSessionOrder for each customer
function seatGroupWithLog(scene, agents, groupSize) {
  const table = origSeatGroup(scene, agents, groupSize, (order, tableId) => addSessionOrder(order, tableId));
  return table;
}

// Add Download Report button below the scene dropdown
function addDownloadReportButton() {
  let btn = document.getElementById('download-report-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'download-report-btn';
    btn.textContent = 'Download Report';
    btn.style.position = 'fixed';
    btn.style.top = '52px';
    btn.style.left = '12px';
    btn.style.zIndex = 2000;
    btn.style.padding = '6px 16px';
    btn.style.fontSize = '1.1em';
    btn.style.borderRadius = '8px';
    btn.style.background = '#1976d2';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
    btn.style.cursor = 'pointer';
    btn.onclick = downloadSessionReport;
    document.body.appendChild(btn);
  }
}
addDownloadReportButton();

function downloadSessionReport() {
  // Generate the latest session summary (same as session log)
  let totalRevenue = 0;
  let totalCustomers = 0;
  let orderCounts = {};
  let tableStats = {};
  for (const entry of sessionOrders) {
    const { order, tableId } = entry;
    if (!tableStats[tableId]) tableStats[tableId] = { revenue: 0, orders: [], customers: 0 };
    const orderTotal = getOrderTotal(order);
    tableStats[tableId].revenue += orderTotal;
    tableStats[tableId].orders.push(order);
    tableStats[tableId].customers++;
    totalRevenue += orderTotal;
    totalCustomers++;
    for (const item of order) {
      orderCounts[item] = (orderCounts[item] || 0) + 1;
    }
  }
  const totalTables = TABLE_POSITIONS.length;
  const occupiedTables = TABLE_STATE.filter(t => t.occupied).length;
  const percentFull = totalTables > 0 ? Math.round((occupiedTables / totalTables) * 100) : 0;
  const summary = {
    timestamp: new Date().toISOString(),
    totalRevenue,
    totalCustomers,
    orderCounts,
    tableStats,
    capacity: {
      totalTables,
      occupiedTables,
      percentFull
    }
  };
  const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `restaurant_session_${new Date().toISOString().replace(/[:.]/g,'-')}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

window.addSessionOrder = addSessionOrder;
