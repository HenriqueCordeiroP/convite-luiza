export function MiniPinIcon() {
  const stroke = 'rgba(10,36,106,0.78)';
  const fill = 'rgba(203,186,206,0.22)';

  return (
    <div
      aria-hidden="true"
      style={{
        width: 30,
        height: 30,
        borderRadius: 12,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(255,255,255,0.45)',
        border: '1px solid rgba(10,36,106,0.14)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55)',
        flex: '0 0 auto',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
        <path
          d="M24 41s10-9.2 10-17.2C34 16.7 29.5 12 24 12s-10 4.7-10 11.8C14 31.8 24 41 24 41Z"
          stroke={stroke}
          strokeWidth="2.2"
          fill={fill}
        />
        <circle cx="24" cy="24" r="4.2" stroke={stroke} strokeWidth="2.2" fill="rgba(255,255,255,0.35)" />
      </svg>
    </div>
  );
}
