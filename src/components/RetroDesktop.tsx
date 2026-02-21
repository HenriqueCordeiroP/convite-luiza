import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BevelBox } from './shared/BevelBox';
import { ClassicTitleBarButton } from './retro/ClassicTitleBarButton';
import { DesktopIcons } from './retro/DesktopIcons';
import { RSVPForm } from './retro/RSVPForm';
import { ConfirmModal } from './retro/ConfirmModal';
import { RetroGalleryModal, type GalleryPhoto } from './retro/RetroGalleryModal';
import { RetroMessagesModal } from './retro/RetroMessagesModal';
import { Taskbar } from './retro/Taskbar';
import { THEME } from './shared/constants';
import { getStoredRsvp, saveRsvp, saveDecline } from '@/lib/rsvpStorage';

const BANGUELA_PHOTOS: GalleryPhoto[] = [
  { src: '/photos/banguela/01.png', alt: 'Banguela' },
  { src: '/photos/banguela/02.png', alt: 'Banguela' },
  { src: '/photos/banguela/03.png', alt: 'Banguela' },
  { src: '/photos/banguela/04.png', alt: 'Banguela' },
  { src: '/photos/banguela/05.png', alt: 'Banguela' },
  { src: '/photos/banguela/06.png', alt: 'Banguela' },
  { src: '/photos/banguela/07.png', alt: 'Banguela' },
  { src: '/photos/banguela/08.png', alt: 'Banguela' },
  { src: '/photos/banguela/09.png', alt: 'Banguela' },
  { src: '/photos/banguela/10.png', alt: 'Banguela' },
  { src: '/photos/banguela/11.png', alt: 'Banguela' },
  { src: '/photos/banguela/12.png', alt: 'Banguela' },
  { src: '/photos/banguela/13.png', alt: 'Banguela' },
];

const NAUTICO_PHOTOS: GalleryPhoto[] = [
  { src: '/photos/lixeira/nautico/01.png', alt: 'Náutico' },
  { src: '/photos/lixeira/nautico/02.jpg', alt: 'Náutico' },
  { src: '/photos/lixeira/nautico/03.jpeg', alt: 'Náutico' },
];

const SPORT_PHOTOS: GalleryPhoto[] = [
  { src: '/photos/lixeira/sport/01.png', alt: 'Sport' },
  { src: '/photos/lixeira/sport/02.jpg', alt: 'Sport' },
  { src: '/photos/lixeira/sport/03.jpg', alt: 'Sport' },
];


const SANTA_CRUZ_PHOTOS: GalleryPhoto[] = [
  { src: '/photos/santa/01.jpg', alt: 'Santa Cruz' },
  { src: '/photos/santa/02.jpg', alt: 'Santa Cruz' },
  { src: '/photos/santa/03.jpg', alt: 'Santa Cruz' },
  { src: '/photos/santa/04.jpeg', alt: 'Santa Cruz' },
  { src: '/photos/santa/05.jpeg', alt: 'Santa Cruz' },
  { src: '/photos/santa/06.jpg', alt: 'Santa Cruz' },
  { src: '/photos/santa/07.jpg', alt: 'Santa Cruz' },
  { src: '/photos/santa/08.jpg', alt: 'Santa Cruz' },
  { src: '/photos/santa/09.jpg', alt: 'Santa Cruz' },
  { src: '/photos/santa/10.jpg', alt: 'Santa Cruz' },
  { src: '/photos/santa/11.jpg', alt: 'Santa Cruz' },
  { src: '/photos/santa/12.jpg', alt: 'Santa Cruz' },
  { src: '/photos/santa/13.jpeg', alt: 'Santa Cruz' },
];


interface Props {
  onEvolve: () => void;
  onBackToLoader?: () => void;
  onLearnMore?: () => void;
  learnMoreHref?: string;
}

export default function RetroDesktop({
  onEvolve,
  onBackToLoader,
  onLearnMore,
  learnMoreHref = '/convite',
}: Props) {
  const [name, setName] = useState('');
  const [hasGuest, setHasGuest] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isDeclineModal, setIsDeclineModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);
  const [alreadyDeclined, setAlreadyDeclined] = useState(false);
  const [time, setTime] = useState(new Date());
  const [clickCount, setClickCount] = useState(0);
  const [inviteVisible, setInviteVisible] = useState(true);
  const [easterEggGallery, setEasterEggGallery] = useState<
    'banguela' | 'nautico_sport' | 'santa_cruz' | null
  >(null);
  const [showMessages, setShowMessages] = useState(false);

  const windowWidth = useMemo(() => 'min(520px, 100%)', []);
  const bodyPad = useMemo(() => 'clamp(12px, 3.8vw, 18px)', []);
  const innerPad = useMemo(() => 'clamp(12px, 4vw, 16px)', []);

  useEffect(() => {
    const stored = getStoredRsvp();
    if (stored?.confirmed) {
      setAlreadyConfirmed(true);
      setIsConfirmed(true);
      if (stored.name) setName(stored.name);
      if (stored.hasGuest != null) setHasGuest(stored.hasGuest);
      if (stored.guestName != null) setGuestName(stored.guestName);
    } else if (stored?.declined) {
      setAlreadyDeclined(true);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTitleClick = useCallback(() => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= 3) return 0;
      return next;
    });
    setTimeout(() => setClickCount(0), 600);
  }, []);

  const handleConfirm = () => {
    if (name) {
      setIsDeclineModal(false);
      setShowModal(true);
    }
  };

  const handleDecline = () => {
    if (name) {
      setIsDeclineModal(true);
      setShowModal(true);
    }
  };

  function handleStartClick() {
    if (onBackToLoader) {
      onBackToLoader();
      return;
    }
    window.location.reload();
  }

  const canEvolve = isConfirmed || alreadyDeclined;

  const handleConfirmFromModal = useCallback(() => {
    if (isDeclineModal) {
      saveDecline({ name });
      setAlreadyDeclined(true);
    } else {
      saveRsvp({
        confirmed: true,
        name,
        hasGuest,
        guestName,
      });
      setIsConfirmed(true);
    }
    setShowModal(false);
  }, [name, hasGuest, guestName, isDeclineModal]);

  function handleLearnMoreClick(e: React.MouseEvent) {
    if (!onLearnMore) return;
    e.preventDefault();
    onLearnMore();
  }

  const xpBtnFull: React.CSSProperties = {
    padding: '7px 16px',
    background: `linear-gradient(180deg, ${THEME.winHighlight} 0%, ${THEME.winFace2} 100%)`,
    borderTop: `2px solid ${THEME.winHighlight}`,
    borderLeft: `2px solid ${THEME.winHighlight}`,
    borderRight: `2px solid ${THEME.winShadow}`,
    borderBottom: `2px solid ${THEME.winShadow}`,
    fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
    fontSize: '11px',
    cursor: 'pointer',
    width: '100%',
  };

  const xpBtnDisabled: React.CSSProperties = {
    ...xpBtnFull,
    opacity: 0.55,
    cursor: 'not-allowed',
    filter: 'grayscale(0.15)',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0668BC 0%, #3794CF 30%, #077BC6 100%)',
        fontFamily: 'Tahoma, "MS Sans Serif", Geneva, sans-serif',
        fontSize: '12px',
        paddingBottom: '36px',
      }}
    >
      <style>{`
        .retro-wrap { width: min(520px, 100%); }
        .top-icons {
          position: absolute;
          top: 10px; left: 10px; right: 10px;
          z-index: 20;
          display: flex;
          gap: 10px;
          align-items: flex-start;
          overflow-x: auto;
          padding-bottom: 6px;
          -webkit-overflow-scrolling: touch;
        }
        .top-icons::-webkit-scrollbar { height: 8px; }
        .top-icons::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.35); border-radius: 10px; }
        .top-icon {
          flex: 0 0 auto;
          width: 76px;
          display: flex;
          flex-direction: column;
          align-items: center;
          user-select: none;
          cursor: pointer;
        }
        .top-icon .lbl {
          color: #fff;
          font-size: 10px;
          margin-top: 2px;
          text-align: center;
          text-shadow: 0 1px 2px rgba(0,0,0,0.35);
          line-height: 1.1;
        }
        .learn-more {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: ${THEME.progress2};
          text-decoration: underline;
          cursor: pointer;
          user-select: none;
        }
        .learn-more:hover { filter: brightness(0.95); }

        @media (max-width: 420px) {
          .retro-menu { display: none; }
          .top-icon { width: 64px; }
        }
      `}</style>

      <DesktopIcons
        onFilesClick={() => setEasterEggGallery('banguela')}
        onTrashClick={() => setEasterEggGallery('nautico_sport')}
        onBestOfBrazilClick={() => setEasterEggGallery('santa_cruz')}
        onMessagesClick={() => setShowMessages(true)}
      />


      <div className="flex items-center justify-center min-h-screen px-3 py-10">
        {inviteVisible && (
          <div
            className="retro-wrap"
            style={{
              width: windowWidth,
              boxShadow: '3px 3px 12px rgba(0,0,0,0.5)',
              marginTop: 32,
            }}
          >
            <div
              style={{
                background: THEME.titleBar,
                color: THEME.titleText,
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 13,
                fontWeight: 700,
                userSelect: 'none',
                borderRadius: '8px 8px 0 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    background: THEME.winFace2,
                    borderTop: `1px solid ${THEME.winHighlight}`,
                    borderLeft: `1px solid ${THEME.winHighlight}`,
                    borderRight: `1px solid ${THEME.winShadow}`,
                    borderBottom: `1px solid ${THEME.winShadow}`,
                  }}
                />
                Convite.exe
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <ClassicTitleBarButton label="_" />
                <ClassicTitleBarButton label="□" />
                <button
                  type="button"
                  aria-label="Fechar"
                  onClick={() => setInviteVisible(false)}
                  style={{ all: 'unset', cursor: 'pointer' }}
                >
                  <ClassicTitleBarButton label="✕" />
                </button>
              </div>
            </div>

            <div
              className="retro-menu"
              style={{
                background: THEME.winFace2,
                borderBottom: '1px solid #ACA899',
                padding: '2px 8px',
                fontSize: '11px',
              }}
            >
              <span className="mr-3 hover:underline cursor-pointer">Arquivo</span>
              <span className="mr-3 hover:underline cursor-pointer">Editar</span>
              <span className="hover:underline cursor-pointer">Ajuda</span>
            </div>

            <div style={{ background: THEME.winFace2, padding: innerPad }}>
              <div className="text-center mb-3">
                <h1
                  className="font-bold mb-1 cursor-pointer select-none"
                  onClick={handleTitleClick}
                  style={{ fontSize: 'clamp(14px, 4.2vw, 16px)' }}
                >
                  🎓🎂 Formatura + Aniversário
                </h1>

                <h2
                  className="font-bold mb-2"
                  style={{ color: THEME.progress2, fontSize: 'clamp(13px, 4vw, 14px)' }}
                >
                  Luiza Omena
                </h2>

                <div
                  style={{
                    borderTop: `1px solid ${THEME.winShadow}`,
                    borderLeft: `1px solid ${THEME.winShadow}`,
                    borderRight: `1px solid ${THEME.winHighlight}`,
                    borderBottom: `1px solid ${THEME.winHighlight}`,
                    padding: '8px',
                    background: '#fff',
                    marginBottom: '10px',
                    textAlign: 'left',
                    fontSize: '12px',
                  }}
                >
                  <p className="mb-0.5">
                    📅 <strong>Data:</strong> 14 de março de 2026
                  </p>
                  <p className="mb-0.5">
                    🕐 <strong>Horário:</strong> 16h
                  </p>
                  <p className="mb-0.5">
                    📍 <strong>Local:</strong> A definir
                  </p>

                  <a
                    href={learnMoreHref}
                    onClick={handleLearnMoreClick}
                    className="learn-more"
                    aria-label="Saiba mais sobre o convite"
                  >
                    Saiba mais <span aria-hidden="true">↗</span>
                  </a>
                  <div style={{ marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={onEvolve}
                      className="learn-more"
                      style={{ background: 'none', border: 'none' }}
                      aria-label="Ver interface moderna"
                    >
                      Ver interface moderna →
                    </button>
                  </div>
                </div>
              </div>

              <RSVPForm
                name={name}
                setName={setName}
                hasGuest={hasGuest}
                setHasGuest={setHasGuest}
                guestName={guestName}
                setGuestName={setGuestName}
                onConfirm={handleConfirm}
                onDecline={handleDecline}
                setIsConfirmed={setIsConfirmed}
                alreadyConfirmed={alreadyConfirmed}
                alreadyDeclined={alreadyDeclined}
              />

              <div className="text-center">
                <button
                  onClick={() => {
                    if (!canEvolve) return;
                    onEvolve();
                  }}
                  disabled={!canEvolve}
                  title={!canEvolve ? 'Confirme a presença primeiro' : 'Ajustar a interface'}
                  style={
                    canEvolve
                      ? {
                        ...xpBtnFull,
                        background: `linear-gradient(180deg, ${THEME.lilac} 0%, ${THEME.winFace2} 100%)`,
                        fontWeight: 'bold',
                      }
                      : {
                        ...xpBtnDisabled,
                        background: `linear-gradient(180deg, ${THEME.winFace} 0%, ${THEME.winFace2} 100%)`,
                        fontWeight: 'bold',
                      }
                  }
                >
                  {canEvolve ? 'Ajustar Interface' : 'Ajustar Interface (bloqueado)'}
                </button>

                {!canEvolve && (
                  <div style={{ marginTop: 6, fontSize: 11, color: 'rgba(0,0,0,0.55)' }}>
                    (primeiro confirma a presença ali em cima)
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        name={name}
        hasGuest={hasGuest}
        guestName={guestName}
        onConfirm={handleConfirmFromModal}
        onEvolve={() => {
          handleConfirmFromModal();
          onEvolve();
        }}
        isDecline={isDeclineModal}
      />

      <RetroGalleryModal
        show={easterEggGallery === 'banguela'}
        onClose={() => setEasterEggGallery(null)}
        title="Como Treinar o Seu Dragão"
        photos={BANGUELA_PHOTOS}
      />

      {/* Lixeira: Náutico + Sport */}
      <RetroGalleryModal
        show={easterEggGallery === 'nautico_sport'}
        onClose={() => setEasterEggGallery(null)}
        title="Os piores"
        photos={[...NAUTICO_PHOTOS, ...SPORT_PHOTOS]}
      />

      {/* Pasta: Santa Cruz */}
      <RetroGalleryModal
        show={easterEggGallery === 'santa_cruz'}
        onClose={() => setEasterEggGallery(null)}
        title="O melhor do brasil (Santa Cruz)"
        photos={SANTA_CRUZ_PHOTOS}
      />


      <RetroMessagesModal
        show={showMessages}
        onClose={() => setShowMessages(false)}
      />

      <Taskbar
        onStartClick={handleStartClick}
        time={time}
        inviteVisible={inviteVisible}
        onRestoreInvite={() => setInviteVisible(true)}
      />
    </motion.div>
  );
}
