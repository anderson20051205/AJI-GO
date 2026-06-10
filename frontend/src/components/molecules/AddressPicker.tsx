import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { UideFaculty } from '../../data/faculties';

// INTERFAZ PARA CONTROLAR LAS PROPIEDADES DE LA MOLÉCULA DE DIRECCIÓN
interface AddressPickerProps {
  currentAddress: string;
  onChangeAddress: (address: string) => void;
}

export default function AddressPicker({
  currentAddress,
  onChangeAddress
}: AddressPickerProps) {
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Obtengo las facultades de la UIDE desde el enum centralizado
  const addresses = Object.values(UideFaculty);

  // EFECTO: Detectar clics fuera del componente para cerrar el menú de direcciones
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowAddressDropdown(false);
      }
    }

    if (showAddressDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddressDropdown]);

  return (
    <div className="relative" ref={containerRef}>
      {/* BOTÓN QUE ACTIVA EL MENÚ DESPLEGABLE */}
      <button
        onClick={() => setShowAddressDropdown(!showAddressDropdown)}
        className="flex items-center gap-2 text-xs text-brand-muted hover:text-brand-text transition-colors bg-brand-card/50 border border-brand-border px-4 py-2 rounded-full cursor-pointer"
      >
        <MapPin className="w-4 h-4 text-brand-red" />
        <span className="max-w-[120px] md:max-w-[200px] truncate text-brand-text font-bold">
          {currentAddress || addresses[0]}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* MENÚ DE DIRECCIONES*/}
      {showAddressDropdown && (
        <div className="absolute left-0 mt-2.5 w-72 bg-brand-card border border-brand-border rounded-2xl shadow-2xl p-2.5 z-20">
          <div className="px-3.5 py-2.5 text-xs font-black text-brand-muted border-b border-brand-border/50 mb-1.5 uppercase tracking-wider">
            Seleccionar Dirección
          </div>
          {addresses.map((addr) => (
            <button
              key={addr}
              onClick={() => {
                onChangeAddress(addr);
                setShowAddressDropdown(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-xs rounded-xl hover:bg-brand-dark transition-colors flex items-center gap-2 cursor-pointer ${currentAddress === addr ? 'text-brand-orange bg-brand-dark/50 font-bold' : 'text-brand-text'
                }`}
            >
              <MapPin className="w-3.5 h-3.5 text-brand-muted" />
              <span className="truncate">{addr}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

