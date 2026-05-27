import React from 'react';
import { Star, Clock, ShieldAlert, UtensilsCrossed } from 'lucide-react';
import ChiliIcon from './ChiliIcon';

export const MOCK_DISHES = [
  // Piedra Negra (Cafes & Postres) - Pink Theme
  {
    id: 'pn1',
    name: 'Espresso Americano Orgánico',
    description: 'Extracción doble de café de especialidad 100% arábica de origen nacional, servido con agua caliente filtrada.',
    price: 6.50,
    category: 'piedra-negra',
    restaurant: 'Piedra Negra',
    rating: 4.9,
    badgeText: 'PN',
    tag: 'Café',
    spicyLevel: 0
  },
  {
    id: 'pn2',
    name: 'Cappuccino con Arte Latte',
    description: 'Doble espresso combinado con leche texturizada al vapor, creando una crema densa y dulce. Espolvoreado con cacao orgánico.',
    price: 8.50,
    category: 'piedra-negra',
    restaurant: 'Piedra Negra',
    rating: 4.8,
    badgeText: 'PN',
    tag: 'Café',
    spicyLevel: 0
  },
  {
    id: 'pn3',
    name: 'Café Latte Helado con Vainilla',
    description: 'Espresso doble servido sobre leche fría, jarabe de vainilla artesanal y cubos de hielo. Perfecto para refrescar el día de estudio.',
    price: 9.50,
    category: 'piedra-negra',
    restaurant: 'Piedra Negra',
    rating: 4.7,
    badgeText: 'PN',
    tag: 'Bebida Fría',
    spicyLevel: 0
  },
  {
    id: 'pn4',
    name: 'Torta de Chocolate Extrahúmeda',
    description: 'Bizcocho húmedo artesanal con cacao al 70%, relleno y cubierto de abundante fudge de chocolate caliente de la casa.',
    price: 12.00,
    category: 'piedra-negra',
    restaurant: 'Piedra Negra',
    rating: 4.9,
    badgeText: 'PN',
    tag: 'Postre',
    spicyLevel: 0
  },
  {
    id: 'pn5',
    name: 'Pie de Limón Clásico',
    description: 'Base crocante de galleta de vainilla rellena con crema de limón y coronada con merengue italiano sopleteado.',
    price: 10.00,
    category: 'piedra-negra',
    restaurant: 'Piedra Negra',
    rating: 4.8,
    badgeText: 'PN',
    tag: 'Postre',
    spicyLevel: 0
  },

  // El Capi (Bolones & Tigrillos)
  {
    id: 'ec1',
    name: 'Bolón de Queso Criollo',
    description: 'Masa crujiente de plátano verde frito majado y sazonado, relleno con abundante queso fresco criollo fundido.',
    price: 8.00,
    category: 'el-capi',
    restaurant: 'El Capi',
    rating: 4.9,
    badgeText: 'EC',
    tag: 'Bolón',
    spicyLevel: 0
  },
  {
    id: 'ec2',
    name: 'Bolón de Chicharrón Crujiente',
    description: 'Masa de plátano verde frito majada con trozos crocantes de chicharrón de cerdo premium seleccionados.',
    price: 9.50,
    category: 'el-capi',
    restaurant: 'El Capi',
    rating: 4.9,
    badgeText: 'EC',
    tag: 'Bolón',
    spicyLevel: 0
  },
  {
    id: 'ec3',
    name: 'Bolón Mixto Especial',
    description: 'La combinación perfecta de masa de verde majado rellena de queso fresco criollo y trozos crocantes de chicharrón de cerdo.',
    price: 11.00,
    category: 'el-capi',
    restaurant: 'El Capi',
    rating: 4.8,
    badgeText: 'EC',
    tag: 'Bolón',
    spicyLevel: 0
  },
  {
    id: 'ec4',
    name: 'Tigrillo Tradicional con Huevo',
    description: 'Plátano verde majado y sofrito en sartén con huevo revuelto, queso criollo, trozos de chicharrón y un toque de culantro fresco.',
    price: 12.50,
    category: 'el-capi',
    restaurant: 'El Capi',
    rating: 4.8,
    badgeText: 'EC',
    tag: 'Tigrillo',
    spicyLevel: 0
  },

  // Collage (Mini Market)
  {
    id: 'co1',
    name: 'Papas Fritas Lays Clásicas',
    description: 'Bolsa tamaño familiar (150g) de papas fritas clásicas saladas. Ideales para compartir entre clases.',
    price: 6.00,
    category: 'collage',
    restaurant: 'Collage',
    rating: 4.7,
    badgeText: 'CO',
    tag: 'Mini Market',
    spicyLevel: 0
  },
  {
    id: 'co2',
    name: 'Bebida Energizante Red Bull',
    description: 'Lata de 250ml de la clásica bebida energizante fría para recargar energía durante las horas de estudio.',
    price: 8.50,
    category: 'collage',
    restaurant: 'Collage',
    rating: 4.8,
    badgeText: 'CO',
    tag: 'Bebida',
    spicyLevel: 0
  },
  {
    id: 'co3',
    name: 'Chocolate de Leche Toblerone',
    description: 'Barra de chocolate de leche suizo con turrón de miel y almendras de 100g. Un dulce antojo en el campus.',
    price: 7.50,
    category: 'collage',
    restaurant: 'Collage',
    rating: 4.9,
    badgeText: 'CO',
    tag: 'Dulce',
    spicyLevel: 0
  },
  {
    id: 'co4',
    name: 'Agua Mineral Güitig con Gas',
    description: 'Botella de 500ml de agua mineral gasificada naturalmente, bien helada.',
    price: 2.50,
    category: 'collage',
    restaurant: 'Collage',
    rating: 4.6,
    badgeText: 'CO',
    tag: 'Bebida',
    spicyLevel: 0
  },

  // UIDE Bakery (Panadería & Pastelería)
  {
    id: 'ub1',
    name: 'Croissant Hojaldrado Francés',
    description: 'Croissant artesanal elaborado con 100% mantequilla pura, horneado diariamente para obtener capas crujientes y doradas.',
    price: 5.00,
    category: 'uide-bakery',
    restaurant: 'UIDE Bakery',
    rating: 4.9,
    badgeText: 'UB',
    tag: 'Panadería',
    spicyLevel: 0
  },
  {
    id: 'ub2',
    name: 'Cinnamon Roll con Glaseado',
    description: 'Rollo de canela horneado, suave y esponjoso, cubierto con un glaseado dulce y cremoso de queso crema.',
    price: 6.50,
    category: 'uide-bakery',
    restaurant: 'UIDE Bakery',
    rating: 4.8,
    badgeText: 'UB',
    tag: 'Pastelería',
    spicyLevel: 0
  },
  {
    id: 'ub3',
    name: 'Baguette Rústica de Masa Madre',
    description: 'Pan francés alargado elaborado con fermentación natural de masa madre, de corteza crujiente y miga alveolada.',
    price: 7.00,
    category: 'uide-bakery',
    restaurant: 'UIDE Bakery',
    rating: 4.7,
    badgeText: 'UB',
    tag: 'Panadería',
    spicyLevel: 0
  }
];

export const MOCK_RESTAURANTS = [
  { 
    id: 'piedra-negra', 
    name: 'Piedra Negra', 
    tagline: 'Cafetería Fina & Postres Exclusivos', 
    rating: 4.9, 
    badgeText: 'PN', 
    bannerColor: 'from-pink-950 to-pink-900',
    description: 'El rincón del buen café y los postres artesanales en la UIDE. Espresso, lattes, tartas y repostería recién horneada.',
    useImage: true,
    imageSrc: '/piedra-negra-logo.png'
  },
  { 
    id: 'el-capi', 
    name: 'El Capi', 
    tagline: 'Especialistas en Bolones & Tigrillos criollos', 
    rating: 4.9, 
    badgeText: 'EC', 
    bannerColor: 'from-cyan-950 to-cyan-900',
    description: 'Los bolones de verde y tigrillos más crujientes del campus. Sabor criollo tradicional con extra queso y chicharrón.'
  },
  { 
    id: 'collage', 
    name: 'Collage', 
    tagline: 'Tu Mini Market Universitario', 
    rating: 4.8, 
    badgeText: 'CO', 
    bannerColor: 'from-purple-950 to-purple-900',
    description: 'Piqueos, chocolates, gaseosas, energizantes y suministros rápidos de mini market directamente a tu facultad.'
  },
  { 
    id: 'uide-bakery', 
    name: 'UIDE Bakery', 
    tagline: 'Panes de Masa Madre & Repostería Fina', 
    rating: 4.9, 
    badgeText: 'UB', 
    bannerColor: 'from-amber-950 to-amber-900',
    description: 'Panadería artesanal horneada directamente en el campus de la UIDE. Croissants de mantequilla, pan rústico y pastelería dulce selecta.',
    useImage: true,
    imageSrc: '/uide-bakery-1.png'
  }
];

// Helper to determine theme classes based on category
const getThemeColors = (category) => {
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

export default function RestaurantGrid({ 
  selectedCategory, 
  searchTerm, 
  onSelectItem,
  selectedRestaurantId
}) {
  
  const visibleRestaurants = MOCK_RESTAURANTS.filter(r => 
    selectedRestaurantId ? r.id === selectedRestaurantId : (selectedCategory === 'all' || r.id === selectedCategory)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 pt-8 space-y-12">
      
      {visibleRestaurants.map((restaurant) => {
        const isPinkTheme = restaurant.id === 'piedra-negra';
        const theme = getThemeColors(restaurant.id);

        const restaurantDishes = MOCK_DISHES.filter(dish => 
          dish.category === restaurant.id &&
          (dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           dish.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (searchTerm && restaurantDishes.length === 0) return null;

        return (
          <section 
            key={restaurant.id} 
            className={`glass-effect rounded-3xl overflow-hidden shadow-xl border ${
              isPinkTheme ? 'border-pink-500/10' : 'border-brand-border/60'
            }`}
          >
            {/* Restaurant Banner Header */}
            <div className={`p-6 md:p-8 bg-gradient-to-r ${restaurant.bannerColor} relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-brand-border/50`}>
              <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
              
              {/* Left Side: Logo and Details */}
              <div className="flex items-center gap-4 relative z-10 text-left">
                {/* Dynamic Logo Image for Restaurants */}
                <div className={`relative w-16 h-16 rounded-2xl bg-brand-dark/95 border ${isPinkTheme ? 'border-pink-500/20' : 'border-brand-border'} flex items-center justify-center font-extrabold shadow-lg shrink-0 overflow-hidden`}>
                  {restaurant.useImage ? (
                    <img 
                      src={restaurant.imageSrc} 
                      alt={restaurant.name} 
                      className="w-full h-full object-cover relative z-10 animate-fade-in" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : null}
                  <span className={`absolute text-sm tracking-wider ${theme.badgeText}`}>
                    {restaurant.badgeText}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                      {restaurant.name}
                    </h2>
                    <span className="flex items-center gap-1 bg-brand-yellow/15 text-brand-yellow font-bold text-xs px-2.5 py-0.5 rounded-lg border border-brand-yellow/15 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {restaurant.rating}
                    </span>
                  </div>
                  <p className={`text-xs font-semibold mt-1 ${isPinkTheme ? 'text-pink-400' : 'text-brand-orange'}`}>
                    {restaurant.tagline}
                  </p>
                  <p className="text-[11px] text-brand-muted mt-1.5 leading-relaxed max-w-xl hidden sm:block">
                    {restaurant.description}
                  </p>
                </div>
              </div>

              {/* Right Side: UIDE Delivery Modality (no exact times) */}
              <div className="flex items-center gap-3 shrink-0 relative z-10 bg-brand-dark/45 border border-brand-border/30 px-4 py-2.5 rounded-2xl">
                <Clock className={`w-4 h-4 ${isPinkTheme ? 'text-pink-500' : 'text-brand-orange'}`} />
                <div className="text-left">
                  <p className="text-[9px] text-brand-muted font-bold uppercase tracking-wider">MODALIDAD UIDE</p>
                  <p className="text-xs font-bold text-white">Retiro / Delivery</p>
                </div>
              </div>
            </div>

            {/* Restaurant Menu Grid */}
            <div className="p-6 md:p-8">
              {restaurantDishes.length === 0 ? (
                <div className="text-center py-10 bg-brand-dark/30 rounded-2xl border border-dashed border-brand-border/80 flex flex-col items-center justify-center">
                  <p className="text-brand-muted text-xs">No se encontraron productos en esta sección.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Showcase display case banner for UIDE Bakery */}
                  {restaurant.id === 'uide-bakery' && (
                    <div className="md:col-span-2 lg:col-span-3 rounded-2xl overflow-hidden border border-brand-border bg-brand-dark p-5 flex flex-col md:flex-row gap-5 items-center">
                      <img 
                        src="/uide-bakery-2.png" 
                        alt="Exhibidor de Dulces de UIDE Bakery" 
                        className="w-full md:w-56 h-36 object-cover rounded-xl border border-brand-border/60 shrink-0" 
                      />
                      <div className="text-left space-y-2">
                        <h4 className="text-sm font-bold text-brand-text flex items-center gap-1.5">
                          <ChiliIcon className="w-4.5 h-4.5 text-brand-orange animate-pulse" />
                          Nuestra Vitrina del Día (UIDE Bakery)
                        </h4>
                        <p className="text-xs text-brand-muted leading-relaxed">
                          Conoce la repostería fresca preparada hoy por nuestros chefs pasteleros. Puedes visitarnos directamente en el local para retirar tus antojos calientes o pedir envío directo a tu aula o facultad.
                        </p>
                        <div className="flex gap-2">
                          <span className="text-[9px] text-brand-orange bg-brand-orange/10 border border-brand-orange/15 px-2.5 py-0.5 rounded font-extrabold">100% ARTESANAL</span>
                          <span className="text-[9px] text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/15 px-2.5 py-0.5 rounded font-extrabold">INGREDIENTES FRESCOS</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {restaurantDishes.map((dish) => (
                    <div 
                      key={dish.id}
                      className={`group relative rounded-2xl bg-brand-dark/40 border p-5 flex flex-col justify-between gap-4 transition-all duration-300 ${
                        isPinkTheme 
                          ? 'border-brand-border/50 hover:border-pink-500/40 hover:shadow-pink-500/5' 
                          : 'border-brand-border/50 hover:border-brand-orange/40 hover:shadow-brand-orange/5'
                      } hover:shadow-lg`}
                    >
                      {/* Top Content */}
                      <div className="text-left">
                        {/* Tags */}
                        <div className="flex justify-between items-center mb-3">
                          <span className={`text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full border ${theme.tagBg}`}>
                            {dish.tag}
                          </span>
                          
                          {/* Small Acronym Circle */}
                          <div className={`w-6 h-6 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-[9px] font-black ${
                            isPinkTheme ? 'text-pink-500/60' : 'text-brand-muted'
                          }`}>
                            {dish.badgeText}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className={`font-bold text-sm text-brand-text transition-colors ${
                          isPinkTheme ? 'group-hover:text-pink-500' : 'group-hover:text-brand-orange'
                        }`}>
                          {dish.name}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-brand-muted mt-2 line-clamp-3 leading-relaxed">
                          {dish.description}
                        </p>
                      </div>

                      {/* Bottom Price & Add Area */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-border/30">
                        <div>
                          <span className="text-[9px] text-brand-muted block uppercase font-bold tracking-wider">PRECIO</span>
                          <span className="text-sm font-extrabold text-brand-text">
                            S/ {dish.price.toFixed(2)}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => onSelectItem(dish)}
                          className={`inline-flex items-center justify-center gap-1.5 text-white border border-brand-border hover:border-transparent px-3.5 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${theme.gradient}`}
                        >
                          <UtensilsCrossed className="w-3.5 h-3.5" />
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

      {/* Edge Case: No Restaurants Found */}
      {visibleRestaurants.length === 0 || MOCK_RESTAURANTS.every(r => searchTerm && MOCK_DISHES.filter(d => d.category === r.id && (d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.description.toLowerCase().includes(searchTerm.toLowerCase()))).length === 0) ? (
        <div className="text-center py-20 bg-brand-card/20 rounded-3xl border border-dashed border-brand-border flex flex-col items-center justify-center">
          <div className="p-4 bg-brand-border/30 rounded-full text-brand-muted mb-4">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-brand-text mb-1">Sin Resultados</h3>
          <p className="text-brand-muted text-xs max-w-xs mx-auto">
            No se encontraron restaurantes o platos con el término ingresado.
          </p>
        </div>
      ) : null}

    </div>
  );
}
