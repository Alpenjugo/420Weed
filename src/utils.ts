import { addHours } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import type { Timezone } from './types';

const cityMap: Record<string, string[]> = {
  'America/La_Paz': ['La Paz', 'Santa Cruz', 'Cochabamba', 'Sucre'],
  'Asia/Kolkata': ['Mumbai', 'New Delhi', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad'],
  'Asia/Tokyo': ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo'],
  'Europe/London': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Edinburgh'],
  'America/New_York': ['New York', 'Boston', 'Philadelphia', 'Miami', 'Atlanta'],
  'America/Los_Angeles': ['Los Angeles', 'San Francisco', 'Seattle', 'Portland', 'San Diego'],
  'Australia/Sydney': ['Sydney', 'Melbourne', 'Brisbane', 'Adelaide', 'Gold Coast'],
  'Asia/Dubai': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
  'Asia/Singapore': ['Singapore', 'Kuala Lumpur', 'Jakarta', 'Bangkok', 'Manila'],
  'Europe/Paris': ['Paris', 'Berlin', 'Rome', 'Madrid', 'Amsterdam', 'Brussels'],
  'Europe/Moscow': ['Moscow', 'St. Petersburg', 'Kazan', 'Nizhny Novgorod'],
  'Asia/Shanghai': ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Hong Kong'],
  'America/Chicago': ['Chicago', 'Houston', 'Dallas', 'Minneapolis', 'Milwaukee'],
  'America/Toronto': ['Toronto', 'Montreal', 'Vancouver', 'Ottawa', 'Calgary']
};

// Keep track of cities we've seen to prevent duplicates
const seenCities = new Set<string>();

function getCitiesForTimezone(timezone: string): string[] {
  const tzKey = Object.keys(cityMap).find(key => 
    timezone.includes(key) || key.includes(timezone)
  );
  
  if (tzKey) {
    const cities = cityMap[tzKey].filter(city => !seenCities.has(city));
    cities.forEach(city => seenCities.add(city));
    return cities;
  }

  // If no mapping found, extract city name from timezone
  const tzParts = timezone.split('/');
  const cityName = tzParts[tzParts.length - 1].replace(/_/g, ' ');
  
  // Only return the extracted city name if it's not a GMT/UTC offset and hasn't been seen
  if (!cityName.startsWith('GMT') && !cityName.startsWith('UTC') && !seenCities.has(cityName)) {
    seenCities.add(cityName);
    return [cityName];
  }
  
  return [];
}

export interface Location420 {
  location: string;
  timeUntil: number;
  localTime: Date;
}

export interface Past420Location {
  location: string;
  timeSince: number;
  localTime: Date;
}

export function findNext420Locations(timezones: Timezone[]): Location420[] {
  const now = new Date();
  const locations: Location420[] = [];
  seenCities.clear(); // Reset seen cities for new search

  timezones.forEach((tz) => {
    if (!tz.utc[0]) return;

    const localTime = utcToZonedTime(now, tz.utc[0]);
    const currentHour = localTime.getHours();
    const currentMinute = localTime.getMinutes();

    let next420 = new Date(localTime);
    next420.setHours(4, 20, 0, 0);

    if (currentHour >= 4 && currentMinute >= 20) {
      next420.setHours(16, 20, 0, 0);
    }

    if (currentHour >= 16 && currentMinute >= 20) {
      next420 = addHours(next420, 12);
    }

    let timeUntil = next420.getTime() - localTime.getTime();

    if (timeUntil < 0) {
      next420 = addHours(next420, 24);
      timeUntil = next420.getTime() - localTime.getTime();
    }

    if (timeUntil > 0 && timeUntil <= 3600000) {
      const cities = getCitiesForTimezone(tz.utc[0]);
      if (cities.length > 0) {
        locations.push({
          location: cities.join(', '),
          timeUntil,
          localTime: next420
        });
      }
    }
  });

  return locations.sort((a, b) => a.timeUntil - b.timeUntil).slice(0, 3);
}

export function findPast420Locations(timezones: Timezone[]): Past420Location[] {
  const now = new Date();
  const pastLocations: Past420Location[] = [];
  seenCities.clear(); // Reset seen cities for new search

  timezones.forEach((tz) => {
    if (!tz.utc[0]) return;

    const localTime = utcToZonedTime(now, tz.utc[0]);
    const morning420 = new Date(localTime);
    morning420.setHours(4, 20, 0, 0);
    
    const evening420 = new Date(localTime);
    evening420.setHours(16, 20, 0, 0);

    const checkTime = (time: Date) => {
      const timeSince = localTime.getTime() - time.getTime();
      if (timeSince > 0 && timeSince <= 3600000) {
        const cities = getCitiesForTimezone(tz.utc[0]);
        if (cities.length > 0) {
          pastLocations.push({
            location: cities.join(', '),
            timeSince,
            localTime: time
          });
        }
      }
    };

    checkTime(morning420);
    checkTime(evening420);
  });

  return pastLocations.sort((a, b) => a.timeSince - b.timeSince).slice(0, 5);
}