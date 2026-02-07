# WedaForecast 🌤️

A modern, immersive weather dashboard providing real-time data and 7-day forecasts with a beautiful glassmorphism UI and dynamic 3D background scenes.

## Features

- **Real-Time Weather**: Accurate current conditions including temperature, humidity, wind, and precipitation.
- **7-Day Forecast**: Swipeable horizontal list showing daily highs, lows, and conditions.
  - _Note_: Includes intelligent mock data generation for days beyond the API's free tier limit.
- **Dynamic 3D Backgrounds**: React Three Fiber scenes that adapt to the weather (Sunny, Rain, Snow, Cloudy) and time of day (Day/Night).
- **Glassmorphism UI**: Sleek, modern interface with blur effects and translucent layers.
- **Mobile Responsive**: Optimized layout and typography for all screen sizes.
- **Quick Search**: Instant city suggestions for rapid checking.

## Tech Stack

- **React 18**: Frontend framework (downgraded from 19 for library compatibility).
- **React Three Fiber (@react-three/fiber)**: 3D scene rendering.
- **Drei**: 3D helpers and abstractions.
- **Axios**: API data fetching.
- **WeatherAPI.com**: Weather data provider.

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- npm

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/wedaforecast.git
    cd wedaforecast
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your WeatherAPI key:

    ```env
    REACT_APP_WEATHER_API_KEY=your_api_key_here
    GENERATE_SOURCEMAP=false
    ```

4.  **Run the App**
    ```bash
    npm start
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Deployment

To build for production:

```bash
npm run build
```

This generates an optimized build in the `build/` folder, ready for deployment to Vercel, Netlify, or any static host.
