import React from 'react';
import './Logo.css';

const Logo = ({ size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="logo-svg"
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f093fb" />
          <stop offset="100%" stopColor="#667eea" />
        </linearGradient>
      </defs>

      {/* Shield Shape - Protection/Prevention */}
      <path
        d="M50 10 L75 20 L75 45 Q75 65 50 85 Q25 65 25 45 L25 20 Z"
        fill="url(#shieldGradient)"
        opacity="0.9"
        className="logo-shield"
      />

      {/* Graduation Cap */}
      <g className="logo-cap">
        {/* Cap Top */}
        <path
          d="M50 35 L70 42 L50 49 L30 42 Z"
          fill="#ffffff"
          opacity="0.95"
        />
        {/* Cap Board */}
        <rect
          x="28"
          y="40"
          width="44"
          height="3"
          fill="#ffffff"
          opacity="0.9"
        />
        {/* Tassel */}
        <circle cx="70" cy="42" r="2" fill="#ffd700" />
        <line x1="70" y1="44" x2="70" y2="52" stroke="#ffd700" strokeWidth="1.5" />
      </g>

      {/* Rising Graph Line - Prevention Success */}
      <g className="logo-graph">
        <polyline
          points="30,65 40,60 50,55 60,58 70,52"
          stroke="#4ade80"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        {/* Data Points */}
        <circle cx="30" cy="65" r="2.5" fill="#4ade80" />
        <circle cx="40" cy="60" r="2.5" fill="#4ade80" />
        <circle cx="50" cy="55" r="2.5" fill="#4ade80" />
        <circle cx="60" cy="58" r="2.5" fill="#4ade80" />
        <circle cx="70" cy="52" r="2.5" fill="#4ade80" />
      </g>
    </svg>
  );
};

export default Logo;
