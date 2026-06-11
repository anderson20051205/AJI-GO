import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2, UtensilsCrossed, Bike } from 'lucide-react';
import { User as UserType } from '../../types';

/* INTERFAZ PARA EL CONTROL DE ACCESO CON SELECCIÓN DE ROL UNIFICADA */
interface AuthPageProps {
  onLoginSuccess: (user: UserType) => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [selectedRole, setSelectedRole] = useState<'customer' | 'admin' | 'driver'>('customer');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  /* ESTADO DE ACEPTACION DE TERMINOS Y CONDICIONES */
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState('Piedra Negra');

  const validateEmail = (val: string) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    /* VALIDACION DE TERMINOS Y CONDICIONES OBLIGATORIA */
    if (!isLogin && !acceptTerms) {
      setError('Debes aceptar los Términos y Condiciones para continuar.');
      return;
    }

    setIsLoading(true);

    // SIMULO UN TIEMPO DE RESPUESTA DE LA API DE INICIO DE SESIÓN
    setTimeout(() => {
      setIsLoading(false);
      if (isLogin) {
        setSuccessMsg('¡Bienvenido a AJI GO!');
        setTimeout(() => {
          onLoginSuccess({
            name: email.split('@')[0],
            email,
            role: selectedRole,
            driverStatus: selectedRole === 'driver' ? 'approved' : 'none',
            restaurantAdminFor: selectedRole === 'admin' ? selectedRestaurant : undefined
          });
        }, 1200);
      } else {
        setSuccessMsg('Registro exitoso. Iniciando sesión...');
        setTimeout(() => {
          onLoginSuccess({
            name,
            email,
            role: selectedRole,
            driverStatus: selectedRole === 'driver' ? 'approved' : 'none',
            restaurantAdminFor: selectedRole === 'admin' ? selectedRestaurant : undefined
          });
        }, 1500);
      }
    }, 1800);
  };

  /* TEXTOS ADAPTADOS SEGUN EL ROL SELECCIONADO */
  const getRoleTexts = () => {
    switch (selectedRole) {
      case 'admin':
        return {
          titleLogin: 'Ingreso Socio Comercial',
          titleRegister: 'Registrar Local / Comercio',
          descLogin: 'Ingresa tus credenciales para administrar tus locales',
          descRegister: 'Registra tu restaurante y gestiona tus pedidos'
        };
      case 'driver':
        return {
          titleLogin: 'Ingreso de Repartidor',
          titleRegister: 'Registro de Repartidor',
          descLogin: 'Ingresa tus credenciales para realizar entregas',
          descRegister: 'Regístrate y comienza a despachar pedidos en el campus'
        };
      case 'customer':
      default:
        return {
          titleLogin: 'Iniciar Sesión',
          titleRegister: 'Crear Cuenta',
          descLogin: 'Ingresa tus credenciales para ordenar tu comida',
          descRegister: 'Regístrate y disfruta de beneficios exclusivos'
        };
    }
  };

  const roleTexts = getRoleTexts();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-brand-dark px-6 py-12 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* CABECERA DE MARCA */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-brand-text font-sans bg-clip-text text-transparent bg-gradient-to-r from-brand-text via-brand-orange to-brand-red">
            AJI <span className="text-brand-red">GO</span>
          </h1>
          <p className="text-brand-muted text-base mt-3 font-semibold">Sabores ardientes directos a tu mesa</p>
        </div>

        {/* TARJETA DE LOGEO COMPACTA */}
        <div className="glass-effect rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow"></div>

          <AnimatePresence mode="wait">
            {successMsg ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-3xl font-black text-brand-text mb-3">{successMsg}</h3>
                <p className="text-brand-muted text-sm font-semibold">Cargando tu menú gastronómico...</p>

                {/* PUNTOS DE CARGA ANIMADOS */}
                <div className="flex space-x-2 mt-8">
                  <span className="w-3.5 h-3.5 rounded-full bg-brand-red animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-brand-orange animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-brand-yellow animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: isLogin ? -25 : 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 25 : -25 }}
                transition={{ duration: 0.3 }}
              >
                {/* SELECCIÓN DE ROL */}
                <div className="flex bg-brand-dark border border-brand-border rounded-2xl p-1 mb-8 select-none">
                  {[
                    { id: 'customer', label: 'Cliente', icon: User },
                    { id: 'admin', label: 'Socio', icon: UtensilsCrossed },
                    { id: 'driver', label: 'Repartidor', icon: Bike }
                  ].map((r) => {
                    const Icon = r.icon;
                    const isSelected = selectedRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          const newRole = r.id as 'customer' | 'admin' | 'driver';
                          setSelectedRole(newRole);
                          setError('');
                          if (newRole === 'admin' || newRole === 'driver') {
                            setIsLogin(true);
                          }
                        }}
                        className={`flex-1 py-3 px-1 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-lg shadow-brand-red/10'
                            : 'text-brand-muted hover:text-brand-text'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{r.label}</span>
                      </button>
                    );
                  })}
                </div>

                <h2 className="text-3xl font-black text-brand-text mb-2.5">
                  {isLogin ? roleTexts.titleLogin : roleTexts.titleRegister}
                </h2>
                <p className="text-brand-muted text-sm mb-8 font-semibold text-left">
                  {isLogin ? roleTexts.descLogin : roleTexts.descRegister}
                </p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs rounded-2xl mb-6 font-bold text-left"
                  >
                    {error}
                  </motion.div>
                )}

                {/* FORMULARIO DE ACCESO */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {selectedRole === 'admin' && (
                    <div className="space-y-2 text-left">
                      <label className="text-xs font-black text-brand-muted uppercase tracking-widest block">Restaurante / Sucursal</label>
                      <div className="relative">
                        <select
                          value={selectedRestaurant}
                          onChange={(e) => setSelectedRestaurant(e.target.value)}
                          className="w-full bg-brand-dark border border-brand-border rounded-2xl py-4 px-5 text-sm text-brand-text placeholder-brand-muted/60 focus:outline-none focus:border-brand-orange appearance-none cursor-pointer"
                          disabled={isLoading}
                        >
                          <option value="Piedra Negra">Piedra Negra</option>
                          <option value="El Capi">El Capi</option>
                          <option value="Collage">Collage</option>
                          <option value="UIDE Bakery">UIDE Bakery</option>
                          <option value="El Cargo">El Cargo</option>
                          <option value="Toscana">Toscana</option>
                          <option value="Happy Coffee">Happy Coffee</option>
                          <option value="La Hueca">La Hueca</option>
                          <option value="Hanaska">Hanaska</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-muted">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {!isLogin && (
                    <div className="space-y-2 text-left">
                      <label className="text-xs font-black text-brand-muted uppercase tracking-widest block">Nombre Completo</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                        <input
                          type="text"
                          placeholder="Tu nombre completo"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-brand-dark border border-brand-border rounded-2xl py-4 pl-12 pr-5 text-sm text-brand-text placeholder-brand-muted/60 focus:outline-none focus:border-brand-orange"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-left">
                    <label className="text-xs font-black text-brand-muted uppercase tracking-widest block">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                      <input
                        type="email"
                        placeholder="tu@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-border rounded-2xl py-4 pl-12 pr-5 text-sm text-brand-text placeholder-brand-muted/60 focus:outline-none focus:border-brand-orange"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-black text-brand-muted uppercase tracking-widest block">Contraseña</label>
                      {isLogin && (
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); alert('Funcionalidad de recuperación en desarrollo.'); }}
                          className="text-xs text-brand-orange hover:text-brand-yellow transition-colors font-bold"
                        >
                          ¿Olvidaste tu contraseña?
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-border rounded-2xl py-4 pl-12 pr-12 text-sm text-brand-text placeholder-brand-muted/60 focus:outline-none focus:border-brand-orange"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition-colors focus:outline-none cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* CASILLA DE ACEPTACION DE TERMINOS Y CONDICIONES */}
                  {!isLogin && (
                    <div className="flex items-start gap-3 text-left">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-1 accent-brand-orange h-4.5 w-4.5 rounded border-brand-border focus:ring-brand-orange cursor-pointer"
                        disabled={isLoading}
                      />
                      <label htmlFor="acceptTerms" className="text-xs text-brand-muted font-semibold leading-relaxed">
                        Acepto los <a href="#" onClick={(e) => { e.preventDefault(); alert('Términos y Condiciones en desarrollo'); }} className="text-brand-orange hover:text-brand-yellow font-black transition-colors underline">Términos y Condiciones</a> y la Política de Privacidad de la plataforma.
                      </label>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative overflow-hidden group bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow hover:opacity-95 text-white font-black py-4.5 px-6 rounded-2xl shadow-xl shadow-brand-red/10 transition duration-300 flex items-center justify-center text-sm cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>{isLogin ? 'Entrar a la Experiencia' : 'Crear Cuenta'}</span>
                        <ArrowRight className="w-4.5 h-4.5 ml-2.5 group-hover:translate-x-1.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                {/* BOTÓN PARA CAMBIAR ENTRE INICIO Y REGISTRO */}
                {selectedRole === 'customer' && (
                  <div className="mt-8 text-center text-sm font-semibold">
                    <span className="text-brand-muted">
                      {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}
                    </span>{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setAcceptTerms(false);
                      }}
                      className="text-brand-orange hover:text-brand-yellow font-black transition-colors focus:outline-none cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MENSAJES DE TÉRMINOS LEGALES */}
        <p className="text-center text-xs text-brand-muted/50 mt-8 font-semibold">
          Al continuar, aceptas nuestros Términos de Servicio y Políticas de Privacidad.
        </p>
      </motion.div>
    </div>
  );
}
