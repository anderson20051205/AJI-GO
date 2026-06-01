import React from 'react';
import { Store, Compass } from 'lucide-react';
import ChiliIcon from './ChiliIcon';

export default function Categories({ selectedCategory, onSelectCategory }) {
  const categories = [
    { id: 'all', name: 'Todos los Locales', icon: Compass },
    { id: 'piedra-negra', name: 'Piedra Negra', icon: ChiliIcon },
    { id: 'el-capi', name: 'El Capi', icon: Store },
    { id: 'collage', name: 'Collage', icon: Store },
    { id: 'uide-bakery', name: 'UIDE Bakery', icon: Store }
  ];

  return (
    <div className="w-full py-6 select-none border-b border-brand-border/20">
      <div className="max-w-[95%] xl:max-w-[90%] 2xl:max-w-[1440px] mx-auto px-4 md:px-8">
        
        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1 rounded bg-brand-orange/15 text-brand-orange">
            <Store className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-brand-text uppercase tracking-wider text-left">
            Nuestros Locales en el Campus UIDE
          </h3>
        </div>

        {/* Categories / Restaurant Selector */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-brand-border scroll-smooth">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            const isPiedra = cat.id === 'piedra-negra';

            // Custom active classes for Piedra Negra
            let activeStyle = '';
            if (isActive) {
              if (isPiedra) {
                activeStyle = 'bg-gradient-to-r from-pink-500 to-pink-600 text-white border-transparent shadow-lg shadow-pink-500/15 transform scale-[1.02]';
              } else {
                activeStyle = 'bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow text-white border-transparent shadow-lg shadow-brand-red/15 transform scale-[1.02]';
              }
            } else {
              activeStyle = `bg-brand-card/60 hover:bg-brand-card border-brand-border text-brand-muted hover:text-white ${
                isPiedra ? 'hover:border-pink-500/30' : 'hover:border-brand-orange/30'
              }`;
            }

            const iconClass = isActive 
              ? 'text-white' 
              : isPiedra 
                ? 'text-pink-500' 
                : 'text-brand-orange';

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border transition-all duration-300 whitespace-nowrap ${activeStyle}`}
              >
                <Icon className={`w-4 h-4 ${iconClass}`} />
                <span className="text-xs font-bold tracking-wide uppercase">{cat.name}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
