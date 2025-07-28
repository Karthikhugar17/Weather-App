const apiKey = "b3026c8b0022d62dffeab80f5db1f28a";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
  document.querySelector(".loading").style.display = "block";
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
  document.querySelector(".loading").style.display = "none";

  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    var data = await response.json();

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    if (data.weather[0].main == "Clouds") {
      weatherIcon.src = "clouds.png";
    } else if (data.weather[0].main == "Clear") {
      weatherIcon.src = "clear.png";
    } else if (data.weather[0].main == "Rain") {
      weatherIcon.src = "rain.png";
    } else if (data.weather[0].main == "Drizzle") {
      weatherIcon.src = "drizzle.png";
    } else if (data.weather[0].main == "Mist") {
      weatherIcon.src = "mist.png";
    }

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
  }
}

async function getForecast(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  );
  const data = await res.json();

  const forecastEl = document.getElementById("forecast");
  forecastEl.innerHTML = "";

  const dailyData = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  dailyData.forEach((item) => {
    const date = new Date(item.dt_txt);
    const dayName = date.toLocaleDateString("en-US", {
      weekday: "short",
    });
    const temp = Math.round(item.main.temp);
    const icon = item.weather[0].icon;

    const card = document.createElement("div");
    card.classList.add("forecast-day");
    card.innerHTML = `
            <h4>${dayName}</h4>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" />
            <p>${temp}°C</p>
          `;
    forecastEl.appendChild(card);
  });
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
          document.querySelector(".error").style.display = "block";
          document.querySelector(".weather").style.display = "none";
        } else {
          const data = await response.json();
          displayWeather(data);
          getForecast(data.name);
        }
      },
      (error) => {
        console.error("Geolocation error:", error.message);
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function displayWeather(data) {
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

  if (data.weather[0].main == "Clouds") {
    weatherIcon.src = "clouds.png";
  } else if (data.weather[0].main == "Clear") {
    weatherIcon.src = "clear.png";
  } else if (data.weather[0].main == "Rain") {
    weatherIcon.src = "rain.png";
  } else if (data.weather[0].main == "Drizzle") {
    weatherIcon.src = "drizzle.png";
  } else if (data.weather[0].main == "Mist") {
    weatherIcon.src = "mist.png";
  }

  document.querySelector(".weather").style.display = "block";
  document.querySelector(".error").style.display = "none";
}

searchBtn.addEventListener("click", () => {
  const city = searchBox.value;
  checkWeather(city);
  getForecast(city);
});

searchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = searchBox.value;
    checkWeather(city);
    getForecast(city);
  }
});

const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

window.addEventListener("load", getWeatherByLocation);
