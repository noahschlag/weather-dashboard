var $searchForm = document.querySelector("#city-search");
var $searchInput = document.querySelector("#search-input");
var $weatherCard = document.querySelector("#current-weather");
var $weatherBody = document.querySelector("#weather-body");
var $forecastSection = document.querySelector("#forecast-section");
var $fivedayDiv = document.querySelector("#five-day");
var $historyCard = document.querySelector("#history-card");
var $searchHistory = document.querySelector("#search-history");
var $errorMsg = document.querySelector("#error-message");

var APIkey = "6aaa464bb00fa4a19aa146dac6e6844d";
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