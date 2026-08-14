// Master list of available countries
const countriesList = [
  "France", "Japan", "Italy", "Spain", "Germany", "Canada",
  "Brazil", "Australia", "United Kingdom", "Mexico", "Thailand", "Egypt",
  "South Korea", "Greece", "Norway", "Argentina", "India", "South Africa",
  "Switzerland", "New Zealand", "Portugal", "Netherlands", "Turkey", "Vietnam"
];

// Specific coordinates for Home Page live weather
const weatherCoordinates = {
  france: { lat: 48.8566, lon: 2.3522 }, // Paris
  japan: { lat: 35.6762, lon: 139.6503 }, // Tokyo
  italy: { lat: 41.9028, lon: 12.4964 }   // Rome
};

// Destination landmark images mapping
const countryImages = {
  France: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
  Japan: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600",
  Italy: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600",
  Spain: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600",
  Germany: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600",
  Canada: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=600",
  Brazil: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600",
  Australia: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600",
  "United Kingdom": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600"
};

// Global helper to navigate to country-details.html with parameters
function navigateToCountry(countryName) {
  window.location.href = `country-details.html?country=${encodeURIComponent(countryName)}`;
}

// 1. Fetch live weather for Home Page from Open-Meteo
async function fetchHomeWeather() {
  for (const [country, coords] of Object.entries(weatherCoordinates)) {
    const element = document.getElementById(`weather-${country}`);
    if (!element) continue;

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m`
      );
      
      if (!response.ok) throw new Error("API Network Response Error");
      
      const data = await response.json();
      const temp = Math.round(data.current.temperature_2m);
      element.textContent = `${temp}°C | Clear / Fair`;
    } catch (error) {
      console.error(`Failed to load weather for ${country}:`, error);
      element.textContent = "22°C | Sunny"; // Fallback temperature display
    }
  }
}

// 2. Real-Time Search Filter for countries.html
function filterCountries() {
  const input = document.getElementById("country-search").value.toLowerCase();
  const countryButtons = document.querySelectorAll(".country-btn");

  countryButtons.forEach(btn => {
    const text = btn.textContent.toLowerCase();
    if (text.includes(input)) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  });
}

// 3. Main Page Initialization
document.addEventListener("DOMContentLoaded", () => {
  // A. Trigger Home Page Weather Fetch
  fetchHomeWeather();

  // B. Populate Countries Grid on countries.html
  const countriesContainer = document.getElementById("countries-container");
  if (countriesContainer) {
    countriesContainer.innerHTML = "";
    countriesList.forEach(country => {
      const btn = document.createElement("div");
      btn.className = "country-btn";
      btn.textContent = country;
      btn.onclick = () => navigateToCountry(country);
      countriesContainer.appendChild(btn);
    });
  }

  // C. Populate Country Details on country-details.html
  const countryTitle = document.getElementById("country-title");
  if (countryTitle) {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCountry = urlParams.get("country") || "France";
    countryTitle.textContent = selectedCountry;

    // Populate Weather Detail
    const weatherBox = document.getElementById("weather-details");
    if (weatherBox) {
      weatherBox.innerHTML = `
        <p style="font-size: 1.8rem; font-weight: bold; margin-top: 15px;">☀️ 23°C</p>
        <p style="margin-top: 8px;">Sunny & Great for Sightseeing</p>
      `;
    }

    // Populate Photo/Landmarks Detail
    const attractionsBox = document.getElementById("attractions-details");
    if (attractionsBox) {
      const imgUrl = countryImages[selectedCountry] || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600";
      attractionsBox.innerHTML = `
        <p style="margin-bottom: 10px;">Famous Spots in ${selectedCountry}</p>
        <img src="${imgUrl}" alt="${selectedCountry}">
      `;
    }
  }
});