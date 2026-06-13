import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Minus, MessageSquare, ShoppingBag } from 'lucide-react';
import { Dish, CartItem } from '../../types';

// INTERFAZ PARA DEFINIR LAS PROPIEDADES DEL MODAL DE PERSONALIZACIÓN
interface FoodItemModalProps {
  item: Dish;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export default function FoodItemModal({
  item,
  onClose,
  onAddToCart
}: FoodItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('standard');
  const [extras, setExtras] = useState<Record<string, boolean>>({});
  const [specialNotes, setSpecialNotes] = useState('');
  const [totalPrice, setTotalPrice] = useState(item.price);

  // DEFINO LAS OPCIONES DE TAMAÑO DISPONIBLES EN EL PRODUCTO O POR DEFECTO
  const sizeOptions = item.sizes && item.sizes.length > 0
    ? item.sizes.map((s, idx) => ({ id: `sz-${idx}`, name: s.name, priceAdd: s.priceAdd }))
    : [{ id: 'standard', name: 'Estándar', priceAdd: 0 }];

  // EXTRAS EXCLUSIVOS DEL PRODUCTO O NINGUNO SI NO TIENE
  const extraOptions = item.extras && item.extras.length > 0
    ? item.extras.map((e, idx) => ({ id: `ex-${idx}`, name: e.name, price: e.price }))
    : [];

  // Resetear el estado al abrir o cambiar de producto
  useEffect(() => {
    setQuantity(1);
    if (sizeOptions.length > 0) {
      setSelectedSize(sizeOptions[0].id);
    } else {
      setSelectedSize('standard');
    }
    
    const initialExtras: Record<string, boolean> = {};
    extraOptions.forEach(opt => {
      initialExtras[opt.id] = false;
    });
    setExtras(initialExtras);
    setSpecialNotes('');
    setTotalPrice(item.price);
  }, [item]);

  //ACTUALIZO EL PRECIO TOTAL CADA VEZ QUE CAMBIA LA CANTIDAD, TAMAÑO O EXTRAS
  useEffect(() => {
    let base = item.price;

    const sizeObj = sizeOptions.find(s => s.id === selectedSize);
    if (sizeObj) base += sizeObj.priceAdd;

    extraOptions.forEach(opt => {
      if (extras[opt.id]) {
        base += opt.price;
      }
    });

    setTotalPrice(base * quantity);
  }, [quantity, selectedSize, extras, item.price, selectedSize, item.sizes, item.extras]);

  const handleToggleExtra = (id: string) => {
    setExtras(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = () => {
    const chosenExtras = extraOptions
      .filter(opt => extras[opt.id])
      .map(opt => opt.name);

    const sizeName = sizeOptions.find(s => s.id === selectedSize)?.name || 'Estándar';

    //IDENTIFICADOR DEL CARRITO
    const cartItem: CartItem = {
      id: `${item.id}-${selectedSize}-${Object.keys(extras).filter(k => extras[k]).join('-')}-${Date.now()}`,
      baseId: item.id,
      name: item.name,
      restaurant: item.restaurant,
      badgeText: item.badgeText,
      price: totalPrice / quantity,
      quantity,
      size: sizeName,
      extras: chosenExtras,
      notes: specialNotes
    };

    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* FONDO DIFUMINADO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/80 backdrop-filter backdrop-blur-md"
      ></motion.div>

      {/* TARJETA DEL MODAL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-xl bg-brand-card border border-brand-border rounded-3xl overflow-hidden shadow-2xl relative z-10 max-h-[90vh] flex flex-col"
      >
        {/* ENCABEZADO Y AVATAR DE SIGLAS DEL LOCAL */}
        <div className="relative h-48 bg-gradient-to-tr from-brand-card via-brand-dark to-brand-border flex items-center justify-center border-b border-brand-border/60 overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-brand-dark/60 hover:bg-brand-dark text-brand-muted hover:text-brand-orange border border-brand-border/40 transition-colors z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {item.imageSrc ? (
            <img
              src={item.imageSrc}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="w-22 h-22 rounded-3xl bg-brand-dark border border-brand-border flex items-center justify-center font-black text-brand-orange text-3xl tracking-widest shadow-2xl select-none">
              {item.badgeText}
            </div>
          )}
        </div>

        {/* CONTENIDO DE PERSONALIZACIÓN */}
        <div className="p-7 md:p-9 overflow-y-auto space-y-6 flex-1 text-left">

          {/* TÍTULO Y DESCRIPCIÓN DEL PLATO */}
          <div>
            <span className="text-xs text-brand-orange font-black uppercase tracking-widest block mb-1">
              {item.restaurant}
            </span>
            <h2 className="text-2xl font-black text-brand-text">{item.name}</h2>
            <p className="text-xs text-brand-muted mt-2 leading-relaxed font-semibold">{item.description}</p>
          </div>

          {/* SELECCIONAR TAMAÑO */}
          {sizeOptions.length > 1 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-brand-text uppercase tracking-wider">Elige el Tamaño</h4>
              <div className="grid grid-cols-3 gap-3.5">
                {sizeOptions.map((sz) => (
                  <button
                    key={sz.id}
                    onClick={() => setSelectedSize(sz.id)}
                    className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${selectedSize === sz.id
                        ? 'bg-brand-orange/10 border-brand-orange text-brand-orange shadow-md'
                        : 'bg-brand-dark/50 border-brand-border text-brand-muted hover:text-brand-text'
                      }`}
                  >
                    <span className="text-xs font-bold">{sz.name}</span>
                    <span className="text-[10px] font-semibold">
                      {sz.priceAdd === 0 ? 'Sin recargo' : `+ S/ ${sz.priceAdd.toFixed(2)}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SELECCIONAR EXTRAS */}
          {extraOptions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-brand-text uppercase tracking-wider">Agregar Extras</h4>
              <div className="space-y-2">
                {extraOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => handleToggleExtra(opt.id)}
                    className={`flex justify-between items-center p-3.5 rounded-2xl border cursor-pointer select-none transition-all ${extras[opt.id]
                        ? 'bg-brand-orange/5 border-brand-orange/50 text-brand-text font-bold'
                        : 'bg-brand-dark/30 border-brand-border text-brand-muted hover:text-brand-text'
                      }`}
                  >
                    <span className="text-xs font-bold">{opt.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-black text-brand-orange">+ S/ {opt.price.toFixed(2)}</span>
                      <input
                        type="checkbox"
                        checked={extras[opt.id]}
                        onChange={() => { }} // DETECTADO POR EL CONTENEDOR DIV CLICKEABLE
                        className="w-4.5 h-4.5 accent-brand-orange rounded border-brand-border bg-brand-dark pointer-events-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INSTRUCCIONES ADICIONALES */}
          <div className="space-y-2">
            <label className="text-xs font-black text-brand-text uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-orange" />
              Instrucciones Especiales
            </label>
            <textarea
              placeholder="Ej. Quitar cebolla, aderezo aparte, bien caliente..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              rows={2}
              className="w-full bg-brand-dark/50 border border-brand-border rounded-2xl p-3.5 text-xs text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-orange"
            ></textarea>
          </div>

        </div>

        {/* PIE DE MODAL: SELECTOR DE CANTIDAD Y ENVÍO */}
        <div className="p-6.5 md:px-8 bg-brand-dark border-t border-brand-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 bg-brand-card border border-brand-border rounded-xl p-1 shrink-0">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="p-2 rounded-lg hover:bg-brand-dark text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-black text-brand-text">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="p-2 rounded-lg hover:bg-brand-dark text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow hover:opacity-95 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-between shadow-lg shadow-brand-red/10 transition duration-300 cursor-pointer"
          >
            <span className="text-xs tracking-wider uppercase font-black flex items-center gap-2">
              <ShoppingBag className="w-4.5 h-4.5" />
              Añadir al pedido
            </span>
            <span className="text-sm font-black">
              S/ {totalPrice.toFixed(2)}
            </span>
          </button>
        </div>

      </motion.div>
    </div>
  );
}
