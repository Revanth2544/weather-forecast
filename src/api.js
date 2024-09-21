import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

console.log('OpenWeatherMap API Key:', API_KEY);

/**
 * Fetch current weather data for a given city.
 * @param {string} cityName
 * @param {string} lat
 * @param {string} lon
 * @param {string} cnt
 * @param {string} unit
 * @returns {Promise<Object>}
 */
export const getCurrentWeather = async (cityName, lat, lon, cnt, unit = 'metric') => {
    try {
        const response = await axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`, {
            params: {
                q: cityName,
                lat: lat,
                lon: lon,
                cnt: cnt,
                appid: API_KEY,
                units: unit
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Fetch 5-day weather forecast data for a given city.
 * @param {string} cityName 
 * @param {number} lat 
 * @param {number} lon 
 * @param {number} cnt
 * @param {string} unit
 * @returns {Promise<Array>}
 */
// export const getForecast = async (cityName, lat, lon, cnt, unit = 'metric') => {
//     try {
//         const response = await axios.get(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`, {
//             params: {
//                 q: cityName,
//                 lat: lat,
//                 lon: lon,
//                 cnt: cnt,
//                 appid: API_KEY,
//                 units: unit
//             }
//         });
//         const processedData = processForecastData(response.data.list);
//         return processedData;
//     } catch (error) {
//         throw error;
//     }
// };

export const getForecast = async (cityName, unit) => {
    const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${unit}&appid=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
        return processForecastData(data.list);
    } else {
        throw new Error('Error fetching forecast data');
    }
};

/**
 * Process raw forecast data to extract daily forecasts.
 * @param {Array} list - List of forecast data points (every 3 hours).
 * @returns {Array} - Array of processed daily forecast data.
 */
const processForecastData = (list) => {
    const daily = {};

    list.forEach(item => {
        const date = new Date(item.dt_txt);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });

        if (!daily[day]) {
            daily[day] = {
                high: item.main.temp_max,
                low: item.main.temp_min,
                icon: item.weather[0].icon,
                temperature: item.main.temp
            };
        } else {
            daily[day].high = Math.max(daily[day].high, item.main.temp_max);
            daily[day].low = Math.min(daily[day].low, item.main.temp_min);
        }
    });

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    delete daily[today];

    const forecastArray = Object.keys(daily).slice(0, 5).map(day => ({
        day,
        high: daily[day].high,
        low: daily[day].low,
        icon: daily[day].icon,
        temperature: daily[day].temperature
    }));

    return forecastArray;
};
