import { renderRestaurantOrderOverlay } from './orderOverlay.js';
import { assignOrders } from '../../logic/restaurant/orderlogic.js';
import { TABLE_POSITIONS } from '../../maps/restaurant/restaurantmap.js';
import { TABLE_STATE } from '../../logic/restaurant/restaurantlogic.js';
import Chart from 'chart.js/auto';

let statsDiv = null;
let statsVisible = false;
let lastCustomersRef = null;
let reportBtn = null;
let chartsPanel = null;
let chartsVisible = false;
let uploadBtn = null;
let gitBtn = null;

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

export function ensureGenerateReportButton() {
  if (!reportBtn) {
    reportBtn = document.createElement('button');
    reportBtn.id = 'generate-report-btn';
    reportBtn.textContent = 'Generate Report';
    reportBtn.style.position = 'fixed';
    reportBtn.style.top = '52px';
    reportBtn.style.right = '10px';
    reportBtn.style.zIndex = '1002';
    reportBtn.style.padding = '6px 16px';
    reportBtn.style.background = '#43a047';
    reportBtn.style.color = '#fff';
    reportBtn.style.border = 'none';
    reportBtn.style.borderRadius = '8px';
    reportBtn.style.fontSize = '1em';
    reportBtn.style.cursor = 'pointer';
    reportBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
    reportBtn.onclick = () => {
      chartsVisible = !chartsVisible;
      if (chartsVisible) {
        showRestaurantChartsPanel();
      } else {
        hideRestaurantChartsPanel();
      }
    };
    document.body.appendChild(reportBtn);
  }
  reportBtn.style.display = window.currentScene === 'restaurant' ? 'block' : 'none';
}

export function ensureUploadReportButton() {
  if (!uploadBtn) {
    uploadBtn = document.createElement('button');
    uploadBtn.id = 'upload-report-btn';
    uploadBtn.textContent = 'Upload Report';
    uploadBtn.style.position = 'fixed';
    uploadBtn.style.top = '92px';
    uploadBtn.style.right = '10px';
    uploadBtn.style.zIndex = '1002';
    uploadBtn.style.padding = '6px 16px';
    uploadBtn.style.background = '#1976d2';
    uploadBtn.style.color = '#fff';
    uploadBtn.style.border = 'none';
    uploadBtn.style.borderRadius = '8px';
    uploadBtn.style.fontSize = '1em';
    uploadBtn.style.cursor = 'pointer';
    uploadBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
    uploadBtn.onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const data = JSON.parse(evt.target.result);
            // Pass to charts module
            import('./restaurantcharts.js').then(mod => {
              if (mod && mod.renderRestaurantCharts) {
                mod.renderRestaurantCharts('restaurant-charts-content', data);
              }
            });
            // Show the panel if not visible
            if (typeof showRestaurantChartsPanel === 'function') showRestaurantChartsPanel();
          } catch (err) {
            alert('Invalid JSON file.');
          }
        };
        reader.readAsText(file);
      };
      input.click();
    };
    document.body.appendChild(uploadBtn);
  }
  uploadBtn.style.display = window.currentScene === 'restaurant' ? 'block' : 'none';
}

function showRestaurantChartsPanel() {
  if (!chartsPanel) {
    chartsPanel = document.createElement('div');
    chartsPanel.id = 'restaurant-charts-panel';
    chartsPanel.style.position = 'fixed';
    chartsPanel.style.top = '100px';
    chartsPanel.style.right = '10px';
    chartsPanel.style.width = '420px';
    chartsPanel.style.height = '420px';
    chartsPanel.style.background = 'rgba(255,255,255,0.98)';
    chartsPanel.style.borderRadius = '12px';
    chartsPanel.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
    chartsPanel.style.zIndex = '2002';
    chartsPanel.style.padding = '18px 18px 12px 18px';
    chartsPanel.style.overflow = 'auto';
    chartsPanel.style.resize = '';
    chartsPanel.style.minWidth = '320px';
    chartsPanel.style.minHeight = '220px';
    chartsPanel.innerHTML = '<b>Restaurant Analytics</b><br><div id="restaurant-charts-content">Loading charts...</div>';
    document.body.appendChild(chartsPanel);
    // Add custom resize handle (bottom left)
    const resizeHandle = document.createElement('div');
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.left = '0';
    resizeHandle.style.bottom = '0';
    resizeHandle.style.width = '18px';
    resizeHandle.style.height = '18px';
    resizeHandle.style.cursor = 'nwse-resize';
    resizeHandle.style.background = 'linear-gradient(135deg, #eee 60%, #bbb 100%)';
    resizeHandle.style.borderBottomLeftRadius = '8px';
    resizeHandle.title = 'Resize';
    chartsPanel.appendChild(resizeHandle);
    // Drag logic
    let resizing = false;
    let startX, startY, startW, startH;
    resizeHandle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      resizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startW = chartsPanel.offsetWidth;
      startH = chartsPanel.offsetHeight;
      document.body.style.userSelect = 'none';
    });
    window.addEventListener('mousemove', (e) => {
      if (!resizing) return;
      const dx = startX - e.clientX;
      const dy = e.clientY - startY;
      chartsPanel.style.width = Math.max(320, startW + dx) + 'px';
      chartsPanel.style.height = Math.max(220, startH + dy) + 'px';
    });
    window.addEventListener('mouseup', () => {
      resizing = false;
      document.body.style.userSelect = '';
    });
    // Dynamically import and render charts
    import('./restaurantcharts.js').then(mod => {
      if (mod && mod.renderRestaurantCharts) {
        mod.renderRestaurantCharts('restaurant-charts-content');
      }
    });
  }
  chartsPanel.style.display = 'block';
}

function hideRestaurantChartsPanel() {
  if (chartsPanel) chartsPanel.style.display = 'none';
}

export function ensureGitButton() {
  if (!gitBtn) {
    gitBtn = document.createElement('a');
    gitBtn.id = 'github-link-btn';
    gitBtn.href = 'https://github.com/Photon1c/bizsim';
    gitBtn.target = '_blank';
    gitBtn.rel = 'noopener noreferrer';
    gitBtn.style.position = 'fixed';
    gitBtn.style.top = '132px';
    gitBtn.style.right = '10px';
    gitBtn.style.zIndex = '1002';
    gitBtn.style.padding = '6px 16px 6px 12px';
    gitBtn.style.background = '#24292f';
    gitBtn.style.color = '#fff';
    gitBtn.style.border = 'none';
    gitBtn.style.borderRadius = '8px';
    gitBtn.style.fontSize = '1em';
    gitBtn.style.cursor = 'pointer';
    gitBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
    gitBtn.style.display = 'flex';
    gitBtn.style.alignItems = 'center';
    gitBtn.innerHTML = `<svg height="20" width="20" viewBox="0 0 16 16" fill="#fff" style="margin-right:8px;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.11.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>GitHub`;
    document.body.appendChild(gitBtn);
  }
  gitBtn.style.display = window.currentScene === 'restaurant' ? 'flex' : 'none';
}

// Call this in your main render loop or scene switch logic
window.ensureGenerateReportButton = ensureGenerateReportButton;
window.ensureUploadReportButton = ensureUploadReportButton;
window.ensureGitButton = ensureGitButton; 
