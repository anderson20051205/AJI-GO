import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from '../../types';

// INTERFAZ PARA ADMINISTRAR LOS DATOS DE CADA FILA DEL CARRITO
interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemoveItem
}: CartItemRowProps) {
  const isPiedraNegra = item.badgeText === 'PN';

  // RETORNO EL CONTENEDOR CON LA INFORMACIÓN DETALLADA DEL PRODUCTO
  // INCLUYE CONTROLADORES DE CANTIDAD Y OPCIÓN PARA ELIMINAR
  return (
    <div className="flex gap-4.5 p-4.5 bg-brand-dark/40 border border-brand-border/50 rounded-2xl relative group">
      {/* CÍRCULO INICIAL DE IDENTIFICACIÓN DE LOCAL COMERCIAL */}
      <div className={`w-13 h-13 rounded-xl bg-brand-dark border flex items-center justify-center font-extrabold text-sm tracking-wider shrink-0 select-none ${isPiedraNegra ? 'text-pink-500 border-pink-500/20' : 'text-brand-orange border-brand-border'
        }`}>
        {item.badgeText}
      </div>

      {/* DETALLES DEL PRODUCTO SELECCIONADO */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex justify-between items-start gap-1">
          <h4 className="text-sm font-bold text-brand-text truncate">{item.name}</h4>
          <span className={`text-sm font-extrabold whitespace-nowrap shrink-0 ${isPiedraNegra ? 'text-pink-500' : 'text-brand-orange'
            }`}>
            S/ {(item.price * item.quantity).toFixed(2)}
          </span>
        </div>

        {/* TAMAÑO DE LA PORCIÓN O BEBIDA */}
        <p className="text-[11px] text-brand-muted mt-1 font-bold">
          Tamaño: {item.size}
        </p>

        {/* EXTRAS AGREGADOS POR EL USUARIO */}
        {item.extras.length > 0 && (
          <p className={`text-[10px] mt-0.5 italic font-medium ${isPiedraNegra ? 'text-pink-400/80' : 'text-brand-orange/80'
            }`}>
            + {item.extras.join(', ')}
          </p>
        )}

        {/* NOTAS ESPECÍFICAS DE PREPARACIÓN */}
        {item.notes && (
          <p className="text-[10px] text-brand-muted/70 bg-brand-dark/60 p-2 rounded-xl mt-2 border border-brand-border/30 truncate">
            Nota: "{item.notes}"
          </p>
        )}

        {/* CONTROLADORES DE CANTIDADES Y ELIMINACIÓN DE ÍTEM */}
        <div className="flex items-center justify-between mt-4 pt-2.5 border-t border-brand-border/30">
          <div className="flex items-center gap-1.5 bg-brand-dark border border-brand-border rounded-xl p-0.5">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="p-1.5 rounded-lg hover:bg-brand-card text-brand-muted hover:text-brand-orange transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center text-xs font-black text-brand-text">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="p-1.5 rounded-lg hover:bg-brand-card text-brand-muted hover:text-brand-orange transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => onRemoveItem(item.id)}
            className="p-2 text-brand-muted hover:text-brand-red rounded-xl hover:bg-brand-red/10 transition-all cursor-pointer"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
