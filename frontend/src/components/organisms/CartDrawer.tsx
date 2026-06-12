import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShoppingBag, Ticket, ArrowRight, ArrowLeft,
  ShieldCheck, MapPin, Store, Navigation, Info, MessageSquare
} from 'lucide-react';
import { CartItem } from '../../types';
import CartItemRow from '../molecules/CartItemRow';
import { UideFaculty } from '../../data/faculties';

// INTERFAZ PARA LAS PROPIEDADES DEL COMPONENTE ORGANISMO DEL CARRITO DE COMPRAS
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (details: any) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  // GESTIÓN DE LAS DOS ETAPAS DEL CHECKOUT: FALSE = VERIFICACIÓN DE CARRITO, TRUE = FORMULARIO DE DETALLES
  const [isCheckoutStage, setIsCheckoutStage] = useState(false);

  // ESTADOS DEL FORMULARIO DE DESPACHO
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedFaculty, setSelectedFaculty] = useState<string>(UideFaculty.CIENCIAS_TECNICAS);
  const [floorLevel, setFloorLevel] = useState('');
  const [classroomOffice, setClassroomOffice] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [transferReceipt, setTransferReceipt] = useState<string | null>(null);

  // ESTADOS DEL CUPÓN DE DESCUENTO
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponSuccess, setCouponSuccess] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
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

  // CÁLCULOS MONETARIOS DEL CARRITO
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const deliveryFee = deliveryMethod === 'delivery' ? 1.50 : 0.00;
  const totalBeforeTax = subtotal - discountAmount + deliveryFee;
  const tax = totalBeforeTax * 0.18; // IVA
  const total = totalBeforeTax;

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return;
    setIsCheckoutStage(true);
  };

  const handleConfirmOrder = () => {
    // VALIDACION PARA QUE SE LLENEN TODOS LOS CAMPOS EXIGIDOS EN CASO DE DELIVERY
    if (deliveryMethod === 'delivery') {
      if (!floorLevel.trim()) {
        alert('Por favor especifica el piso o nivel para la entrega.');
        return;
      }
      if (!classroomOffice.trim()) {
        alert('Por favor indica el número de aula u oficina.');
        return;
      }
      if (!transferReceipt) {
        alert('Por favor sube el comprobante de transferencia bancaria para continuar con el delivery.');
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
      transferReceipt: deliveryMethod === 'delivery' ? (transferReceipt || undefined) : undefined,
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
      {/* FONDO OSCURECIDO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/85 backdrop-filter backdrop-blur-sm"
      ></motion.div>

      {/* PANEL LATERAL DESLIZABLE */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "tween", duration: 0.35 }}
          className="w-screen max-w-lg bg-brand-card border-l border-brand-border shadow-2xl flex flex-col h-full text-brand-text"
        >
          {/* CABECERA DEL CARRITO */}
          <div className="p-6.5 border-b border-brand-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isCheckoutStage ? (
                <button
                  onClick={() => setIsCheckoutStage(false)}
                  className="p-2 rounded-xl hover:bg-brand-dark/80 text-brand-orange border border-brand-border transition-colors mr-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <ShoppingBag className="w-6 h-6 text-brand-orange" />
              )}
              <h2 className="text-xl font-black text-brand-text">
                {isCheckoutStage ? 'Datos del Delivery UIDE' : 'Tu Pedido'}
              </h2>
              {!isCheckoutStage && (
                <span className="bg-brand-orange/15 text-brand-orange text-xs px-3 py-1 rounded-full font-black uppercase tracking-wider">
                  {cartItems.length} {cartItems.length === 1 ? 'Ítem' : 'Ítems'}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-brand-dark/50 hover:bg-brand-dark text-brand-muted hover:text-brand-orange border border-brand-border/40 transition-colors cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* CONTENIDO INTERNO DESLIZABLE */}
          <div className="flex-1 overflow-y-auto p-6.5 text-left">
            <AnimatePresence mode="wait">
              {!isCheckoutStage ? (
                /* LISTA DE PRODUCTOS */
                <motion.div
                  key="stage-cart"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4.5 h-full flex flex-col"
                >
                  <div className="flex-1 space-y-4.5">
                    {cartItems.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-24 space-y-6">
                        <ShoppingBag className="w-20 h-20 text-brand-muted/40 animate-pulse" />
                        <div>
                          <h3 className="text-lg font-black text-brand-text">Tu carrito está vacío</h3>
                          <p className="text-xs text-brand-muted mt-1.5 max-w-[240px] mx-auto font-medium">Selecciona tu local favorito de la UIDE y añade productos para ordenar.</p>
                        </div>
                        <button
                          onClick={onClose}
                          className="bg-brand-dark hover:bg-brand-dark/80 text-brand-orange hover:text-brand-yellow font-black text-xs border border-brand-orange/20 px-6 py-3.5 rounded-full transition-all cursor-pointer"
                        >
                          Explorar Menú
                        </button>
                      </div>
                    ) : (
                      cartItems.map((item) => (
                        <CartItemRow
                          key={item.id}
                          item={item}
                          onUpdateQuantity={onUpdateQuantity}
                          onRemoveItem={onRemoveItem}
                        />
                      ))
                    )}
                  </div>
                </motion.div>
              ) : (
                /* DATOS DE DESPACHO EN EL CAMPUS */
                <motion.div
                  key="stage-checkout"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* ALTERNAR ENTRE DELIVERY Y RETIRO */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-brand-text uppercase tracking-wider block">Método de Entrega</label>
                    <div className="grid grid-cols-2 gap-3.5">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('delivery')}
                        className={`flex flex-col items-center justify-center p-4.5 rounded-2xl border text-center transition-all duration-200 gap-1.5 cursor-pointer ${deliveryMethod === 'delivery'
                            ? 'bg-brand-orange/10 border-brand-orange text-brand-orange shadow-md font-bold'
                            : 'bg-brand-dark/60 border-brand-border text-brand-muted hover:text-brand-text'
                          }`}
                      >
                        <Navigation className="w-5 h-5" />
                        <span className="text-xs font-bold">Delivery UIDE</span>
                        <span className="text-[10px] opacity-85 font-medium">+ S/ 1.50 costo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('pickup')}
                        className={`flex flex-col items-center justify-center p-4.5 rounded-2xl border text-center transition-all duration-200 gap-1.5 cursor-pointer ${deliveryMethod === 'pickup'
                            ? 'bg-brand-orange/10 border-brand-orange text-brand-orange shadow-md font-bold'
                            : 'bg-brand-dark/60 border-brand-border text-brand-muted hover:text-brand-text'
                          }`}
                      >
                        <Store className="w-5 h-5" />
                        <span className="text-xs font-bold">Retiro en Local</span>
                        <span className="text-[10px] opacity-85 font-medium">Gratis</span>
                      </button>
                    </div>
                  </div>

                  {deliveryMethod === 'delivery' ? (
                    /* CAMPOS EXCLUSIVOS PARA DELIVERY UIDE */
                    <div className="space-y-4.5">

                      {/* SELECCIÓN DE FACULTAD */}
                      <div className="space-y-2">
                        <label className="text-xs font-black text-brand-text uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-4.5 h-4.5 text-brand-orange" />
                          Facultad o Edificio
                        </label>
                        <select
                          value={selectedFaculty}
                          onChange={(e) => setSelectedFaculty(e.target.value)}
                          className="w-full bg-brand-dark border border-brand-border rounded-xl p-3.5 text-xs text-brand-text focus:outline-none focus:border-brand-orange font-bold"
                        >
                          {Object.values(UideFaculty).map((faculty) => (
                            <option key={faculty} value={faculty}>
                              {faculty}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* DETALLES DE PISO Y AULA */}
                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-brand-text uppercase tracking-wider block">Piso / Nivel</label>
                          <input
                            type="text"
                            placeholder="Ej. Piso 2, PB"
                            value={floorLevel}
                            onChange={(e) => setFloorLevel(e.target.value)}
                            className="w-full bg-brand-dark border border-brand-border rounded-xl p-3.5 text-xs text-brand-text focus:outline-none focus:border-brand-orange"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-brand-text uppercase tracking-wider block">Aula / Oficina</label>
                          <input
                            type="text"
                            placeholder="Ej. Aula 304, Lab"
                            value={classroomOffice}
                            onChange={(e) => setClassroomOffice(e.target.value)}
                            className="w-full bg-brand-dark border border-brand-border rounded-xl p-3.5 text-xs text-brand-text focus:outline-none focus:border-brand-orange"
                          />
                        </div>
                      </div>

                      {/* INDICACIONES EXTRA */}
                      <div className="space-y-2">
                        <label className="text-xs font-black text-brand-text uppercase tracking-wider flex items-center gap-1.5">
                          <MessageSquare className="w-4.5 h-4.5 text-brand-orange" />
                          Indicaciones de Entrega
                        </label>
                        <textarea
                          placeholder="Ej. Dejar en consejería de la facultad, entregar en mano..."
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          rows={2}
                          className="w-full bg-brand-dark/50 border border-brand-border rounded-xl p-3.5 text-xs text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-orange"
                        ></textarea>
                      </div>

                      {/* COMPROBANTE DE TRANSFERENCIA (SOLO PARA DELIVERY) */}
                      <div className="space-y-2">
                        <label className="text-xs font-black text-brand-text uppercase tracking-wider block">
                          Comprobante de Transferencia (Obligatorio)
                        </label>
                        <div className="border-2 border-dashed border-brand-border rounded-2xl p-4 bg-brand-dark/30 hover:bg-brand-dark/50 transition-colors flex flex-col items-center justify-center cursor-pointer relative min-h-[100px]">
                          {transferReceipt ? (
                            <div className="relative w-full flex flex-col items-center gap-2">
                              <img src={transferReceipt} alt="Comprobante de Pago" className="max-h-32 rounded-lg object-contain border border-brand-border" />
                              <button
                                type="button"
                                onClick={() => setTransferReceipt(null)}
                                className="absolute -top-2 -right-2 bg-brand-red text-white p-1 rounded-full hover:bg-brand-red/90 flex items-center justify-center cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <span className="text-[10px] text-brand-muted truncate max-w-full">Comprobante cargado correctamente</span>
                            </div>
                          ) : (
                            <label className="w-full flex flex-col items-center justify-center gap-2 py-2 cursor-pointer">
                              <svg className="w-8 h-8 text-brand-orange animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <span className="text-xs font-bold text-brand-muted hover:text-brand-orange transition-colors">Subir Comprobante</span>
                              <span className="text-[9px] text-brand-muted/70">Formatos: PNG, JPG, JPEG</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setTransferReceipt(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>

                    </div>
                  ) : (
                    /* MENSAJE INFORMATIVO PARA RETIRO */
                    <div className="p-4.5 bg-brand-dark/40 border border-brand-border/60 rounded-2xl flex gap-3.5 text-left">
                      <Info className="w-5.5 h-5.5 text-brand-orange shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-black text-brand-text">Retiro Directo</p>
                        <p className="text-[11px] text-brand-muted leading-relaxed font-semibold">
                          Tu pedido estará listo para retirar en el local correspondiente ubicado dentro del campus de la UIDE. Te enviaremos una notificación cuando esté preparado.
                        </p>
                      </div>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CALCULOS MONETARIOS Y BOTÓN ACCIONADOR */}
          {cartItems.length > 0 && (
            <div className="p-6.5 border-t border-brand-border bg-brand-dark/50 space-y-4.5">

              {/* FORMULARIO DE CUPONES DE DESCUENTO */}
              {!isCheckoutStage && (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brand-muted" />
                    <input
                      type="text"
                      placeholder="Código de cupón (AJIGO20)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-border rounded-xl py-3.5 pl-10 pr-3.5 text-xs text-brand-text placeholder-brand-muted/40 uppercase focus:outline-none focus:border-brand-orange font-bold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-brand-card hover:bg-brand-dark text-brand-text border border-brand-border hover:border-brand-orange/40 text-xs font-black px-4.5 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Aplicar
                  </button>
                </form>
              )}

              {couponError && <p className="text-[11px] text-brand-red text-left font-bold">{couponError}</p>}
              {couponSuccess && (
                <div className="flex items-center gap-1.5 text-[11px] text-green-500 text-left font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{couponSuccess}</span>
                </div>
              )}

              {/* DETALLES DE CÁLCULO */}
              <div className="space-y-2.5 text-xs border-t border-brand-border/40 pt-4.5 text-brand-muted font-semibold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-brand-text font-black">S/ {subtotal.toFixed(2)}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-500 font-bold">
                    <span>Descuento ({discountPercent}%)</span>
                    <span>- S/ {discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Costo de envío (UIDE Campus)</span>
                  <span className="text-brand-text font-black">
                    {deliveryFee === 0 ? (
                      <span className="text-green-500 font-extrabold uppercase text-[10px] tracking-wider bg-green-500/10 px-2.5 py-1 rounded border border-green-500/15">Gratis (Retiro)</span>
                    ) : (
                      `S/ ${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[10px] opacity-75 font-medium">
                  <span>IGV (18% incluido)</span>
                  <span>S/ {tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-lg font-black text-brand-text border-t border-brand-border/40 pt-3.5 mt-1.5">
                  <span>Total a pagar</span>
                  <span className="text-brand-orange">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* ACCIONES DE FORMULARIO */}
              {!isCheckoutStage ? (
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow hover:opacity-95 text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-red/10 transition duration-300 cursor-pointer"
                >
                  <span>Proceder al Pago</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleConfirmOrder}
                  className="w-full bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow hover:opacity-95 text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-red/10 transition duration-300 cursor-pointer"
                >
                  <span>Confirmar Pedido</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}

            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
