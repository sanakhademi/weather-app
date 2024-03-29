//data and time codes
function dateSet(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[date.getDay()];
  return `${currentDay}`;
}
function timeSet(time) {
  let currentHour = time.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }
  let currentMinute = time.getMinutes();
  if (currentMinute < 10) {
    currentMinute = `0${currentMinute}`;
  }
  return `${currentHour}:${currentMinute}`;
}
let currentTime = new Date();
let dateSpace = document.querySelector("#dateTime");
dateSpace.innerHTML = dateSet(currentTime);
let timeSpace = document.querySelector("#timeOnly");
timeSpace.innerHTML = timeSet(currentTime);
//end of date and time codes

//start of forecast days
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  return days[day];
}

//end of forecast days

//forecast
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHtml = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHtml =
        forecastHtml +
        `<div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 days">
                <p>${formatDay(forecastDay.dt)}</p>
                <img src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png" width="100%"/>
                <p>${Math.round(
                  forecastDay.temp.max
                )}°<span class="min-degree"> ${Math.round(
          forecastDay.temp.min
        )}°</span></p>
            </div>`;
    }
  });

  forecastHtml = forecastHtml + `</div>`;
  forecastElement.innerHTML = forecastHtml;
}

//end of forecast

//showing real searched city temperatures
function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "b68074b7f2b052837c816f676aa31f49";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  celsiusTemperature = response.data.main.temp;
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#current-temp").innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#feels-like").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  //change icon according to weather condition
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  //end of change icon according to weather condition
  getForecast(response.data.coord);
}

//default page on load

function search(cityName) {
  let units = "metric";
  let apiKey = "b68074b7f2b052837c816f676aa31f49";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}
//end of default page on load

function showCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let changeCity = document.querySelector("h1");
  changeCity.innerHTML = cityInput.value;
  let cityName = document.querySelector("#city-input").value;
  search(cityName);
}
let city = document.querySelector("#city-search");
city.addEventListener("submit", showCity);

//current location weather
function searchLocation(position) {
  let apiKey = "b68074b7f2b052837c816f676aa31f49";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
}

function getLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", getLocation);
//end of current location weather

//end of showing real searched city temperatures

search("London");
