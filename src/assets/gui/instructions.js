export const INSTRUCTIONS_HTML = `
  <div style="max-width:480px;margin:0 auto;line-height:1.6;">
    <h2 style="margin-top:0;">Simulation Instructions</h2>
    <ul>
      <li><b>Scene Select</b> – Use the dropdown to switch between Grocery Store and Restaurant simulations</li>
      <li><b>WASD</b> – Move camera</li>
      <li><b>Q/E</b> – Move camera up/down</li>
      <li><b>Arrow Keys</b> – Rotate camera</li>
      <li><b>Shift</b> – Speed boost</li>
      <li><b>Click a customer</b> – View their stats card (works in both scenes)</li>
      <li><b>Show/Hide Stats</b> – Toggle overlay with all customer stats (unified button for both scenes)</li>
      <li><b>MB Stats panel</b> (bottom left) – FPS, agent count, memory usage</li>
      <li><b>Grocery Logic:</b> Customers pick up baskets, visit aisles for their shopping list, and check out. Items are distributed across all aisles. A clue mechanic ensures they find their items.</li>
      <li><b>Restaurant Logic:</b> Customers always enter through the front entrance, walk to their table (never through walls), and are seated. Workers have roles (host, waiter, busser, cook), and each customer has an order.</li>
      <li><b>Restaurant Agent Colors:</b> <span style="color:#1976d2;">Host</span>, <span style="color:#43a047;">Waiter</span>, <span style="color:#ffb300;">Busser</span>, <span style="color:#d32f2f;">Cook</span>, <span style="color:#4caf50;">Customer</span></li>
      <li><b>Press <kbd>i</kbd></b> – Show/hide this info panel</li>
      <li><b>Analytics Dashboard:</b> Click <b>Generate Report</b> (top right, restaurant scene) to open a live analytics panel with a large (1140x660) interactive chart. Upload a .json report to visualize session analytics. The panel is resizable for easier viewing and analysis.</li>
    </ul>
    <p style="color:#888;font-size:0.95em;">Project: Modular, interactive 3D grocery store and restaurant simulation with realistic agent behaviors, stats, and UI. Built with Vite + Three.js.</p>
  </div>
`; 
