import React from 'react';
import { motion } from 'framer-motion';
import { X, Mail, MapPin, Award, Calendar, BadgeCheck, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import ChiliIcon from './ChiliIcon';

export default function UserProfileModal({ isOpen, onClose, user, orders, currentAddress, onViewOrderTracking }) {
  if (!isOpen) return null;

  // Calculate stats
  const totalOrders = orders ? orders.length : 0;
  const ajiGoPoints = totalOrders * 15; // 15 points per order

  const getStatusLabel = (status) => {
    switch (status) {
      case 0: return { text: 'Recibido', color: 'text-blue-600 bg-blue-50 border-blue-100' };
      case 1: return { text: 'En Preparación', color: 'text-amber-600 bg-amber-50 border-amber-100' };
      case 2: return { text: 'Listo / En Camino', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
      case 3: return { text: 'Entregado', color: 'text-green-600 bg-green-50 border-green-100' };
      default: return { text: 'Pendiente', color: 'text-slate-600 bg-slate-50 border-slate-100' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative bg-white border border-brand-border rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl z-10 text-brand-text text-left flex flex-col max-h-[90vh] md:max-h-[85vh]"
      >
        {/* Top Decorative Line */}
        <div className="h-2 w-full bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow shrink-0"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-muted hover:text-brand-text transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Main Content Area - Scrollable */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">

          {/* Header Visuals */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-brand-border/60 pb-6">
            {/* Avatar Circle */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-brand-orange to-brand-red text-white flex items-center justify-center font-black text-2xl shadow-lg border-4 border-white shrink-0">
              {user?.name?.substring(0, 2).toUpperCase() || 'AJ'}

              {/* Floating Chili Badge */}
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-brand-border flex items-center justify-center shadow">
                <ChiliIcon className="w-4 h-4 text-brand-orange" />
              </span>
            </div>

            {/* User Details */}
            <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="text-xl font-black tracking-tight text-brand-text truncate">
                  {user?.name || 'Cliente UIDE'}
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-brand-orange/10 text-brand-orange border border-brand-orange/15 w-fit mx-auto sm:mx-0 shrink-0">
                  <Sparkles className="w-2.5 h-2.5 fill-current" />
                  Premium UIDE
                </span>
              </div>

              {/* Email details */}
              <p className="text-xs font-semibold text-brand-muted flex items-center justify-center sm:justify-start gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-brand-muted shrink-0" />
                <span className="truncate">{user?.email || 'estudiante@uide.edu.ec'}</span>
                <BadgeCheck className="w-4 h-4 text-green-500 shrink-0 fill-green-50" title="Cuenta UIDE Verificada" />
              </p>

              {/* Delivery location */}
              <p className="text-xs font-semibold text-brand-muted flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
                <span className="truncate">Ubicación: <strong className="text-brand-text font-bold">{currentAddress}</strong></span>
              </p>
            </div>
          </div>

          {/* Stats Cards Section */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-brand-muted">
              ESTADÍSTICAS DEL ESTUDIANTE
            </h4>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Orders Counter Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-brand-border/60 text-left">
                <span className="text-[9px] text-brand-muted font-bold uppercase tracking-wider">PEDIDOS TOTALES</span>
                <p className="text-2xl font-black text-brand-text mt-1">{totalOrders}</p>
                <p className="text-[9px] text-brand-muted mt-0.5">Comidas Campus UIDE</p>
              </div>

              {/* points Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-brand-border/60 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-brand-muted font-bold uppercase tracking-wider">PUNTOS AJI GO</span>
                  <Award className="w-3.5 h-3.5 text-brand-orange" />
                </div>
                <p className="text-2xl font-black text-brand-orange mt-1">{ajiGoPoints}</p>
                <p className="text-[9px] text-brand-muted mt-0.5">Listos para canjes</p>
              </div>
            </div>
          </div>

          {/* Details & Info Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-brand-border/50 rounded-2xl text-xs">
              <Calendar className="w-4 h-4 text-brand-orange shrink-0" />
              <div className="text-left">
                <p className="text-[9px] text-brand-muted font-bold uppercase">FECHA DE REGISTRO</p>
                <p className="font-bold text-brand-text text-[11px]">Mayo 2026</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-brand-border/50 rounded-2xl text-xs">
              <Award className="w-4 h-4 text-brand-red shrink-0" />
              <div className="text-left">
                <p className="text-[9px] text-brand-muted font-bold uppercase">NIVEL DE LEALTAD</p>
                <p className="font-bold text-brand-text text-[11px] flex items-center gap-1.5">
                  Foodie de Fuego
                  <span className="text-[8px] bg-red-100 text-brand-red font-black px-1.5 py-0.2 rounded">HOT</span>
                </p>
              </div>
            </div>
          </div>

          {/* Historial de Pedidos */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 border-b border-brand-border/40 pb-2">
              <ShoppingBag className="w-4 h-4 text-brand-orange" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-text">
                HISTORIAL DE PEDIDOS
              </h4>
            </div>

            {orders && orders.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {orders.map((order) => {
                  const statusInfo = getStatusLabel(order.status);
                  return (
                    <div 
                      key={order.id}
                      className="p-4 bg-slate-50 hover:bg-slate-100/80 border border-brand-border/70 rounded-2xl shadow-sm transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-extrabold text-brand-text">{order.restaurant}</span>
                          <span className="text-[9px] text-brand-muted font-mono font-bold">{order.id}</span>
                          <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full border ${statusInfo.color} shrink-0`}>
                            {statusInfo.text}
                          </span>
                        </div>
                        <p className="text-[10px] text-brand-muted">
                          {order.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                        </p>
                        <p className="text-[9px] text-brand-muted">
                          Hora: {order.createdAt} • {order.deliveryDetails?.method === 'delivery' ? 'Delivery a Aula' : 'Retiro en Local'}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-brand-border/40 pt-2 sm:pt-0 shrink-0 gap-2">
                        <div className="text-left sm:text-right">
                          <span className="text-[8px] text-brand-muted block font-extrabold uppercase">TOTAL</span>
                          <span className="text-xs font-black text-brand-orange">S/ {order.total.toFixed(2)}</span>
                        </div>
                        
                        <button
                          onClick={() => onViewOrderTracking(order)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-orange text-white text-[9px] font-extrabold tracking-wide uppercase hover:opacity-90 transition-opacity shadow-sm"
                        >
                          <span>Rastrear</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-brand-border/60 flex flex-col items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-brand-muted mb-2 opacity-50" />
                <p className="text-xs font-bold text-brand-text">Sin pedidos activos</p>
                <p className="text-[10px] text-brand-muted mt-0.5">Tus compras del campus se listarán aquí.</p>
              </div>
            )}
          </div>

        </div>

        {/* Footer Area - Fixed */}
        <div className="p-4 bg-slate-50 border-t border-brand-border/60 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-brand-text hover:bg-brand-text/90 text-white font-bold text-xs shadow-md transition-all"
          >
            Cerrar Perfil
          </button>
        </div>

      </motion.div>
    </div>
  );
}
