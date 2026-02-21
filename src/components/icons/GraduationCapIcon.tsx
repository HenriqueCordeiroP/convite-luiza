const THEME = {
  winDkShadow: '#404040',
  lilac: '#CBBACE',
  plum: '#CB8CC2',
};

export function GraduationCapIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M6 24L32 12l26 12-26 12L6 24Z" fill={THEME.winDkShadow} />
      <path d="M14 28v10c0 2 9 8 18 8s18-6 18-8V28l-18 8-18-8Z" fill={THEME.lilac} />
      <path d="M54 26v16" stroke={THEME.plum} strokeWidth="3" strokeLinecap="round" />
      <circle cx="54" cy="44" r="4" fill={THEME.plum} />
    </svg>
  );
}
