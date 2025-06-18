// Restaurant Order Overlay
let orderOverlayVisible = true;
export function renderRestaurantOrderOverlay(customers) {
  let overlay = document.getElementById('restaurant-order-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'restaurant-order-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '90px';
    overlay.style.left = '10px';
    overlay.style.right = '';
    overlay.style.background = 'rgba(30,30,40,0.92)';
    overlay.style.color = '#fff';
    overlay.style.padding = '10px 18px';
    overlay.style.fontFamily = 'monospace';
    overlay.style.fontSize = '1.1em';
    overlay.style.borderRadius = '10px';
    overlay.style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)';
    overlay.style.zIndex = 1001;
    overlay.style.maxHeight = '90vh';
    overlay.style.overflowY = 'auto';
    document.body.appendChild(overlay);
  }
  let html = '';
  html += `<button id="order-overlay-toggle-btn" style="position:absolute;top:8px;left:8px;padding:4px 12px;font-size:1em;border-radius:6px;border:none;background:#222;color:#fff;cursor:pointer;z-index:1002;">${orderOverlayVisible ? 'Hide' : 'Show'} Orders</button>`;
  if (orderOverlayVisible) {
    customers.forEach((c, i) => {
      const stateMap = {
        placed: 0.25,
        cooking: 0.5,
        delivering: 0.75,
        delivered: 1
      };
      const colorMap = {
        placed: 'gray',
        cooking: 'orange',
        delivering: 'lightblue',
        delivered: 'green'
      };
      const orderPct = Math.min(1, c.orderProgress || 0);
      const consumptionPct = Math.min(1, c.consumptionProgress || 0);
      html += `<div class="customer-card" style="margin-bottom:18px;min-width:220px;">
        <div class="label" style="font-weight:bold;margin-bottom:2px;">Customer #${i+1}</div>
        <div class="order-bar-bg" style="width:100%;height:6px;background:#ccc;border-radius:2px;margin-top:4px;">
          <div class="order-bar-fill" style="height:6px;border-radius:2px;width:${orderPct*100}%;background:${colorMap[c.orderState]};transition:width 0.3s;"></div>
        </div>
        <div class="consumption-bar-bg" style="width:100%;height:3px;background:#bbb;border-radius:2px;margin-top:2px;">
          <div class="consumption-bar-fill" style="height:3px;border-radius:2px;width:${consumptionPct*100}%;background:lightgreen;transition:width 0.3s;"></div>
        </div>
        <div style="font-size:0.95em;color:#bbb;margin-top:4px;">Order: ${c.order ? c.order.join(', ') : '—'}</div>
        <div style="font-size:0.92em;color:#aaa;">Status: <b>${c.orderState.charAt(0).toUpperCase() + c.orderState.slice(1)}</b></div>
      </div>`;
    });
  }
  overlay.innerHTML = html;
  overlay.style.display = customers.length ? 'block' : 'none';
  // Add toggle logic
  const btn = document.getElementById('order-overlay-toggle-btn');
  if (btn) {
    btn.onclick = () => {
      orderOverlayVisible = !orderOverlayVisible;
      renderRestaurantOrderOverlay(customers);
    };
  }
}

if (!document.getElementById('restaurant-order-overlay-style')) {
  const style = document.createElement('style');
  style.id = 'restaurant-order-overlay-style';
  style.innerHTML = `
    .order-bar-bg, .consumption-bar-bg {
      width: 100%;
      background-color: #ccc;
      border-radius: 2px;
      margin-top: 4px;
    }
    .order-bar-bg { height: 6px; }
    .order-bar-fill { height: 6px; border-radius: 2px; }
    .consumption-bar-bg { height: 3px; background-color: #bbb; }
    .consumption-bar-fill { height: 3px; border-radius: 2px; }
  `;
  document.head.appendChild(style);
} 