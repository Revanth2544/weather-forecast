import React from 'react';
import WeatherIcon from './WeatherIcon';

const ForecastCard = ({ day, high, low, icon }) => {
    return (
        <div className="forecast-card">
            <div className="forecast-day">{day}</div>
            <WeatherIcon icon={icon} />
            <div className="forecast-temp">
                <span className="high">{Math.round(high)}°</span> / 
                <span className="low">{Math.round(low)}°</span>
            </div>
        </div>
    );
};

export default ForecastCard;
