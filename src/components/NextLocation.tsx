import { Globe } from 'lucide-react';

interface NextLocationProps {
  location: string;
  localTime: Date;
  timeUntil: number;
  isNext: boolean;
}

export function NextLocation({ location, localTime, timeUntil, isNext }: NextLocationProps) {
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
      className={`w-full text-left ${isNext ? '' : 'opacity-80'} bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all duration-200 transform hover:scale-[1.02] cursor-pointer group`}
      onClick={() => handleCitySearch(cities[0])}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCitySearch(cities[0])}
    >
      <div className="flex items-center gap-4 mb-3">
        <Globe className="w-5 h-5 text-purple-300 shrink-0 group-hover:text-purple-200 transition-colors duration-200" />
        <div className="flex flex-wrap gap-2">
          {cities.map((city, index) => (
            <button 
              key={`${city}-${index}`}
              onClick={(e) => {
                e.stopPropagation();
                handleCitySearch(city);
              }}
              className="text-lg text-purple-200 hover:text-white hover:underline transition-colors duration-200"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <p className="text-3xl font-bold ml-9 group-hover:text-white transition-colors duration-200">
          4:20
        </p>
        <p className="text-purple-200 group-hover:text-purple-100 transition-colors duration-200">
          in {Math.ceil(timeUntil / 60000)} minutes
        </p>
      </div>
    </div>
  );
}