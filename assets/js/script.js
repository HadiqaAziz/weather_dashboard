var searchBtn = document.querySelector("#search-btn");
var resultsContainer = document.querySelector("#results-container");
var citySearchEl = document.querySelector("#city-search"); 
var infoContainerEl = document.querySelector("#info-container");
var forecastRowEl = document.querySelector("#forecast-row");
var alertEl = document.querySelector("#alert");
var historyContainer = document.querySelector("#city-history");
var cityHistoryBtn = document.querySelector("#city-history");

// Defining the format in which current date is shown on screen
var currentDate = moment().format("MM/DD/YYYY");
var dayIndex = 1;
// Defining default city history as an empty array
var cityHistory = [];

var formSubmitHandler = function(event) {
  event.preventDefault();

  var userCity = citySearchEl.value.trim();
  // If entered city is incorrect an alert message will be shown on screen
  if (userCity) {
    getLatLong(userCity);
    citySearchEl.value = "";
    alertEl.className = "alert"
    alertEl.classList.add("hide");
  }
  else {
    citySearchEl.value = "";
    alertEl.classList.remove("hide");
  }
};
// Weather API call
var getLatLong = function(userInput) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=e6f1180431902688ee08af2326efb755`
  fetch(apiUrl)
      .then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
            var cityName = data.name;
            dayIndex = 1;
            getForecast(data, cityName);
            searchHistory(cityName);
          })
        }
        else {
          alertEl.classList.remove("hide");
          return formSubmitHandler();
        }
      })
}

var getForecast = function(data, cityName) {
  resultsContainer.classList.remove("hide");
  var latEl = data.coord.lat  // Getting latitude
  var longEl = data.coord.lon  // Getting longitude
  var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latEl}&lon=${longEl}&units=imperial&appid=e6f1180431902688ee08af2326efb755`
  fetch(apiUrl)
      .then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
            displayForecast(data, cityName)
          })
        }
      })
}
  // including searched city name in search history list
var searchHistory = function(cityName) {
  var getHistoryStorage = JSON.parse(localStorage.getItem("City History"));
  var historyBtn = document.createElement("button");
  if (getHistoryStorage === null) {
    cityHistory.push(cityName);
    historyBtn.textContent = cityName;
    historyBtn.classList.add("w-100");
    historyBtn.classList.add("history-btn");
    historyBtn.setAttribute("id", "city-history");
    historyContainer.appendChild(historyBtn);
    localStorage.setItem("City History", JSON.stringify(cityHistory));
  }
  else {
    cityHistory = getHistoryStorage;
    if (cityHistory.includes(cityName)) {
      return null;
    }
    else {
      historyBtn.textContent = cityName;
      historyBtn.classList.add("w-100");
      historyBtn.classList.add("history-btn");
      historyBtn.setAttribute("id", "city-history");
      historyContainer.appendChild(historyBtn);
      cityHistory.push(cityName);
      localStorage.setItem("City History", JSON.stringify(cityHistory));
    }
  }       
}

var getSearchHistory = function() {
  var getHistoryStorage = JSON.parse(localStorage.getItem("City History"));
  if (getHistoryStorage === null) {
    return;
  }
  else {
    cityHistory = getHistoryStorage;
    for (var i = 0; i < cityHistory.length; i++) {
    var historyBtn = document.createElement("button");
    historyBtn.textContent = cityHistory[i];
    historyBtn.classList.add("w-100");
    historyBtn.classList.add("history-btn");
    historyBtn.setAttribute("id", "city-history");
    historyContainer.appendChild(historyBtn);
    }
  }
}

var recallHistory = function(event) {
  var cityHistoryText = event.target.textContent;
  dayIndex = 1;
  getLatLong(cityHistoryText);
}

///Showing current weather conditions

var displayForecast = function(weatherData, cityName) {
  var cityNameEl = document.querySelector("#city-name");
  var tempEl = document.querySelector("#temp");
  var windEl = document.querySelector("#wind");
  var humidityEL = document.querySelector("#humidity");
  var iconImg = document.querySelector("#icon-img");
  if (weatherData.status === "city not found") {
    console.log("Nothing");
  }
  else {
    iconImg.src = `http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}.png`
    cityNameEl.textContent = `${cityName} (${currentDate})`;
    tempEl.textContent = weatherData.current.temp
    windEl.textContent = weatherData.current.wind_speed
    humidityEL.textContent = weatherData.current.humidity
    var i = 0;
    // showing future weather conditions
    $(".forecast-box").each(function() {
      var futureDay = moment().add(dayIndex, "days").format("MM/DD/YYYY");
      var futureDate = $(this).find("span")[0];
      var futureTemp = $(this).find("span")[1];
      var futureWind = $(this).find("span")[2];
      var futureHumidity = $(this).find("span")[3];
      var futureIcon = $(this).find("img")[0];
      futureDate.textContent = futureDay;
      futureIcon.src = `http://openweathermap.org/img/wn/${weatherData.daily[i].weather[0].icon}.png`
      futureTemp.textContent = weatherData.daily[i].temp.day;
      futureWind.textContent = weatherData.daily[i].wind_speed;
      futureHumidity.textContent = weatherData.daily[i].humidity;
      i++;
      dayIndex++;
    })
  }
}

getSearchHistory();
searchBtn.addEventListener("click", formSubmitHandler);
cityHistoryBtn.addEventListener("click", recallHistory);