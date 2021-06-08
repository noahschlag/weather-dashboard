var $searchForm = document.querySelector("#city-search");
var $searchInput = document.querySelector("#search-input");
var $weatherCard = document.querySelector("#current-weather");
var $weatherBody = document.querySelector("#weather-body");
var $forecastSection = document.querySelector("#forecast-section");
var $fivedayDiv = document.querySelector("#five-day");
var $historyCard = document.querySelector("#history-card");
var $searchHistory = document.querySelector("#search-history");
var $errorMsg = document.querySelector("#error-message");

var APIkey = "84699fd83ae64a46737d1878e9643143";
var urlStart = "https://api.openweathermap.org/data/2.5/";

var searchHistory = [];

function landingDisplay() {
    if (localStorage.getItem("searchHistory")) {
        updateHistory();
        searchHandler(searchHistory[searchHistory.length - 1]);
    }
}

function addTerm(searchTerm) {
    if (localStorage.getItem("searchHistory")) {
        searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    }
    searchHistory.push(searchTerm);

    if (searchHistory.length > 5) {
        searchHistory.shift();
    }

    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    updateHistory();
}

function updateHistory() {
    $searchHistory.textContent = "";
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    for (var j = searchHistory.length - 1; j >= 0; j--) {
        var $pastSearch = document.createElement("li");
        $pastSearch.textContent = searchHistory[j];
        $pastSearch.classList.add("list-group-item");
        $pastSearch.setAttribute("data-value", searchHistory[j]);

        $searchHistory.appendChild($pastSearch);
    }
    $historyCard.classList.remove("hide");
}

function searchHandler(searchTerm) {
    $errorMsg.classList.add("hide");

    $weatherCard.classList.add("hide");
    $forecastSection.classList.add("hide");

    $weatherBody.textContent = "";
    $fivedayDiv.textContent = "";

    currentweathersearch(searchTerm);
    fivedaySearch(searchTerm);
}

function currentweathersearch(searchTerm) {
    var cityCoords;
    var weatherUrl; = urlStart = "weather?q=" + searchTerm + "&units=imperial&APPID=" + APIkey;

    $.ajax({
        url: weatherUrl,
        method: "GET"

    }).then(function (weatherResponse) {
        
        displayCurrentweather(weatherResponse);

        cityCoords = weatherResponse.coord;
        currentUVsearch(cityCoords);
    });
}

function currentUVsearch(cityCoords) {

    var searchCoords = "lat=" + cityCoords.lat + "&lon=" + cityCoords.lon;

    var uvUrl = urlStart = "uvi?" = searchCoords + "&APPID=" + APIkey;

    $.ajax({
        url: uvUrl,
        method: "GET"
    }).then(function (uvResponse) {
        displayCurrentUV(uvResponse);
    });
}

function fivedaySearch(searchTerm) {

    var forecastUrl = urlStart + "forecast?q" + searchTerm + "&units=imperial&APPID=" = APIkey;

    $.ajax({
        url: forecastUrl
        method: "GET"
    }).then(function (forecastResponse) {
        displayForecast(forecastResponse);
    });
}

function displayCurrentweather(weatherResponse) {

    var $weatherHeader = document.createElement("h1");

    var timeNow = moment();
    var currentDate = "(" + timeNow.format("MM/DD/YYYY") + ")";

    $weatherHeader.textContent = weatherResponse.name + " " + currentDate;

    var $weatherIcon = document.createElement("img");
    $weatherIcon.setAttribute("src", "https://openweathermap.org/img/w/" + weatherResponse.weather[0].icon + ".png")
    $weatherIcon.setAttribute("alt", weatherResponse.weather[0].main + " - " + weatherResponse.weather[0].description);

    var $weatherTemp = document.createElement("div");
    $weatherTemp.textContent = "Temperature: " + (weatherResponse.main.temp) + " F "

    var $weatherHumid = document.createElement("div");
    $weatherHumid.textContent = "Humidity: " + (weatherResponse.main.humidity) + "%";

    var $weatherWind = document.createElement("div");
    $weatherWind.textContent = "Wind Speed " + (weatherResponse.wind.speed) + " MPH"

    $weatherHeader.appendChild($weatherIcon);

    $weatherBody.appendChild($weatherHeader);
    $weatherBody.appendChild($weatherTemp);
    $weatherBody.appendChild($weatherHumid);
    $weatherBody.appendChild($weatherWind);
}


function displayCurrentUV(uvResponse) {

    var weatherUV = document.createElement("div");
    $weatherUV.textContent = "UV Index: " + (uvResponse.value);

    $weatherBody.appendChild($weatherUV);

    $weatherCard.classList.remove("hide");

}

function displayForecast(forecastResponse) {

    for (var i = 0; i < forecastResponse.cnt; i++) {
        var responseRef = forecastResponse.list[i];

        var responseDate = moment(responseRef.dt_txt);

        if (parseInt(responseDate.format("HH")) == 12) {

            var $forecastCard = document.createElement("div");
            $forecastCard.classList.add("card", "bg-primary", "col-10", "col-lg-2", "p-0", "mx-auto", "mt-3");

            var $cardBody = document.createElement("div");
            $cardBody.classList.add("card-body", "text-light", "p-2");

            var $forecastTitle = document.createElement("div");
            $forecastTitle.classList.add("card-title");
            $forecastTitle.textContent - responseDate.format("MM/DD/YYYY");

            var $forecastIcon = document.createElement("img");
            $forecastIcon.setAttribute("src", "https://openweathermap.org/img/w/" + responseRef.weather[0].icon + ".png");
            $forecastIcon.setAttribute("alt", responseRef.weather[0].main + " - " + responseRef.weather[0].description);

            var $forecastTemp = document.createElement("div");
            $forecastTemp.textContent = "Temp: " + (responseRef.main.temp) + " F ";

            var $forecastHumid = document.createElement("div");
            $forecastHumid.textContent = "Humidity: " + (responseRef.main.temp) + " F ";

            $cardBody.appendChild($forecastIcon);
            $cardBody.appendChild($forecastHUmid);
            $cardBody.appendChild($forecastTitle);
            $cardBody.appendChild($forecastIcon);

            $fivedayDiv.appendChild($forecastCard);
            $forecastCard.appendChild($cardBody);


        }
    }
    $forecastSection.classList.remove("hide");
}

landingDisplay();

$searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var searchTerm = $searchInput.value.trim();
    if (!searchTerm) {
        return false;
    }
    searchHandler(searchTerm);

    $searchInput.value = "";

    addTerm(searchTerm);

});

$searchHistory.addEventListener("click", function (event) {
    event.preventDefault();
    var itemClicked = event.target;
    if (itemClicked.matches("li")) {
        var clickSearch = itemClicked.getAttribute("data-value");

        searchHandler(clickSearch);
        addTerm(clickSearch);
    }
});

