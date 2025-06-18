import { renderRestaurantOrderOverlay } from './orderOverlay.js';
import { assignOrders } from '../../logic/restaurant/orderlogic.js';
import { TABLE_POSITIONS } from '../../maps/restaurant/restaurantmap.js';
import { TABLE_STATE } from '../../logic/restaurant/restaurantlogic.js';

let statsDiv = null;
let statsVisible = false;
let lastCustomersRef = null;

export function setRestaurantStatsVisible(visible) {
  statsVisible = visible;
  if (statsDiv) statsDiv.style.display = statsVisible ? 'block' : 'none';
}

export function renderRestaurantStatsOverlay(customers, workers) {
  // Only create one instance of the stats panel
  if (!statsDiv) {
    statsDiv = document.createElement('div');
    statsDiv.id = 'restaurant-stats-div';
    statsDiv.style.position = 'fixed';
    statsDiv.style.top = '90px'; // below grocery stats
    statsDiv.style.right = '10px';
    statsDiv.style.background = 'rgba(30,30,40,0.92)';
    statsDiv.style.color = '#fff';
    statsDiv.style.padding = '10px 18px';
    statsDiv.style.fontFamily = 'monospace';
    statsDiv.style.fontSize = '1.1em';
    statsDiv.style.borderRadius = '10px';
    statsDiv.style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)';
    statsDiv.style.zIndex = 1001;
    document.body.appendChild(statsDiv);
  }
  if (!statsVisible) {
    statsDiv.style.display = 'none';
    return;
  } else {
    statsDiv.style.display = 'block';
  }
  // Assign orders if not already present
  if (customers !== lastCustomersRef) {
    assignOrders(customers);
    lastCustomersRef = customers;
  }
  let roleCounts = { host: 0, waiter: 0, busser: 0, cook: 0 };
  for (const w of workers) roleCounts[w.role] = (roleCounts[w.role] || 0) + 1;
  // Capacity and percent full
  const totalTables = TABLE_POSITIONS.length;
  const occupiedTables = TABLE_STATE.filter(t => t.occupied).length;
  const percentFull = totalTables > 0 ? Math.round((occupiedTables / totalTables) * 100) : 0;
  let tableToCustomers = {};
  customers.forEach((c, i) => {
    if (c.table && c.table.id) {
      if (!tableToCustomers[c.table.id]) tableToCustomers[c.table.id] = [];
      tableToCustomers[c.table.id].push(i+1); // Customer #
    }
  });
  let html = `<b>Restaurant Stats</b><br/>
    Customers: <b>${customers.length}</b><br/>
    Workers: <b>${workers.length}</b><br/>
    Capacity: <b>${occupiedTables} / ${totalTables}</b> (${percentFull}%)<br/>
    Host: ${roleCounts.host} | Waiter: ${roleCounts.waiter} | Busser: ${roleCounts.busser} | Cook: ${roleCounts.cook}<br/><br/>
    <b>Tables & Customers:</b><br/>`;
  Object.keys(tableToCustomers).sort((a,b)=>a-b).forEach(tableId => {
    html += `Table ${tableId}: Customer #${tableToCustomers[tableId].join(', #')}<br/>`;
  });
  statsDiv.innerHTML = html;
  renderRestaurantOrderOverlay(customers);
} 