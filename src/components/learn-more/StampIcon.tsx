interface StampIconProps {
  kind: 'calendar' | 'clock' | 'pin';
}

export function StampIcon({ kind }: StampIconProps) {
  const stroke = 'rgba(10,36,106,0.78)';
  const fill = 'rgba(203,140,194,0.10)';

  const common = {
    width: 34,
    height: 34,
    viewBox: '0 0 48 48',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
  };

  return (
    <div
      aria-hidden="true"
      style={{
        width: 44,
        height: 44,
        borderRadius: 14,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(255,255,255,0.45)',
        border: '1px solid rgba(10,36,106,0.14)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55)',
        flex: '0 0 auto',
      }}
    >
      {kind === 'calendar' && (
        <svg {...common}>
          <rect x="10" y="14" width="28" height="22" rx="5" stroke={stroke} strokeWidth="2" fill={fill} />
          <path d="M14 12v6M34 12v6" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <path d="M10 20h28" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          <path d="M16 26h7" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
          <path d="M16 31h11" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        </svg>
      )}

      {kind === 'clock' && (
        <svg {...common}>
          <circle cx="24" cy="24" r="14" stroke={stroke} strokeWidth="2" fill={fill} />
          <path d="M24 16v9l6 3" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 10v3" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        </svg>
      )}

      {kind === 'pin' && (
        <svg {...common}>
          <path
            d="M24 41s10-9.2 10-17.2C34 16.7 29.5 12 24 12s-10 4.7-10 11.8C14 31.8 24 41 24 41Z"
            stroke={stroke}
            strokeWidth="2"
            fill={fill}
          />
          <circle cx="24" cy="24" r="4.2" stroke={stroke} strokeWidth="2" fill="rgba(255,255,255,0.35)" />
        </svg>
      )}
    </div>
  );
}
