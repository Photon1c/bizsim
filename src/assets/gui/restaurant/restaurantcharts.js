// Interactive Restaurant Analytics Charts
// To be filled in with live chart logic (e.g., Chart.js, D3, etc.)

import Chart from 'chart.js/auto';

// Chart size constants
const CHART_WIDTH = 1140;
const CHART_HEIGHT = 660;

export function renderRestaurantCharts(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (data) {
    // Show summary of uploaded report
    container.innerHTML = `
      <div style="text-align:center;margin-bottom:12px;font-size:1.2em;font-weight:bold;">Uploaded Report</div>
      <div style="margin-bottom:10px;">Total Revenue: <b>$${data.totalRevenue ?? 'N/A'}</b></div>
      <div style="margin-bottom:10px;">Total Customers: <b>${data.totalCustomers ?? 'N/A'}</b></div>
      <div style="margin-bottom:10px;">Avg Tip: <b>$${data.avgTip ?? 'N/A'}</b></div>
      <div style="margin-bottom:10px;">Mood Breakdown: <b>${data.moodBreakdown ? JSON.stringify(data.moodBreakdown) : 'N/A'}</b></div>
      <div style="margin-bottom:18px;">(Charts will appear here. Integrate with Chart.js or D3.)</div>
      <div id="chart-placeholder" style="width:100%;height:320px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#bbb;font-size:1.1em;">[Charts Placeholder]</div>
    `;
    const moods = ['happy', 'neutral', 'frustrated'];
    const values = moods.map(m => (data.moodBreakdown && data.moodBreakdown[m]) || 0);
    const hasData = values.some(v => v > 0);
    if (hasData) {
      // Remove placeholder and add canvas
      const chartPlaceholder = document.getElementById('chart-placeholder');
      if (chartPlaceholder) chartPlaceholder.remove();
      const canvas = document.createElement('canvas');
      canvas.id = 'moodChart';
      canvas.width = CHART_WIDTH;
      canvas.height = CHART_HEIGHT;
      canvas.style.marginTop = '18px';
      canvas.style.display = 'block';
      canvas.style.maxWidth = '100%';
      canvas.style.maxHeight = '100%';
      container.appendChild(canvas);
      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: moods,
          datasets: [{
            label: 'Mood Breakdown',
            data: values,
            backgroundColor: ['#4caf50', '#ffb300', '#d32f2f']
          }]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }
      });
    } else {
      container.innerHTML += '<div style="margin-top:18px;color:#b00;font-size:1.1em;">No mood breakdown data available.</div>';
    }
  } else {
    container.innerHTML = `
      <div style="text-align:center;margin-bottom:12px;font-size:1.2em;font-weight:bold;">Live Restaurant Analytics</div>
      <div style="margin-bottom:18px;">(Charts will appear here. Integrate with session data and Chart.js or D3.)</div>
      <div id="chart-placeholder" style="width:100%;height:320px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#bbb;font-size:1.1em;">[Charts Placeholder]</div>
    `;
  }
  // TODO: Add live chart rendering here
} 
