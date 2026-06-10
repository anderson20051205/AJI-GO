import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Clock, ArrowRight } from 'lucide-react';
import { MOCK_RESTAURANTS } from './RestaurantGrid';

// INTERFAZ PARA DEFINIR LAS PROPIEDADES DEL COMPONENTE ORGANISMO CARRUSEL
interface RestaurantCarouselProps {
  onSelectRestaurant: (id: string) => void;
}

export default function RestaurantCarousel({
  onSelectRestaurant
}: RestaurantCarouselProps) {
  // USO REFERENCIA PARA EL CONTENEDOR DE SCROLL Y ESTADOS PARA EL ELEMENTO ACTIVO
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const totalItems = MOCK_RESTAURANTS.length;

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cards = container.children;
      // FILTRO SOLO LOS ELEMENTOS DIV QUE EMPIECEN CON EL ID CARD- PARA EVITAR OTROS NODOS
      const cardElements = Array.from(cards).filter(
        el => el.tagName === 'DIV' && el.id.startsWith('card-')
      ) as HTMLDivElement[];

      if (cardElements && cardElements[index]) {
        const targetScroll = cardElements[index].offsetLeft - container.offsetLeft - 16;
        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
        setActiveIndex(index);
      }
    }
  };

  const handleNext = () => {
    if (totalItems === 0) return;
    const nextIndex = (activeIndex + 1) % totalItems;
    scrollToCard(nextIndex);
  };

  const handlePrev = () => {
    if (totalItems === 0) return;
    const prevIndex = (activeIndex - 1 + totalItems) % totalItems;
    scrollToCard(prevIndex);
  };

  // AUTO DESPLAZAMIENTO CADA 4.5 SEGUNDOS SI EL MOUSE NO ESTÁ ENCIMA
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(interval);
  }, [activeIndex, isHovered]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const cards = container.children;
      const cardElements = Array.from(cards).filter(
        el => el.tagName === 'DIV' && el.id.startsWith('card-')
      ) as HTMLDivElement[];

      if (cardElements && cardElements.length > 0) {
        let closestIndex = 0;
        let minDiff = Infinity;

        cardElements.forEach((card, idx) => {
          const cardOffset = card.offsetLeft - container.offsetLeft - 16;
          const diff = Math.abs(cardOffset - scrollLeft);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = idx;
          }
        });

        if (closestIndex !== activeIndex) {
          setActiveIndex(closestIndex);
        }
      }
    }
  };

  // PALETAS DE COLOR DINÁMICAS BASADAS EN CADA LOCAL DE LA UIDE
  const getThemeColors = (id: string) => {
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
    <div
      className="w-full py-10 select-none bg-brand-dark/20 border-b border-brand-border/40 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-[95%] xl:max-w-[90%] 2xl:max-w-[1440px] mx-auto px-4 md:px-8">

        {/* ENCABEZADO Y CONTROLES DEL CARRUSEL */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div className="text-left">
            <span className="text-xs bg-brand-orange/10 text-brand-orange px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-brand-orange/15">
              EXPLORAR EL CAMPUS
            </span>
            <h2 className="text-3xl font-black text-brand-text tracking-tight mt-3">
              Locales Gastronómicos UIDE
            </h2>
            <p className="text-sm text-brand-muted mt-1.5 font-medium">
              Desliza y selecciona un local para ver su menú y ordenar tus antojos calientes.
            </p>
          </div>

          {/* BOTONES ANTERIOR Y SIGUIENTE */}
          <div className="flex gap-2.5 self-end sm:self-auto">
            <button
              onClick={handlePrev}
              className="p-3 rounded-xl bg-white border border-brand-border hover:border-brand-orange text-brand-muted hover:text-brand-orange shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5.5 h-5.5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-xl bg-white border border-brand-border hover:border-brand-orange text-brand-muted hover:text-brand-orange shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5.5 h-5.5" />
            </button>
          </div>
        </div>

        {/* CONTENEDOR DESLIZANTE DE LOS RESTAURANTES */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none scroll-smooth snap-x snap-mandatory pr-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {MOCK_RESTAURANTS.length === 0 ? (
            <div className="w-full text-center py-10 bg-white border border-brand-border rounded-3xl">
              <p className="text-brand-muted text-xs font-bold">No hay locales gastronómicos registrados en el campus.</p>
            </div>
          ) : (
            MOCK_RESTAURANTS.map((restaurant) => {
            const theme = getThemeColors(restaurant.id);
            return (
              <div
                key={restaurant.id}
                id={`card-${restaurant.id}`}
                onClick={() => onSelectRestaurant(restaurant.id)}
                className={`snap-start shrink-0 w-[310px] md:w-[380px] bg-white border border-brand-border rounded-3xl p-7 cursor-pointer transition-all duration-300 ${theme.borderHover} ${theme.glow} shadow-sm hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between gap-6 group`}
              >
                <div>
                  {/* LÍNEA SUPERIOR DE CALIFICACIONES Y SIGLAS */}
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-[11px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-wider ${theme.badge}`}>
                      {restaurant.badgeText}
                    </span>
                    <span className="flex items-center gap-1.5 bg-brand-yellow/10 text-brand-yellow font-black text-xs px-2.5 py-1 rounded-lg border border-brand-yellow/15 shrink-0">
                      <Star className="w-4 h-4 fill-current" />
                      {restaurant.rating}
                    </span>
                  </div>

                  {/* IDENTIFICACIÓN E IMAGEN DEL LOGOTIPO */}
                  <div className="flex items-center gap-4.5 text-left">
                    <div className={`relative w-16 h-16 rounded-2xl border flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0 overflow-hidden ${theme.logoBg}`}>
                      {restaurant.useImage && restaurant.imageSrc ? (
                        <img
                          src={restaurant.imageSrc}
                          alt={restaurant.name}
                          className="w-full h-full object-cover relative z-10"
                          onError={(e: any) => { e.target.style.display = 'none'; }}
                        />
                      ) : null}
                      <span className={`absolute text-sm tracking-wider font-extrabold ${theme.accent}`}>
                        {restaurant.badgeText}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xl font-black text-brand-text group-hover:text-brand-orange transition-colors truncate">
                        {restaurant.name}
                      </h3>
                      <p className={`text-xs font-black ${theme.accent} truncate mt-1`}>
                        {restaurant.tagline}
                      </p>
                    </div>
                  </div>

                  {/* DESCRIPCIÓN BREVE DEL ESTABLECIMIENTO */}
                  <p className="text-xs text-brand-muted mt-4.5 text-left line-clamp-2 leading-relaxed font-semibold">
                    {restaurant.description}
                  </p>
                </div>

                {/* PIE DE TARJETA CON MODALIDADES DISPONIBLES */}
                <div className="flex items-center justify-between pt-4.5 border-t border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4.5 h-4.5 ${theme.accent}`} />
                    <span className="text-[11px] font-black text-brand-muted uppercase tracking-wider">
                      Retiro / Delivery
                    </span>
                  </div>

                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-white shadow-sm transition-all duration-300 group-hover:translate-x-2 cursor-pointer ${theme.btnBg}`}>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </span>
                </div>
              </div>
            );
          }))}
        </div>

        {/* INDICADORES FLOTANTES */}
        <div className="flex justify-center gap-2 mt-4.5">
          {MOCK_RESTAURANTS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToCard(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === idx
                  ? 'bg-brand-orange w-7 shadow-sm shadow-brand-orange/20'
                  : 'bg-brand-border hover:bg-brand-orange/40'
                }`}
              aria-label={`Ir al restaurante ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
