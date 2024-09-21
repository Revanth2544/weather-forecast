import React from 'react';

const WeatherCondition = ({ condition }) => {
    return (
        <div className="weather-condition">
            {condition}
        </div>
    );
};

export default WeatherCondition;
