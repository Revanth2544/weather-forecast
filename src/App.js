import React, { useState, useEffect } from 'react';
import {
    getCurrentWeather,
    getForecast
} from './api';
import CityDisplay from './components/CityDisplay';
import TemperatureDisplay from './components/TemperatureDisplay';
import WeatherCondition from './components/WeatherCondition';
import WeatherIcon from './components/WeatherIcon';
import ForecastCard from './components/ForecastCard';
import SearchBar from './components/SearchBar';
import TemperatureToggle from './components/TemperatureToggle';
import './App.css';

const App = () => {
    const [city, setCity] = useState('New York');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [unit, setUnit] = useState('metric');
    const [error, setError] = useState(null);
    const [temperature, setTemperature] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

                if (!API_KEY) {
                    console.error('API key is missing! Please check your .env file.');
                    return;
                }

                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`;
                
                console.log('Fetching from URL:', url);

                const response = await fetch(url);
                const data = await response.json();

                if (response.ok) {
                    console.log('Weather Data:', data); 
                    setTemperature(data.main.temp);
                } else {
                    console.error('Error fetching weather data:', data.message);
                    setTemperature(null);
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
                setTemperature(null);
            }
        };

        fetchWeatherData();
    }, [city, unit])


    useEffect(() => {
        const cachedCity = localStorage.getItem('city');
        const cachedUnit = localStorage.getItem('unit');
        if (cachedCity) {
            setCity(cachedCity);
        }
        if (cachedUnit) {
            setUnit(cachedUnit);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('city', city);
        localStorage.setItem('unit', unit);
    }, [city, unit]);

    useEffect(() => {
        fetchWeatherData(city);
    }, [city, unit]);

    /**
     * Fetch weather data using the API functions.
     * Handles online and offline scenarios.
     * @param {string} cityName - Name of the city to fetch data for.
     */
    const fetchWeatherData = async (cityName) => {
        try {
            setError(null);

            // Fetch current weather
            const currentWeather = await getCurrentWeather(cityName, unit);
            setWeatherData(currentWeather);
            localStorage.setItem('weatherData', JSON.stringify(currentWeather));

            // Fetch forecast
            const forecast = await getForecast(cityName, unit);
            setForecastData(forecast);
            localStorage.setItem('forecastData', JSON.stringify(forecast));

        } catch (err) {
            if (!navigator.onLine) {
                // If offline, attempt to load cached data
                const cachedWeather = localStorage.getItem('weatherData');
                const cachedForecast = localStorage.getItem('forecastData');
                if (cachedWeather && cachedForecast) {
                    setWeatherData(JSON.parse(cachedWeather));
                    setForecastData(JSON.parse(cachedForecast));
                    setError('You are offline. Showing cached data.');
                } else {
                    setError('You are offline and no cached data is available.');
                }
            } else if (err.response && err.response.status === 404) {
                setError('City not found. Please try another city.');
            } 
            // setWeatherData(null);
            // setForecastData([]);
        }
    };

    /**
     * Handle city search from the SearchBar component.
     * @param {string} cityName
     */
    const handleSearch = (cityName) => {
        setCity(cityName);
    };

    /**
     * Handle temperature unit toggle from the TemperatureToggle component.
     */
    const handleToggle = () => {
        setUnit(prevUnit => prevUnit === 'metric' ? 'imperial' : 'metric');
    };

    return (
        <div className="app-container">
            <header>
                <h1>Weather Forecast</h1>
                <SearchBar onSearch={handleSearch} />
                <TemperatureToggle unit={unit} onToggle={handleToggle} />
            </header>

            {/* <h1>Weather in {city}</h1>
            {temperature !== null ? (
                <TemperatureDisplay temperature={temperature} unit={unit} />
            ) : (
                <p>Loading...</p>
            )} */}

            {/* Buttons to toggle between Celsius and Fahrenheit */}
            {/* <div className="unit-toggle">
                <button onClick={() => setUnit('metric')} disabled={unit === 'metric'}>
                    °C
                </button>
                <button onClick={() => setUnit('imperial')} disabled={unit === 'imperial'}>
                    °F
                </button>
            </div> */}


            {error && <div className="error-message">{error}</div>}

            {weatherData && temperature !== null && (
                <div className="current-weather">
                    <CityDisplay city={weatherData.name} />
                    <WeatherIcon icon={weatherData.weather[0].icon} />
                    <TemperatureDisplay temperature={temperature} unit={unit} />
                    <WeatherCondition condition={weatherData.weather[0].description} />
                </div>
            )}

            {forecastData.length > 0 && temperature !== null && (
                <div className="forecast-section">
                    <h3>5-Day Forecast</h3>
                    <div className="forecast-container">
                        {forecastData.map((dayForecast, index) => (
                            <ForecastCard 
                                key={index}
                                day={dayForecast.day}
                                high={dayForecast.high}
                                low={dayForecast.low}
                                icon={dayForecast.icon}
                                temperature={dayForecast.temperature} 
                                unit={unit}
                            />
                        ))}
                    </div>
                </div>
            )}
            
        </div>

        
    );
};

export default App;
