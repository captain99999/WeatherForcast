const apiKey = 'b29ac397ce2f5023e869caa3a0dc5d0b';
const form = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const weatherDataContainer = document.getElementById('weatherData');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value;
    getWeatherData(city);
});

async function getWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        const data = await response.json();
        console.log(data);
        if (data.cod === '404') {
            weatherDataContainer.innerHTML = '<p>City not found</p>';
        } else {
            displayWeatherData(data);
        }
    } catch (error) {
        weatherDataContainer.innerHTML = '<p>Something went wrong. Please try again later.</p>';
    }
}

function displayWeatherData(data) {
    const { name, main, wind } = data;
    const { temp, humidity } = main;
    const { speed } = wind;

    weatherDataContainer.innerHTML = `
        <h2>${name}</h2>
        <p>Temperature: ${Number(temp).toFixed(0)}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${speed} m/s</p>
    `;

    getForecastData(data.coord.lat, data.coord.lon);
}

async function getForecastData(latitude, longitude) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
        const data = await response.json();
        displayForecastData(data);
    } catch (error) {
        weatherDataContainer.innerHTML += '<p>Failed to fetch forecast data.</p>';
    }
}

function displayForecastData(data) {
    const forecastList = data.list;
    console.log(forecastList);

    let forecastHTML = '<h3>5-day Forecast:</h3><ul style="list-style-type:none;">';
    forecastList.slice(0, 5).forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const temperature = item.main.temp;
        forecastHTML += `<li>${date}: ${Number(temperature).toFixed(0)}°C</li>`;
    });
    forecastHTML += '</ul>';

    weatherDataContainer.innerHTML += forecastHTML;
}
