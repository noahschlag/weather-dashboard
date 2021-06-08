const form = document.querySelector(".top-banner form");

form.addEventListener("submit", e => {
    e.preventDefault();
    const inputVal = input.value;
});

const apiKey = "84699fd83ae64a46737d1878e9643143";
const inputVal = input.value;

...

const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

fetch(url)
    .then(response => response.json())
    .then(data => {
    
    })
    .catch(() => {
        msg.textContent = "Search anywhere in the world for the weather you need to know";
    });
