import { BevelBox } from '@/components/shared/BevelBox';

interface ClassicTitleBarButtonProps {
  label: string;
}

export function ClassicTitleBarButton({ label }: ClassicTitleBarButtonProps) {
  return (
    <BevelBox
      radius={3}
      style={{
        width: 22,
        height: 18,
        display: 'grid',
        placeItems: 'center',
        background: '#D4D0C8',
        fontSize: 12,
        lineHeight: 1,
        padding: 0,
        opacity: 0.9,
      }}
    >
      <span style={{ transform: 'translateY(-1px)' }}>{label}</span>
    </BevelBox>
  );
}
