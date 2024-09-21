import React, { useState, useEffect } from 'react';
import TemperatureDisplay from './TemperatureDisplay';

const WeatherApp = () => {
    const [temperature, setTemperature] = useState(null);
    const [unit, setUnit] = useState('metric');
    const [city, setCity] = useState('Paris');

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`;

                console.log('Fetching from URL:', url);

                const response = await fetch(url);
                const data = await response.json();

                if (response.ok) {
                    console.log('Weather Data:', data);
                    setTemperature(data.main.temp);
                } else {
                    console.error('Error fetching weather data:', data.message);
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchWeatherData();
    }, [city, unit]);

    return (
        <div className="weather-app">
            <h1>Weather in {city}</h1>
            {temperature !== null ? (
                <TemperatureDisplay temperature={temperature} unit={unit} />
            ) : (
                <p>Loading...</p>
            )}

            {/* Buttons to toggle between Celsius and Fahrenheit */}
            <div className="unit-toggle">
                <button onClick={() => setUnit('metric')} disabled={unit === 'metric'}>
                    °C
                </button>
                <button onClick={() => setUnit('imperial')} disabled={unit === 'imperial'}>
                    °F
                </button>
            </div>

        </div>
    );
};

export default WeatherApp;
