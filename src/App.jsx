import React, { useState } from 'react';
import './App.css';

const API_KEY = 'e3376688e4c95307c049f86c21ec8a6e'; // ← replace with your real key

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      setWeather(null);
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setError(data.message || 'City not found');
        setWeather(null);
      } else {
        setWeather(data);
      }
    } catch {
      setError('Something went wrong. Try again later.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchWeather();
  };

  return (
    <div className="app">
      <h1 className="title">Weather App</h1>

      <div className="search">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={fetchWeather}>Get Weather</button>
      </div>

      {loading && <p className="info">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="card">
          <h2 className="city">
            {weather.name}, {weather.sys.country}
          </h2>

          <div className="details">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              alt={weather.weather[0].description}
            />
            <div className="metrics">
              <p className="temp">{Math.round(weather.main.temp)}°C</p>
              <p className="desc">{weather.weather[0].description}</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind: {Math.round(weather.wind.speed)} m/s</p>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        Data by&nbsp;
        <a
          href="https://openweathermap.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenWeatherMap
        </a>
      </footer>
    </div>
  );
}

export default App;
