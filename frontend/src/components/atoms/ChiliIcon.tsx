import React from 'react';

// INTERFAZ PARA ESPECIFICAR LAS PROPIEDADES QUE VA A RECIBIR EL ICONO DEL AJÍ
interface ChiliIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export default function ChiliIcon({ className = "w-6 h-6", ...props }: ChiliIconProps) {
  // RETORNO EL SVG DEL AJÍ CON DEGRADADOS BRILLANTES QUE LE DAN UN ASPECTO CHEVERE
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* CUERPO PRINCIPAL DEL AJÍ*/}
      <path
        d="M16.8 5.6C15.2 6.5 13.9 8 13 9.7C11.5 12.5 10.3 14.8 7.3 17C5.3 18.5 3.3 19.3 1.5 19.4C0.8 19.4 0.5 20.2 1 20.7C3.3 22.8 7 23.3 10.1 22.1C14.3 20.5 17.5 16.5 19.2 12C20.5 8.5 20.8 4.7 19.4 2C19.1 1.4 18.2 1.3 17.7 1.8L16.8 5.6Z"
        fill="url(#chili-gradient-accent)"
      />
      {/* TALLO VERDE SUPERIOR DEL AJÍ*/}
      <path
        d="M19.4 2C19.8 1.5 20.5 1.5 21 2C22 3 22.5 4.5 22.5 5.5C22.5 6.3 21.8 7 21 7C20.2 7 19.5 6.3 19.5 5.5C19.5 4.5 19.1 3.5 18.5 2.8L19.4 2Z"
        fill="#22C55E"
      />
      {/* REFLEJO CURVO BRILLANTE EN COLOR BLANCO SEMITRANSPARENTE*/}
      <path
        d="M17.5 7.5C16.8 8.8 15.9 10 14.8 11.2C13.8 12.3 12.8 13.3 11.5 14.3C11 14.7 10.3 14.5 10 14C9.7 13.5 9.8 12.8 10.3 12.5C11.4 11.6 12.3 10.7 13.2 9.8C14.1 8.8 14.8 7.8 15.3 6.8C15.6 6.3 16.3 6.1 16.8 6.4C17.3 6.7 17.5 7.3 17.2 7.8L17.5 7.5Z"
        fill="#FFFFFF"
        opacity="0.35"
      />
      <defs>
        <linearGradient id="chili-gradient-accent" x1="20" y1="2" x2="3" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF8A00" />
          <stop offset="30%" stopColor="#FF3838" />
          <stop offset="70%" stopColor="#E00000" />
          <stop offset="100%" stopColor="#8A0000" />
        </linearGradient>
      </defs>
    </svg>
  );
}
