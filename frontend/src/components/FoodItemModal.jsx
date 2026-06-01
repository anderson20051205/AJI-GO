import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Minus, MessageSquare, AlertCircle, ShoppingBag } from 'lucide-react';

export default function FoodItemModal({ item, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('standard');
  const [extras, setExtras] = useState({
    cheese: false,
    bacon: false,
    spicySauce: false
  });
  const [specialNotes, setSpecialNotes] = useState('');
  const [totalPrice, setTotalPrice] = useState(item.price);

  const sizeOptions = [
    { id: 'standard', name: 'Estándar', priceAdd: 0 },
    { id: 'familiar', name: 'Familiar', priceAdd: 12.00 },
    { id: 'gigante', name: 'Tamaño AJI GO', priceAdd: 22.00 }
  ];

  const extraOptions = [
    { id: 'cheese', name: 'Queso Extra', price: 3.50 },
    { id: 'bacon', name: 'Tocino Ahumado', price: 4.90 },
    { id: 'spicySauce', name: 'Doble Crema de Rocoto', price: 1.50 }
  ];

  // Calculate pricing whenever quantity, size, or extras change
  useEffect(() => {
    let base = item.price;
    
    // Add size pricing
    const sizeObj = sizeOptions.find(s => s.id === selectedSize);
    if (sizeObj) base += sizeObj.priceAdd;

    // Add extras pricing
    extraOptions.forEach(opt => {
      if (extras[opt.id]) {
        base += opt.price;
      }
    });

    setTotalPrice(base * quantity);
  }, [quantity, selectedSize, extras, item.price]);

  const handleToggleExtra = (id) => {
    setExtras(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = () => {
    // Generate selected extras text
    const chosenExtras = extraOptions
      .filter(opt => extras[opt.id])
      .map(opt => opt.name);

    const sizeName = sizeOptions.find(s => s.id === selectedSize).name;

    const cartItem = {
      id: `${item.id}-${selectedSize}-${Object.keys(extras).filter(k => extras[k]).join('-')}-${Date.now()}`, // unique cart key
      baseId: item.id,
      name: item.name,
      restaurant: item.restaurant,
      badgeText: item.badgeText,
      price: totalPrice / quantity, // price per item with configurations
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
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/80 backdrop-filter backdrop-blur-md"
      ></motion.div>

      {/* Modal Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-xl bg-brand-card border border-brand-border rounded-3xl overflow-hidden shadow-2xl relative z-10 max-h-[90vh] flex flex-col"
      >
        {/* Top Header & Visual Avatar */}
        <div className="relative h-44 bg-gradient-to-tr from-brand-card via-brand-dark to-brand-border flex items-center justify-center border-b border-brand-border/60">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-brand-dark/60 hover:bg-brand-dark text-brand-muted hover:text-white border border-brand-border/40 transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="w-20 h-20 rounded-3xl bg-brand-dark border border-brand-border flex items-center justify-center font-black text-brand-orange text-3xl tracking-widest shadow-2xl select-none">
            {item.badgeText}
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-left">
          
          {/* Header Title */}
          <div>
            <span className="text-xs text-brand-orange font-bold uppercase tracking-widest block mb-1">
              {item.restaurant}
            </span>
            <h2 className="text-2xl font-extrabold text-white">{item.name}</h2>
            <p className="text-xs text-brand-muted mt-2 leading-relaxed">{item.description}</p>
          </div>

          {/* Size Options */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Elige el Tamaño</h4>
            <div className="grid grid-cols-3 gap-3">
              {sizeOptions.map((sz) => (
                <button
                  key={sz.id}
                  onClick={() => setSelectedSize(sz.id)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedSize === sz.id
                      ? 'bg-brand-orange/10 border-brand-orange text-brand-orange'
                      : 'bg-brand-dark/50 border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-border/80'
                  }`}
                >
                  <span className="text-xs font-bold">{sz.name}</span>
                  <span className="text-[10px]">
                    {sz.priceAdd === 0 ? 'Sin recargo' : `+ S/ ${sz.priceAdd.toFixed(2)}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Extra Ingredients */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Agregar Extras</h4>
            <div className="space-y-2">
              {extraOptions.map((opt) => (
                <div 
                  key={opt.id}
                  onClick={() => handleToggleExtra(opt.id)}
                  className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer select-none transition-all ${
                    extras[opt.id]
                      ? 'bg-brand-orange/5 border-brand-orange/50 text-white'
                      : 'bg-brand-dark/30 border-brand-border text-brand-muted hover:text-brand-text'
                  }`}
                >
                  <span className="text-xs font-medium">{opt.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-brand-orange">+ S/ {opt.price.toFixed(2)}</span>
                    <input 
                      type="checkbox"
                      checked={extras[opt.id]}
                      onChange={() => {}} // Handled by div onClick
                      className="w-4 h-4 accent-brand-orange rounded border-brand-border bg-brand-dark pointer-events-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cooking Instructions */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-brand-orange" />
              Instrucciones Especiales
            </label>
            <textarea
              placeholder="Ej. Quitar cebolla, aderezo aparte, bien caliente..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              rows="2"
              className="w-full bg-brand-dark/50 border border-brand-border rounded-2xl p-3 text-xs text-white placeholder-brand-muted/40 focus:outline-none focus:border-brand-orange"
            ></textarea>
          </div>

        </div>

        {/* Footer Checkout Info */}
        <div className="p-6 md:px-8 bg-brand-dark border-t border-brand-border flex items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-1 bg-brand-card border border-brand-border rounded-xl p-1 shrink-0">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="p-2 rounded-lg hover:bg-brand-dark text-brand-muted hover:text-white transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-white">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)}
              className="p-2 rounded-lg hover:bg-brand-dark text-brand-muted hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow hover:opacity-95 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-between shadow-lg shadow-brand-red/10 transition duration-300"
          >
            <span className="text-xs tracking-wider uppercase font-extrabold flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Añadir al pedido
            </span>
            <span className="text-sm font-extrabold">
              S/ {totalPrice.toFixed(2)}
            </span>
          </button>
        </div>

      </motion.div>
    </div>
  );
}
