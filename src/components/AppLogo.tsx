import React from "react";

interface AppLogoProps {
  className?: string;
  showText?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = "w-12 h-12", showText = false }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <svg
        viewBox="0 0 500 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Saffron Flag atop the Chariot */}
        <path
          d="M190 60 L190 100 M190 60 L135 78 L190 95 Z"
          fill="#f39c12"
          stroke="#e67e22"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Chariot Dome/Roof (Dark Blue/Teal) */}
        <path
          d="M150 142 C160 115, 220 115, 230 142 Z"
          fill="#0f2a4a"
          stroke="#111d2e"
          strokeWidth="3.5"
        />

        {/* Chariot Main Body */}
        <path
          d="M152 142 L228 142 L228 190 C180 215, 140 215, 152 190 Z"
          fill="#0f2a4a"
          stroke="#0b203a"
          strokeWidth="3"
        />

        {/* Lotus Flower on Chariot Side (Gold/Orange accents) */}
        <g id="LotusFlower" transform="translate(42, 115)">
          {/* Outer Left Petal */}
          <path
            d="M50 80 C20 70, 15 50, 40 40 C45 60, 48 70, 50 80 Z"
            fill="#f1c40f"
            stroke="#d35400"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Inner Left Petal */}
          <path
            d="M50 80 C30 60, 25 35, 52 25 C55 45, 53 65, 50 80 Z"
            fill="#f1c40f"
            stroke="#d35400"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Center Petal */}
          <path
            d="M50 80 C40 50, 45 15, 60 10 C75 15, 80 50, 70 80 Z"
            fill="#f39c12"
            stroke="#e67e22"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Inner Right Petal */}
          <path
            d="M70 80 C90 65, 88 45, 91 25 C118 35, 113 60, 70 80 Z"
            fill="#f1c40f"
            stroke="#d35400"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Outer Right Petal */}
          <path
            d="M70 80 C92 70, 95 60, 100 40 C125 50, 120 70, 70 80 Z"
            fill="#f1c40f"
            stroke="#d35400"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Lotus Base */}
          <path
            d="M40 80 C50 90, 70 90, 80 80 Z"
            fill="#e67e22"
            stroke="#d35400"
            strokeWidth="2"
          />
        </g>

        {/* Charioteer / Lord Krishna / Arjuna Profile */}
        <path
          d="M200 150 C205 145, 215 145, 218 153 L212 165 C205 168, 195 168, 195 162 Z" /* Head & Crown */
          fill="#1abc9c"
          stroke="#0f2a4a"
          strokeWidth="1.5"
        />
        <path
          d="M195 162 C198 175, 215 178, 222 170 C226 164, 228 152, 215 147 Z" /* Face Profile */
          fill="#eaf2f8"
          stroke="#0f2a4a"
          strokeWidth="1.5"
        />
        <path
          d="M210 170 L235 160 M210 174 L245 162" /* Arms holding Reins */
          stroke="#e67e22"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Golden Wheels */}
        <circle
          cx="220"
          cy="210"
          r="26"
          fill="#f39c12"
          stroke="#d35400"
          strokeWidth="4"
        />
        <circle
          cx="220"
          cy="210"
          r="6"
          fill="#0f2a4a"
        />
        {/* Wheel Spokes */}
        <line x1="220" y1="184" x2="220" y2="236" stroke="#0f2a4a" strokeWidth="2.5" />
        <line x1="194" y1="210" x2="246" y2="210" stroke="#0f2a4a" strokeWidth="2.5" />
        <line x1="2015" y1="1915" x2="2385" y2="2285" stroke="#0f2a4a" strokeWidth="2.5" />
        <line x1="201.5" y1="191.5" x2="238.5" y2="228.5" stroke="#0f2a4a" strokeWidth="2.5" />
        <line x1="201.5" y1="228.5" x2="238.5" y2="191.5" stroke="#0f2a4a" strokeWidth="2.5" />

        {/* Chariot Shaft / Reins Line extending forward */}
        <path
          d="M246 210 L275 200 M245 162 L285 180"
          stroke="#f39c12"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Main Base Line */}
        <line
          x1="110"
          y1="230"
          x2="390"
          y2="230"
          stroke="#d35400"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* "गीता" Bold Text in Devanagari script style design */}
        {/* Shirorekha (Top horizontal bar) */}
        <rect x="254" y="112" width="130" height="9" rx="1.5" fill="#0f2a4a" />
        
        {/* Letter "गी" vertical and curve */}
        <path
          d="M272 112 L272 175 M272 122 C248 112, 248 140, 272 145"
          stroke="#0f2a4a"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Ee ki maatra curve on left */}
        <path
          d="M272 112 C255 102, 230 115, 226 150 M226 150 L226 175"
          stroke="#0f2a4a"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Letter "ता" */}
        <path
          d="M332 112 L332 175 M332 135 C310 135, 302 160, 302 175"
          stroke="#0f2a4a"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Kana (vertical end bar) */}
        <path
          d="M365 112 L365 175"
          stroke="#0f2a4a"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* "विज्डम" Saffron / Sanchaar Orange Text */}
        <text
          x="332"
          y="226"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="36"
          fontWeight="900"
          fill="#e67e22"
          textAnchor="middle"
          letterSpacing="2"
        >
          विज्डम
        </text>

        {/* Decorative Lotus petal flourish near baseline */}
        <path
          d="M260 230 C264 220, 274 220, 278 230"
          fill="#f39c12"
          stroke="#d35400"
          strokeWidth="1.5"
        />

        {/* Sanskrit Subtext: शाश्वत ज्ञान. व्यावहारिक जीवन. */}
        <text
          x="250"
          y="255"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="14.5"
          fontWeight="bold"
          fill="#5d4037"
          textAnchor="middle"
          letterSpacing="0.4"
        >
          शाश्वत ज्ञान. व्यावहारिक जीवन.
        </text>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-serif font-black tracking-tight text-[#5d4037] leading-none">
            Gitawisdom
          </span>
          <span className="text-[10px] text-stone-400 font-sans italic tracking-wide mt-0.5">
            Timeless Vedic Counselor
          </span>
        </div>
      )}
    </div>
  );
};
