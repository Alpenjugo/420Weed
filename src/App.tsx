import React, { useEffect, useState } from 'react';
import type { Timezone } from './types';
import { findNext420Locations, findPast420Locations, type Location420, type Past420Location } from './utils';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Header } from './components/Header';
import { NextLocation } from './components/NextLocation';
import { PastLocation } from './components/PastLocation';
import { SmokeEffect } from './components/SmokeEffect';

export default function App() {
  const [timezones, setTimezones] = useState<Timezone[]>([]);
  const [next420s, setNext420s] = useState<Location420[]>([]);
  const [past420s, setPast420s] = useState<Past420Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSmoke, setShowSmoke] = useState(false);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/dmfilipenko/timezones.json/master/timezones.json')
      .then(res => res.json())
      .then(data => {
        setTimezones(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (timezones.length === 0) return;

    const updateLocations = () => {
      const nextLocations = findNext420Locations(timezones);
      setNext420s(nextLocations);
      setPast420s(findPast420Locations(timezones));
      
      // Check if any location is hitting 4:20
      const isAnyLocationHitting420 = nextLocations.some(loc => loc.timeUntil <= 0);
      if (isAnyLocationHitting420 && !showSmoke) {
        setShowSmoke(true);
        setTimeout(() => setShowSmoke(false), 30000);
      }
    };

    updateLocations();
    const interval = setInterval(updateLocations, 1000);
    return () => clearInterval(interval);
  }, [timezones, showSmoke]);

  const triggerSmoke = () => {
    setShowSmoke(true);
    setTimeout(() => setShowSmoke(false), 30000);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {showSmoke && <SmokeEffect />}
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl text-white relative z-10">
        <Header onSmokeTriggered={triggerSmoke} />
        
        <div className="space-y-4">
          {next420s.map((location, index) => (
            <NextLocation key={location.location} {...location} isNext={index === 0} />
          ))}
        </div>
        
        {past420s.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2 text-purple-200">Past 4:20</h2>
            <div className="space-y-2">
              {past420s.map((location) => (
                <PastLocation key={location.location} {...location} />
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center text-sm text-purple-300">
          Showing the next locations where it will be 4:20
        </div>
      </div>
    </div>
  );
}