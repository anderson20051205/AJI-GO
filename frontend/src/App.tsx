import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Sparkles, UtensilsCrossed, ShoppingBag, User as UserIcon, Monitor, Bike, Star, Clock } from 'lucide-react';
import ChiliIcon from './components/atoms/ChiliIcon';
import RestaurantCarousel from './components/organisms/RestaurantCarousel';

import AuthPage from './components/templates/AuthPage';
import Navbar from './components/organisms/Navbar';
import RestaurantGrid, { MOCK_RESTAURANTS } from './components/organisms/RestaurantGrid';
import FoodItemModal from './components/organisms/FoodItemModal';
import CartDrawer from './components/organisms/CartDrawer';
import OrderTracker from './components/templates/OrderTracker';
import RestaurantAdmin from './components/templates/RestaurantAdmin';
import DriverPortal from './components/templates/DriverPortal';
import UserProfileModal from './components/organisms/UserProfileModal';

import { User, CartItem, Order, Dish } from './types';
import { UideFaculty } from './data/faculties';
import './App.css';

export default function App() {
  // ESTADOS DEL NÚCLEO DE LA APLICACIÓN CON TIPADO STRICT
  /* ESTADO DE SESION UNIFICADO */
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [activePage, setActivePage] = useState<'dashboard' | 'tracking'>('dashboard');
  const [viewMode, setViewMode] = useState<'customer' | 'admin' | 'driver'>('customer');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // ESTADOS DE FILTRO Y BÚSQUEDA
  const [searchTerm, setSearchTerm] = useState('');
  const [currentAddress, setCurrentAddress] = useState<string>(UideFaculty.CIENCIAS_TECNICAS);

  // ESTADOS DEL CARRITO DE COMPRAS Y PEDIDOS
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<Dish | null>(null);
  const [checkoutDetails, setCheckoutDetails] = useState<Order | null>(null);

  /* ESTADO DE NOTIFICACIONES DINAMICAS */
  const [notifications, setNotifications] = useState<{ id: number; text: string; time: string }[]>([
    { id: 1, text: "Bienvenido a AJI GO. Descubre especialidades del campus.", time: "Hace 1 min" }
  ]);

  // COLA  DE ORDENES (INICIALIZADA VACÍA SIN DATOS SIMULADOS)
  const [orders, setOrders] = useState<Order[]>([]);

  /* OBTENER EL USUARIO ACTIVO SEGUN EL MODO DE VISTA */
  const getActiveUser = () => {
    return currentUser;
  };

  const activeUser = currentUser;

  /* LIMPIAR COLA DE NOTIFICACIONES */
  const handleClearNotifications = () => {
    setNotifications([]);
  };

  /* ENRUTAMIENTO DINAMICO POR ROLES */
  const parsePath = () => {
    const path = window.location.pathname;

    if (path === '/admin') {
      setViewMode('admin');
    } else if (path === '/driver') {
      setViewMode('driver');
    } else if (path === '/tracking') {
      setViewMode('customer');
      setActivePage('tracking');
    } else if (path.startsWith('/restaurante/')) {
      const restId = path.replace('/restaurante/', '');
      setViewMode('customer');
      setActivePage('dashboard');
      setSelectedRestaurantId(restId);
    } else {
      setViewMode('customer');
      setActivePage('dashboard');
      setSelectedRestaurantId(null);
      if (path !== '/' && path !== '/login') {
        window.history.replaceState(null, '', '/');
      }
    }
  };

  /* ACTUALIZACION DE RUTA EN EL NAVEGADOR */
  const updatePath = (
    mode: 'customer' | 'admin' | 'driver',
    page: 'dashboard' | 'tracking',
    restId: string | null
  ) => {
    let target = '/';
    if (mode === 'admin') {
      target = '/admin';
    } else if (mode === 'driver') {
      target = '/driver';
    } else if (page === 'tracking') {
      target = '/tracking';
    } else if (restId) {
      target = `/restaurante/${restId}`;
    }

    if (window.location.pathname !== target) {
      window.history.pushState(null, '', target);
    }
  };

  /* ESCUCHADOR DE POPSTATE Y MONTAJE INICIAL */
  useEffect(() => {
    parsePath();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      parsePath();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /* ACTUALIZACION DE LA URL CON ESTADOS CLAVE */
  useEffect(() => {
    updatePath(viewMode, activePage, selectedRestaurantId);
  }, [viewMode, activePage, selectedRestaurantId]);

  /* FUNCIONES DE AUTENTICACION UNIFICADAS */
  const handleLoginSuccess = (userData: User) => {
    setCurrentUser(userData);
    setViewMode(userData.role || 'customer');

    let roleText = 'Cliente';
    if (userData.role === 'admin') roleText = 'Socio Comercial';
    if (userData.role === 'driver') roleText = 'Repartidor';

    setNotifications(prev => [
      { id: Date.now(), text: `Sesión iniciada como ${roleText}: ${userData.name}`, time: "Ahora" },
      ...prev
    ]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setActivePage('dashboard');
  };

  // CONTROLADORES DE CARRITO DE COMPRAS
  const handleAddToCart = (newCartItem: CartItem) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item =>
        item.baseId === newCartItem.baseId &&
        item.size === newCartItem.size &&
        JSON.stringify(item.extras) === JSON.stringify(newCartItem.extras)
      );

      if (existingIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += newCartItem.quantity;
        return updatedCart;
      }
      return [...prevCart, newCartItem];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item => item.id === cartItemId ? { ...item, quantity: newQuantity } : item)
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
  };

  const handleCheckout = (details: any) => {
    const newOrder: Order = {
      id: `AG-${Math.floor(100000 + Math.random() * 900000)}`,
      items: details.items,
      subtotal: details.subtotal,
      deliveryFee: details.deliveryFee,
      discount: details.discount,
      tax: details.tax,
      total: details.total,
      coupon: details.coupon,
      deliveryDetails: details.deliveryDetails,
      status: 0,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      restaurant: details.items[0]?.restaurant || 'UIDE Bakery'
    };

    setOrders(prev => [newOrder, ...prev]);
    setCheckoutDetails(newOrder);
    setActivePage('tracking');

    /* NOTIFICACION EN TIEMPO REAL AL CONFIRMAR COMPRA */
    setNotifications(prev => [
      { id: Date.now(), text: `Pedido ${newOrder.id} creado con éxito. En espera de confirmación.`, time: "Ahora" },
      ...prev
    ]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: number) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setCheckoutDetails(prev => {
      if (prev && prev.id === orderId) {
        return { ...prev, status: newStatus };
      }
      return prev;
    });

    /* DETECTOR DEL ESTADO DEL PEDIDO PARA ACTUALIZAR NOTIFICACIONES */
    const getStatusText = (status: number) => {
      if (status === 1) return "está en preparación";
      if (status === 2) return "está en camino a tu aula";
      if (status === 3) return "ha sido entregado";
      return "ha cambiado de estado";
    };

    setNotifications(prev => [
      { id: Date.now(), text: `El pedido ${orderId} ${getStatusText(newStatus)}.`, time: "Ahora" },
      ...prev
    ]);
  };

  const handleAssignDriverToOrder = (orderId: string, driverName: string) => {
    const driverDetails = {
      driverName,
      driverVehicle: 'Motocicleta Honda (AJI-990)',
      driverPhone: '+593 98 765 4321'
    };

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...driverDetails } : o));
    setCheckoutDetails(prev => {
      if (prev && prev.id === orderId) {
        return { ...prev, ...driverDetails };
      }
      return prev;
    });
  };

  const handleBackToMenu = () => {
    setActivePage('dashboard');
    setCart([]);
    setCheckoutDetails(null);
  };

  //SEMANTICA PARA REDIRIGIR AL INICIO
  const handleLogoClick = () => {
    if (currentUser?.role === 'admin') {
      return;
    }
    setViewMode('customer');
    setSelectedRestaurantId(null);
    setActivePage('dashboard');
  };

  /* REDIRECCION AL FORMULARIO DE ACCESO EXCLUSIVO SI NO HAY SESIÓN INICIADA */
  if (!currentUser) {
    return (
      <AuthPage onLoginSuccess={handleLoginSuccess} />
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col font-sans select-none overflow-x-hidden pb-24 md:pb-0">

      {/* NAVBAR ORGANISMO */}
      <Navbar
        user={activeUser}
        cartItemsCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        onLogout={handleLogout}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        currentAddress={currentAddress}
        onChangeAddress={setCurrentAddress}
        viewMode={viewMode}
        onToggleViewMode={(mode: any) => setViewMode(mode)}
        onProfileClick={() => setIsProfileOpen(true)}
        onLogoClick={handleLogoClick}
        notifications={notifications}
        onClearNotifications={handleClearNotifications}
      />

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {viewMode === 'admin' ? (
            /* PORTAL DEL SOCIO COMERCIAL */
            <motion.div
              key="admin-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <RestaurantAdmin
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                user={currentUser}
              />
            </motion.div>
          ) : viewMode === 'driver' ? (
            /* PORTAL DEL REPARTIDOR */
            <motion.div
              key="driver-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <DriverPortal
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onAssignDriver={handleAssignDriverToOrder}
                user={currentUser}
              />
            </motion.div>
          ) : activePage === 'dashboard' ? (
            /* VISTA DEL CLIENTE */
            <motion.div
              key={selectedRestaurantId ? `restaurant-${selectedRestaurantId}` : "dashboard"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {selectedRestaurantId ? (
                /* MENÚ DEL LOCAL ESPECÍFICO SELECCIONADO */
                (() => {
                  const currentRest = MOCK_RESTAURANTS.find(r => r.id === selectedRestaurantId);
                  if (!currentRest) return null;

                  return (
                    <div className="space-y-6 max-w-[95%] xl:max-w-[90%] 2xl:max-w-[1440px] mx-auto px-4 md:px-8 py-8">
                      {/* BREADCRUMB / BOTÓN RETORNAR */}
                      <div className="flex justify-between items-center mb-6">
                        <button
                          onClick={() => setSelectedRestaurantId(null)}
                          className="flex items-center gap-2.5 px-4.5 py-3 rounded-xl bg-white border border-brand-border hover:border-brand-orange text-brand-text hover:text-brand-orange font-black text-xs shadow-sm transition-all cursor-pointer"
                        >
                          ← Volver al Campus
                        </button>
                        <span className="text-xs bg-brand-orange/10 text-brand-orange px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest border border-brand-orange/15">
                          SECCIÓN DE LOCAL
                        </span>
                      </div>

                      {/* BANNER DE LOCAL */}
                      <div className={`p-8 md:p-10 bg-gradient-to-r ${currentRest.bannerColor || 'from-brand-red to-brand-orange'} rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl`}>
                        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

                        <div className="flex items-center gap-4.5 relative z-10 text-left">
                          <div className="relative w-18 h-18 rounded-2xl bg-white border border-brand-border flex items-center justify-center font-black shadow-lg shrink-0 overflow-hidden">
                            {currentRest.useImage && currentRest.imageSrc ? (
                              <img
                                src={currentRest.imageSrc}
                                alt={currentRest.name}
                                className="w-full h-full object-cover relative z-10"
                              />
                            ) : null}
                            <span className="absolute text-xs tracking-wider font-extrabold text-brand-orange">
                              {currentRest.badgeText}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                {currentRest.name}
                              </h2>
                              <span className="flex items-center gap-1 bg-white/20 text-white font-bold text-xs px-2.5 py-1 rounded-lg border border-white/10 shrink-0">
                                <Star className="w-3.5 h-3.5 fill-current text-brand-yellow" />
                                {currentRest.rating}
                              </span>
                            </div>
                            <p className="text-xs font-black text-white/95 mt-1">
                              {currentRest.tagline}
                            </p>
                            <p className="text-xs text-white/70 mt-2 leading-relaxed max-w-xl hidden sm:block font-medium">
                              {currentRest.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 relative z-10 bg-black/20 border border-white/10 px-4.5 py-3 rounded-2xl">
                          <Clock className="w-4.5 h-4.5 text-white" />
                          <div className="text-left font-semibold">
                            <p className="text-[9px] text-white/60 font-bold uppercase tracking-wider">MODALIDAD UIDE</p>
                            <p className="text-xs font-bold text-white">Retiro / Delivery</p>
                          </div>
                        </div>
                      </div>

                      {/* GRILLA DEL MENÚ */}
                      <div className="pt-4 text-left">
                        <RestaurantGrid
                          selectedCategory="all"
                          searchTerm={searchTerm}
                          onSelectItem={setSelectedItemForModal}
                          selectedRestaurantId={selectedRestaurantId}
                        />
                      </div>
                    </div>
                  );
                })()
              ) : (
                /* INICIO DE PLATAFORMA (CAMPUS HERO & CAROUSEL) */
                <>
                  <div className="relative bg-gradient-to-b from-brand-card/90 to-brand-dark/40 py-20 px-4 md:px-8 border-b border-brand-border/30">
                    <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-orange/5 blur-3xl pointer-events-none"></div>
                    <div className="max-w-[95%] xl:max-w-[90%] 2xl:max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-left">

                      <div className="space-y-5 max-w-2xl">
                        <span className="inline-flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange text-xs font-black px-4 py-1.5 rounded-full border border-brand-orange/15">
                          <Sparkles className="w-4 h-4 fill-current animate-pulse" />
                          EXCLUSIVO UIDE
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-brand-text tracking-tight leading-tight">
                          Tu comida favorita de la <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow">UIDE</span> sin salir de clase
                        </h1>
                        <p className="text-sm font-semibold text-brand-muted max-w-xl leading-relaxed mt-4">
                          Sabor premium directo a tu aula en el campus de la UIDE. Tu plataforma exclusiva de delivery y retiro en local para estudiantes y docentes.
                        </p>
                      </div>

                      <div className="relative hidden md:flex justify-center items-center select-none w-72 h-72">
                        <div className="absolute w-60 h-60 rounded-full border-2 border-brand-orange/10 border-dashed animate-spin" style={{ animationDuration: '40s' }}></div>
                        <div className="absolute w-52 h-52 rounded-full bg-gradient-to-tr from-brand-red/10 via-brand-orange/15 to-transparent blur-md"></div>
                        <div className="w-40 h-40 rounded-full bg-brand-card border border-brand-border flex items-center justify-center shadow-2xl relative animate-float">
                          <ChiliIcon className="w-18 h-18 text-brand-orange animate-pulse" />
                          <div className="absolute -bottom-2 bg-gradient-to-r from-brand-red to-brand-orange text-white text-[10px] uppercase font-black px-4 py-1 rounded-full shadow-lg border border-white">
                            AJI GO
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <RestaurantCarousel onSelectRestaurant={setSelectedRestaurantId} />
                </>
              )}
            </motion.div>
          ) : (
            /* SEGUIMIENTO EN VIVO DEL PEDIDO */
            <motion.div
              key="tracking"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <OrderTracker
                orderDetails={checkoutDetails}
                deliveryAddress={currentAddress}
                onBackToMenu={handleBackToMenu}
                onUpdateStatus={handleUpdateOrderStatus}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER SEMÁNTICO */}
      <footer className="bg-brand-card border-t border-brand-border py-10 px-4 md:px-8 mt-auto text-left">
        <div className="max-w-[95%] xl:max-w-[90%] 2xl:max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-muted font-semibold">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-brand-red/15 text-brand-red">
              <ChiliIcon className="w-4.5 h-4.5" />
            </div>
            <span className="font-black text-brand-text">AJI GO Delivery</span>
            <span>&copy; {new Date().getFullYear()} Todos los derechos reservados.</span>
          </div>

          <div className="flex gap-6">
            <a href="#" onClick={(e) => { e.preventDefault(); alert('En desarrollo'); }} className="hover:text-brand-orange transition-colors">Ayuda & Soporte</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('En desarrollo'); }} className="hover:text-brand-orange transition-colors">Términos Legales</a>
            <a href="https://www.uide.edu.ec/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">Portal UIDE</a>
          </div>
        </div>
      </footer>

      {/* MODAL DE SELECCIÓN DE PLATO */}
      <AnimatePresence>
        {selectedItemForModal && (
          <FoodItemModal
            item={selectedItemForModal}
            onClose={() => setSelectedItemForModal(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* PANEL LATERAL DEL CARRITO */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />
        )}
      </AnimatePresence>

      {/* MODAL DE PERFIL */}
      <AnimatePresence>
        {isProfileOpen && (
          <UserProfileModal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            user={activeUser}
            orders={orders}
            currentAddress={currentAddress}
            onViewOrderTracking={(order) => {
              setCheckoutDetails(order);
              setActivePage('tracking');
              setIsProfileOpen(false);
            }}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
            }}
          />
        )}
      </AnimatePresence>

      {/* BARRA DE BOTONES DE NAVEGACIÓN MÓVIL */}
      {currentUser && currentUser.role !== 'admin' && (
        <div className="fixed bottom-4 left-4 right-4 z-40 bg-white/95 backdrop-blur-md border border-brand-border rounded-2xl shadow-xl flex justify-around items-center p-3.5 md:hidden select-none">
          {currentUser.role !== 'admin' && (
            <>
              <button
                onClick={() => {
                  setViewMode('customer');
                  setSelectedRestaurantId(null);
                  setActivePage('dashboard');
                }}
                className={`flex flex-col items-center gap-1 text-[10px] font-black cursor-pointer ${viewMode === 'customer' && activePage === 'dashboard' && !selectedRestaurantId ? 'text-brand-orange animate-pulse' : 'text-brand-muted hover:text-brand-text'
                  }`}
              >
                <UtensilsCrossed className="w-5.5 h-5.5" />
                <span>Campus</span>
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="flex flex-col items-center gap-1 text-[10px] font-black text-brand-muted hover:text-brand-text relative cursor-pointer"
              >
                <ShoppingBag className="w-5.5 h-5.5 text-brand-text" />
                <span>Carrito</span>
                {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-brand-red to-brand-orange text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsProfileOpen(true)}
                className={`flex flex-col items-center gap-1 text-[10px] font-black cursor-pointer ${isProfileOpen ? 'text-brand-orange' : 'text-brand-muted hover:text-brand-text'
                  }`}
              >
                <UserIcon className="w-5.5 h-5.5 text-brand-text" />
                <span>Mi Perfil</span>
              </button>
            </>
          )}

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setViewMode('admin')}
              className={`flex flex-col items-center gap-1 text-[10px] font-black cursor-pointer ${viewMode === 'admin' ? 'text-brand-orange' : 'text-brand-muted hover:text-brand-text'
                }`}
            >
              <Monitor className="w-5.5 h-5.5 text-brand-text" />
              <span>Socio</span>
            </button>
          )}

          {(currentUser.role === 'driver' || currentUser.driverStatus === 'approved') && (
            <button
              onClick={() => setViewMode('driver')}
              className={`flex flex-col items-center gap-1 text-[10px] font-black cursor-pointer ${viewMode === 'driver' ? 'text-brand-orange animate-pulse' : 'text-brand-muted hover:text-brand-text'
                }`}
            >
              <Bike className="w-5.5 h-5.5 text-brand-text" />
              <span>Repartidor</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
}
