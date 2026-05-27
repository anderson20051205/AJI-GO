import React from 'react';
import { motion } from 'framer-motion';
import { X, Mail, MapPin, Award, Calendar, BadgeCheck, ShieldAlert, Sparkles } from 'lucide-react';
import ChiliIcon from './ChiliIcon';

export default function UserProfileModal({ isOpen, onClose, user, orders, currentAddress }) {
  if (!isOpen) return null;

  // Calculate stats
  const totalOrders = orders ? orders.length : 0;
  const ajiGoPoints = totalOrders * 15; // 15 points per order

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
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative bg-white border border-brand-border rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl z-10 text-brand-text text-left"
      >
        {/* Top Decorative Line */}
        <div className="h-2 w-full bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-muted hover:text-brand-text transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Main Profile Info Section */}
        <div className="p-8 space-y-6">

          {/* Header Visuals */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-brand-border/60 pb-6">
            {/* Avatar Círculo */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-brand-orange to-brand-red text-white flex items-center justify-center font-black text-3xl shadow-xl shadow-brand-red/10 border-4 border-white">
              {user?.name?.substring(0, 2).toUpperCase() || 'AJ'}

              {/* Floating Chili Badge */}
              <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border border-brand-border flex items-center justify-center shadow">
                <ChiliIcon className="w-4.5 h-4.5" />
              </span>
            </div>

            {/* User Details */}
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="text-2xl font-black tracking-tight text-brand-text">
                  {user?.name || 'Cliente UIDE'}
                </h3>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-orange/10 text-brand-orange border border-brand-orange/15 w-fit mx-auto sm:mx-0">
                  <Sparkles className="w-3 h-3 fill-current" />
                  Premium UIDE
                </span>
              </div>

              {/* Email details with custom check badge */}
              <p className="text-sm font-medium text-brand-muted flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-4 h-4 text-brand-muted shrink-0" />
                <span>{user?.email || 'estudiante@uide.edu.ec'}</span>
                <BadgeCheck className="w-4.5 h-4.5 text-green-500 shrink-0 fill-green-50" title="Cuenta UIDE Verificada" />
              </p>

              {/* Delivery facultad */}
              <p className="text-xs font-semibold text-brand-muted flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-4 h-4 text-brand-red shrink-0" />
                <span>Ubicación: <strong className="text-brand-text font-bold">{currentAddress}</strong></span>
              </p>
            </div>
          </div>

          {/* Stats Cards Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-muted">
              ESTADÍSTICAS DEL ESTUDIANTE
            </h4>

            <div className="grid grid-cols-2 gap-4">
              {/* Orders Counter Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-brand-border/60">
                <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">PEDIDOS TOTALES</span>
                <p className="text-3xl font-black text-brand-text mt-2">{totalOrders}</p>
                <p className="text-[10px] text-brand-muted mt-1">Comidas Campus UIDE</p>
              </div>

              {/* points Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-brand-border/60">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">PUNTOS AJI GO</span>
                  <Award className="w-4 h-4 text-brand-orange" />
                </div>
                <p className="text-3xl font-black text-brand-orange mt-2">{ajiGoPoints}</p>
                <p className="text-[10px] text-brand-muted mt-1">Puntos listos para canjes</p>
              </div>
            </div>
          </div>

          {/* Details & Info Blocks */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-brand-border/50 rounded-2xl text-xs">
              <Calendar className="w-4 h-4 text-brand-orange shrink-0" />
              <div className="text-left">
                <p className="text-[10px] text-brand-muted font-bold uppercase">FECHA DE REGISTRO</p>
                <p className="font-bold text-brand-text">Miembro desde Mayo 2026</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-brand-border/50 rounded-2xl text-xs">
              <Award className="w-4 h-4 text-brand-red shrink-0" />
              <div className="text-left">
                <p className="text-[10px] text-brand-muted font-bold uppercase">NIVEL DE LEALTAD</p>
                <p className="font-bold text-brand-text flex items-center gap-1.5">
                  Foodie de Fuego
                  <span className="inline-flex items-center text-[9px] bg-red-100 text-brand-red font-black px-1.5 py-0.5 rounded">HOT</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Area */}
        <div className="p-6 bg-slate-50 border-t border-brand-border/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-brand-text hover:bg-brand-text/90 text-white font-bold text-xs shadow-md transition-all"
          >
            Entendido
          </button>
        </div>

      </motion.div>
    </div>
  );
}
