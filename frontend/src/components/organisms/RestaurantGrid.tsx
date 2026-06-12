import React from 'react';
import { Star, Clock, ShieldAlert, UtensilsCrossed } from 'lucide-react';
import ChiliIcon from '../atoms/ChiliIcon';
import { Dish, Restaurant } from '../../types';

// PLATOS DE COMIDA DE PRUEBA
export const MOCK_DISHES: Dish[] = [
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
  },

  // El Cargo (Hamburguesas y Papas fritas)
  {
    id: 'cg1',
    name: 'Hamburguesa La Cargo Especial',
    description: '180g de carne de res premium, queso cheddar fundido, tocino ahumado crujiente, cebolla caramelizada, lechuga y tomate en pan brioche.',
    price: 14.50,
    category: 'el-cargo',
    restaurant: 'El Cargo',
    rating: 4.9,
    badgeText: 'ECG',
    tag: 'Hamburguesas',
    spicyLevel: 0
  },
  {
    id: 'cg2',
    name: 'Costillas BBQ Ahumadas',
    description: 'Media costillar de cerdo tierna cocida a fuego lento, baja en grasa, bañada en salsa barbacoa de la casa, servida con papas rústicas.',
    price: 18.00,
    category: 'el-cargo',
    restaurant: 'El Cargo',
    rating: 4.8,
    badgeText: 'ECG',
    tag: 'Costillas',
    spicyLevel: 0
  },
  {
    id: 'cg3',
    name: 'Alitas Glaseadas Mango Curry',
    description: '8 alitas crujientes bañadas en una salsa dulce y ligeramente picante de mango y curry, acompañadas de bastones de apio.',
    price: 11.50,
    category: 'el-cargo',
    restaurant: 'El Cargo',
    rating: 4.7,
    badgeText: 'ECG',
    tag: 'Entradas',
    spicyLevel: 1
  },

  // Toscana (Pizza & Pastas)
  {
    id: 'ts1',
    name: 'Pizza Margherita Toscana',
    description: 'Salsa de tomate artesanal, mozzarella fresca, albahaca orgánica y un toque de aceite de oliva extravirgen en masa de piedra.',
    price: 12.00,
    category: 'toscana',
    restaurant: 'Toscana',
    rating: 4.9,
    badgeText: 'TO',
    tag: 'Pizza',
    spicyLevel: 0
  },
  {
    id: 'ts2',
    name: 'Lasagna Bolognese Clásica',
    description: 'Capas de pasta fresca con abundante salsa boloñesa de carne, salsa bechamel, mozzarella gratinada y queso parmesano.',
    price: 14.00,
    category: 'toscana',
    restaurant: 'Toscana',
    rating: 4.8,
    badgeText: 'TO',
    tag: 'Pasta',
    spicyLevel: 0
  },
  {
    id: 'ts3',
    name: 'Pizza Quattro Formaggi',
    description: 'Exquisita combinación de quesos mozzarella, gorgonzola, parmesano y provolone sobre salsa de tomate de la casa.',
    price: 15.50,
    category: 'toscana',
    restaurant: 'Toscana',
    rating: 4.9,
    badgeText: 'TO',
    tag: 'Pizza',
    spicyLevel: 0
  },

  // Happy Coffee (Cafetería Gourmet)
  {
    id: 'hc1',
    name: 'Caramel Macchiato Helado',
    description: 'Espresso intenso mezclado con leche fría y jarabe de vainilla, coronado con una rejilla de salsa de caramelo mantecoso y hielo.',
    price: 8.50,
    category: 'happy-coffee',
    restaurant: 'Happy Coffee',
    rating: 4.8,
    badgeText: 'HC',
    tag: 'Bebida Fría',
    spicyLevel: 0
  },
  {
    id: 'hc2',
    name: 'Mocaccino Supremo Caliente',
    description: 'Combinación perfecta de espresso de especialidad, salsa de chocolate belga, leche texturizada y espuma cremosa.',
    price: 7.50,
    category: 'happy-coffee',
    restaurant: 'Happy Coffee',
    rating: 4.7,
    badgeText: 'HC',
    tag: 'Café Caliente',
    spicyLevel: 0
  },
  {
    id: 'hc3',
    name: 'Sándwich Croque Monsieur',
    description: 'Sándwich de jamón ahumado y queso suizo bañado en salsa bechamel con queso parmesano gratinado en pan campesino.',
    price: 9.00,
    category: 'happy-coffee',
    restaurant: 'Happy Coffee',
    rating: 4.8,
    badgeText: 'HC',
    tag: 'Sándwich',
    spicyLevel: 0
  },

  // La Hueca (Comida Típica)
  {
    id: 'lh1',
    name: 'Almuerzo Ejecutivo del Día',
    description: 'Sopa casera tradicional, plato fuerte con arroz, proteína a elegir (carne, pollo o pescado), ensalada fresca y jugo natural.',
    price: 8.50,
    category: 'la-hueca',
    restaurant: 'La Hueca',
    rating: 4.8,
    badgeText: 'LH',
    tag: 'Almuerzos',
    spicyLevel: 0
  },
  {
    id: 'lh2',
    name: 'Ceviche de Camarón Manabita',
    description: 'Camarones cocidos marinados en jugo de limón y naranja, cebolla colorada, tomate, culantro, acompañado de chifles y canguil.',
    price: 13.00,
    category: 'la-hueca',
    restaurant: 'La Hueca',
    rating: 4.9,
    badgeText: 'LH',
    tag: 'Mariscos',
    spicyLevel: 0
  },
  {
    id: 'lh3',
    name: 'Seco de Pollo Criollo',
    description: 'Pollo cocido lentamente en una salsa tradicional de cerveza, naranjilla y especias, servido con arroz amarillo y maduro frito.',
    price: 9.50,
    category: 'la-hueca',
    restaurant: 'La Hueca',
    rating: 4.9,
    badgeText: 'LH',
    tag: 'Tradicional',
    spicyLevel: 0
  },

  // Hanaska (Comida Saludable)
  {
    id: 'ha1',
    name: 'Bowl de Quinoa y Salmón',
    description: 'Base de quinoa orgánica con salmón a la plancha, palta fresca, edamame, zanahoria rallada, pepino y aderezo de sésamo y jengibre.',
    price: 16.50,
    category: 'hanaska',
    restaurant: 'Hanaska',
    rating: 4.9,
    badgeText: 'HA',
    tag: 'Bowls',
    spicyLevel: 0
  },
  {
    id: 'ha2',
    name: 'Wrap de Pollo y Aguacate',
    description: 'Pechuga de pollo deshilachada a las finas hierbas con palta, lechugas hidropónicas, tomate cherry y salsa ligera de yogur en tortilla integral.',
    price: 11.00,
    category: 'hanaska',
    restaurant: 'Hanaska',
    rating: 4.8,
    badgeText: 'HA',
    tag: 'Wraps',
    spicyLevel: 0
  },
  {
    id: 'ha3',
    name: 'Ensalada César con Pollo a la Parrilla',
    description: 'Mix de lechugas crujientes, pechuga de pollo a la plancha, crutones integrales, queso parmesano y aderezo césar light de la casa.',
    price: 12.00,
    category: 'hanaska',
    restaurant: 'Hanaska',
    rating: 4.8,
    badgeText: 'HA',
    tag: 'Ensaladas',
    spicyLevel: 0
  }
];

// RESTAURANTES
export const MOCK_RESTAURANTS: Restaurant[] = [
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
  },
  { 
    id: 'el-cargo', 
    name: 'El Cargo', 
    tagline: 'Hamburguesas & Papas Fritas', 
    rating: 4.8, 
    badgeText: 'ECG', 
    bannerColor: 'from-emerald-950 to-emerald-900',
    description: 'Hamburguesas artesanales a la parrilla y papas rústicas recién hechas. Sabor y calidad premium en cualquier momento del dia en la UIDE.'
  },
  { 
    id: 'toscana', 
    name: 'Toscana', 
    tagline: 'Pizzas Artesanales & Pastas Italianas', 
    rating: 4.9, 
    badgeText: 'TO', 
    bannerColor: 'from-rose-950 to-rose-900',
    description: 'Sabores tradicionales de Italia en la UIDE. Pizzas crujientes de masa delgada y pastas frescas preparadas al momento.'
  },
  { 
    id: 'happy-coffee', 
    name: 'Happy Coffee', 
    tagline: 'El Café que Alegra tus Mañanas', 
    rating: 4.7, 
    badgeText: 'HC', 
    bannerColor: 'from-yellow-950 to-yellow-900',
    description: 'Variedad de bebidas calientes y heladas, sánduches gourmet y postres perfectos para tus horas de estudio.'
  },
  { 
    id: 'la-hueca', 
    name: 'La Hueca', 
    tagline: 'Tradición Ecuatoriana', 
    rating: 4.8, 
    badgeText: 'LH', 
    bannerColor: 'from-orange-950 to-orange-900',
    description: 'El auténtico sabor de la comida casera ecuatoriana, ceviches frescos y platos tradicionales para disfrutar en la UIDE.'
  },
  { 
    id: 'hanaska', 
    name: 'Hanaska', 
    tagline: 'Gourmet Catering & Comidas Saludables', 
    rating: 4.9, 
    badgeText: 'HA', 
    bannerColor: 'from-indigo-950 to-indigo-900',
    description: 'Comida gourmet saludable, ensaladas personalizadas, bowls y wraps frescos con ingredientes locales seleccionados.'
  }
];

// FUNCIÓN HELPER PARA ASIGNAR COLORES A CADA RESTAURANTE
const getThemeColors = (category: string) => {
  switch (category) {
    case 'piedra-negra':
      return {
        text: 'text-pink-500 hover:text-pink-400',
        bg: 'bg-pink-500/10 border-pink-500/20 text-pink-500',
        border: 'border-brand-border hover:border-pink-500/40',
        gradient: 'bg-pink-600 hover:bg-pink-500',
        badgeText: 'text-pink-500',
        tagBg: 'text-pink-500 bg-pink-500/10 border-pink-500/15'
      };
    case 'el-capi':
      return {
        text: 'text-cyan-500 hover:text-cyan-400',
        bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500',
        border: 'border-brand-border hover:border-cyan-500/40',
        gradient: 'bg-cyan-600 hover:bg-cyan-500',
        badgeText: 'text-cyan-500',
        tagBg: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/15'
      };
    case 'collage':
      return {
        text: 'text-purple-500 hover:text-purple-400',
        bg: 'bg-purple-500/10 border-purple-500/20 text-purple-500',
        border: 'border-brand-border hover:border-purple-500/40',
        gradient: 'bg-purple-600 hover:bg-purple-500',
        badgeText: 'text-purple-500',
        tagBg: 'text-purple-500 bg-purple-500/10 border-purple-500/15'
      };
    case 'uide-bakery':
      return {
        text: 'text-amber-500 hover:text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
        border: 'border-brand-border hover:border-amber-500/40',
        gradient: 'bg-amber-600 hover:bg-amber-500',
        badgeText: 'text-amber-500',
        tagBg: 'text-amber-500 bg-amber-500/10 border-amber-500/15'
      };
    case 'el-cargo':
      return {
        text: 'text-emerald-500 hover:text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
        border: 'border-brand-border hover:border-emerald-500/40',
        gradient: 'bg-emerald-600 hover:bg-emerald-500',
        badgeText: 'text-emerald-500',
        tagBg: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/15'
      };
    case 'toscana':
      return {
        text: 'text-rose-500 hover:text-rose-400',
        bg: 'bg-rose-500/10 border-rose-500/20 text-rose-500',
        border: 'border-brand-border hover:border-rose-500/40',
        gradient: 'bg-rose-600 hover:bg-rose-500',
        badgeText: 'text-rose-500',
        tagBg: 'text-rose-500 bg-rose-500/10 border-rose-500/15'
      };
    case 'happy-coffee':
      return {
        text: 'text-yellow-500 hover:text-yellow-400',
        bg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500',
        border: 'border-brand-border hover:border-yellow-500/40',
        gradient: 'bg-yellow-600 hover:bg-yellow-500',
        badgeText: 'text-yellow-500',
        tagBg: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/15'
      };
    case 'la-hueca':
      return {
        text: 'text-orange-500 hover:text-orange-400',
        bg: 'bg-orange-500/10 border-orange-500/20 text-orange-500',
        border: 'border-brand-border hover:border-orange-500/40',
        gradient: 'bg-orange-600 hover:bg-orange-500',
        badgeText: 'text-orange-500',
        tagBg: 'text-orange-500 bg-orange-500/10 border-orange-500/15'
      };
    case 'hanaska':
      return {
        text: 'text-indigo-500 hover:text-indigo-400',
        bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500',
        border: 'border-brand-border hover:border-indigo-500/40',
        gradient: 'bg-indigo-600 hover:bg-indigo-500',
        badgeText: 'text-indigo-500',
        tagBg: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/15'
      };
    default:
      return {
        text: 'text-brand-orange hover:text-brand-yellow',
        bg: 'bg-brand-orange/10 border-brand-orange/20 text-brand-orange',
        border: 'border-brand-border hover:border-brand-orange/40',
        gradient: 'bg-gradient-to-r from-brand-red to-brand-orange hover:opacity-95',
        badgeText: 'text-brand-orange',
        tagBg: 'text-brand-orange bg-brand-card border-brand-border'
      };
  }
};

// INTERFAZ DE PROPIEDADES PARA EL ORGANISMO RESTAURANTGRID
interface RestaurantGridProps {
  selectedCategory: string;
  searchTerm: string;
  onSelectItem: (item: Dish) => void;
  selectedRestaurantId: string | null;
  dishes: Dish[];
}

export default function RestaurantGrid({
  selectedCategory,
  searchTerm,
  onSelectItem,
  selectedRestaurantId,
  dishes
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
        const restaurantDishes = dishes.filter(dish =>
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
            {!selectedRestaurantId && (
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
            )}

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

                        {/* IMAGEN DE PLATO SI EXISTE */}
                        {dish.imageSrc && (
                          <div className="w-full h-36 rounded-xl overflow-hidden border border-brand-border/40 mb-3.5 relative">
                            <img
                              src={dish.imageSrc}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

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
      {visibleRestaurants.length === 0 || MOCK_RESTAURANTS.every(r => searchTerm && dishes.filter(d => d.category === r.id && (d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.description.toLowerCase().includes(searchTerm.toLowerCase()))).length === 0) ? (
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
