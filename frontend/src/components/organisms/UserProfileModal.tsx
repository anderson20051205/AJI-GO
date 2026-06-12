import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, MapPin, Award, Calendar, BadgeCheck, Sparkles, ShoppingBag, ArrowRight, Bike } from 'lucide-react';
import ChiliIcon from '../atoms/ChiliIcon';
import { User, Order } from '../../types';
import { MOCK_RESTAURANTS } from './RestaurantGrid';

// INTERFAZ PARA CONTROLAR LAS PROPIEDADES DEL MODAL DE PERFIL DE USUARIO
interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  orders: Order[];
  currentAddress: string;
  onViewOrderTracking: (order: any) => void;
  onUpdateUser?: (updatedUser: User) => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  user,
  orders,
  currentAddress,
  onViewOrderTracking,
  onUpdateUser
}: UserProfileModalProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('foot');
  const [licensePlate, setLicensePlate] = useState('');

  // ESTADOS PARA EL CANJE DE PUNTOS
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [selectedRedeemRestaurant, setSelectedRedeemRestaurant] = useState(MOCK_RESTAURANTS[0]?.name || 'Piedra Negra');
  const [selectedPackage, setSelectedPackage] = useState(50);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState('');
  const [redeemErrorMsg, setRedeemErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    const isVehicleWithPlate = vehicleType === 'moto' || vehicleType === 'auto';
    if (isVehicleWithPlate && !licensePlate.trim()) {
      alert('Por favor, ingresa la matrícula del vehículo.');
      return;
    }
    if (onUpdateUser && user) {
      onUpdateUser({
        ...user,
        phone,
        driverStatus: 'pending',
        vehicleType,
        licensePlate: isVehicleWithPlate ? licensePlate : undefined
      });
      setIsApplying(false);
    }
  };

  /* CALCULO DE ESTADISTICAS Y OBTENCION DE PUNTOS DINAMICOS */
  const totalOrders = orders ? orders.length : 0;
  const ajiGoPoints = user?.points !== undefined ? user.points : totalOrders * 15;

  const handleRedeemPoints = (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemErrorMsg('');
    setRedeemSuccessMsg('');

    if (ajiGoPoints < selectedPackage) {
      setRedeemErrorMsg('No tienes suficientes puntos para realizar este canje.');
      return;
    }

    if (onUpdateUser && user) {
      const remainingPoints = ajiGoPoints - selectedPackage;
      onUpdateUser({
        ...user,
        points: remainingPoints
      });

      const couponCode = `AJIGO-CANJE-${Math.floor(1000 + Math.random() * 9000)}`;
      setRedeemSuccessMsg(`¡Canje exitoso! Usa el código ${couponCode} en ${selectedRedeemRestaurant}. Se han descontado ${selectedPackage} puntos.`);
      
      // Auto-ocultar el mensaje después de unos segundos
      setTimeout(() => {
        setRedeemSuccessMsg('');
        setIsRedeeming(false);
      }, 8000);
    }
  };

  const getStatusLabel = (status: number) => {
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* TARJETA DEL PERFIL DE USUARIO */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative bg-white border border-brand-border rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl z-10 text-brand-text text-left flex flex-col max-h-[90vh] md:max-h-[85vh]"
      >
        <div className="h-2.5 w-full bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow shrink-0"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-muted hover:text-brand-text transition-colors z-20 cursor-pointer"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* ÁREA DE CONTENIDO PRINCIPAL DESLIZABLE */}
        <div className="p-7 md:p-9 overflow-y-auto space-y-6 flex-1">

          {/* DETALLES GENERALES DEL ESTUDIANTE O DOCENTE */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-brand-border/60 pb-6">
            <div className="relative w-22 h-22 rounded-full bg-gradient-to-br from-brand-orange to-brand-red text-white flex items-center justify-center font-black text-2xl shadow-lg border-4 border-white shrink-0">
              {user?.name?.substring(0, 2).toUpperCase() || 'AJ'}

              {/* MEDALLA DEL LOGO FLOTANTE */}
              <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border border-brand-border flex items-center justify-center shadow">
                <ChiliIcon className="w-5 h-5 text-brand-orange" />
              </span>
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="text-2xl font-black tracking-tight text-brand-text truncate">
                  {user?.name || 'Cliente UIDE'}
                </h3>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-orange/10 text-brand-orange border border-brand-orange/15 w-fit mx-auto sm:mx-0 shrink-0">
                  <Sparkles className="w-3 h-3 fill-current" />
                  {user?.membership || 'Premium UIDE'}
                </span>
              </div>

              {/* CORREO ELECTRÓNICO */}
              <p className="text-xs font-semibold text-brand-muted flex items-center justify-center sm:justify-start gap-1.5 truncate">
                <Mail className="w-4 h-4 text-brand-muted shrink-0" />
                <span className="truncate">{user?.email || 'estudiante@uide.edu.ec'}</span>
                <span title="Cuenta UIDE Verificada">
                  <BadgeCheck className="w-4.5 h-4.5 text-green-500 shrink-0 fill-green-50" />
                </span>
              </p>

              {/* DIRECCIÓN UNIVERSITARIA */}
              <p className="text-xs font-semibold text-brand-muted flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-4 h-4 text-brand-red shrink-0" />
                <span className="truncate">Ubicación: <strong className="text-brand-text font-bold">{currentAddress}</strong></span>
              </p>
            </div>
          </div>

          {/* CUADROS DE ESTADÍSTICAS RELEVANTES */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-brand-muted">
              ESTADÍSTICAS DEL ESTUDIANTE
            </h4>

            <div className="grid grid-cols-2 gap-4">
              {/* PEDIDOS REALIZADOS EN EL CAMPUS */}
              <div className="p-4.5 rounded-2xl bg-slate-50 border border-brand-border/60 text-left">
                <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">PEDIDOS TOTALES</span>
                <p className="text-3xl font-black text-brand-text mt-1">{totalOrders}</p>
                <p className="text-[10px] text-brand-muted mt-1 font-medium">Comidas Campus UIDE</p>
              </div>

              {/* PUNTOS ACUMULADOS EN AJI GO */}
              <div className="p-4.5 rounded-2xl bg-slate-50 border border-brand-border/60 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">PUNTOS AJI GO</span>
                  <Award className="w-4 h-4 text-brand-orange" />
                </div>
                <p className="text-3xl font-black text-brand-orange mt-1">{ajiGoPoints}</p>
                <p className="text-[10px] text-brand-muted mt-1 font-medium">Listos para canjes</p>
              </div>
            </div>
          </div>

          {/* DETALLES DE MEMBRESIA CON LECTURAS DINAMICAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-brand-border/50 rounded-2xl text-xs font-semibold text-brand-muted">
              <Calendar className="w-4.5 h-4.5 text-brand-orange shrink-0" />
              <div className="text-left">
                <p className="text-[9px] text-brand-muted font-bold uppercase">FECHA DE REGISTRO</p>
                <p className="font-bold text-brand-text text-xs">{user?.registrationDate || 'Mayo 2026'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-brand-border/50 rounded-2xl text-xs font-semibold text-brand-muted">
              <Award className="w-4.5 h-4.5 text-brand-red shrink-0" />
              <div className="text-left">
                <p className="text-[9px] text-brand-muted font-bold uppercase">NIVEL DE LEALTAD</p>
                <p className="font-bold text-brand-text text-xs flex items-center gap-1.5">
                  {user?.loyaltyLevel || 'Foodie de Fuego'}
                  {(!user?.loyaltyLevel || user.loyaltyLevel === 'Foodie de Fuego') && (
                    <span className="text-[9px] bg-red-100 text-brand-red font-black px-2 py-0.5 rounded">HOT</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* SECCIÓN DE CANJE DE PUNTOS */}
          <div className="p-5 rounded-2xl bg-brand-yellow/5 border border-brand-yellow/20 text-left space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-yellow/10 text-brand-orange flex items-center justify-center">
                <Award className="w-5 h-5 text-brand-orange" />
              </div>
              <div>
                <h4 className="text-sm font-black text-brand-text font-sans">Canjear Puntos AJI GO</h4>
                <p className="text-[10px] text-brand-muted font-semibold">Usa tus puntos acumulados para obtener productos de cortesía</p>
              </div>
            </div>

            {!isRedeeming ? (
              <button
                onClick={() => {
                  setRedeemSuccessMsg('');
                  setRedeemErrorMsg('');
                  setIsRedeeming(true);
                }}
                className="w-full bg-brand-orange hover:bg-brand-orange/95 text-white font-black text-xs py-3 rounded-xl transition-all shadow-sm text-center cursor-pointer"
              >
                Canjear mis puntos ahora
              </button>
            ) : (
              <form onSubmit={handleRedeemPoints} className="space-y-3.5 pt-1.5">
                {redeemErrorMsg && (
                  <div className="p-3 bg-brand-red/10 border border-brand-red/20 text-brand-red text-[11px] rounded-xl font-bold">
                    {redeemErrorMsg}
                  </div>
                )}
                {redeemSuccessMsg && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-600 text-[11px] rounded-xl font-bold">
                    {redeemSuccessMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-brand-muted uppercase block">1. Selecciona Local</label>
                    <select
                      value={selectedRedeemRestaurant}
                      onChange={(e) => setSelectedRedeemRestaurant(e.target.value)}
                      className="w-full bg-white border border-brand-border rounded-xl p-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-orange cursor-pointer"
                    >
                      {MOCK_RESTAURANTS.map((rest) => (
                        <option key={rest.id} value={rest.name}>
                          {rest.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-brand-muted uppercase block">2. Selecciona Recompensa</label>
                    <select
                      value={selectedPackage}
                      onChange={(e) => setSelectedPackage(Number(e.target.value))}
                      className="w-full bg-white border border-brand-border rounded-xl p-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-orange cursor-pointer"
                    >
                      <option value={50}>50 puntos = Bebida gratis</option>
                      <option value={100}>100 puntos = Entrada gratis</option>
                      <option value={150}>150 puntos = Almuerzo gratis</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-1.5">
                  <button
                    type="submit"
                    className="flex-1 bg-brand-orange hover:bg-brand-orange/95 text-white font-black text-xs py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Confirmar Canje
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRedeeming(false)}
                    className="bg-slate-200 hover:bg-slate-300 text-brand-muted font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* SECCIÓN TRABAJAR COMO REPARTIDOR (PARA CLIENTES NATURALES) */}
          {user?.role === 'customer' && (
            <div className="p-5 rounded-2xl bg-brand-orange/5 border border-brand-orange/20 text-left space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-orange/10 text-brand-orange">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-brand-text font-sans">Trabajar como Repartidor</h4>
                  <p className="text-[10px] text-brand-muted font-semibold">Genera ingresos adicionales entregando pedidos en el campus</p>
                </div>
              </div>

              {(!user.driverStatus || user.driverStatus === 'none') && !isApplying && (
                <button
                  onClick={() => {
                    setPhone(user.phone || '');
                    setLicensePlate(user.licensePlate || '');
                    setVehicleType(user.vehicleType || 'foot');
                    setIsApplying(true);
                  }}
                  className="w-full bg-brand-orange hover:bg-brand-orange/95 text-white font-black text-xs py-3 rounded-xl transition-all shadow-sm text-center cursor-pointer"
                >
                  Solicitar unirse al equipo de Repartidores
                </button>
              )}

              {isApplying && (
                <form onSubmit={handleApplySubmit} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-brand-muted uppercase">Teléfono Móvil</label>
                    <input
                      type="tel"
                      placeholder="Ej: +593987654321"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-brand-border rounded-xl p-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-orange"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-brand-muted uppercase block">Medio de Transporte</label>
                    <div className="grid grid-cols-3 gap-2 select-none">
                      {[
                        { type: 'foot', label: 'A Pie' },
                        { type: 'moto', label: 'Moto' },
                        { type: 'auto', label: 'Auto' }
                      ].map((v) => (
                        <button
                          key={v.type}
                          type="button"
                          onClick={() => setVehicleType(v.type)}
                          className={`py-2 text-center rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            vehicleType === v.type
                              ? 'bg-brand-orange text-white border-transparent'
                              : 'bg-white border-brand-border text-brand-muted hover:text-brand-text'
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(vehicleType === 'moto' || vehicleType === 'auto') && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-brand-muted uppercase">Matrícula del Vehículo</label>
                      <input
                        type="text"
                        placeholder="Ej: ABC-1234"
                        value={licensePlate}
                        onChange={(e) => setLicensePlate(e.target.value)}
                        className="w-full bg-white border border-brand-border rounded-xl p-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-orange"
                        required
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-1.5">
                    <button
                      type="submit"
                      className="flex-1 bg-brand-orange hover:bg-brand-orange/95 text-white font-black text-xs py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      Enviar Solicitud
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsApplying(false)}
                      className="bg-slate-200 hover:bg-slate-300 text-brand-muted font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              {user.driverStatus === 'pending' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2.5">
                  <p className="text-xs text-amber-700 font-semibold leading-relaxed">
                    Tu solicitud está en estado <strong>Pendiente de Aprobación</strong>. Un administrador del campus revisará tus documentos.
                  </p>
                  <button
                    onClick={() => {
                      if (onUpdateUser) {
                        onUpdateUser({
                          ...user,
                          driverStatus: 'approved'
                        });
                      }
                    }}
                    className="bg-green-600 hover:bg-green-500 text-white text-[10px] font-black py-2 px-4.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Aprobar Solicitud (Simulación)
                  </button>
                </div>
              )}

              {user.driverStatus === 'approved' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2.5">
                  <BadgeCheck className="w-5.5 h-5.5 text-green-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs text-green-700 font-black">¡Eres repartidor oficial de AJI GO!</p>
                    <p className="text-[10px] text-green-600 font-semibold leading-relaxed">
                      Se han desbloqueado tus funciones de repartidor. Ya puedes usar la pestaña "Repartidor" en la barra superior para gestionar entregas.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HISTORIAL COMPLETO DE COMPRAS */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-center gap-2 border-b border-brand-border/40 pb-2.5">
              <ShoppingBag className="w-4.5 h-4.5 text-brand-orange" />
              <h4 className="text-xs font-black uppercase tracking-wider text-brand-text">
                HISTORIAL DE PEDIDOS
              </h4>
            </div>

            {orders && orders.length > 0 ? (
              <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
                {orders.map((order) => {
                  const statusInfo = getStatusLabel(order.status);
                  return (
                    <div
                      key={order.id}
                      className="p-4.5 bg-slate-50 hover:bg-slate-100/80 border border-brand-border/70 rounded-2xl shadow-sm transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 text-left"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-brand-text">{order.restaurant}</span>
                          <span className="text-[10px] text-brand-muted font-mono font-bold">{order.id}</span>
                          <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full border ${statusInfo.color} shrink-0`}>
                            {statusInfo.text}
                          </span>
                        </div>
                        <p className="text-xs text-brand-muted font-medium">
                          {order.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                        </p>
                        <p className="text-[10px] text-brand-muted font-semibold">
                          Hora: {order.createdAt} • {order.deliveryDetails?.method === 'delivery' ? 'Delivery a Aula' : 'Retiro en Local'}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-brand-border/40 pt-2.5 sm:pt-0 shrink-0 gap-2">
                        <div className="text-left sm:text-right">
                          <span className="text-[9px] text-brand-muted block font-bold uppercase">TOTAL</span>
                          <span className="text-sm font-black text-brand-orange">S/ {order.total.toFixed(2)}</span>
                        </div>

                        <button
                          onClick={() => onViewOrderTracking(order)}
                          className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-brand-orange text-white text-[10px] font-black tracking-wider uppercase hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
                        >
                          <span>Rastrear</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-brand-border/60 flex flex-col items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-brand-muted mb-2.5 opacity-55" />
                <p className="text-xs font-black text-brand-text">Sin pedidos activos</p>
                <p className="text-[10px] text-brand-muted mt-0.5">Tus compras del campus se listarán aquí.</p>
              </div>
            )}
          </div>

        </div>

        {/* PIE DE DIÁLOGO PARA CIERRE */}
        <div className="p-4.5 bg-slate-50 border-t border-brand-border/60 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-brand-text hover:bg-brand-text/90 text-white font-black text-xs shadow-md transition-all cursor-pointer"
          >
            Cerrar Perfil
          </button>
        </div>

      </motion.div>
    </div>
  );
}
