import { motion } from 'framer-motion';
import { THEME } from '@/components/shared/constants';
import { assetUrl } from '@/lib/utils';

export interface GalleryPhoto {
  src: string;
  alt: string;
}

interface RetroGalleryModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  photos: GalleryPhoto[];
}

export function RetroGalleryModal({
  show,
  onClose,
  title,
  photos,
}: RetroGalleryModalProps) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-3 py-6"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: 'min(480px, 100%)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          background: THEME.winFace2,
          border: `1px solid ${THEME.winShadow}`,
          borderRadius: 8,
          boxShadow: `2px 2px 0 ${THEME.winDkShadow}`,
          overflow: 'hidden',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: THEME.titleBar,
            color: THEME.titleText,
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
          }}
        >
          <span>{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            style={{
              width: 22,
              height: 22,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: THEME.winFace2,
              border: `1px solid ${THEME.winShadow}`,
              borderRadius: 2,
              color: THEME.text,
              fontSize: 12,
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: 12,
            overflow: 'auto',
            flex: 1,
            minHeight: 0,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: 10,
            }}
          >
            {photos.map((p, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    objectFit: 'cover',
                    border: `1px solid ${THEME.winShadow}`,
                    background: THEME.winFace,
                  }}
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.objectFit = 'none';
                    el.src = assetUrl('/placeholder.svg');
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    color: THEME.subText,
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
                >
                  {p.alt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
