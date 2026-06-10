import React from 'react';
import { Star, Clock, ShieldAlert, UtensilsCrossed } from 'lucide-react';
import ChiliIcon from '../atoms/ChiliIcon';
import { Dish, Restaurant } from '../../types';

// PLATOS DE COMIDA DE PRUEBA
export const MOCK_DISHES: Dish[] = [];

// RESTAURANTES
export const MOCK_RESTAURANTS: Restaurant[] = [];

// FUNCIÓN HELPER PARA ASIGNAR COLORES A CADA RESTAURANTE
const getThemeColors = (category: string) => {
  if (category === 'piedra-negra') {
    return {
      text: 'text-pink-500 hover:text-pink-400',
      bg: 'bg-pink-500/10 border-pink-500/20 text-pink-500',
      border: 'border-brand-border hover:border-pink-500/40',
      gradient: 'bg-pink-600 hover:bg-pink-500',
      badgeText: 'text-pink-500',
      tagBg: 'text-pink-500 bg-pink-500/10 border-pink-500/15'
    };
  }
  return {
    text: 'text-brand-orange hover:text-brand-yellow',
    bg: 'bg-brand-orange/10 border-brand-orange/20 text-brand-orange',
    border: 'border-brand-border hover:border-brand-orange/40',
    gradient: 'bg-gradient-to-r from-brand-red to-brand-orange hover:opacity-95',
    badgeText: 'text-brand-orange',
    tagBg: 'text-brand-orange bg-brand-card border-brand-border'
  };
};

// INTERFAZ DE PROPIEDADES PARA EL ORGANISMO RESTAURANTGRID
interface RestaurantGridProps {
  selectedCategory: string;
  searchTerm: string;
  onSelectItem: (item: Dish) => void;
  selectedRestaurantId: string | null;
}

export default function RestaurantGrid({
  selectedCategory,
  searchTerm,
  onSelectItem,
  selectedRestaurantId
}: RestaurantGridProps) {

  // FILTRO RESTAURANTES SEGUN LA SELECCION DEL USUARIO
  const visibleRestaurants = MOCK_RESTAURANTS.filter(r =>
    selectedRestaurantId ? r.id === selectedRestaurantId : (selectedCategory === 'all' || r.id === selectedCategory)
  );

  return (
    <div className="max-w-[95%] xl:max-w-[90%] 2xl:max-w-[1440px] mx-auto px-4 md:px-8 pb-16 pt-8 space-y-12">

      {visibleRestaurants.map((restaurant) => {
        const isPinkTheme = restaurant.id === 'piedra-negra';
        const theme = getThemeColors(restaurant.id);

        // FILTRO PLATOS
        const restaurantDishes = MOCK_DISHES.filter(dish =>
          dish.category === restaurant.id &&
          (dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dish.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (searchTerm && restaurantDishes.length === 0) return null;

        return (
          <section
            key={restaurant.id}
            className={`glass-effect rounded-3xl overflow-hidden shadow-xl border ${isPinkTheme ? 'border-pink-500/10' : 'border-brand-border/60'
              }`}
          >
            {/* ENCABEZADO DE CADA RESTAURANTE */}
            <div className={`p-7 md:p-9 bg-gradient-to-r ${restaurant.bannerColor} relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-brand-border/50`}>
              <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

              <div className="flex items-center gap-4.5 relative z-10 text-left">
                <div className={`relative w-16 h-16 rounded-2xl bg-brand-dark/95 border ${isPinkTheme ? 'border-pink-500/20' : 'border-brand-border'} flex items-center justify-center font-black shadow-lg shrink-0 overflow-hidden`}>
                  {restaurant.useImage && restaurant.imageSrc ? (
                    <img
                      src={restaurant.imageSrc}
                      alt={restaurant.name}
                      className="w-full h-full object-cover relative z-10"
                      onError={(e: any) => { e.target.style.display = 'none'; }}
                    />
                  ) : null}
                  <span className={`absolute text-sm tracking-wider ${theme.badgeText}`}>
                    {restaurant.badgeText}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                      {restaurant.name}
                    </h2>
                    <span className="flex items-center gap-1.5 bg-brand-yellow/15 text-brand-yellow font-black text-xs px-2.5 py-1 rounded-lg border border-brand-yellow/15 shrink-0">
                      <Star className="w-4 h-4 fill-current" />
                      {restaurant.rating}
                    </span>
                  </div>
                  <p className={`text-xs font-black mt-1 ${isPinkTheme ? 'text-pink-400' : 'text-brand-orange'}`}>
                    {restaurant.tagline}
                  </p>
                  <p className="text-xs text-brand-muted mt-2 leading-relaxed max-w-xl hidden sm:block font-medium">
                    {restaurant.description}
                  </p>
                </div>
              </div>

              {/* TIPO DE SERVICIO DISPONIBLE */}
              <div className="flex items-center gap-3 shrink-0 relative z-10 bg-brand-dark/45 border border-brand-border/30 px-4.5 py-3 rounded-2xl">
                <Clock className={`w-4.5 h-4.5 ${isPinkTheme ? 'text-pink-500' : 'text-brand-orange'}`} />
                <div className="text-left">
                  <p className="text-[9px] text-brand-muted font-bold uppercase tracking-widest">MODALIDAD UIDE</p>
                  <p className="text-xs font-black text-white">Retiro / Delivery</p>
                </div>
              </div>
            </div>

            {/* GRILLA DE PLATOS DE COMIDA */}
            <div className="p-7 md:p-9">
              {restaurantDishes.length === 0 ? (
                <div className="text-center py-12 bg-brand-dark/30 rounded-2xl border border-dashed border-brand-border flex flex-col items-center justify-center">
                  <p className="text-brand-muted text-xs font-bold">No se encontraron productos en esta sección.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {/* EXHIBIDOR DE PANADERÍA PARA UIDE BAKERY */}
                  {restaurant.id === 'uide-bakery' && (
                    <div className="md:col-span-2 lg:col-span-3 rounded-2xl overflow-hidden border border-brand-border bg-brand-dark p-6 flex flex-col md:flex-row gap-6 items-center">
                      <img
                        src="/uide-bakery-2.png"
                        alt="Exhibidor de Dulces de UIDE Bakery"
                        className="w-full md:w-56 h-36 object-cover rounded-xl border border-brand-border/60 shrink-0"
                      />
                      <div className="text-left space-y-2">
                        <h4 className="text-sm font-black text-brand-text flex items-center gap-2">
                          <ChiliIcon className="w-5 h-5 text-brand-orange animate-pulse" />
                          Nuestra Vitrina del Día (UIDE Bakery)
                        </h4>
                        <p className="text-xs text-brand-muted leading-relaxed font-semibold">
                          Conoce la repostería fresca preparada hoy por nuestros chefs pasteleros. Puedes visitarnos directamente en el local para retirar tus antojos calientes o pedir envío directo a tu aula o facultad.
                        </p>
                        <div className="flex gap-2">
                          <span className="text-[10px] text-brand-orange bg-brand-orange/10 border border-brand-orange/15 px-3 py-1 rounded-lg font-black">100% ARTESANAL</span>
                          <span className="text-[10px] text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/15 px-3 py-1 rounded-lg font-black">INGREDIENTES FRESCOS</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {restaurantDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className={`group relative rounded-2xl bg-brand-dark/40 border p-6 flex flex-col justify-between gap-4 transition-all duration-300 ${isPinkTheme
                          ? 'border-brand-border/50 hover:border-pink-500/40 hover:shadow-pink-500/5'
                          : 'border-brand-border/50 hover:border-brand-orange/40 hover:shadow-brand-orange/5'
                        } hover:shadow-lg`}
                    >
                      <div className="text-left">
                        {/* TAG DE IDENTIFICACIÓN */}
                        <div className="flex justify-between items-center mb-3.5">
                          <span className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full border ${theme.tagBg}`}>
                            {dish.tag}
                          </span>

                          <div className={`w-7.5 h-7.5 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-[10px] font-black ${isPinkTheme ? 'text-pink-500/60' : 'text-brand-muted'
                            }`}>
                            {dish.badgeText}
                          </div>
                        </div>

                        {/* TÍTULO DEL PLATO */}
                        <h3 className={`font-black text-base text-brand-text transition-colors ${isPinkTheme ? 'group-hover:text-pink-500' : 'group-hover:text-brand-orange'
                          }`}>
                          {dish.name}
                        </h3>

                        {/* DESCRIPCIÓN DEL PLATO */}
                        <p className="text-xs text-brand-muted mt-2.5 line-clamp-3 leading-relaxed font-semibold">
                          {dish.description}
                        </p>
                      </div>

                      {/* AREA DE PRECIO Y COMPRA */}
                      <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-brand-border/30">
                        <div>
                          <span className="text-[9px] text-brand-muted block uppercase font-bold tracking-widest">PRECIO</span>
                          <span className="text-sm font-black text-brand-text">
                            S/ {dish.price.toFixed(2)}
                          </span>
                        </div>

                        <button
                          onClick={() => onSelectItem(dish)}
                          className={`inline-flex items-center justify-center gap-1.5 text-white border border-brand-border hover:border-transparent px-4 py-2.5 rounded-xl font-black text-xs transition-all duration-300 cursor-pointer ${theme.gradient}`}
                        >
                          <UtensilsCrossed className="w-4 h-4" />
                          <span>Ordenar</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* COMPORTAMIENTO CASO EXCEPCIONAL DE CERO RESULTADOS */}
      {visibleRestaurants.length === 0 || MOCK_RESTAURANTS.every(r => searchTerm && MOCK_DISHES.filter(d => d.category === r.id && (d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.description.toLowerCase().includes(searchTerm.toLowerCase()))).length === 0) ? (
        <div className="text-center py-24 bg-brand-card/20 rounded-3xl border border-dashed border-brand-border flex flex-col items-center justify-center">
          <div className="p-4 bg-brand-border/30 rounded-full text-brand-muted mb-4.5">
            <ShieldAlert className="w-12 h-12" />
          </div>
          <h3 className="text-xl font-black text-brand-text mb-1">Sin Resultados</h3>
          <p className="text-brand-muted text-xs max-w-xs mx-auto font-bold">
            No se encontraron restaurantes o platos con el término ingresado.
          </p>
        </div>
      ) : null}

    </div>
  );
}
