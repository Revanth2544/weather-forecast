import React from 'react';

const TemperatureToggle = ({ unit, onToggle }) => {
    return (
        <div className="temperature-toggle">
            <button 
                onClick={onToggle} 
                className="toggle-button"
            >
                {unit === 'metric' ? '°C' : '°F'}
            </button>
        </div>
    );
};

export default TemperatureToggle;
