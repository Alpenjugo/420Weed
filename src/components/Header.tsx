import { Leaf } from 'lucide-react';

interface HeaderProps {
  onSmokeTriggered: () => void;
}

export function Header({ onSmokeTriggered }: HeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-center">
        <button
          onClick={onSmokeTriggered}
          className="transform hover:scale-110 transition-transform duration-200"
        >
          <Leaf className="w-12 h-12 text-green-400 transform rotate-45" />
        </button>
      </div>
      <h1 className="text-3xl font-bold text-center mt-2">Happy 4:20</h1>
    </div>
  );
}