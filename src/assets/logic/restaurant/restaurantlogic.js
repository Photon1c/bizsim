import * as THREE from 'three';
import { HOST_POS, KITCHEN_POS, TABLE_POSITIONS, ENTRANCE_POS } from '../../maps/restaurant/restaurantmap.js';
import { assignOrders } from './orderlogic.js';

// Colors for roles
const ROLE_COLORS = {
  host: 0x1976d2,    // blue
  waiter: 0x43a047,  // green
  busser: 0xffb300,  // yellow
  cook: 0xd32f2f,    // red
  customer: 0x4caf50 // light green
};

// Track table occupancy
export const TABLE_STATE = TABLE_POSITIONS.map((table, idx) => ({ ...table, occupied: false, group: null, id: idx+1 }));
let groupQueue = [];
let groupArrivalTimer = 0;

function getFreeTable() {
  return TABLE_STATE.find(t => !t.occupied);
}

export function seatGroup(scene, agents, groupSize, onSeatCustomer) {
  const table = getFreeTable();
  if (!table) return false;
  table.occupied = true;
  table.group = [];
  for (let i = 0; i < groupSize; i++) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x4caf50 })
    );
    mesh.userData.type = 'customer';
    // Seat at one of 4 chair positions
    const seatAngle = (Math.PI/2) * i;
    const seatX = table.x + Math.cos(seatAngle) * 1.5;
    const seatZ = table.z + Math.sin(seatAngle) * 1.5;
    // Place mesh at entrance gap and add to scene
    mesh.position.set(0, 0.5, 16);
    scene.add(mesh);
    // Add waypoints: entrance gap (z=16) -> just inside (z=12) -> seat
    const waypoints = [
      { x: 0, y: 0.5, z: 16 }, // entrance gap in wall
      { x: 0, y: 0.5, z: HOST_POS.z }, // just inside entrance
      { x: seatX, y: 0.5, z: seatZ }
    ];
    const customer = {
      mesh,
      table,
      seat: i,
      group: table,
      state: 'walking', // 'walking', 'seated'
      hasOrdered: false,
      hasEaten: false,
      orderState: 'placed',
      orderProgress: 0,
      consumptionProgress: 0,
      waypoints,
      waypointIndex: 0,
      target: waypoints[0],
      mood: 100,
      waitStartTime: Date.now(),
      servedTime: null,
      waitDuration: null,
      serviceQuality: null, // 'good', 'ok', 'bad'
      tip: null, // mood-based tip
      timeSeated: Date.now(),
      timeFinished: null,
      consumptionTime: null,
      bottleneck: false // flag for bottleneck alerts
    };
    agents.customers.push(customer);
    table.group.push(customer);
    assignOrders([customer]);
    if (onSeatCustomer) onSeatCustomer(customer, table.id);
  }
  return true;
}

export function createRestaurantAgents(scene, customerCount = 8, workerCount = 3) {
  const customers = [];
  const workers = [];

  // Create worker agents (roles: host, waiter, busser, cook; sometimes one does all)
  const roles = ['host', 'waiter', 'busser', 'cook'];
  for (let i = 0; i < workerCount; i++) {
    const role = roles[i % roles.length];
    const color = ROLE_COLORS[role];
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshStandardMaterial({ color })
    );
    mesh.userData.type = 'worker';
    mesh.userData.role = role;
    // Place at host stand, kitchen (in front), or random
    if (role === 'host') mesh.position.set(HOST_POS.x, 0.5, HOST_POS.z);
    else if (role === 'cook') mesh.position.set(KITCHEN_POS.x, 0.5, KITCHEN_POS.z + 4); // in front of kitchen
    else mesh.position.set(0, 0.5, 0);
    scene.add(mesh);
    workers.push({ mesh, role, state: 'idle', target: null });
  }

  // Initially, no customers; groups will arrive over time
  return { customers, workers };
}

export let isRestaurantOpen = () => true; // default
export function setSimTimeGetter(getter) { isRestaurantOpen = getter; }

export function updateRestaurantAgents(agents, delta, scene) {
  if (!agents || !agents.customers || !agents.workers) return;
  // Simple logic: host stands at host stand, cook stays in front of kitchen, waiter visits tables
  for (const worker of agents.workers) {
    if (worker.role === 'host') {
      worker.mesh.position.set(HOST_POS.x, 0.5, HOST_POS.z);
    } else if (worker.role === 'cook') {
      worker.mesh.position.set(KITCHEN_POS.x, 0.5, KITCHEN_POS.z + 4);
    } else if (worker.role === 'waiter') {
      const t = Date.now() * 0.0003 + worker.mesh.id;
      const idx = Math.floor((Math.sin(t) + 1) / 2 * (TABLE_POSITIONS.length - 1));
      const table = TABLE_POSITIONS[idx];
      worker.mesh.position.lerp(new THREE.Vector3(table.x, 0.5, table.z), 0.05);
    } else if (worker.role === 'busser') {
      const t = Date.now() * 0.0002 + worker.mesh.id;
      const idx = Math.floor((Math.cos(t) + 1) / 2 * (TABLE_POSITIONS.length - 1));
      const table = TABLE_POSITIONS[idx];
      worker.mesh.position.lerp(new THREE.Vector3(table.x, 0.5, table.z), 0.03);
    }
  }
  // --- Group Arrival Logic ---
  groupArrivalTimer -= delta;
  if (typeof isRestaurantOpen === 'function' ? isRestaurantOpen() : true) {
    if (groupArrivalTimer <= 0) {
      // Try to seat a new group if a table is free
      const groupSize = 1 + Math.floor(Math.random() * 4); // 1-4
      const rate = (typeof window !== 'undefined' && window.footTrafficRate) ? window.footTrafficRate : 1.0;
      if (seatGroup(scene, agents, groupSize, (customer, tableId) => {
        if (typeof window !== 'undefined' && window.addSessionOrder && customer.order) {
          window.addSessionOrder(customer.order, tableId, customer);
        }
      })) {
        groupArrivalTimer = (3 + Math.random() * 4) / rate; // Next group in 3-7 seconds, scaled by foot traffic
      } else {
        groupArrivalTimer = 2 / rate; // Try again soon if no table free
      }
    }
  }
  // --- Customer/Group Update & Departure ---
  for (let i = agents.customers.length - 1; i >= 0; i--) {
    const customer = agents.customers[i];
    // --- Movement to table ---
    if (customer.state === 'walking') {
      const mesh = customer.mesh;
      const waypoints = customer.waypoints;
      let idx = customer.waypointIndex || 0;
      const target = waypoints[idx];
      const dx = target.x - mesh.position.x;
      const dz = target.z - mesh.position.z;
      const dist = Math.sqrt(dx*dx + dz*dz);
      const speed = 2.2; // units/sec
      if (dist > 0.05) {
        mesh.position.x += (dx/dist) * speed * delta;
        mesh.position.z += (dz/dist) * speed * delta;
      } else {
        mesh.position.x = target.x;
        mesh.position.z = target.z;
        if (idx < waypoints.length - 1) {
          customer.waypointIndex = idx + 1;
          customer.target = waypoints[idx + 1];
        } else {
          customer.state = 'seated';
        }
      }
      continue; // Don't progress order/consumption until seated
    }
    // --- Mood logic ---
    // Very slow decay
    customer.mood -= delta * 0.01;
    // Exponential decay if waiting too long for food
    if (customer.state === 'seated' && customer.orderState !== 'delivered') {
      const wait = (Date.now() - customer.waitStartTime) / 1000;
      if (wait > 60) { // after 60s, decay increases
        customer.mood -= delta * 0.05 * Math.exp((wait-60)/60);
      }
    }
    // Clamp mood
    customer.mood = Math.max(0, Math.min(100, customer.mood));
    // --- Order/consumption logic (only if seated) ---
    if (customer.state === 'seated') {
      if (customer.orderState === 'placed') {
        customer.orderProgress += delta * 0.1;
        if (customer.orderProgress >= 0.25) {
          customer.orderState = 'cooking';
        }
      } else if (customer.orderState === 'cooking') {
        customer.orderProgress += delta * 0.15;
        if (customer.orderProgress >= 0.5) {
          customer.orderState = 'delivering';
        }
      } else if (customer.orderState === 'delivering') {
        customer.orderProgress += delta * 0.2;
        if (customer.orderProgress >= 0.75) {
          customer.orderState = 'delivered';
          // Mood adjustment on service
          customer.servedTime = Date.now();
          customer.waitDuration = (customer.servedTime - customer.waitStartTime) / 1000;
          if (customer.waitDuration < 45) {
            customer.mood = Math.min(100, customer.mood + 10);
            customer.serviceQuality = 'good';
          } else if (customer.waitDuration < 90) {
            customer.mood = Math.min(100, customer.mood + 2);
            customer.serviceQuality = 'ok';
          } else {
            customer.mood = Math.max(0, customer.mood - 10);
            customer.serviceQuality = 'bad';
            customer.bottleneck = true;
          }
          // Mood-based tip logic
          if (customer.mood >= 90) customer.tip = 5 + Math.random();
          else if (customer.mood >= 70) customer.tip = 3 + Math.random();
          else if (customer.mood >= 50) customer.tip = 1 + Math.random();
          else customer.tip = 0;
          customer.tip = Math.round(customer.tip * 100) / 100;
        }
      } else if (customer.orderState === 'delivered') {
        customer.orderProgress = 1;
        if (customer.consumptionProgress < 1) {
          customer.consumptionProgress += delta * 0.08;
        } else {
          customer.consumptionProgress = 1;
          if (!customer.timeFinished) {
            customer.timeFinished = Date.now();
            customer.consumptionTime = (customer.timeFinished - customer.servedTime) / 1000;
          }
          // Check if all group members are done
          const group = customer.group;
          if (group && group.group && group.group.every(m => m.consumptionProgress >= 1)) {
            // Remove all group members
            for (const member of group.group) {
              scene.remove(member.mesh);
              const idx = agents.customers.indexOf(member);
              if (idx !== -1) agents.customers.splice(idx, 1);
            }
            group.occupied = false;
            group.group = null;
          }
        }
      }
    }
  }
  // Optionally, re-assign orders for new customers
  if (typeof assignOrders === 'function') assignOrders(agents.customers);
} 
