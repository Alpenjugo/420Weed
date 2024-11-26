import React from 'react';

export function SmokeEffect() {
  return (
    <div className="fixed inset-x-0 bottom-0 h-screen pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="smoke-particle absolute bottom-0 w-48 h-48 bg-white/30 rounded-full blur-2xl"
          style={{
            left: `${(i * 100/20)}%`,
            animation: `float ${4 + i * 0.3}s ease-in infinite`,
            animationDelay: `${i * 0.2}s`,
            opacity: 0
          }}
        />
      ))}
      {[...Array(15)].map((_, i) => (
        <div
          key={`inner-${i}`}
          className="smoke-particle absolute bottom-0 w-32 h-32 bg-white/40 rounded-full blur-xl"
          style={{
            left: `${(i * 100/15 + 3)}%`,
            animation: `float ${3 + i * 0.4}s ease-in infinite`,
            animationDelay: `${i * 0.15}s`,
            opacity: 0
          }}
        />
      ))}
    </div>
  );
}