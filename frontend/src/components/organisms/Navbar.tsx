import React, { useState } from 'react';
import { ShoppingBag, Bell, LogOut, User, ChevronDown, MapPin } from 'lucide-react';
import ChiliIcon from '../atoms/ChiliIcon';
import SearchBar from '../molecules/SearchBar';
import AddressPicker from '../molecules/AddressPicker';
import { User as UserType } from '../../types';

/* PROPIEDADES DE LA CABECERA PRINCIPAL CON NOTIFICACIONES DINAMICAS */
interface NavbarProps {
  user: UserType | null;
  cartItemsCount: number;
  onCartToggle: () => void;
  onLogout: () => void;
  onSearchChange: (searchTerm: string) => void;
  searchTerm: string;
  currentAddress: string;
  onChangeAddress: (address: string) => void;
  viewMode: string;
  onToggleViewMode: (mode: string) => void;
  onProfileClick: () => void;
  onLogoClick: () => void;
  notifications: { id: number; text: string; time: string }[];
  onClearNotifications: () => void;
}

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
  onProfileClick,
  onLogoClick,
  notifications,
  onClearNotifications
}: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full glass-effect border-b border-brand-border px-4 py-4 md:px-8">
      <div className="max-w-[95%] xl:max-w-[90%] 2xl:max-w-[1440px] mx-auto flex items-center justify-between gap-4">

        <div className="flex items-center gap-6">
          {/* REDIRECCIÓN DE RUTA AL INICIO */}
          <div
            onClick={onLogoClick}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-brand-red to-brand-orange shadow-md shadow-brand-red/20 group-hover:scale-105 transition-transform duration-200">
              <ChiliIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-brand-text tracking-tight hidden sm:inline">
              AJI <span className="text-brand-red">GO</span>
            </span>
          </div>

          {/* SELECCIONADOR DE DIRECCIONES UNIVERSITARIAS*/}
          <AddressPicker
            currentAddress={currentAddress}
            onChangeAddress={onChangeAddress}
          />
        </div>

        {/* BARRA DE BÚSQUEDA FILTRADORA */}
        {viewMode === 'customer' && (
          <div className="flex-1 max-w-md hidden md:block">
            <SearchBar
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Buscar restaurantes o platos..."
            />
          </div>
        )}

        {/* ACCIONES Y MENÚS DEL USUARIO */}
        <div className="flex items-center gap-4.5">

          {/* CARRITO DE COMPRAS */}
          {viewMode === 'customer' && (
            <button
              onClick={onCartToggle}
              className="relative p-3 rounded-xl bg-brand-card/75 border border-brand-border hover:border-brand-orange hover:bg-brand-dark/20 text-brand-text transition-all flex items-center justify-center cursor-pointer"
            >
              <ShoppingBag className="w-5.5 h-5.5 text-brand-text" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-brand-red to-brand-orange text-white text-xs font-black w-6.5 h-6.5 rounded-full flex items-center justify-center border-2 border-brand-dark shadow-md">
                  {cartItemsCount}
                </span>
              )}
            </button>
          )}

          {/* NOTIFICACIONES DINAMICAS */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 rounded-xl bg-brand-card/75 border border-brand-border hover:border-brand-orange hover:bg-brand-dark/20 text-brand-text hover:text-brand-orange transition-all flex items-center justify-center cursor-pointer relative"
            >
              <Bell className="w-5.5 h-5.5" />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-brand-red border border-brand-card"></span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                <div className="absolute right-0 mt-3 w-80 bg-brand-card border border-brand-border rounded-2xl shadow-2xl p-4 z-20">
                  <div className="flex justify-between items-center px-2 py-1.5 border-b border-brand-border/50 mb-2.5">
                    <span className="text-xs font-black text-brand-text uppercase">Notificaciones</span>
                    {notifications.length > 0 && (
                      <span
                        onClick={() => {
                          onClearNotifications();
                          setShowNotifications(false);
                        }}
                        className="text-[10px] text-brand-orange font-bold cursor-pointer hover:underline"
                      >
                        Limpiar
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-brand-muted py-4 text-center font-semibold">No tienes notificaciones.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-2.5 hover:bg-brand-dark/50 rounded-xl transition-colors cursor-pointer text-left">
                          <p className="text-xs text-brand-text font-bold leading-relaxed">{notif.text}</p>
                          <span className="text-[10px] text-brand-muted block mt-1 font-medium">{notif.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* SEGMENTADOR DE ROLES / MODO DE VISTA (CLIENTE / SOCIO / REPARTIDOR) */}
          {(() => {
            const allowedRoles: { id: string; label: string }[] = [];
            if (user) {
              if (user.role === 'admin') {
                allowedRoles.push({ id: 'admin', label: 'Socio' });
              } else {
                allowedRoles.push({ id: 'customer', label: 'Cliente' });
                if (user.driverStatus === 'approved' || user.role === 'driver') {
                  allowedRoles.push({ id: 'driver', label: 'Repartidor' });
                }
              }
            }

            if (allowedRoles.length <= 1) return null;

            return (
              <div className="flex bg-slate-100/80 border border-brand-border rounded-xl p-0.5 shrink-0 select-none">
                {allowedRoles.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => onToggleViewMode(mode.id)}
                    className={`px-3.5 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${viewMode === mode.id
                        ? 'bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-md'
                        : 'text-brand-muted hover:text-brand-text hover:bg-slate-200/50'
                      }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            );
          })()}

          <div className="h-6 w-[1px] bg-brand-border"></div>

          {/* BOTÓN Y MENÚ DE PERFIL DE USUARIO VISIBLE SOLO CON SESION INICIADA */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-none cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-orange to-brand-yellow text-brand-dark font-black text-sm flex items-center justify-center shadow-md">
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
                <ChevronDown className="w-4 h-4 text-brand-muted hidden sm:block" />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 bg-brand-card border border-brand-border rounded-2xl shadow-2xl p-2 z-20">
                    <div className="px-3.5 py-2.5 border-b border-brand-border/50 mb-1.5 text-left">
                      <p className="text-[10px] text-brand-muted uppercase font-bold">Sesión Iniciada</p>
                      <p className="text-sm font-black text-brand-text truncate">{user.name}</p>
                    </div>

                    <button
                      onClick={() => {
                        onProfileClick();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs text-brand-text rounded-xl hover:bg-brand-dark transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-brand-muted" />
                      Mi Perfil
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs text-brand-red rounded-xl hover:bg-brand-red/10 transition-colors flex items-center gap-2 cursor-pointer font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>

      </div>

      {/* BARRA DE BÚSQUEDA MÓVIL (SE MUESTRA ABAJO DEL NAVBAR EN MÓVIL) */}
      {viewMode === 'customer' && (
        <div className="mt-4 max-w-[95%] mx-auto md:hidden">
          <SearchBar
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Buscar platos o locales..."
          />
        </div>
      )}
    </nav>
  );
}
