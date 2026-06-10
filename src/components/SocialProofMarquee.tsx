import React from 'react';
import { UtensilsCrossed, ChefHat, Wine, Coffee, Pizza, Fish } from 'lucide-react';

const logos = [
  { icon: UtensilsCrossed, name: "The Oak Room" },
  { icon: ChefHat, name: "Lumière" },
  { icon: Wine, name: "Symphony Kitchen" },
  { icon: Coffee, name: "Daily Grind" },
  { icon: Pizza, name: "Fire & Crust" },
  { icon: Fish, name: "Catch 22" },
];

export function SocialProofMarquee() {
  return (
    <section className="w-full py-16 md:py-24 bg-transparent overflow-hidden relative">
      <div className="container mx-auto px-4 mb-10">
        <p className="text-center text-sm md:text-base font-semibold text-slate-400 tracking-wide uppercase">
          Trusted by innovative restaurants, cafes, and bars nationwide
        </p>
      </div>

      <div className="relative flex max-w-[100vw] overflow-hidden group">
        {/* Left fade gradient */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 md:w-48 bg-gradient-to-r from-background to-transparent"></div>
        
        {/* Right fade gradient */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 md:w-48 bg-gradient-to-l from-background to-transparent"></div>

        {/* Scrolling wrapper */}
        <div className="flex animate-infinite-scroll group-hover:[animation-play-state:paused] w-max">
          {[...Array(2)].map((_, arrayIndex) => (
            <div key={arrayIndex} className="flex gap-16 md:gap-24 px-8 md:px-12 items-center">
              {logos.map((logo, index) => {
                const Icon = logo.icon;
                return (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 md:gap-4 text-slate-500 hover:text-foreground transition-all duration-300 whitespace-nowrap opacity-50 hover:opacity-100 cursor-default"
                  >
                    <Icon className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
                    <span className="text-xl md:text-3xl font-bold tracking-tight">{logo.name}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
