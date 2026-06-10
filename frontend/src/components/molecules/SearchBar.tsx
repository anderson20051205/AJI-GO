import React from 'react';
import { Search } from 'lucide-react';

// INTERFAZ PARA DEFINIR LAS PROPIEDADES DE NUESTRA MOLÉCULA DE BÚSQUEDA
interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Buscar...",
  className = ""
}: SearchBarProps) {
  // RETORNO EL CONTENEDOR CON LA LUPA DE BUSCADOR Y LA ENTRADA DE TEXTO
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-brand-dark border border-brand-border rounded-full py-3.5 pl-12 pr-5 text-sm text-brand-text placeholder-brand-muted/50 focus:outline-none focus:border-brand-orange transition-all duration-200"
      />
    </div>
  );
}
