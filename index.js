// Weather coordinates for Home Page cards
const weatherCoordinates = {
  france: { lat: 48.8566, lon: 2.3522 },
  japan: { lat: 35.6762, lon: 139.6503 },
  italy: { lat: 41.9028, lon: 12.4964 }
};

// Fallback images for Country Details page
const countryImages = {
  France: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
  Japan: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600",
  Italy: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600"
};

// Global helper for page navigation
function navigateToCountry(countryName) {
  window.location.href = `country-details.html?country=${encodeURIComponent(countryName)}`;
}

// 1. Fetch Live Weather for Home Page (Open-Meteo)
async function fetchHomeWeather() {
  for (const [country, coords] of Object.entries(weatherCoordinates)) {
    const element = document.getElementById(`weather-${country}`);
    if (!element) continue;

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m`
      );
      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      const temp = Math.round(data.current.temperature_2m);
      element.textContent = `${temp}°C | Clear / Fair`;
    } catch (error) {
      element.textContent = "22°C | Sunny";
    }
  }
}

// 2. Fetch ALL World Countries dynamically from REST Countries API
async function loadAllCountries() {
  const container = document.getElementById("countries-container");
  if (!container) return;

  container.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>Loading all countries...</p>";

  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name");
    const data = await response.json();

    // Extract names and sort alphabetically A-Z
    const countries = data
      .map(c => c.name.common)
      .sort((a, b) => a.localeCompare(b));

    container.innerHTML = ""; // Clear loading message

    countries.forEach(country => {
      const btn = document.createElement("div");
      btn.className = "country-btn";
      btn.textContent = country;
      btn.onclick = () => navigateToCountry(country);
      container.appendChild(btn);
    });
  } catch (error) {
    console.error("Failed to load countries:", error);
    container.innerHTML = "<p style='grid-column: 1/-1;'>Failed to load countries. Check connection.</p>";
  }
}

// 3. Search Filter Logic
function filterCountries() {
  const input = document.getElementById("country-search").value.toLowerCase();
  const countryButtons = document.querySelectorAll(".country-btn");

  countryButtons.forEach(btn => {
    const text = btn.textContent.toLowerCase();
    btn.style.display = text.includes(input) ? "block" : "none";
  });
}

// 4. Initializer
document.addEventListener("DOMContentLoaded", () => {
  fetchHomeWeather();
  loadAllCountries();

  // Setup Mobile Hamburger Dropdown Listener
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });
  }

  // Populate Country Details page if open
  const countryTitle = document.getElementById("country-title");
  if (countryTitle) {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCountry = urlParams.get("country") || "France";
    countryTitle.textContent = selectedCountry;

    const weatherBox = document.getElementById("weather-details");
    if (weatherBox) {
      weatherBox.innerHTML = `
        <p style="font-size: 1.8rem; font-weight: bold; margin-top: 15px;">☀️ 23°C</p>
        <p style="margin-top: 8px;">Sunny & Pleasant</p>
      `;
    }

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