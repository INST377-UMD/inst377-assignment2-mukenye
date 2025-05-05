document.addEventListener('DOMContentLoaded', () => {
    const quoteText = document.getElementById('quote-text');
  
    // Load quote from ZenQuotes API
    fetch('https://zenquotes.io/api/random')
      .then(res => res.json())
      .then(data => {
        if (data && data[0]) {
          quoteText.innerHTML = `"${data[0].q}" — <em>${data[0].a}</em>`;
        } else {
          quoteText.textContent = 'No quote available.';
        }
      })
      .catch(err => {
        console.error('Failed to fetch quote:', err);
        quoteText.textContent = 'Quote failed to load.';
      });

      
  
    // === Annyang Commands ===
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
      annyang.start(); // Start by default
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

  