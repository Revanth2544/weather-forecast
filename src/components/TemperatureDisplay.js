import React from 'react';

const TemperatureDisplay = ({ temperature, unit }) => {
    return (
        <div className="temperature">
            {Math.round(temperature)}°{unit === 'metric' ? 'C' : 'F'}
        </div>
    );
};

export default TemperatureDisplay;
