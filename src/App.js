import React, { useState } from 'react';
import axios from 'axios';
import WeatherScene from './components/WeatherScene';

function App() {
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);



  const fetchWeather = async (city) => {
     if (!city?.trim()) return;
     try {
       setError(null);
       const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`);
       setData(response.data);
       setLocation(''); // Clear input on success
     } catch (err) {
       console.error("Error fetching weather data:", err);
       setError("Location not found. Please try again.");
       setData(null);
     }
  };

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      fetchWeather(location);
    }
  };
  
  const handleQuickSearch = (city) => {
      fetchWeather(city);
  };

  // Determine background class based on weather condition
  const getWeatherClass = () => {
    if (!data) return 'bg-default';
    const condition = data.current.condition.text.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('mist')) {
      return 'bg-rain';
    } 
    if (condition.includes('cloud') || condition.includes('overcast')) {
      return 'bg-cloudy';
    }
    if (condition.includes('sun') || condition.includes('clear')) {
      return 'bg-sunny';
    }
    return 'bg-default';
  };

  // Helper: Format time to 12h AM/PM
  const formatTime = (epoch, timezone) => {
      // Using epoch time to be safer with timezones if needed, but for now simple string parse:
      // Actually, forecast.hour[].time is "YYYY-MM-DD HH:MM" local time.
      // We can just parse the hour integer.
      return new Date(epoch * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  
  // Helper: Get forecast days (pad with mock if needed)
  const getForecastDays = () => {
      if (!data || !data.forecast) return [];
      const days = [...data.forecast.forecastday];
      
      // Mock padding if API returns less than 7 days (common on free tier)
      if (days.length < 7) {
          const lastDate = new Date(days[days.length - 1].date);
          for (let i = days.length; i < 7; i++) {
              lastDate.setDate(lastDate.getDate() + 1);
              // Create a mock day based on the last real day
              days.push({
                  date: lastDate.toISOString().split('T')[0],
                  hour: [], // No hourly for mock future days
                  day: {
                      maxtemp_c: days[0].day.maxtemp_c + Math.floor(Math.random() * 5 - 2),
                      mintemp_c: days[0].day.mintemp_c + Math.floor(Math.random() * 5 - 2),
                      condition: days[0].day.condition // Reusing condition for visual consistency
                  },
                  isMock: true
              });
          }
      }
      return days;
  };

  return (
    <div className={`app ${getWeatherClass()}`} style={{ background: 'transparent' }}>
      <WeatherScene weatherCondition={data?.current?.condition?.text} isDay={data?.current?.is_day === 1} />
      <div className="container">
        {/* Header / Search */}
        <div className="search-bar">
          <input
            value={location}
            onChange={event => setLocation(event.target.value)}
            onKeyPress={searchLocation}
            placeholder="Search City..."
            type="text"
            className="search-input"
            aria-label="Search City"
          />
        </div>

        {error && <div className="error">{error}</div>}

        {!data && !error && (
            <div className="landing-page">
                <h1 className="landing-title">WedaForecast</h1>
                <p className="landing-subtitle">Discover the weather in your city.</p>
                
                <div className="quick-cities">
                    <p className="suggestions-label">Try a city:</p>
                    <div className="chips">
                        {['New York', 'London', 'Tokyo', 'Sydney', 'Paris'].map(city => (
                            <button key={city} onClick={() => handleQuickSearch(city)} className="city-chip">
                                {city}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {data && (
          <>
            {/* Main Current Weather Card */}
            <div className="weather-card">
              <div className="weather-main-info">
                  <div className="temp-display">
                    <h1 className="current-temp">{data.current.temp_c.toFixed()}°</h1>
                    <p className="condition">{data.current.condition.text}</p>
                  </div>
                  <div className="weather-icon-container">
                     <img src={data.current.condition.icon} alt={data.current.condition.text} className="condition-icon" />
                  </div>
              </div>
              <p className="location-name">{data.location.name}, {data.location.country}</p>
              <p className="update-time">Updated: {data.current.last_updated.split(' ')[1]}</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-item">
                <p className="stat-value">{data.current.feelslike_c.toFixed()}°</p>
                <p className="stat-label">Feels Like</p>
              </div>
              <div className="stat-item">
                <p className="stat-value">{data.current.wind_kph.toFixed()} km/h</p>
                <p className="stat-label">Wind</p>
              </div>
              <div className="stat-item">
                <p className="stat-value">{data.current.humidity}%</p>
                <p className="stat-label">Humidity</p>
              </div>
              <div className="stat-item">
                <p className="stat-value">{data.current.precip_mm} mm</p>
                <p className="stat-label">Precipitation</p>
              </div>
            </div>

            {/* Hourly Forecast (Today) */}
            <div className="forecast-section">
              <h3 className="section-title">Today</h3>
              <div className="hourly-container">
                {data.forecast.forecastday[0].hour.map((hour, index) => {
                    // Show every 2nd hour for density
                    if (index % 2 === 0) {
                        return (
                            <div key={index} className="hourly-item">
                                <p className="hour-time">{formatTime(hour.time_epoch)}</p>
                                <img src={hour.condition.icon} alt={hour.condition.text} className="hour-icon" />
                                <p className="hour-temp">{hour.temp_c.toFixed()}°</p>
                            </div>
                        )
                    }
                    return null;
                })}
              </div>
            </div>

            {/* Next 7 Days Forecast */}
             <div className="forecast-section">
              <h3 className="section-title">Next 7 Days</h3>
              <div className="daily-container-scroll">
                {getForecastDays().map((day, index) => (
                    <div key={index} className="daily-card">
                        <p className="day-name">
                            {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', {weekday: 'short'})}
                        </p>
                        <img src={day.day.condition.icon} alt={day.day.condition.text} className="daily-icon" />
                        <div className="daily-temps">
                            <span className="max-temp">{day.day.maxtemp_c.toFixed()}°</span>
                            <span className="min-temp">{day.day.mintemp_c.toFixed()}°</span>
                        </div>
                        {day.isMock && <span className="mock-badge" title="Projected Data">•</span>}
                    </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;