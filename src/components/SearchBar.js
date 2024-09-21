import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const dropdownRef = useRef(null);

    const cities = [
        'New York',
        'London',
        'Paris',
        'Tokyo',
        'Sydney',
        'Mumbai',
        'Moscow',
        'Rio de Janeiro',
        'Toronto',
        'Beijing',
        'Los Angeles',
        'Chicago',
        'San Francisco',
        'Dubai',
        'Singapore',
        'Bangkok',
        'Seoul',
        'Istanbul',
        'Barcelona',
        'Madrid',
    ];

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setSuggestions(cities);
        } else {
            setSuggestions([]);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.length > 0) {
            const filtered = cities.filter(city =>
                city.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions(cities);
        }
    };

    const handleSelect = (city) => {
        onSearch(city);
        setSearchTerm('');
        setSuggestions([]);
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="search-bar" ref={dropdownRef}>
            <button onClick={handleToggle} className="search-button">
                Search City
            </button>
            {isOpen && (
                <div className="dropdown-modal">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleChange}
                        placeholder="Enter city name"
                        className="search-input"
                    />
                    <ul className="suggestions-list">
                        {suggestions.map((city, index) => (
                            <li key={index} onClick={() => handleSelect(city)} className="suggestion-item">
                                {city}
                            </li>
                        ))}
                        {searchTerm && suggestions.length === 0 && (
                            <li className="no-results">No cities found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
