const indiaLocations = {
  "Andhra Pradesh": ["Vijayawada", "Visakhapatnam", "Guntur"],
  "Arunachal Pradesh": ["Itanagar"],
  "Assam": ["Guwahati", "Dibrugarh"],
  "Bihar": ["Patna", "Gaya"],
  "Chhattisgarh": ["Raipur", "Bilaspur"],
  "Delhi": ["New Delhi"],
  "Goa": ["Panaji", "Margao"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
  "Haryana": ["Gurgaon", "Faridabad"],
  "Himachal Pradesh": ["Shimla", "Manali"],
  "Jharkhand": ["Ranchi", "Jamshedpur"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubli"],
  "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Manipur": ["Imphal"],
  "Meghalaya": ["Shillong"],
  "Mizoram": ["Aizawl"],
  "Nagaland": ["Kohima"],
  "Odisha": ["Bhubaneswar", "Cuttack"],
  "Punjab": ["Amritsar", "Ludhiana", "Chandigarh"],
  "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur"],
  "Sikkim": ["Gangtok"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "Telangana": ["Hyderabad", "Warangal"],
  "Tripura": ["Agartala"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
  "Uttarakhand": ["Dehradun", "Haridwar"],
  "West Bengal": ["Kolkata", "Siliguri"]
};

function populateDropdowns() {
  const stateSelect = document.getElementById("stateSelect");
  const citySelect = document.getElementById("citySelect");

  for (let state in indiaLocations) {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  }

  stateSelect.addEventListener("change", () => {
    const cities = indiaLocations[stateSelect.value];
    citySelect.innerHTML = "<option value=''>Select City</option>";
    cities.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  });
}

function getWeatherEmoji(condition) {
  condition = condition.toLowerCase();
  if (condition.includes("clear")) return "☀️";
  if (condition.includes("cloud")) return "☁️";
  if (condition.includes("rain")) return "🌧️";
  if (condition.includes("storm")) return "⛈️";
  if (condition.includes("snow")) return "❄️";
  if (condition.includes("fog") || condition.includes("mist")) return "🌫️";
  return "❓";
}

async function getWeather() {
  const city = document.getElementById("citySelect").value;
  if (!city) return alert("Please select a city");

  const apiKey = "b3d4f8a0eece51f5cc23da900162975a";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&units=metric&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const current = data.list[0];
    const emoji = getWeatherEmoji(current.weather[0].description);
    document.getElementById("weatherResult").classList.remove("hidden");
    document.getElementById("cityName").textContent = city;
    document.getElementById("weatherIcon").textContent = emoji;
    document.getElementById("temperature").textContent = `${current.main.temp} °C`;
    document.getElementById("condition").textContent = current.weather[0].description;

    const hourly = data.list.slice(0, 8);
    const forecastDiv = document.getElementById("hourlyForecast");
    forecastDiv.innerHTML = "";
    hourly.forEach(hour => {
      const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const icon = getWeatherEmoji(hour.weather[0].description);
      forecastDiv.innerHTML += `
        <div class="hour">
          <div>${time}</div>
          <div>${icon}</div>
          <div>${hour.main.temp.toFixed(1)}°C</div>
        </div>
      `;
    });

  } catch (error) {
    alert("Weather info not found. Try again.");
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", populateDropdowns);
