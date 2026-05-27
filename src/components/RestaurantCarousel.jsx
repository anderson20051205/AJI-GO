import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Clock, ArrowRight } from 'lucide-react';
import { MOCK_RESTAURANTS } from './RestaurantGrid';

export default function RestaurantCarousel({ onSelectRestaurant }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Helper to determine theme classes based on category
  const getThemeColors = (id) => {
    switch (id) {
      case 'piedra-negra':
        return {
          accent: 'text-pink-500',
          borderHover: 'hover:border-pink-300',
          glow: 'hover:shadow-pink-500/10',
          btnBg: 'bg-pink-500 hover:bg-pink-600',
          logoBg: 'bg-pink-50 border-pink-100',
          badge: 'bg-pink-50 text-pink-600 border-pink-100'
        };
      case 'el-capi':
        return {
          accent: 'text-cyan-600',
          borderHover: 'hover:border-cyan-300',
          glow: 'hover:shadow-cyan-500/10',
          btnBg: 'bg-cyan-600 hover:bg-cyan-700',
          logoBg: 'bg-cyan-50 border-cyan-100',
          badge: 'bg-cyan-50 text-cyan-600 border-cyan-100'
        };
      case 'collage':
        return {
          accent: 'text-purple-600',
          borderHover: 'hover:border-purple-300',
          glow: 'hover:shadow-purple-500/10',
          btnBg: 'bg-purple-600 hover:bg-purple-700',
          logoBg: 'bg-purple-50 border-purple-100',
          badge: 'bg-purple-50 text-purple-600 border-purple-100'
        };
      case 'uide-bakery':
        return {
          accent: 'text-amber-600',
          borderHover: 'hover:border-amber-300',
          glow: 'hover:shadow-amber-500/10',
          btnBg: 'bg-amber-600 hover:bg-amber-700',
          logoBg: 'bg-amber-50 border-amber-100',
          badge: 'bg-amber-50 text-amber-600 border-amber-100'
        };
      default:
        return {
          accent: 'text-brand-orange',
          borderHover: 'hover:border-brand-orange/30',
          glow: 'hover:shadow-brand-orange/10',
          btnBg: 'bg-gradient-to-r from-brand-red to-brand-orange',
          logoBg: 'bg-brand-dark/5 border-brand-border',
          badge: 'bg-brand-card text-brand-orange border-brand-border'
        };
    }
  };

  return (
    <div className="w-full py-8 select-none bg-brand-dark/20 border-b border-brand-border/40 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Area */}
        <div className="flex justify-between items-end mb-6">
          <div className="text-left">
            <span className="text-[10px] bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full font-extrabold uppercase tracking-widest border border-brand-orange/15">
              EXPLORAR EL CAMPUS
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-brand-text tracking-tight mt-2.5">
              Locales Gastronómicos UIDE
            </h2>
            <p className="text-xs text-brand-muted mt-1">
              Desliza y selecciona un local para ver su menú y revisar tus pedidos en curso.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-xl bg-white border border-brand-border hover:border-brand-orange text-brand-muted hover:text-brand-orange shadow-sm hover:shadow transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-xl bg-white border border-brand-border hover:border-brand-orange text-brand-muted hover:text-brand-orange shadow-sm hover:shadow transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-none scroll-smooth snap-x snap-mandatory pr-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {MOCK_RESTAURANTS.map((restaurant) => {
            const theme = getThemeColors(restaurant.id);
            return (
              <div
                key={restaurant.id}
                onClick={() => onSelectRestaurant(restaurant.id)}
                className={`snap-start shrink-0 w-[290px] md:w-[350px] bg-white border border-brand-border rounded-3xl p-6 cursor-pointer transition-all duration-300 ${theme.borderHover} ${theme.glow} shadow-sm hover:shadow-xl flex flex-col justify-between gap-5 group`}
              >
                <div>
                  {/* Top line with Star and Tagline */}
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${theme.badge}`}>
                      {restaurant.badgeText}
                    </span>
                    <span className="flex items-center gap-1 bg-brand-yellow/10 text-brand-yellow font-extrabold text-xs px-2.5 py-0.5 rounded-lg border border-brand-yellow/15 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {restaurant.rating}
                    </span>
                  </div>

                  {/* Logo + Title */}
                  <div className="flex items-center gap-4 text-left">
                    <div className={`relative w-14 h-14 rounded-2xl border flex items-center justify-center font-extrabold shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0 overflow-hidden ${theme.logoBg}`}>
                      {restaurant.useImage && restaurant.imageSrc ? (
                        <img 
                          src={restaurant.imageSrc} 
                          alt={restaurant.name} 
                          className="w-full h-full object-cover relative z-10" 
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : null}
                      <span className={`absolute text-xs tracking-wider font-extrabold ${theme.accent}`}>
                        {restaurant.badgeText}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg font-extrabold text-brand-text group-hover:text-brand-orange transition-colors truncate">
                        {restaurant.name}
                      </h3>
                      <p className={`text-xs font-semibold ${theme.accent} truncate mt-0.5`}>
                        {restaurant.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-brand-muted mt-4 text-left line-clamp-2 leading-relaxed">
                    {restaurant.description}
                  </p>
                </div>

                {/* Bottom line: Modality and Button */}
                <div className="flex items-center justify-between pt-4 border-t border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${theme.accent}`} />
                    <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wide">
                      Retiro / Delivery
                    </span>
                  </div>
                  
                  <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-white shadow-sm transition-all duration-300 group-hover:translate-x-1.5 ${theme.btnBg}`}>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
