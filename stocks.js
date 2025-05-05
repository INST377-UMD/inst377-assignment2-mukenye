document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('stock-form');
    const symbolInput = document.getElementById('stock-symbol');
    const rangeSelect = document.getElementById('date-range');
    const chartCanvas = document.getElementById('stock-chart');
    const redditTable = document.querySelector('#reddit-table tbody');
  
    const POLYGON_API_KEY = 's8RZJwIKzxzZCTHBITwTbMBxNnp1kd_3';
  
    let chart; // We'll store the chart here so we can update it later
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const symbol = symbolInput.value.toUpperCase();
      const days = parseInt(rangeSelect.value);
      await fetchStockChart(symbol, days);
    });
  
    async function fetchStockChart(symbol, days) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - days);
  
      const from = start.toISOString().split('T')[0];
      const to = end.toISOString().split('T')[0];
  
      const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${POLYGON_API_KEY}`;
  
      try {
        const res = await fetch(url);
        const data = await res.json();
  
        if (!data.results || data.results.length === 0) {
          alert('No data found for this ticker.');
          return;
        }
  
        const dates = data.results.map(entry => {
          const d = new Date(entry.t);
          return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        });
  
        const prices = data.results.map(entry => entry.c);
  
        if (chart) chart.destroy();
  
        chart = new Chart(chartCanvas, {
          type: 'line',
          data: {
            labels: dates,
            datasets: [{
              label: `${symbol} Closing Price`,
              data: prices,
              fill: false,
              borderWidth: 2
            }]
          },
          options: {
            responsive: true
          }
        });
      } catch (err) {
        console.error('Error fetching stock data:', err);
      }
    }
  
    async function fetchRedditSentiment() {
      try {
        const res = await fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03');
        const data = await res.json();
        const top5 = data.slice(0, 5);
  
        redditTable.innerHTML = '';
  
        top5.forEach(item => {
          const row = document.createElement('tr');
  
          const tickerCell = document.createElement('td');
          const link = document.createElement('a');
          link.href = `https://finance.yahoo.com/quote/${item.ticker}`;
          link.target = '_blank';
          link.textContent = item.ticker;
          tickerCell.appendChild(link);
  
          const commentCell = document.createElement('td');
          commentCell.textContent = item.no_of_comments;
  
          const sentimentCell = document.createElement('td');
          const icon = document.createElement('span');
          icon.textContent = item.sentiment === 'Bullish' ? '📈' : '📉';
          sentimentCell.appendChild(icon);
  
          row.appendChild(tickerCell);
          row.appendChild(commentCell);
          row.appendChild(sentimentCell);
          redditTable.appendChild(row);
        });
      } catch (err) {
        console.error('Failed to load Reddit data:', err);
      }
    }
  
    // Load Reddit data on page load
    fetchRedditSentiment();
  
    // === Voice Commands ===
    if (window.annyang) {
      const commands = {
        'lookup *symbol': (symbol) => {
          symbolInput.value = symbol.toUpperCase();
          fetchStockChart(symbol.toUpperCase(), 30); // Default to 30 days
        },
        'change the color to *color': (color) => {
          document.body.style.backgroundColor = color;
        },
        'navigate to *page': (page) => {
          const dest = page.toLowerCase();
          if (dest.includes('home')) window.location.href = 'index.html';
          else if (dest.includes('dog')) window.location.href = 'dogs.html';
          else if (dest.includes('stock')) window.location.href = 'stocks.html';
        }
      };
  
      annyang.addCommands(commands);
      annyang.start();
    }
  });
  
  // Audio setup for home page
const turnOnBtn = document.querySelector('.audio-controls button:nth-child(3)');
const turnOffBtn = document.querySelector('.audio-controls button:nth-child(4)');

if (window.annyang) {
  const commands = {
    'hello': () => alert('Hello World'),
    'change the color to *color': (color) => {
      document.body.style.backgroundColor = color;
    },
    'navigate to *page': (page) => {
      const pageLower = page.toLowerCase();
      if (pageLower.includes('stock')) {
        window.location.href = 'stocks.html';
      } else if (pageLower.includes('dog')) {
        window.location.href = 'dogs.html';
      } else if (pageLower.includes('home')) {
        window.location.href = 'index.html';
      }
    }
  };

  annyang.addCommands(commands);

  turnOnBtn.addEventListener('click', () => {
    annyang.start();
    console.log('Annyang started');
  });

  turnOffBtn.addEventListener('click', () => {
    annyang.abort();
    console.log('Annyang stopped');
  });

  annyang.addCallback('error', err => console.error('Annyang error:', err));
  annyang.addCallback('resultNoMatch', phrases => {
    console.log("Didn't match:", phrases);
  });
}
