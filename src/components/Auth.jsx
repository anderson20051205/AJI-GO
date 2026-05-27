import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import ChiliIcon from './ChiliIcon';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const validateEmail = (val) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const handleSubmit = (e) => {
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

    setIsLoading(true);

    // Simulate login API call
    setTimeout(() => {
      setIsLoading(false);
      if (isLogin) {
        setSuccessMsg('¡Bienvenido a AJI GO!');
        setTimeout(() => {
          onLoginSuccess({ name: email.split('@')[0], email });
        }, 1200);
      } else {
        setSuccessMsg('Registro exitoso. Iniciando sesión...');
        setTimeout(() => {
          onLoginSuccess({ name, email });
        }, 1500);
      }
    }, 1800);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-brand-dark px-4 overflow-hidden">
      {/* Decorative Glowing Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-red opacity-10 blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand-orange opacity-10 blur-[130px] pointer-events-none animate-pulse-slow"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-brand-red to-brand-orange shadow-lg shadow-brand-red/20 mb-4 animate-float">
            <ChiliIcon className="w-11 h-11 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-text font-sans bg-clip-text text-transparent bg-gradient-to-r from-brand-text via-brand-orange to-brand-red">
            AJI <span className="text-brand-red">GO</span>
          </h1>
          <p className="text-brand-muted text-sm mt-2">Sabores ardientes directos a tu mesa</p>
        </div>

        {/* Auth Glass Card */}
        <div className="glass-effect rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow"></div>
          
          <AnimatePresence mode="wait">
            {successMsg ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-brand-text mb-2">{successMsg}</h3>
                <p className="text-brand-muted text-sm">Cargando tu menú gastronómico...</p>
                
                {/* Loader dots */}
                <div className="flex space-x-1.5 mt-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-brand-text mb-2">
                  {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <p className="text-brand-muted text-sm mb-6">
                  {isLogin ? 'Ingresa tus credenciales para ordenar' : 'Regístrate y disfruta de beneficios exclusivos'}
                </p>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs rounded-xl mb-4"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Nombre Completo</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                        <input
                          type="text"
                          placeholder="Tu nombre completo"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-brand-dark border border-brand-border rounded-xl py-3 pl-10 pr-4 text-sm text-brand-text placeholder-brand-muted/60 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                      <input
                        type="email"
                        placeholder="tu@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-border rounded-xl py-3 pl-10 pr-4 text-sm text-brand-text placeholder-brand-muted/60 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider block">Contraseña</label>
                      {isLogin && (
                        <a href="#" onClick={(e) => { e.preventDefault(); alert('Funcionalidad de recuperación en desarrollo.'); }} className="text-xs text-brand-orange hover:text-brand-yellow transition-colors font-medium">
                          ¿Olvidaste tu contraseña?
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-border rounded-xl py-3 pl-10 pr-10 text-sm text-brand-text placeholder-brand-muted/60 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative overflow-hidden group bg-gradient-to-r from-brand-red via-brand-orange to-brand-yellow hover:opacity-95 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-brand-red/10 transition duration-300 flex items-center justify-center text-sm"

                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>{isLogin ? 'Entrar a la Experiencia' : 'Crear Cuenta'}</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <span className="text-brand-muted">
                    {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}
                  </span>{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                    }}
                    className="text-brand-orange hover:text-brand-yellow font-bold transition-colors focus:outline-none"
                    disabled={isLoading}
                  >
                    {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer info */}
        <p className="text-center text-xs text-brand-muted/50 mt-6">
          Al continuar, aceptas nuestros Términos de Servicio y Políticas de Privacidad.
        </p>
      </motion.div>
    </div>
  );
}
