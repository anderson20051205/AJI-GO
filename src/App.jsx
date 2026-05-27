import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, MapPin, Sparkles, ShieldCheck, HelpCircle, ShoppingBag, UtensilsCrossed, Star, Clock } from 'lucide-react';
import ChiliIcon from './components/ChiliIcon';
import RestaurantCarousel from './components/RestaurantCarousel';

import Auth from './components/Auth';
import Navbar from './components/Navbar';
import Categories from './components/Categories';
import RestaurantGrid, { MOCK_RESTAURANTS } from './components/RestaurantGrid';
import FoodItemModal from './components/FoodItemModal';
import CartDrawer from './components/CartDrawer';
import OrderTracker from './components/OrderTracker';
import RestaurantAdmin from './components/RestaurantAdmin';

import './App.css';

function App() {
  const [user, setUser] = useState(null); // Auth state
  const [activePage, setActivePage] = useState('dashboard'); // 'dashboard' or 'tracking'
  const [viewMode, setViewMode] = useState('customer'); // 'customer' or 'admin'
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [restaurantTab, setRestaurantTab] = useState('menu'); // 'menu' or 'orders'
  
  // Browsing/Filters state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentAddress, setCurrentAddress] = useState('Facultad de Ciencias Técnicas');

  // Cart state
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const [checkoutDetails, setCheckoutDetails] = useState(null);

  // Orders State (populated with mock transactions for initial accounting data)
  const [orders, setOrders] = useState([
    {
      id: 'AG-482910',
      items: [
        { name: 'Espresso Americano Orgánico', price: 6.50, quantity: 2, badgeText: 'PN' },
        { name: 'Torta de Chocolate Extrahúmeda', price: 12.00, quantity: 1, badgeText: 'PN' }
      ],
      subtotal: 25.00,
      deliveryFee: 1.50,
      discount: 0,
      tax: 4.77,
      total: 26.50,
      coupon: null,
      deliveryDetails: {
        method: 'delivery',
        faculty: 'Facultad de Ciencias Técnicas',
        floor: 'Piso 1',
        classroom: 'Aula 102',
        notes: 'Dejar en recepción por favor.'
      },
      status: 3, // Entregado
      createdAt: '08:35 AM',
      restaurant: 'Piedra Negra'
    },
    {
      id: 'AG-910283',
      items: [
        { name: 'Bolón de Chicharrón Crujiente', price: 9.50, quantity: 1, badgeText: 'EC' },
        { name: 'Tigrillo Tradicional con Huevo', price: 12.50, quantity: 1, badgeText: 'EC' }
      ],
      subtotal: 22.00,
      deliveryFee: 0,
      discount: 4.40,
      tax: 3.17,
      total: 17.60,
      coupon: 'AJIGO20',
      deliveryDetails: {
        method: 'pickup',
        faculty: 'Facultad de Ciencias Técnicas',
        floor: '',
        classroom: '',
        notes: ''
      },
      status: 3, // Entregado
      createdAt: '10:15 AM',
      restaurant: 'El Capi'
    },
    {
      id: 'AG-718290',
      items: [
        { name: 'Croissant Hojaldrado Francés', price: 5.00, quantity: 4, badgeText: 'UB' },
        { name: 'Cinnamon Roll con Glaseado', price: 6.50, quantity: 2, badgeText: 'UB' }
      ],
      subtotal: 33.00,
      deliveryFee: 1.50,
      discount: 0,
      tax: 6.21,
      total: 34.50,
      coupon: null,
      deliveryDetails: {
        method: 'delivery',
        faculty: 'Facultad de Medicina',
        floor: 'Piso 3',
        classroom: 'Laboratorio A',
        notes: 'Llamar al llegar.'
      },
      status: 2, // Listo / En camino
      createdAt: '12:20 PM',
      restaurant: 'UIDE Bakery'
    }
  ]);

  // Handlers
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setActivePage('dashboard');
    setViewMode('customer');
    setCart([]);
  };

  const handleAddToCart = (newCartItem) => {
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

  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCart(prevCart => 
      prevCart.map(item => item.id === cartItemId ? { ...item, quantity: newQuantity } : item)
    );
  };

  const handleRemoveItem = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
  };

  const handleCheckout = (details) => {
    // Generate real order details structure
    const newOrder = {
      id: `AG-${Math.floor(100000 + Math.random() * 900000)}`,
      items: details.items,
      subtotal: details.subtotal,
      deliveryFee: details.deliveryFee,
      discount: details.discount,
      tax: details.tax,
      total: details.total,
      coupon: details.coupon,
      deliveryDetails: details.deliveryDetails,
      status: 0, // Recibido
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      restaurant: details.items[0]?.restaurant || 'UIDE Bakery'
    };

    setOrders(prev => [newOrder, ...prev]);
    setCheckoutDetails(newOrder);
    setActivePage('tracking');
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    // Sincronizar el pedido que está actualmente bajo seguimiento de cliente
    setCheckoutDetails(prev => {
      if (prev && prev.id === orderId) {
        return { ...prev, status: newStatus };
      }
      return prev;
    });
  };

  const handleBackToMenu = () => {
    setActivePage('dashboard');
    setCart([]); // Clear cart upon successful delivery
    setCheckoutDetails(null);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 0: return { text: 'Recibido', color: 'text-blue-600 bg-blue-50 border-blue-100' };
      case 1: return { text: 'En Preparación', color: 'text-amber-600 bg-amber-50 border-amber-100' };
      case 2: return { text: 'Listo / En Camino', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
      case 3: return { text: 'Entregado', color: 'text-green-600 bg-green-50 border-green-100' };
      default: return { text: 'Pendiente', color: 'text-brand-muted bg-brand-border' };
    }
  };

  // If user is not logged in, show Auth Gate
  if (!user) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* Navigation Header */}
      <Navbar 
        user={user}
        cartItemsCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        onLogout={handleLogout}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        currentAddress={currentAddress}
        onChangeAddress={setCurrentAddress}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(prev => prev === 'customer' ? 'admin' : 'customer')}
      />

      {/* Main Container */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {viewMode === 'admin' ? (
            /* PARTNER / RESTAURANT MANAGEMENT PORTAL */
            <motion.div
              key="admin-portal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <RestaurantAdmin 
                orders={orders} 
                onUpdateOrderStatus={handleUpdateOrderStatus} 
              />
            </motion.div>
          ) : activePage === 'dashboard' ? (
            /* CUSTOMER BROWSER BOARD OR DEDICATED RESTAURANT VIEW */
            <motion.div
              key={selectedRestaurantId ? `restaurant-${selectedRestaurantId}` : "dashboard"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {selectedRestaurantId ? (
                /* DEDICATED RESTAURANT VIEW (APARTADO PROPIO) */
                (() => {
                  const currentRest = MOCK_RESTAURANTS.find(r => r.id === selectedRestaurantId);
                  if (!currentRest) return null;
                  const restOrders = orders.filter(o => o.restaurant === currentRest.name);

                  return (
                    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-8 py-8">
                      {/* Breadcrumbs / Back Button */}
                      <div className="flex justify-between items-center mb-6">
                        <button 
                          onClick={() => {
                            setSelectedRestaurantId(null);
                            setRestaurantTab('menu');
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-brand-border hover:border-brand-orange text-brand-text hover:text-brand-orange font-bold text-xs shadow-sm hover:shadow transition-all"
                        >
                          ← Volver al Campus
                        </button>
                        <span className="text-[10px] bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full font-extrabold uppercase tracking-widest border border-brand-orange/15">
                          SECCIÓN DE LOCAL
                        </span>
                      </div>

                      {/* Restaurant Banner Header */}
                      <div className={`p-6 md:p-8 bg-gradient-to-r ${currentRest.bannerColor || 'from-brand-red to-brand-orange'} rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl`}>
                        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                        
                        {/* Left Side: Logo and Details */}
                        <div className="flex items-center gap-4 relative z-10 text-left">
                          <div className="relative w-16 h-16 rounded-2xl bg-white border border-brand-border flex items-center justify-center font-extrabold shadow-lg shrink-0 overflow-hidden">
                            {currentRest.useImage && currentRest.imageSrc ? (
                              <img 
                                src={currentRest.imageSrc} 
                                alt={currentRest.name} 
                                className="w-full h-full object-cover relative z-10" 
                              />
                            ) : null}
                            <span className="absolute text-sm tracking-wider font-extrabold text-brand-orange">
                              {currentRest.badgeText}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                                {currentRest.name}
                              </h2>
                              <span className="flex items-center gap-1 bg-white/20 text-white font-bold text-xs px-2.5 py-0.5 rounded-lg border border-white/10 shrink-0">
                                <Star className="w-3.5 h-3.5 fill-current text-brand-yellow" />
                                {currentRest.rating}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-white/95 mt-1">
                              {currentRest.tagline}
                            </p>
                            <p className="text-[11px] text-white/70 mt-1.5 leading-relaxed max-w-xl hidden sm:block">
                              {currentRest.description}
                            </p>
                          </div>
                        </div>

                        {/* Right Side: Modality */}
                        <div className="flex items-center gap-3 shrink-0 relative z-10 bg-black/20 border border-white/10 px-4 py-2.5 rounded-2xl">
                          <Clock className="w-4 h-4 text-white" />
                          <div className="text-left">
                            <p className="text-[9px] text-white/60 font-bold uppercase tracking-wider">MODALIDAD UIDE</p>
                            <p className="text-xs font-bold text-white">Retiro / Delivery</p>
                          </div>
                        </div>
                      </div>

                      {/* Local Tabs Menu */}
                      <div className="flex gap-4 border-b border-brand-border pb-3 text-left">
                        <button
                          onClick={() => setRestaurantTab('menu')}
                          className={`flex items-center gap-2 pb-2 text-sm font-extrabold border-b-2 transition-all ${
                            restaurantTab === 'menu' 
                              ? 'border-brand-orange text-brand-orange' 
                              : 'border-transparent text-brand-muted hover:text-brand-text'
                          }`}
                        >
                          <UtensilsCrossed className="w-4 h-4" />
                          Menú de Especialidades
                        </button>
                        <button
                          onClick={() => setRestaurantTab('orders')}
                          className={`flex items-center gap-2 pb-2 text-sm font-extrabold border-b-2 transition-all ${
                            restaurantTab === 'orders' 
                              ? 'border-brand-orange text-brand-orange' 
                              : 'border-transparent text-brand-muted hover:text-brand-text'
                          }`}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Mis Pedidos aquí ({restOrders.length})
                        </button>
                      </div>

                      {/* Local Tabs Content */}
                      {restaurantTab === 'menu' ? (
                        <RestaurantGrid 
                          selectedCategory="all"
                          searchTerm={searchTerm}
                          onSelectItem={setSelectedItemForModal}
                          selectedRestaurantId={selectedRestaurantId}
                        />
                      ) : (
                        /* LOCAL ORDERS HISTORIAL */
                        <div className="space-y-4 text-left">
                          {restOrders.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-3xl border border-brand-border flex flex-col items-center justify-center">
                              <ShoppingBag className="w-10 h-10 text-brand-muted mb-3" />
                              <h4 className="text-sm font-bold text-brand-text">Sin pedidos activos</h4>
                              <p className="text-xs text-brand-muted max-w-xs mt-1">
                                Aún no has realizado pedidos en {currentRest.name}.
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {restOrders.map((order) => {
                                const label = getStatusLabel(order.status);
                                return (
                                  <div key={order.id} className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
                                    <div className="flex justify-between items-start border-b border-brand-border/60 pb-3">
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-black text-brand-text">{order.id}</span>
                                          <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border ${label.color}`}>
                                            {label.text}
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-brand-muted mt-1">Creado: {order.createdAt}</p>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-[9px] text-brand-muted block font-extrabold tracking-wider">TOTAL</span>
                                        <span className="text-sm font-black text-brand-orange">S/ {order.total.toFixed(2)}</span>
                                      </div>
                                    </div>

                                    <div className="space-y-1.5 text-xs">
                                      {order.items.map((it, idx) => (
                                        <div key={idx} className="flex justify-between text-brand-text">
                                          <span className="truncate max-w-[200px]">
                                            <span className="font-extrabold text-brand-orange mr-1">{it.quantity}x</span> {it.name}
                                          </span>
                                          <span className="text-brand-muted">S/ {(it.price * it.quantity).toFixed(2)}</span>
                                        </div>
                                      ))}
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t border-brand-border/60 mt-2">
                                      <span className="text-[10px] text-brand-muted font-semibold">
                                        Tipo: {order.deliveryDetails?.method === 'delivery' ? 'Delivery a Aula' : 'Retiro en Local'}
                                      </span>
                                      <button 
                                        onClick={() => {
                                          setCheckoutDetails(order);
                                          setActivePage('tracking');
                                        }}
                                        className="px-3.5 py-2 rounded-xl bg-brand-orange text-white text-[10px] font-extrabold tracking-wide uppercase hover:opacity-90 transition-opacity"
                                      >
                                        Seguimiento en Vivo
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                /* MAIN CAMPUS BROWSER DASHBOARD */
                <>
                  {/* Hero Banner Section */}
                  <div className="relative bg-gradient-to-b from-brand-card/90 to-brand-dark/40 py-16 px-4 md:px-8 border-b border-brand-border/30">
                    <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-orange/5 blur-3xl pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-left">
                      
                      {/* Left Hero Details */}
                      <div className="space-y-4 max-w-2xl">
                        <span className="inline-flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange text-xs font-black px-3.5 py-1.5 rounded-full border border-brand-orange/15">
                          <Sparkles className="w-3.5 h-3.5 fill-current" />
                          EXCLUSIVO UIDE
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-brand-text tracking-tight leading-tight">
                          Tu comida favorita de la <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow">UIDE</span> sin salir de clase
                        </h1>
                        <p className="text-sm font-semibold text-brand-muted max-w-xl leading-relaxed mt-4">
                          Sabor premium directo a tu aula en el campus de la <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow">UIDE</span>. Tu plataforma exclusiva de delivery y retiro en local para estudiantes y docentes.
                        </p>

                        {/* Responsive Search Input on Mobile only */}
                        <div className="relative max-w-md md:hidden mt-4">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                          <input
                            type="text"
                            placeholder="¿Qué comeremos hoy?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-brand-card border border-brand-border rounded-2xl py-3 pl-10 pr-4 text-sm text-brand-text placeholder-brand-muted/40 focus:outline-none focus:border-brand-orange"
                          />
                        </div>
                      </div>

                      {/* Right Hero Graphic representation (Animated Chili Logo) */}
                      <div className="relative hidden md:flex justify-center items-center select-none w-72 h-72">
                        <div className="absolute w-60 h-60 rounded-full border-2 border-brand-orange/10 border-dashed animate-spin" style={{ animationDuration: '40s' }}></div>
                        <div className="absolute w-52 h-52 rounded-full bg-gradient-to-tr from-brand-red/10 via-brand-orange/15 to-transparent blur-md"></div>
                        <div className="w-40 h-40 rounded-full bg-brand-card border border-brand-border flex items-center justify-center shadow-2xl relative animate-float">
                          <ChiliIcon className="w-16 h-16 text-brand-orange animate-pulse" />
                          <div className="absolute -bottom-2 bg-gradient-to-r from-brand-red to-brand-orange text-white text-[10px] uppercase font-black px-3.5 py-1 rounded-full shadow-lg border border-white">
                            AJI GO
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Restaurant Carousel Slider */}
                  <RestaurantCarousel onSelectRestaurant={setSelectedRestaurantId} />

                  {/* Food Category filter */}
                  <Categories 
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />

                  {/* Products/Restaurants Grid */}
                  <RestaurantGrid 
                    selectedCategory={selectedCategory}
                    searchTerm={searchTerm}
                    onSelectItem={setSelectedItemForModal}
                  />
                </>
              )}
            </motion.div>
          ) : (
            /* CUSTOMER LIVE ORDER TRACKER VIEW */
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

      {/* Footer */}
      <footer className="bg-brand-card border-t border-brand-border py-8 px-4 md:px-8 mt-auto text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-brand-red/15 text-brand-red">
              <ChiliIcon className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-brand-text">AJI GO Delivery</span>
            <span>&copy; {new Date().getFullYear()} Todos los derechos reservados.</span>
          </div>

          <div className="flex gap-6">
            <a href="#" onClick={(e) => { e.preventDefault(); alert('En desarrollo'); }} className="hover:text-brand-orange transition-colors">Ayuda & Soporte</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('En desarrollo'); }} className="hover:text-brand-orange transition-colors">Términos Legales</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('En desarrollo'); }} className="hover:text-brand-orange transition-colors">Portal UIDE</a>
          </div>
        </div>
      </footer>

      {/* Food customization Modal */}
      <AnimatePresence>
        {selectedItemForModal && (
          <FoodItemModal 
            item={selectedItemForModal}
            onClose={() => setSelectedItemForModal(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
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

    </div>
  );
}

export default App;
