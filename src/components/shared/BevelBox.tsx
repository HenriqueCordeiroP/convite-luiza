import React from 'react';

const THEME = {
  winFace: '#D4D0C8',
  winShadow: '#808080',
  winDkShadow: '#404040',
  winHighlight: '#FFFFFF',
  winLight: '#F5F5F5',
};

interface BevelBoxProps {
  children: React.ReactNode;
  radius?: number;
  style?: React.CSSProperties;
}

export function BevelBox({ children, radius = 10, style }: BevelBoxProps) {
  return (
    <div
      style={{
        borderRadius: radius,
        background: THEME.winFace,
        borderTop: `2px solid ${THEME.winHighlight}`,
        borderLeft: `2px solid ${THEME.winHighlight}`,
        borderRight: `2px solid ${THEME.winShadow}`,
        borderBottom: `2px solid ${THEME.winShadow}`,
        boxShadow: `inset 1px 1px 0 ${THEME.winLight}, inset -1px -1px 0 ${THEME.winDkShadow}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
