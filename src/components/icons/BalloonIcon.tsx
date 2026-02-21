const THEME = {
  plum: '#CB8CC2',
  lilac: '#CBBACE',
  winDkShadow: '#404040',
};

export function BalloonIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <ellipse cx="32" cy="26" rx="16" ry="20" fill={THEME.plum} />
      <ellipse cx="26" cy="20" rx="6" ry="8" fill="white" opacity="0.35" />
      <path d="M28 46h8l-4 7-4-7Z" fill={THEME.lilac} />
      <path d="M32 53v9" stroke={THEME.winDkShadow} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
