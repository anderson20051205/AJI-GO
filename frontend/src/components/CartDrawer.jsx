import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Minus, Trash2, ShoppingBag, Ticket, 
  ArrowRight, ArrowLeft, ShieldCheck, MapPin, 
  Store, Navigation, Info, MessageSquare 
} from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}) {
  // Checkout Stages: false = Cart Review, true = UIDE Delivery Details Form
  const [isCheckoutStage, setIsCheckoutStage] = useState(false);
  
  // Checkout Form States
  const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // 'delivery' or 'pickup'
  const [selectedFaculty, setSelectedFaculty] = useState('Facultad de Ciencias Técnicas');
  const [floorLevel, setFloorLevel] = useState('');
  const [classroomOffice, setClassroomOffice] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponSuccess, setCouponSuccess] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'AJIGO20') {
      setDiscountPercent(20);
      setCouponSuccess('¡Cupón AJIGO20 aplicado! Obtuviste 20% de descuento.');
      setCouponError('');
    } else {
      setCouponError('Código de cupón inválido. Intenta con "AJIGO20"');
      setDiscountPercent(0);
      setCouponSuccess('');
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  
  // S/ 1.50 dynamic campus delivery fee, S/ 0 for takeaway
  const deliveryFee = deliveryMethod === 'delivery' ? 1.50 : 0.00;
  
  const totalBeforeTax = subtotal - discountAmount + deliveryFee;
  const tax = totalBeforeTax * 0.18; // 18% IGV included in total
  const total = totalBeforeTax;

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return;
    
    // Move to stage 2
    setIsCheckoutStage(true);
  };

  const handleConfirmOrder = () => {
    // Basic validation for delivery details
    if (deliveryMethod === 'delivery') {
      if (!floorLevel.trim()) {
        alert('Por favor especifica el piso o nivel para la entrega.');
        return;
      }
      if (!classroomOffice.trim()) {
        alert('Por favor indica el número de aula u oficina.');
        return;
      }
    }

    onCheckout({
      items: cartItems,
      subtotal,
      deliveryFee,
      discount: discountAmount,
      tax,
      total,
      coupon: discountPercent > 0 ? 'AJIGO20' : null,
      deliveryDetails: {
        method: deliveryMethod,
        faculty: selectedFaculty,
        floor: floorLevel,
        classroom: classroomOffice,
        notes: deliveryNotes
      }
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/85 backdrop-filter backdrop-blur-sm"
      ></motion.div>

      {/* Cart Container Slide Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "tween", duration: 0.35 }}
          className="w-screen max-w-md bg-brand-card border-l border-brand-border shadow-2xl flex flex-col h-full text-brand-text"
        >
          {/* Header */}
          <div className="p-6 border-b border-brand-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isCheckoutStage ? (
                <button 
                  onClick={() => setIsCheckoutStage(false)}
                  className="p-1.5 rounded-lg hover:bg-brand-dark/80 text-brand-orange border border-transparent hover:border-brand-border transition-colors mr-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <ShoppingBag className="w-5 h-5 text-brand-orange" />
              )}
              <h2 className="text-lg font-bold text-brand-text">
                {isCheckoutStage ? 'Datos del Delivery UIDE' : 'Tu Pedido'}
              </h2>
              {!isCheckoutStage && (
                <span className="bg-brand-orange/15 text-brand-orange text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                  {cartItems.length} {cartItems.length === 1 ? 'Ítem' : 'Ítems'}
                </span>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-brand-dark/50 hover:bg-brand-dark text-brand-muted hover:text-brand-orange border border-brand-border/40 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 text-left">
            <AnimatePresence mode="wait">
              {!isCheckoutStage ? (
                /* STAGE 1: Cart Items List */
                <motion.div
                  key="stage-cart"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 h-full flex flex-col"
                >
                  <div className="flex-1 space-y-4">
                    {cartItems.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-4">
                        <ShoppingBag className="w-16 h-16 text-brand-muted/40 animate-pulse-slow" />
                        <div>
                          <h3 className="text-base font-bold text-brand-text">Tu carrito está vacío</h3>
                          <p className="text-xs text-brand-muted mt-1 max-w-[220px] mx-auto">Selecciona tu local favorito de la UIDE y añade productos para ordenar.</p>
                        </div>
                        <button 
                          onClick={onClose}
                          className="bg-brand-dark hover:bg-brand-dark/80 text-brand-orange hover:text-brand-yellow font-bold text-xs border border-brand-orange/20 px-5 py-2.5 rounded-full transition-all"
                        >
                          Explorar Menú
                        </button>
                      </div>
                    ) : (
                      cartItems.map((item) => (
                        <div 
                          key={item.id}
                          className="flex gap-4 p-4 bg-brand-dark/40 border border-brand-border/50 rounded-2xl relative group"
                        >
                          {/* Typographic Avatar */}
                          <div className={`w-12 h-12 rounded-xl bg-brand-dark border flex items-center justify-center font-extrabold text-sm tracking-wider shrink-0 select-none ${
                            item.badgeText === 'PN' ? 'text-pink-500 border-pink-500/20' : 'text-brand-orange border-brand-border'
                          }`}>
                            {item.badgeText}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="text-xs font-bold text-brand-text truncate">{item.name}</h4>
                              <span className={`text-xs font-bold whitespace-nowrap shrink-0 ${
                                item.badgeText === 'PN' ? 'text-pink-500' : 'text-brand-orange'
                              }`}>
                                S/ {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                            
                            <p className="text-[10px] text-brand-muted mt-1 font-medium">
                              Tamaño: {item.size}
                            </p>
                            
                            {item.extras.length > 0 && (
                              <p className={`text-[9px] mt-0.5 italic ${
                                item.badgeText === 'PN' ? 'text-pink-400/80' : 'text-brand-orange/80'
                              }`}>
                                + {item.extras.join(', ')}
                              </p>
                            )}

                            {item.notes && (
                              <p className="text-[9px] text-brand-muted/70 bg-brand-dark/60 p-1.5 rounded mt-1.5 border border-brand-border/30 truncate">
                                Nota: "{item.notes}"
                              </p>
                            )}

                            {/* Quantity Controller & Delete */}
                            <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-brand-border/30">
                              <div className="flex items-center gap-1 bg-brand-dark border border-brand-border rounded-lg p-0.5">
                                <button 
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  className="p-1 rounded hover:bg-brand-card text-brand-muted hover:text-brand-orange transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-bold text-brand-text">{item.quantity}</span>
                                <button 
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 rounded hover:bg-brand-card text-brand-muted hover:text-brand-orange transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <button 
                                onClick={() => onRemoveItem(item.id)}
                                  className="p-1.5 text-brand-muted hover:text-brand-red rounded-lg hover:bg-brand-red/10 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              ) : (
                /* STAGE 2: UIDE Delivery Details Form */
                <motion.div
                  key="stage-checkout"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Delivery / Pickup Tabs */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-brand-text uppercase tracking-wider block">Método de Entrega</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('delivery')}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-200 gap-1.5 ${
                          deliveryMethod === 'delivery'
                            ? 'bg-brand-orange/10 border-brand-orange text-brand-orange shadow-md shadow-brand-orange/5'
                            : 'bg-brand-dark/60 border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-border/80'
                        }`}
                      >
                        <Navigation className="w-4 h-4" />
                        <span className="text-xs font-bold">Delivery UIDE</span>
                        <span className="text-[9px] opacity-80">+ S/ 1.50 costo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('pickup')}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-200 gap-1.5 ${
                          deliveryMethod === 'pickup'
                            ? 'bg-brand-orange/10 border-brand-orange text-brand-orange shadow-md shadow-brand-orange/5'
                            : 'bg-brand-dark/60 border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-border/80'
                        }`}
                      >
                        <Store className="w-4 h-4" />
                        <span className="text-xs font-bold">Retiro en Local</span>
                        <span className="text-[9px] opacity-80">Gratis</span>
                      </button>
                    </div>
                  </div>

                  {deliveryMethod === 'delivery' ? (
                    /* Delivery UIDE Fields */
                    <div className="space-y-4">
                      
                      {/* Faculty Dropdown */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-brand-text uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                          Facultad o Edificio
                        </label>
                        <select
                           value={selectedFaculty}
                           onChange={(e) => setSelectedFaculty(e.target.value)}
                           className="w-full bg-brand-dark border border-brand-border rounded-xl p-3 text-xs text-brand-text focus:outline-none focus:border-brand-orange"
                        >
                          <option value="Facultad de Ciencias Técnicas">Facultad de Ciencias Técnicas</option>
                          <option value="Facultad de Medicina">Facultad de Medicina</option>
                          <option value="Facultad Administrativa">Facultad Administrativa</option>
                          <option value="Edificio de Aulas">Edificio de Aulas</option>
                        </select>
                      </div>

                      {/* Floor and Classroom Inputs */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-extrabold text-brand-text uppercase tracking-wider block">Piso / Nivel</label>
                          <input
                            type="text"
                            placeholder="Ej. Piso 2, PB"
                            value={floorLevel}
                            onChange={(e) => setFloorLevel(e.target.value)}
                            className="w-full bg-brand-dark border border-brand-border rounded-xl p-3 text-xs text-brand-text focus:outline-none focus:border-brand-orange"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-extrabold text-brand-text uppercase tracking-wider block">Aula / Oficina</label>
                          <input
                            type="text"
                            placeholder="Ej. Aula 304, Lab"
                            value={classroomOffice}
                            onChange={(e) => setClassroomOffice(e.target.value)}
                            className="w-full bg-brand-dark border border-brand-border rounded-xl p-3 text-xs text-brand-text focus:outline-none focus:border-brand-orange"
                          />
                        </div>
                      </div>

                      {/* Additional Delivery Notes */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-brand-text uppercase tracking-wider flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-brand-orange" />
                          Indicaciones de Entrega
                        </label>
                        <textarea
                          placeholder="Ej. Dejar en consejería de la facultad, entregar en mano..."
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          rows="2"
                          className="w-full bg-brand-dark/50 border border-brand-border rounded-xl p-3 text-xs text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-orange"
                        ></textarea>
                      </div>

                    </div>
                  ) : (
                    /* Takeaway Pick Up Notes */
                    <div className="p-4 bg-brand-dark/40 border border-brand-border/60 rounded-2xl flex gap-3 text-left">
                      <Info className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-brand-text">Retiro Directo</p>
                        <p className="text-[11px] text-brand-muted leading-relaxed">
                          Tu pedido estará listo para retirar en el local correspondiente ubicado dentro del campus de la UIDE. Te enviaremos una notificación cuando esté preparado.
                        </p>
                      </div>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pricing calculations & Footer Buttons */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-brand-border bg-brand-dark/50 space-y-4">
              
              {/* Promo Coupon Form (Only shown in Stage 1) */}
              {!isCheckoutStage && (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                    <input
                      type="text"
                      placeholder="Código de cupón (AJIGO20)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-border rounded-xl py-2 pl-9 pr-3 text-xs text-brand-text placeholder-brand-muted/40 uppercase focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-brand-card hover:bg-brand-dark text-brand-text border border-brand-border hover:border-brand-orange/40 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    Aplicar
                  </button>
                </form>
              )}

              {/* Coupon messages */}
              {!isCheckoutStage && couponError && <p className="text-[10px] text-brand-red text-left font-medium">{couponError}</p>}
              {!isCheckoutStage && couponSuccess && (
                <div className="flex items-center gap-1 text-[10px] text-green-500 text-left font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>{couponSuccess}</span>
                </div>
              )}

              {/* Price Calculations */}
              <div className="space-y-2 text-xs border-t border-brand-border/40 pt-4 text-brand-muted">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-brand-text font-semibold">S/ {subtotal.toFixed(2)}</span>
                </div>
                
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Descuento ({discountPercent}%)</span>
                    <span className="font-semibold">- S/ {discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Costo de envío (UIDE Campus)</span>
                  <span className="text-brand-text font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-green-500 font-extrabold uppercase text-[10px] tracking-wider bg-green-500/10 px-2 py-0.5 rounded border border-green-500/15">Gratis (Retiro)</span>
                    ) : (
                      `S/ ${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[10px] opacity-75">
                  <span>IGV (18% incluido)</span>
                  <span>S/ {tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-brand-text border-t border-brand-border/40 pt-3 mt-1">
                  <span>Total a pagar</span>
                  <span className="text-brand-orange">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Button */}
              {!isCheckoutStage ? (
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow hover:opacity-95 text-white font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-red/10 transition duration-300"
                >
                  <span>Proceder al Pago</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleConfirmOrder}
                  className="w-full bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow hover:opacity-95 text-white font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-red/10 transition duration-300"
                >
                  <span>Confirmar Pedido</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
