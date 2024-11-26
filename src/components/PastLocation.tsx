import { History } from 'lucide-react';

interface PastLocationProps {
  location: string;
  timeSince: number;
}

export function PastLocation({ location, timeSince }: PastLocationProps) {
  const cities = location.split(/,\s*/).map(city => city.trim());
  
  const handleCitySearch = (city: string) => {
    const width = 800;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(`${city} city`)}`,
      `${city}Search`,
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
    );
  };
  
  return (
    <div 
      className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-200 transform hover:scale-[1.02] cursor-pointer group"
      onClick={() => handleCitySearch(cities[0])}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCitySearch(cities[0])}
    >
      <div className="flex items-center gap-4">
        <History className="w-4 h-4 text-purple-300 shrink-0 group-hover:text-purple-200 transition-colors duration-200" />
        <div className="flex flex-wrap gap-2">
          {cities.map((city, index) => (
            <button
              key={`${city}-${index}`}
              onClick={(e) => {
                e.stopPropagation();
                handleCitySearch(city);
              }}
              className="text-sm text-purple-200 hover:text-white hover:underline transition-colors duration-200"
            >
              {city}
            </button>
          ))}
        </div>
        <p className="text-sm text-purple-300 ml-auto group-hover:text-purple-200 transition-colors duration-200">
          {Math.floor(timeSince / 60000)} minutes ago
        </p>
      </div>
    </div>
  );
}