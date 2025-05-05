document.addEventListener('DOMContentLoaded', () => {
  const carouselContainer = document.getElementById('dog-carousel');
  const breedButtonsContainer = document.getElementById('breed-buttons');
  const breedInfoContainer = document.getElementById('breed-info');

  // Load 10 random dog images for carousel
  fetch('https://dog.ceo/api/breeds/image/random/10')
    .then(res => res.json())
    .then(data => {
      if (data && data.message) {
        carouselContainer.innerHTML = data.message.map(img =>
          `<img src="${img}" class="slide" alt="Dog image"/>`
        ).join('');
        // Initialize Simple-Slider
        new SimpleSlider('.carousel', {
          autoPlay: true,
          delay: 3000
        });
      }
    })
    .catch(err => {
      console.error('Failed to load dog images:', err);
    });

  // Load all dog breeds
  fetch('https://dog.ceo/api/breeds/list/all')
    .then(res => res.json())
    .then(data => {
      const breeds = Object.keys(data.message);
      breeds.forEach(breed => {
        const btn = document.createElement('button');
        btn.textContent = breed;
        btn.classList.add('breed-button');
        btn.setAttribute('data-breed', breed);
        btn.addEventListener('click', () => loadBreedInfo(breed));
        breedButtonsContainer.appendChild(btn);
      });
    })
    .catch(err => console.error('Failed to load breed list:', err));

  // Load breed info when button clicked or voice command used
  async function loadBreedInfo(breed) {
    breedInfoContainer.innerHTML = 'Loading info...';
    breedInfoContainer.classList.remove('hidden');

    try {
      const res = await fetch(`https://api.api-ninjas.com/v1/dogs?name=${breed}`, {
        headers: {
          'X-Api-Key': 'awrJziOjURKgfJvYiFxVAQ==7ayopjMtoKM2dpdP'
        }
      });

      const data = await res.json();

      if (data && data.length > 0) {
        const b = data[0];
        breedInfoContainer.innerHTML = `
          <h3>${b.name}</h3>
          <p><strong>Description:</strong> ${b.description || 'No description available.'}</p>
          <p><strong>Lifespan:</strong> ${b.min_life_expectancy} - ${b.max_life_expectancy} years</p>
        `;
      } else {
        breedInfoContainer.innerHTML = `<p>No data available for ${breed}</p>`;
      }
    } catch (err) {
      console.error('Failed to load breed info:', err);
      breedInfoContainer.innerHTML = `<p>Error loading data for ${breed}</p>`;
    }
  }

  // === Voice Commands ===
  if (window.annyang) {
    const commands = {
      'load dog breed *breed': (breed) => {
        const breedName = breed.toLowerCase();
        loadBreedInfo(breedName);
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
