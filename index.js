// Function to navigate to country details page with selected country name
function navigateToCountry(countryName) {
  window.location.href = `country-details.html?country=${encodeURIComponent(countryName)}`;
}

// Fetch live weather data for Home Page cards using Open-Meteo API
async function fetchHomeWeather() {
  const coordinates = {
    france: { lat: 48.8566, lon: 2.3522 }, // Paris
    japan: { lat: 35.6762, lon: 139.6503 }, // Tokyo
    italy: { lat: 41.9028, lon: 12.4964 }   // Rome
  };

  try {
    for (const [country, coords] of Object.entries(coordinates)) {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`
      );
      const data = await response.json();
      const temp = Math.round(data.current_weather.temperature);
      
      const element = document.getElementById(`weather-${country}`);
      if (element) {
        element.textContent = `${temp}°C | Sunny / Clear`;
      }
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Run weather fetch on load
document.addEventListener("DOMContentLoaded", () => {
  fetchHomeWeather();
});


// List of countries for the grid page
const countriesList = [
  "France", "Japan", "Italy", "Spain", "Germany", "Canada",
  "Brazil", "Australia", "United Kingdom", "Mexico", "Thailand", "Egypt",
  "South Korea", "Greece", "Norway", "Argentina", "India", "South Africa",
  "Switzerland", "New Zealand", "Portugal", "Netherlands", "Turkey", "Vietnam"
];

// Helper to navigate to detail page
function navigateToCountry(countryName) {
  window.location.href = `country-details.html?country=${encodeURIComponent(countryName)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  // 1. Populate Countries Grid if on countries.html
  const countriesContainer = document.getElementById("countries-container");
  if (countriesContainer) {
    countriesList.forEach(country => {
      const btn = document.createElement("div");
      btn.className = "country-btn";
      btn.textContent = country;
      btn.onclick = () => navigateToCountry(country);
      countriesContainer.appendChild(btn);
    });
  }

  // 2. Load Details if on country-details.html
  const countryTitle = document.getElementById("country-title");
  if (countryTitle) {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCountry = urlParams.get("country") || "France";
    countryTitle.textContent = selectedCountry;

    // Load photo in Attractions box
    const attractionsBox = document.getElementById("attractions-details");
    if (attractionsBox) {
      attractionsBox.innerHTML = `
        <p>Famous landmarks in ${selectedCountry}</p>
        <img src="https://source.unsplash.com/featured/?${encodeURIComponent(selectedCountry)},landmark" alt="${selectedCountry}" onerror="this.src='https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500'">
      `;
    }
  }
});