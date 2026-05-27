import React, { useState } from 'react';
import { MapPin, Search, ShoppingBag, Bell, LogOut, User, ChevronDown, Monitor } from 'lucide-react';
import ChiliIcon from './ChiliIcon';

export default function Navbar({ 
  user, 
  cartItemsCount, 
  onCartToggle, 
  onLogout, 
  onSearchChange,
  searchTerm,
  currentAddress,
  onChangeAddress,
  viewMode,
  onToggleViewMode,
  onProfileClick
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  const addresses = [
    "Facultad de Ciencias Técnicas",
    "Facultad de Medicina",
    "Facultad Administrativa",
    "Edificio de Aulas"
  ];

  const notifications = [
    { id: 1, text: "Tu pedido de Piedra Negra se encuentra en camino.", time: "Hace 2 min" },
    { id: 2, text: "Cupón de bienvenida aplicado con éxito.", time: "Hace 15 min" },
    { id: 3, text: "Nuevas especialidades de temporada en Collage.", time: "Hace 1 hora" }
  ];

  return (
    <nav className="sticky top-0 z-40 w-full glass-effect border-b border-brand-border px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Delivery Location */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer select-none">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-brand-red to-brand-orange shadow-md shadow-brand-red/20">
              <ChiliIcon className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-brand-text tracking-tight hidden sm:inline">
              AJI <span className="text-brand-red">GO</span>
            </span>
          </div>

          {/* Location Picker */}
          <div className="relative">
            <button 
              onClick={() => setShowAddressDropdown(!showAddressDropdown)}
              className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-text transition-colors bg-brand-card/50 border border-brand-border px-3 py-1.5 rounded-full"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-red" />
              <span className="max-w-[120px] md:max-w-[180px] truncate text-brand-text font-medium">
                {currentAddress || addresses[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showAddressDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowAddressDropdown(false)}></div>
                <div className="absolute left-0 mt-2 w-64 bg-brand-card border border-brand-border rounded-2xl shadow-2xl p-2 z-20">
                  <div className="px-3 py-2 text-xs font-semibold text-brand-muted border-b border-brand-border/50 mb-1">
                    SELECCIONAR DIRECCIÓN
                  </div>
                  {addresses.map((addr) => (
                    <button
                      key={addr}
                      onClick={() => {
                        onChangeAddress(addr);
                        setShowAddressDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-brand-dark transition-colors flex items-center gap-2 ${
                        currentAddress === addr ? 'text-brand-orange bg-brand-dark/50' : 'text-brand-text'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-brand-muted" />
                      <span className="truncate">{addr}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center: Search bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input
              type="text"
              placeholder="Buscar restaurantes, platos o antojos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-brand-dark border border-brand-border rounded-full py-2 pl-10 pr-4 text-sm text-brand-text placeholder-brand-muted/50 focus:outline-none focus:border-brand-orange"
            />
          </div>
        </div>

        {/* Right: Actions (Cart, Notifications, View Mode, Profile) */}
        <div className="flex items-center gap-3">
          
          {/* Cart Icon */}
          <button 
            onClick={onCartToggle}
            className="relative p-2.5 rounded-xl bg-brand-card/75 border border-brand-border hover:border-brand-orange hover:bg-brand-dark text-white transition-all flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5 text-brand-text" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-brand-red to-brand-orange text-white text-[10px] font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-brand-dark shadow-md">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl bg-brand-card/75 border border-brand-border hover:border-brand-orange hover:bg-brand-dark text-brand-text hover:text-white transition-all flex items-center justify-center"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-red border border-brand-card"></span>
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                <div className="absolute right-0 mt-3 w-80 bg-brand-card border border-brand-border rounded-2xl shadow-2xl p-3 z-20">
                  <div className="flex justify-between items-center px-2 py-1.5 border-b border-brand-border/50 mb-2">
                    <span className="text-xs font-bold text-brand-text">Notificaciones</span>
                    <span className="text-[10px] text-brand-orange cursor-pointer hover:underline">Marcar como leídas</span>
                  </div>
                  <div className="space-y-1">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-2 hover:bg-brand-dark/50 rounded-xl transition-colors cursor-pointer text-left">
                        <p className="text-xs text-brand-text font-medium leading-relaxed">{notif.text}</p>
                        <span className="text-[9px] text-brand-muted block mt-1">{notif.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Partner View Toggle Button */}
          <button
            onClick={onToggleViewMode}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/20 hover:border-brand-orange text-brand-orange hover:text-brand-yellow font-extrabold text-[10px] uppercase tracking-wider transition-all duration-300"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">
              {viewMode === 'customer' ? 'Modo Socio' : 'Modo Cliente'}
            </span>
          </button>

          <div className="h-5 w-[1px] bg-brand-border"></div>

          {/* Profile Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-orange to-brand-yellow text-brand-dark font-bold text-sm flex items-center justify-center shadow-md">
                {user?.name?.substring(0, 2).toUpperCase() || 'AJ'}
              </div>
              <ChevronDown className="w-4 h-4 text-brand-muted hidden sm:block" />
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}></div>
                <div className="absolute right-0 mt-3 w-48 bg-brand-card border border-brand-border rounded-2xl shadow-2xl p-2 z-20">
                  <div className="px-3 py-2 border-b border-brand-border/50 mb-1 text-left">
                    <p className="text-xs text-brand-muted">Hola,</p>
                    <p className="text-sm font-semibold text-brand-text truncate">{user?.name || 'Cliente UIDE'}</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      onProfileClick();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-brand-text rounded-xl hover:bg-brand-dark transition-colors flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-brand-muted" />
                    Mi Perfil
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-brand-red rounded-xl hover:bg-brand-red/10 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Cerrar Sesión
                  </button>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </nav>
  );
}
