import React from 'react';
import WeatherIcon from './WeatherIcon';

const ForecastCard = ({ day, high, low, icon, temperature, unit }) => {
    return (
        <div className="forecast-card">
            <div className="forecast-day">{day}</div>
            <WeatherIcon icon={icon} />
            <div className="forecast-temp">
                <p>Temperature: {Math.round(temperature)}°{unit === 'metric' ? 'C' : 'F'}</p>
                <p>High: {Math.round(high)}°{unit === 'metric' ? 'C' : 'F'}</p>
                <p>Low: {Math.round(low)}°{unit === 'metric' ? 'C' : 'F'}</p>
            </div>
        </div>
    );
};

export default ForecastCard;
