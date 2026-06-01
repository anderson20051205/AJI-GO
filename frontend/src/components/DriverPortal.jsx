import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, MapPin, Compass, Clock, CheckCircle2, QrCode, 
  Award, TrendingUp, AlertCircle, ShoppingBag, ShieldCheck, 
  User, Phone, MessageCircle, DollarSign, Play, Sparkles, 
  X, Check, LogOut, Navigation, HelpCircle, Map
} from 'lucide-react';
import ChiliIcon from './ChiliIcon';

export default function DriverPortal({ orders, onUpdateOrderStatus, onAssignDriver, user }) {
  const [isOnline, setIsOnline] = useState(false);
  const [activeDelivery, setActiveDelivery] = useState(null);
  
  // Financial metrics
  const [earnings, setEarnings] = useState(() => {
    const saved = localStorage.getItem('aji_go_driver_earnings');
    return saved ? parseFloat(saved) : 0;
  });
  const [completedDeliveries, setCompletedDeliveries] = useState(() => {
    const saved = localStorage.getItem('aji_go_driver_completed');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Vehicle Selection: 'foot' | 'bike' | 'moto'
  const [vehicleType, setVehicleType] = useState('moto');
  
  // Active delivery sub-states
  // 'accepted' -> 'picked_up' -> 'delivered'
  const [deliveryStep, setDeliveryStep] = useState('accepted');
  const [routeProgress, setRouteProgress] = useState(0);
  const [isSimulatingRoute, setIsSimulatingRoute] = useState(false);
  
  // Modals / Scanner state
  const [showScanner, setShowScanner] = useState(false);
  const [scannerScanning, setScannerScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Persist metrics
  useEffect(() => {
    localStorage.setItem('aji_go_driver_earnings', earnings.toFixed(2));
    localStorage.setItem('aji_go_driver_completed', completedDeliveries.toString());
  }, [earnings, completedDeliveries]);

  // Coordinates of UIDE Campus Locations for SVG Map
  const locations = {
    // Restaurants
    'Piedra Negra': { x: 25, y: 35, label: 'Piedra Negra' },
    'El Capi': { x: 22, y: 72, label: 'El Capi' },
    'Collage': { x: 35, y: 50, label: 'Collage' },
    'UIDE Bakery': { x: 18, y: 55, label: 'UIDE Bakery' },
    
    // Destinations (Faculties)
    'Facultad de Ciencias Técnicas': { x: 75, y: 30, label: 'F. Técnicas' },
    'Facultad de Medicina': { x: 82, y: 62, label: 'F. Medicina' },
    'Facultad Administrativa': { x: 62, y: 78, label: 'F. Administrativa' },
    'Edificio de Aulas': { x: 80, y: 45, label: 'Aulas G.' },
  };

  // Get active order details
  const activeOrderDetails = activeDelivery ? orders.find(o => o.id === activeDelivery.id) : null;

  // Sync active order status changes from external source (or internal)
  useEffect(() => {
    if (activeDelivery && activeOrderDetails) {
      if (activeOrderDetails.status === 3) {
        // Order was marked as delivered somewhere else (like in admin QR scan)
        handleDeliveryCompletion(true);
      }
    }
  }, [orders, activeDelivery, activeOrderDetails]);

  // Simulation of GPS Route progress
  useEffect(() => {
    let interval;
    if (isSimulatingRoute && routeProgress < 100) {
      const speed = vehicleType === 'moto' ? 8 : vehicleType === 'bike' ? 5 : 3;
      interval = setInterval(() => {
        setRouteProgress(prev => {
          if (prev + speed >= 100) {
            clearInterval(interval);
            setIsSimulatingRoute(false);
            return 100;
          }
          return prev + speed;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isSimulatingRoute, routeProgress, vehicleType]);

  // Available orders for delivery: must be status 2 (Ready for Delivery) and delivery method
  const availableOrders = orders.filter(
    o => o.status === 2 && 
    o.deliveryDetails?.method === 'delivery' && 
    (!o.driverName || o.driverName === user?.name) &&
    (!activeDelivery || o.id !== activeDelivery.id)
  );

  // Accept an order
  const handleAcceptOrder = (order) => {
    if (activeDelivery) {
      alert('Ya tienes una entrega en curso.');
      return;
    }
    
    if (onAssignDriver) {
      onAssignDriver(order.id, user?.name || 'Repartidor UIDE');
    }
    
    setActiveDelivery(order);
    setDeliveryStep('accepted');
    setRouteProgress(0);
    setIsSimulatingRoute(false);
  };

  // Pick up order from local
  const handlePickUp = () => {
    setDeliveryStep('picked_up');
    setRouteProgress(0);
    setIsSimulatingRoute(true);
  };

  // Start/Resume Route Simulation
  const handleToggleRouteSimulation = () => {
    setIsSimulatingRoute(prev => !prev);
  };

  // Open Scanner Modal
  const handleOpenScanner = () => {
    setShowScanner(true);
    setScannerScanning(true);
    // Simulate auto scan after 2.5 seconds
    setTimeout(() => {
      setScannerScanning(false);
    }, 2500);
  };

  // Confirm QR Scanner result
  const handleConfirmScanner = () => {
    setShowScanner(false);
    handleDeliveryCompletion();
  };

  // Complete Delivery
  const handleDeliveryCompletion = (bypassStateUpdate = false) => {
    if (!activeDelivery) return;

    if (!bypassStateUpdate && onUpdateOrderStatus) {
      onUpdateOrderStatus(activeDelivery.id, 3); // Mark as Delivered (3)
    }

    // Calculate delivery fee + tip simulation
    const fee = activeDelivery.deliveryFee || 1.50;
    const randomTip = Math.random() > 0.5 ? parseFloat((Math.random() * 2 + 1).toFixed(2)) : 0;
    const totalEarned = fee + randomTip;

    setEarnings(prev => prev + totalEarned);
    setCompletedDeliveries(prev => prev + 1);
    
    // Clear delivery
    setActiveDelivery(null);
    setRouteProgress(0);
    setIsSimulatingRoute(false);
    
    alert(`¡Entrega completada con éxito!\nGanancia: S/ ${fee.toFixed(2)}\nPropina: S/ ${randomTip.toFixed(2)}\nGanancia Total de este pedido: S/ ${totalEarned.toFixed(2)}`);
  };

  // Simulate injecting a test order into the system
  const handleCreateTestOrder = () => {
    const randomId = `AG-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomRestaurant = Object.keys(locations).slice(0, 4)[Math.floor(Math.random() * 4)];
    const randomFaculty = Object.keys(locations).slice(4)[Math.floor(Math.random() * 4)];
    
    const testOrder = {
      id: randomId,
      items: [
        { name: 'Hamburguesa Triple UIDE', price: 9.50, quantity: 1 },
        { name: 'Bebida Energética Helada', price: 2.50, quantity: 1 }
      ],
      subtotal: 12.00,
      deliveryFee: 1.50,
      discount: 0,
      tax: 1.62,
      total: 13.50,
      deliveryDetails: {
        method: 'delivery',
        faculty: randomFaculty,
        floor: 'Piso 2',
        classroom: 'Aula 205',
        notes: 'Entregar rápido, estoy en examen.'
      },
      status: 2, // Listo para despacho
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      restaurant: randomRestaurant
    };

    // Inject into parent component state
    if (orders) {
      orders.push(testOrder);
      // Trigger a force re-render in App by doing status update simulation or just relying on App state
      onUpdateOrderStatus(randomId, 2);
    }
  };

  // Handle Cash Withdrawal
  const handleWithdraw = (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Ingresa un monto válido.');
      return;
    }
    if (amount > earnings) {
      alert('Fondos insuficientes.');
      return;
    }

    setEarnings(prev => prev - amount);
    setWithdrawAmount('');
    setShowWithdrawModal(false);
    alert(`Transferencia exitosa: S/ ${amount.toFixed(2)} han sido enviados a tu cuenta bancaria registrada.`);
  };

  // Calculate coordinates for SVG map positioning
  const getMapCoordinates = () => {
    if (!activeDelivery) return { start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, current: { x: 0, y: 0 } };
    
    const startLoc = locations[activeDelivery.restaurant] || { x: 20, y: 50 };
    const endLoc = locations[activeDelivery.deliveryDetails?.faculty] || { x: 80, y: 50 };
    
    const currentX = startLoc.x + (endLoc.x - startLoc.x) * (routeProgress / 100);
    const currentY = startLoc.y + (endLoc.y - startLoc.y) * (routeProgress / 100);
    
    return {
      start: startLoc,
      end: endLoc,
      current: { x: currentX, y: currentY }
    };
  };

  const mapCoords = getMapCoordinates();

  return (
    <div className="max-w-[95%] xl:max-w-[90%] 2xl:max-w-[1440px] mx-auto px-4 md:px-8 py-10 text-brand-text">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-brand-border/40 pb-6 mb-8 text-left">
        <div>
          <span className="text-[10px] bg-brand-orange/15 text-brand-orange px-3 py-1 rounded-full font-black uppercase tracking-widest border border-brand-orange/10">
            PORTAL DEL REPARTIDOR UIDE
          </span>
          <h2 className="text-3xl font-extrabold text-brand-text mt-3">Reparto en Campus</h2>
          <p className="text-xs text-brand-muted mt-1">Conéctate para aceptar entregas, calcular rutas y cobrar tus ganancias.</p>
        </div>

        {/* Online/Offline Toggle */}
        <div className="flex items-center gap-4 bg-brand-card border border-brand-border p-3 rounded-2xl shadow-sm">
          <div className="text-left">
            <p className="text-[10px] text-brand-muted font-bold uppercase">Estado de Trabajo</p>
            <p className={`text-xs font-black ${isOnline ? 'text-green-500 animate-pulse' : 'text-brand-muted'}`}>
              {isOnline ? 'CONECTADO / ACTIVO' : 'DESCONECTADO'}
            </p>
          </div>
          <button
            onClick={() => {
              setIsOnline(!isOnline);
              if (isOnline && activeDelivery) {
                alert('No puedes desconectarte mientras tienes una entrega en progreso.');
                setIsOnline(true);
              }
            }}
            className={`w-14 h-8 rounded-full transition-all duration-300 relative focus:outline-none p-1 ${
              isOnline ? 'bg-green-500' : 'bg-slate-300'
            }`}
          >
            <div 
              className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-all duration-300 ${
                isOnline ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Panel for Action/Map, Right Panel for Stats/List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT & CENTER PANEL (Active Map & Deliveries) */}
        <div className="lg:col-span-2 space-y-6">
          
          {!isOnline ? (
            /* OFFLINE VIEW */
            <div className="glass-effect rounded-3xl p-10 md:p-16 text-center border border-brand-border/60 bg-white shadow-sm flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-24 h-24 rounded-full bg-slate-100 border border-brand-border flex items-center justify-center mb-6 relative animate-float">
                <Compass className="w-12 h-12 text-brand-muted" />
              </div>
              <h3 className="text-xl font-extrabold text-brand-text mb-3">¿Listo para comenzar a repartir?</h3>
              <p className="text-brand-muted text-xs max-w-sm mx-auto leading-relaxed mb-8">
                Activa tu estado en la esquina superior derecha. Podrás recibir solicitudes de entrega de los locales de la UIDE directo a las aulas de clase.
              </p>
              <button
                onClick={() => setIsOnline(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-red to-brand-orange text-white font-extrabold text-xs shadow-lg shadow-brand-red/10 hover:opacity-95 transition-opacity"
              >
                Conectarme Ahora
              </button>
            </div>
          ) : activeDelivery ? (
            /* ACTIVE DELIVERY VIEW */
            <div className="space-y-6">
              
              {/* Map & GPS representation Card */}
              <div className="glass-effect rounded-3xl p-6 bg-white border border-brand-border/60 shadow-sm relative overflow-hidden text-left">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-extrabold text-brand-text uppercase tracking-wider flex items-center gap-1.5">
                    <Map className="w-4 h-4 text-brand-orange" />
                    GPS: Navegación del Campus UIDE
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded font-bold">
                      {routeProgress}% Completado
                    </span>
                    <button 
                      onClick={handleToggleRouteSimulation}
                      className="text-[10px] bg-brand-dark border border-brand-border hover:border-brand-orange px-2.5 py-1 rounded font-extrabold flex items-center gap-1"
                    >
                      <Play className={`w-3 h-3 ${isSimulatingRoute ? 'text-red-500 fill-red-500' : 'text-green-500 fill-green-500'}`} />
                      {isSimulatingRoute ? 'Pausar GPS' : 'Iniciar GPS'}
                    </button>
                  </div>
                </div>

                {/* SVG Visual Map */}
                <div className="relative w-full h-[280px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-15"></div>
                  
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Road Network Lines */}
                    <line x1="20" y1="50" x2="80" y2="50" stroke="#334155" strokeWidth="2" strokeDasharray="3" />
                    <line x1="25" y1="35" x2="25" y2="72" stroke="#334155" strokeWidth="1.5" />
                    <line x1="75" y1="30" x2="75" y2="78" stroke="#334155" strokeWidth="1.5" />
                    
                    {/* Active Route Path */}
                    {activeDelivery && (
                      <line 
                        x1={mapCoords.start.x} 
                        y1={mapCoords.start.y} 
                        x2={mapCoords.end.x} 
                        y2={mapCoords.end.y} 
                        stroke="#FF7A00" 
                        strokeWidth="2.5" 
                        className="animate-dash-route"
                      />
                    )}

                    {/* Render Locations (Buildings) */}
                    {Object.entries(locations).map(([name, loc]) => {
                      const isRestaurant = ['Piedra Negra', 'El Capi', 'Collage', 'UIDE Bakery'].includes(name);
                      const isActiveStart = activeDelivery.restaurant === name;
                      const isActiveEnd = activeDelivery.deliveryDetails?.faculty === name;

                      return (
                        <g key={name}>
                          {/* Outer Glow for Active points */}
                          {(isActiveStart || isActiveEnd) && (
                            <circle 
                              cx={loc.x} 
                              cy={loc.y} 
                              r="5" 
                              fill={isActiveStart ? '#FF3838' : '#FF7A00'} 
                              className="animate-ping" 
                              style={{ animationDuration: '3s' }}
                            />
                          )}
                          
                          {/* Anchor Circle */}
                          <circle 
                            cx={loc.x} 
                            cy={loc.y} 
                            r={isActiveStart || isActiveEnd ? '3.5' : '2.5'} 
                            fill={isRestaurant ? '#F43F5E' : '#3B82F6'} 
                            stroke="#0F172A"
                            strokeWidth="1"
                          />
                          
                          {/* Label Text */}
                          <text 
                            x={loc.x} 
                            y={loc.y - 5} 
                            fill="#94A3B8" 
                            fontSize="2.5" 
                            fontWeight="bold" 
                            textAnchor="middle"
                          >
                            {loc.label}
                          </text>
                        </g>
                      );
                    })}

                    {/* Animated Delivery Agent Position */}
                    {activeDelivery && (
                      <g>
                        <circle 
                          cx={mapCoords.current.x} 
                          cy={mapCoords.current.y} 
                          r="4" 
                          fill="#FF7A00" 
                          stroke="#FFFFFF" 
                          strokeWidth="1.2" 
                          className="shadow-lg"
                        />
                      </g>
                    )}
                  </svg>

                  {/* Floating vehicle overlay icon showing progress */}
                  <div 
                    className="absolute p-2 bg-brand-orange text-white rounded-xl shadow-lg border border-white flex items-center justify-center transition-all duration-300"
                    style={{ 
                      left: `${mapCoords.current.x}%`, 
                      top: `${mapCoords.current.y}%`,
                      transform: 'translate(-50%, -50%)' 
                    }}
                  >
                    <Bike className="w-4.5 h-4.5" />
                  </div>

                  {/* Route Summary Floating Overlay */}
                  <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-800 p-3 rounded-xl text-left">
                    <p className="text-[9px] text-slate-400 font-extrabold uppercase">Ruta Activa</p>
                    <p className="text-xs font-bold text-white mt-0.5 truncate max-w-[170px]">{activeDelivery.restaurant} → {activeDelivery.deliveryDetails?.faculty}</p>
                    <p className="text-[10px] text-brand-orange font-semibold mt-1">
                      {routeProgress === 100 ? '¡Destino alcanzado!' : `Aprox. ${Math.ceil((100 - routeProgress) * 0.1)} min restantes`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Order Delivery Card & Status Stepper */}
              <div className="glass-effect rounded-3xl p-6 bg-white border border-brand-border/60 shadow-sm text-left relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow"></div>
                
                {/* Order Identity & Fee */}
                <div className="flex justify-between items-start border-b border-brand-border/40 pb-4 mb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-brand-text">{activeDelivery.id}</span>
                      <span className="text-[9px] bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-full font-bold">
                        En Proceso de Entrega
                      </span>
                    </div>
                    <p className="text-[10px] text-brand-muted mt-1">Aceptado hace poco</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-brand-muted block uppercase font-extrabold">Pago de Envío</span>
                    <span className="text-base font-black text-brand-orange">S/ {activeDelivery.deliveryFee.toFixed(2)}</span>
                  </div>
                </div>

                {/* Pickup and Delivery details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Local Pickup */}
                  <div className="p-4 bg-slate-50 border border-brand-border/40 rounded-2xl">
                    <span className="text-[9px] text-brand-muted block uppercase font-bold tracking-wider mb-2">1. RETIRAR EN LOCAL</span>
                    <p className="font-bold text-brand-text text-sm flex items-center gap-1">
                      <ShoppingBag className="w-4 h-4 text-brand-red shrink-0" />
                      {activeDelivery.restaurant}
                    </p>
                    <div className="mt-3 space-y-1 text-xs">
                      {activeDelivery.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-brand-text">
                          <span>{it.quantity}x {it.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Client Destination */}
                  <div className="p-4 bg-slate-50 border border-brand-border/40 rounded-2xl">
                    <span className="text-[9px] text-brand-muted block uppercase font-bold tracking-wider mb-2">2. ENTREGAR A CLIENTE</span>
                    <p className="font-bold text-brand-text text-sm flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-brand-red shrink-0" />
                      {activeDelivery.deliveryDetails?.faculty}
                    </p>
                    <p className="text-xs text-brand-text font-medium mt-1">
                      Piso: <span className="font-bold">{activeDelivery.deliveryDetails?.floor}</span> | Aula: <span className="font-bold">{activeDelivery.deliveryDetails?.classroom}</span>
                    </p>
                    {activeDelivery.deliveryDetails?.notes && (
                      <p className="text-[10px] text-brand-muted italic mt-2 bg-white/70 p-1.5 rounded border border-brand-border/30">
                        "{activeDelivery.deliveryDetails.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Workflow Controller Button */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-brand-dark/45 p-4 rounded-2xl">
                  {deliveryStep === 'accepted' ? (
                    <>
                      <span className="text-xs text-brand-muted font-bold text-center sm:text-left">
                        Dirígete al local para retirar los productos empaquetados.
                      </span>
                      <button
                        onClick={handlePickUp}
                        className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orange/95 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-brand-orange/15 shrink-0"
                      >
                        Confirmar Retiro en Local
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-left w-full sm:w-auto">
                        <span className="text-[9px] text-brand-muted block font-extrabold uppercase">Ruta en Progreso</span>
                        <span className="text-xs font-bold text-brand-text">
                          {routeProgress < 100 
                            ? 'Transládate a la facultad destino...' 
                            : '¡Has llegado! Solicita el código QR al cliente.'
                          }
                        </span>
                      </div>
                      
                      <div className="flex gap-2 w-full sm:w-auto shrink-0">
                        {routeProgress < 100 && (
                          <button
                            onClick={() => setRouteProgress(100)}
                            className="flex-1 sm:flex-initial bg-brand-card hover:bg-brand-dark border border-brand-border text-brand-text font-bold text-xs px-4 py-3 rounded-xl transition-all"
                          >
                            Omitir Ruta
                          </button>
                        )}
                        <button
                          onClick={handleOpenScanner}
                          disabled={routeProgress < 100}
                          className="flex-1 sm:flex-initial bg-green-600 hover:bg-green-500 disabled:opacity-30 disabled:hover:bg-green-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                        >
                          <QrCode className="w-4 h-4" />
                          Validar Entrega (QR)
                        </button>
                      </div>
                    </>
                  )}
                </div>

              </div>

            </div>
          ) : (
            /* ONLINE & WAITING FOR ORDERS VIEW */
            <div className="space-y-6">
              
              {/* Radar Waiting Screen */}
              <div className="glass-effect rounded-3xl p-8 bg-white border border-brand-border/60 shadow-sm text-center flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
                
                {/* Radar Waves Animation */}
                <div className="w-32 h-32 rounded-full border border-brand-orange/20 flex items-center justify-center relative mb-6">
                  <div className="absolute w-28 h-28 rounded-full bg-brand-orange/5 animate-radar"></div>
                  <div className="absolute w-20 h-20 rounded-full bg-brand-orange/10 animate-radar" style={{ animationDelay: '1s' }}></div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-orange to-brand-red text-white flex items-center justify-center shadow-lg relative z-10">
                    <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-brand-text">Buscando entregas disponibles...</h3>
                <p className="text-brand-muted text-xs max-w-xs mx-auto mt-2 leading-relaxed">
                  Cuando un restaurante prepare un despacho de delivery, aparecerá inmediatamente aquí.
                </p>

                {/* Test Order Injector Button */}
                <div className="mt-8 border-t border-brand-border/40 pt-6 w-full flex flex-col items-center">
                  <span className="text-[9px] text-brand-muted font-bold tracking-widest uppercase">Entorno de Pruebas</span>
                  <button
                    onClick={handleCreateTestOrder}
                    className="mt-3 bg-brand-dark hover:bg-brand-card text-brand-orange border border-brand-orange/30 hover:border-brand-orange px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all"
                  >
                    Simular Pedido de Prueba en local
                  </button>
                </div>
              </div>

              {/* Available Orders List Queue */}
              <div className="space-y-4 text-left">
                <h3 className="text-xs font-extrabold text-brand-muted uppercase tracking-wider">
                  Pedidos Disponibles en el Campus ({availableOrders.length})
                </h3>

                {availableOrders.length === 0 ? (
                  <div className="py-10 bg-brand-card/25 rounded-2xl border border-dashed border-brand-border text-center">
                    <ShoppingBag className="w-8 h-8 text-brand-muted/50 mx-auto mb-2" />
                    <p className="text-xs font-bold text-brand-muted">No hay pedidos listos para retirar.</p>
                    <p className="text-[10px] text-brand-muted/70 mt-0.5">Ve al Modo Socio para preparar platos o inyecta un pedido de prueba arriba.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableOrders.map((order) => (
                      <div 
                        key={order.id} 
                        className="bg-white border border-brand-border rounded-2xl p-5 hover:border-brand-orange hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-extrabold text-brand-text">{order.id}</span>
                            <p className="text-[10px] text-brand-muted mt-0.5">{order.restaurant}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-brand-muted block uppercase font-bold">Pago Envío</span>
                            <span className="text-xs font-black text-brand-orange">S/ {order.deliveryFee.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-1 text-brand-text">
                            <MapPin className="w-3.5 h-3.5 text-brand-red" />
                            <span className="font-bold truncate">{order.deliveryDetails?.faculty}</span>
                          </div>
                          <p className="text-[11px] text-brand-muted pl-4.5">
                            Piso {order.deliveryDetails?.floor} • {order.deliveryDetails?.classroom}
                          </p>
                        </div>

                        <button
                          onClick={() => handleAcceptOrder(order)}
                          className="w-full bg-brand-text hover:bg-brand-text/90 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                        >
                          Aceptar Entrega
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* RIGHT SIDE PANEL (Driver Stats & Earnings Ledger) */}
        <div className="space-y-6">
          
          {/* Earnings & Wallet Card */}
          <div className="glass-effect rounded-3xl p-6 bg-white border border-brand-border/60 shadow-sm text-left relative overflow-hidden">
            <div className="absolute top-[-30px] right-[-30px] w-24 h-24 rounded-full bg-brand-orange/5 blur-xl pointer-events-none"></div>
            
            <span className="text-[9px] text-brand-muted font-bold uppercase tracking-wider block">Billetera de Trabajo</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-black text-brand-text">S/ {earnings.toFixed(2)}</span>
              <span className="text-xs font-bold text-green-500">Saldo Netó</span>
            </div>

            {/* Quick stats mini grid */}
            <div className="grid grid-cols-2 gap-3 border-t border-brand-border/40 mt-5 pt-4 text-xs">
              <div className="p-2.5 bg-slate-50 border border-brand-border/40 rounded-xl">
                <span className="text-[9px] text-brand-muted block uppercase font-bold">Entregas</span>
                <span className="font-black text-brand-text text-sm">{completedDeliveries} pedidos</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-brand-border/40 rounded-xl">
                <span className="text-[9px] text-brand-muted block uppercase font-bold">Nivel</span>
                <span className="font-black text-brand-orange text-sm flex items-center gap-1">
                  Bronce Rep
                  <Award className="w-3.5 h-3.5 fill-current" />
                </span>
              </div>
            </div>

            {/* Withdraw Button */}
            <button
              onClick={() => {
                if (earnings <= 0) {
                  alert('No tienes saldo disponible para retirar.');
                  return;
                }
                setWithdrawAmount(earnings.toString());
                setShowWithdrawModal(true);
              }}
              className="w-full mt-4 bg-brand-text hover:bg-brand-text/95 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4 text-brand-orange" />
              Retirar a Banco
            </button>
          </div>

          {/* Vehicle Configurator */}
          <div className="glass-effect rounded-3xl p-6 bg-white border border-brand-border/60 shadow-sm text-left">
            <h3 className="text-xs font-extrabold text-brand-text uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Bike className="w-4 h-4 text-brand-orange" />
              Configurar Transporte
            </h3>
            
            <div className="flex gap-2 bg-brand-dark p-1 rounded-xl border border-brand-border/50">
              {[
                { type: 'foot', label: 'Pie', speed: 'Lento' },
                { type: 'bike', label: 'Bici', speed: 'Medio' },
                { type: 'moto', label: 'Moto', speed: 'Rápido' }
              ].map((veh) => (
                <button
                  key={veh.type}
                  onClick={() => {
                    if (activeDelivery) {
                      alert('No puedes cambiar de vehículo durante un reparto activo.');
                      return;
                    }
                    setVehicleType(veh.type);
                  }}
                  className={`flex-1 py-2 px-1 text-center rounded-lg transition-all cursor-pointer ${
                    vehicleType === veh.type
                      ? 'bg-gradient-to-r from-brand-red to-brand-orange text-white font-extrabold shadow-sm'
                      : 'text-brand-muted hover:text-brand-text'
                  }`}
                >
                  <p className="text-xs font-bold">{veh.label}</p>
                  <p className={`text-[8px] ${vehicleType === veh.type ? 'text-white/80' : 'text-brand-muted/70'}`}>{veh.speed}</p>
                </button>
              ))}
            </div>
          </div>

          {/* FAQ/Rules Info */}
          <div className="glass-effect rounded-3xl p-6 bg-white border border-brand-border/60 shadow-sm text-left">
            <h4 className="text-[10px] text-brand-muted font-bold uppercase tracking-wider mb-3">Normas de Reparto UIDE</h4>
            <div className="space-y-3 text-[11px] text-brand-muted leading-relaxed">
              <div className="flex gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <p><strong>Firma Digital (QR):</strong> Siempre escanea el QR en el celular del estudiante al entregar. Es la única forma de validar el cobro.</p>
              </div>
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <p><strong>Puntualidad:</strong> Cuida la velocidad de entrega en los pasillos de las facultades para evitar accidentes.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* QR CAMERA SCANNER SIMULATION MODAL */}
      <AnimatePresence>
        {showScanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScanner(false)}
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl z-10 text-white p-6 relative"
            >
              {/* Top border decor */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow"></div>
              
              <button 
                onClick={() => setShowScanner(false)}
                className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-all"
              >
                <X className="w-4 h-4 text-slate-300" />
              </button>

              <div className="text-center py-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 mb-1 text-brand-orange">
                  <QrCode className="w-4 h-4 animate-pulse" />
                  Escanear QR del Cliente
                </h3>
                <p className="text-[10px] text-slate-400">Escaneando firma digital en el aula...</p>
              </div>

              {/* Mock camera view */}
              <div className="relative w-full h-[220px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
                {/* Camera Feed Mock Graphic */}
                <div className="absolute inset-8 border-2 border-brand-orange/40 border-dashed rounded-xl animate-pulse"></div>
                
                {/* Laser animation */}
                {scannerScanning && <div className="animate-laser"></div>}
                
                {scannerScanning ? (
                  <div className="flex flex-col items-center gap-2 z-10 text-center p-4">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange animate-bounce">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-300">Alinea el código QR del cliente...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 z-10 text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 animate-scale">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <p className="text-xs font-bold text-green-400">¡Escaneo Exitoso!</p>
                    <p className="text-[9px] text-slate-400">Pedido verificado con el cliente.</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-2">
                {!scannerScanning ? (
                  <button
                    onClick={handleConfirmScanner}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    Confirmar Entrega
                  </button>
                ) : (
                  <button
                    onClick={() => setScannerScanning(false)}
                    className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md"
                  >
                    Simular Lectura de QR
                  </button>
                )}
                
                <button
                  onClick={() => setShowScanner(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                  Cancelar
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WITHDRAW MONEY MODAL */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWithdrawModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-brand-border rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl z-10 text-brand-text p-6 relative text-left"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow"></div>
              
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-all"
              >
                <X className="w-4 h-4 text-brand-muted" />
              </button>

              <h3 className="text-base font-extrabold mb-2 text-brand-text">Retirar Ganancias a Banco</h3>
              <p className="text-xs text-brand-muted mb-4">Envía tu dinero de reparto de forma directa y segura a tu cuenta UIDE registrada.</p>

              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Monto a Transferir (S/)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted font-bold text-xs">S/</span>
                    <input
                      type="number"
                      step="0.01"
                      max={earnings}
                      min="1.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-border rounded-xl py-3 pl-8 pr-4 text-sm text-brand-text focus:outline-none"
                      required
                    />
                  </div>
                  <span className="text-[9px] text-brand-muted block">Máximo disponible: S/ {earnings.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand-red to-brand-orange text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <TrendingUp className="w-4 h-4 text-white" />
                  Confirmar Transferencia
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
