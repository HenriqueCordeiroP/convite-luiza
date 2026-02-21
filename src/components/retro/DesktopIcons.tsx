import React from 'react';

export interface DesktopIconsProps {
  onFilesClick?: () => void;
  onTrashClick?: () => void;
  onBestOfBrazilClick?: () => void;
  onMessagesClick?: () => void;
}

const ICONS = [
  { icon: '💻', label: 'Meu Computador', onClick: undefined as (() => void) | undefined },
  { icon: '📁', label: 'Meus Docs', onClick: undefined as (() => void) | undefined },
  { icon: '🗑️', label: 'Lixeira', onClick: undefined as (() => void) | undefined },
  { icon: '📁', label: 'O melhor do brasil', onClick: undefined as (() => void) | undefined },
  { icon: '💬', label: 'Mensagens', onClick: undefined as (() => void) | undefined },
];

export function DesktopIcons(props: DesktopIconsProps): React.ReactElement {
  const { onFilesClick, onTrashClick, onBestOfBrazilClick, onMessagesClick } = props;

  const items = [
    { ...ICONS[0] },
    { ...ICONS[1], onClick: onFilesClick },
    { ...ICONS[2], onClick: onTrashClick },
    { ...ICONS[3], onClick: onBestOfBrazilClick },
    { ...ICONS[4], onClick: onMessagesClick },
  ];

  return (
    <div className="top-icons" aria-label="Ícones da área de trabalho">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          className="top-icon"
          onClick={item.onClick}
          style={{
            all: 'unset',
            cursor: item.onClick ? 'pointer' : 'default',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: item.label.length > 10 ? 76 : 70,
          }}
        >
          <span className="text-2xl drop-shadow">{item.icon}</span>
          <span className="lbl">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
