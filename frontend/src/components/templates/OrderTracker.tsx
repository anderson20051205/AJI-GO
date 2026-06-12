import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, CookingPot, Bike, MapPin, Clock, Phone,
  MessageCircle, Sparkles, Receipt, Home, QrCode, Store, FileSpreadsheet
} from 'lucide-react';
import { Order } from '../../types';

// INTERFAZ PARA LAS PROPIEDADES DEL TEMPLATE SEGUIDOR DE PEDIDOS
interface OrderTrackerProps {
  orderDetails: Order | null;
  deliveryAddress: string;
  onBackToMenu: () => void;
  onUpdateStatus: (orderId: string, status: number) => void;
}

export default function OrderTracker({
  orderDetails,
  deliveryAddress,
  onBackToMenu,
  onUpdateStatus
}: OrderTrackerProps) {

  // PASO DE PREPARACIÓN ACTUAL DEL ESTADO DEL PEDIDO
  const currentStep = orderDetails?.status !== undefined ? orderDetails.status : 0;

  // LISTO LAS ETAPAS DEL DELIVERY UIDE
  const steps = [
    { title: 'Pedido Recibido', desc: 'El restaurante ha registrado tu orden.', icon: FileSpreadsheet },
    { title: 'En Preparación', desc: 'Tu pedido se está preparando en las cocinas del campus.', icon: CookingPot },
    { title: 'Despachado / Listo', desc: 'El repartidor va a tu aula o ya puedes retirar en el local.', icon: Bike },
    { title: '¡Entregado!', desc: '¡Buen provecho! Entrega validada mediante código QR.', icon: CheckCircle2 }
  ];

  // SIMULACIÓN AUTOMÁTICA DE 12 SEGUNDOS POR PASO PARA FINES DE DEMOSTRACIÓN
  useEffect(() => {
    if (currentStep >= steps.length - 1) return;

    const timer = setTimeout(() => {
      if (onUpdateStatus && orderDetails?.id) {
        onUpdateStatus(orderDetails.id, currentStep + 1);
      }
    }, 12000);

    return () => clearTimeout(timer);
  }, [currentStep, orderDetails, onUpdateStatus]);

  const handleAdvanceStep = () => {
    if (currentStep < steps.length - 1 && onUpdateStatus && orderDetails?.id) {
      onUpdateStatus(orderDetails.id, currentStep + 1);
    }
  };

  const handleResetStep = () => {
    if (onUpdateStatus && orderDetails?.id) {
      onUpdateStatus(orderDetails.id, 0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 select-none">

      {/* CABECERA DEL RASTREADOR */}
      <div className="text-center mb-10 text-left">
        <span className="text-xs bg-brand-orange/15 text-brand-orange px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-brand-orange/10">
          SEGUIMIENTO DE PEDIDO (UIDE)
        </span>
        <h2 className="text-3xl font-black text-brand-text mt-4">Tu orden en camino</h2>
        <p className="text-xs text-brand-muted mt-2 font-bold">
          Código de seguimiento: <span className="text-brand-orange font-black font-mono">{orderDetails?.id || '#AG-000000'}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* FLUJO DE PASOS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-effect rounded-3xl p-7 md:p-9 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow"></div>

            {/* TIEMPO ESTIMADO */}
            <div className="flex justify-between items-center mb-8 border-b border-brand-border/40 pb-5">
              <div className="flex items-center gap-3.5 text-left">
                <div className="p-3 rounded-xl bg-brand-dark border border-brand-border flex items-center justify-center">
                  <Clock className="w-5.5 h-5.5 text-brand-orange" />
                </div>
                <div>
                  <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Tiempo Estimado</p>
                  <p className="text-sm font-black text-brand-text">Variable (Según demanda)</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Destino</p>
                <p className="text-xs font-black text-brand-text max-w-[200px] truncate">
                  {orderDetails?.deliveryDetails?.method === 'pickup' ? 'Retiro en Local' : deliveryAddress}
                </p>
              </div>
            </div>

            {/* TIMELINE DE PROGRESO */}
            <div className="relative space-y-8 pl-8 md:pl-10 text-left">
              <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-brand-border border-dashed border-l border-brand-border/60"></div>

              <div
                className="absolute left-[15px] top-4 w-[2px] bg-gradient-to-b from-brand-red to-brand-orange transition-all duration-1000"
                style={{ height: `${(currentStep / (steps.length - 1)) * 88}%` }}
              ></div>

              {steps.map((step, idx) => {
                const IconComponent = step.icon;
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;

                return (
                  <div key={idx} className="relative flex gap-4.5 items-start">

                    <div className={`absolute left-[-26px] md:left-[-28px] w-7.5 h-7.5 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-500 ${isActive
                        ? 'bg-gradient-to-br from-brand-red to-brand-orange border-transparent text-white ring-4 ring-brand-orange/15 scale-110 shadow-lg'
                        : isCompleted
                          ? 'bg-brand-red border-transparent text-white shadow-md'
                          : 'bg-brand-dark border-brand-border text-brand-muted'
                      }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <IconComponent className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className={`text-sm font-black transition-colors duration-300 ${isActive ? 'text-brand-orange' : isCompleted ? 'text-brand-text/80' : 'text-brand-muted'
                        }`}>
                        {step.title}
                      </h4>
                      <p className={`text-xs mt-1 transition-colors duration-300 leading-relaxed font-semibold ${isActive ? 'text-brand-text' : 'text-brand-muted/70'
                        }`}>
                        {step.desc}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* PANEL DE SIMULACIÓN PARA EVALUACIÓN */}
            <div className="mt-8 pt-6 border-t border-brand-border/40 flex flex-wrap gap-3.5 justify-between items-center">
              <span className="text-[10px] text-brand-muted font-black tracking-widest uppercase">SIMULACIÓN CLIENTE</span>
              <div className="flex gap-2.5">
                <button
                  onClick={handleResetStep}
                  className="bg-brand-dark hover:bg-brand-card text-[10px] text-brand-muted hover:text-white border border-brand-border px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Reiniciar
                </button>
                <button
                  onClick={handleAdvanceStep}
                  disabled={currentStep === steps.length - 1}
                  className="bg-brand-orange/10 hover:bg-brand-orange/20 text-[10px] text-brand-orange border border-brand-orange/20 px-4 py-2 rounded-xl transition-all disabled:opacity-30 cursor-pointer"
                >
                  Avanzar Estado
                </button>
              </div>
            </div>

          </div>

          {/* TARJETA DE INFORMACIÓN DE ENTREGA */}
          <div className="glass-effect rounded-3xl p-7 md:p-9 shadow-xl text-left border border-brand-border/60 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow"></div>
            <h3 className="text-xs font-black text-brand-text uppercase tracking-wider mb-4.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-orange" />
              Detalles de Entrega (Campus UIDE)
            </h3>
            {orderDetails?.deliveryDetails?.method === 'pickup' ? (
              <div className="space-y-1.5 text-xs font-semibold">
                <p className="text-brand-text font-black flex items-center gap-1.5">
                  <Store className="w-4.5 h-4.5 text-brand-orange" />
                  Retiro en Local
                </p>
                <p className="text-brand-muted leading-relaxed">
                  Tu pedido estará listo para que lo retires directamente en el local de **{orderDetails.restaurant}** en el campus de la UIDE.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4.5 text-xs text-left font-semibold">
                <div>
                  <span className="text-[10px] text-brand-muted block uppercase font-bold tracking-wider mb-1">Edificio / Facultad</span>
                  <span className="text-brand-text font-black">{orderDetails?.deliveryDetails?.faculty || deliveryAddress}</span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-muted block uppercase font-bold tracking-wider mb-1">Piso / Nivel</span>
                  <span className="text-brand-text font-black">{orderDetails?.deliveryDetails?.floor || 'PB'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-muted block uppercase font-bold tracking-wider mb-1">Aula / Oficina</span>
                  <span className="text-brand-text font-black">{orderDetails?.deliveryDetails?.classroom || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-muted block uppercase font-bold tracking-wider mb-1">Indicaciones</span>
                  <span className="text-brand-text font-black block truncate max-w-[130px]">{orderDetails?.deliveryDetails?.notes || 'Ninguna'}</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* QR DE ENTREGA Y REPARTIDOR */}
        <div className="space-y-6">

          {/* CÓDIGO QR PARA VALIDACIÓN */}
          <div className="glass-effect rounded-3xl p-7 shadow-xl text-center border border-brand-border/60 relative overflow-hidden">
            <h3 className="text-xs font-black text-brand-text uppercase tracking-wider mb-4 flex items-center justify-center gap-1.5">
              <QrCode className="w-4.5 h-4.5 text-brand-orange animate-pulse" />
              Código QR de Validación
            </h3>

            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl max-w-[180px] mx-auto shadow-inner border border-brand-border/20">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${orderDetails?.id || 'AG-AJIGO'}`}
                alt="Código QR de Validación"
                className="w-36 h-36 object-contain"
              />
            </div>

            <p className="text-[10px] text-brand-muted mt-4 leading-relaxed font-semibold">
              {orderDetails?.deliveryDetails?.method === 'pickup'
                ? 'Presenta este código QR en el local para retirar tu pedido de forma segura.'
                : 'El repartidor de la UIDE escaneará este código QR al entregarte el pedido en tu aula para validar la transacción.'
              }
            </p>
          </div>

          {/* FICHA DEL REPARTIDOR */}
          {orderDetails?.deliveryDetails?.method === 'delivery' && (
            <div className="glass-effect rounded-3xl p-7 shadow-xl relative overflow-hidden text-left">
              <h3 className="text-xs font-black text-brand-text uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-yellow" />
                Tu Repartidor Asignado
              </h3>

              <div className="flex items-center gap-4.5 mb-5">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-brand-orange to-brand-red text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                  {(orderDetails?.driverName || 'Carlos Mendoza').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-brand-text">{orderDetails?.driverName || 'Carlos Mendoza'}</h4>
                  <p className="text-[10px] text-brand-yellow font-black mt-0.5">
                    {orderDetails?.driverName ? '★ 5.0 Repartidor Activo' : '★ 4.9 Repartidor Pro'}
                  </p>
                  <p className="text-[10px] text-brand-muted mt-1 truncate font-semibold">{orderDetails?.driverVehicle || 'Motocicleta Honda (AJI-990)'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => alert('Llamando al repartidor... (Simulación)')}
                  className="flex items-center justify-center gap-1.5 bg-brand-card hover:bg-brand-dark border border-brand-border text-brand-text py-2 rounded-xl text-xs font-black transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-brand-orange" />
                  Llamar
                </button>
                <button
                  onClick={() => alert('Mensajería con el repartidor en desarrollo... (Simulación)')}
                  className="flex items-center justify-center gap-1.5 bg-brand-card hover:bg-brand-dark border border-brand-border text-brand-text py-2 rounded-xl text-xs font-black transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-brand-orange" />
                  Mensaje
                </button>
              </div>
            </div>
          )}

          {/* FICHA DE FACTURA / RESUMEN DE PAGO */}
          <div className="glass-effect rounded-3xl p-7 shadow-xl text-left relative">
            <h3 className="text-xs font-black text-brand-text uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-brand-orange" />
              Resumen de Compra
            </h3>

            <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
              {orderDetails?.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-brand-muted truncate max-w-[160px]">
                    <span className="font-black text-brand-orange mr-1">{item.quantity}x</span> {item.name}
                  </span>
                  <span className="text-brand-text font-black">S/ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-border/40 mt-4 pt-4 space-y-2.5 text-xs text-brand-muted font-semibold">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>S/ {orderDetails?.subtotal?.toFixed(2) || '0.00'}</span>
              </div>

              {orderDetails && orderDetails.discount > 0 && (
                <div className="flex justify-between text-green-500 font-bold">
                  <span>Descuento</span>
                  <span>- S/ {orderDetails.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Envío</span>
                <span>{orderDetails?.deliveryFee === 0 ? 'Gratis' : `S/ ${orderDetails?.deliveryFee?.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between text-base font-black text-brand-text border-t border-brand-border/40 pt-3.5">
                <span>Total pagado</span>
                <span className="text-brand-orange">S/ {orderDetails?.total?.toFixed(2) || '0.00'}</span>
              </div>

              {orderDetails?.transferReceipt && (
                <div className="border-t border-brand-border/40 mt-4.5 pt-4 space-y-2 text-left">
                  <span className="text-[9px] text-brand-muted block uppercase font-bold tracking-wider">Comprobante de Pago (Transferencia)</span>
                  <div className="rounded-xl overflow-hidden border border-brand-border/40 bg-brand-dark/25 p-2 flex justify-center">
                    <img src={orderDetails.transferReceipt} alt="Comprobante" className="max-h-48 object-contain rounded-lg shadow-sm" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RETORNO AL CAMPUS */}
          <button
            onClick={onBackToMenu}
            className="w-full bg-brand-card hover:bg-brand-dark border border-brand-border hover:border-brand-orange text-brand-text py-4 px-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs transition-all duration-300 cursor-pointer"
          >
            <Home className="w-4.5 h-4.5 text-brand-orange" />
            <span>Volver al Inicio</span>
          </button>

        </div>

      </div>

    </div>
  );
}
