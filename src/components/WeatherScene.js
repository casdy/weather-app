
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sun, Moon, Clouds, Rain, Snow } from './WeatherEffects';

const WeatherScene = ({ weatherCondition, isDay }) => {
  // Normalize weather condition to lowercase for easier matching
  const condition = weatherCondition ? weatherCondition.toLowerCase() : 'clear';

  const isRain = condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunderstorm');
  const isSnow = condition.includes('snow') || condition.includes('sleet') || condition.includes('blizzard');
  const isCloudy = condition.includes('cloud') || condition.includes('overcast') || condition.includes('mist') || condition.includes('fog');

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <color attach="background" args={[isDay ? '#87CEEB' : '#0a0a2a']} />
        
        <ambientLight intensity={0.4} />
        
        {/* Celestial Bodies */}
        {isDay ? <Sun /> : <Moon />}
        
        {/* Weather Effects */}
        {isCloudy && <Clouds />}
        {isRain && <Rain count={3000} />}
        {isSnow && <Snow count={3000} />}
        
        {/* Fallback/Combination Logic */}
        {/* If it's raining or snowing, we likely want clouds too */}
        {(isRain || isSnow) && !isCloudy && <Clouds />}

        {/* Controls (optional, maybe remove for production background) */}
        {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
      </Canvas>
    </div>
  );
};

export default WeatherScene;
