import type { CSSProperties } from 'react';

const flakes = Array.from({ length: 42 }, (_, index) => ({
  left: `${(index * 37) % 103 - 2}%`,
  delay: `-${(index % 14) * 0.9}s`,
  duration: `${8 + (index % 6) * 1.4}s`,
  size: `${3 + (index % 5) * 1.5}px`,
  drift: `${(index % 7) * 10 - 30}px`,
}));

export default function FallingStars() {
  return (
    <div className="falling-stars" aria-hidden="true">
      {flakes.map((flake, index) => (
        <span
          className="snowflake"
          key={index}
          style={
            {
              left: flake.left,
              animationDelay: flake.delay,
              animationDuration: flake.duration,
              height: flake.size,
              width: flake.size,
              ['--snow-drift' as string]: flake.drift,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
