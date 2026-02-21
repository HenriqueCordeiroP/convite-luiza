import { THEME } from '@/components/shared/constants';

interface RSVPFormProps {
  name: string;
  setName: (name: string) => void;
  hasGuest: boolean;
  setHasGuest: (has: boolean) => void;
  guestName: string;
  setGuestName: (name: string) => void;
  onConfirm: () => void;
  onDecline: () => void;
  setIsConfirmed: (confirmed: boolean) => void;
  /** Já confirmou uma vez (persistido); mostra aviso e desabilita inputs */
  alreadyConfirmed?: boolean;
  alreadyDeclined?: boolean;
}

export function RSVPForm({
  name,
  setName,
  hasGuest,
  setHasGuest,
  guestName,
  setGuestName,
  onConfirm,
  onDecline,
  setIsConfirmed,
  alreadyConfirmed = false,
  alreadyDeclined = false,
}: RSVPFormProps) {
  const xpInput: React.CSSProperties = {
    width: '100%',
    padding: '6px 8px',
    borderTop: `2px solid ${THEME.winShadow}`,
    borderLeft: `2px solid ${THEME.winShadow}`,
    borderRight: `2px solid ${THEME.winHighlight}`,
    borderBottom: `2px solid ${THEME.winHighlight}`,
    fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
    fontSize: '12px',
    background: '#fff',
    outline: 'none',
  };

  const canOpenConfirmModal = Boolean(name) && !alreadyConfirmed && !alreadyDeclined;

  if (alreadyDeclined) {
    return (
      <fieldset
        style={{
          borderTop: `2px solid ${THEME.winHighlight}`,
          borderLeft: `2px solid ${THEME.winHighlight}`,
          borderRight: `2px solid ${THEME.winShadow}`,
          borderBottom: `2px solid ${THEME.winShadow}`,
          padding: 'clamp(12px, 3.8vw, 18px)',
          marginBottom: '10px',
          background: THEME.winFace,
        }}
      >
        <legend className="font-bold px-1 text-xs">Confirmação de Presença</legend>
        <p style={{ fontSize: 12, fontWeight: 700, color: THEME.plum, marginBottom: 6 }}>
          Entendido! Vamos sentir sua falta.
        </p>
        <p style={{ fontSize: 11, color: THEME.subText, marginBottom: 0 }}>
          Se mudar de ideia, entre em contato comigo pelo WhatsApp.
        </p>
      </fieldset>
    );
  }

  if (alreadyConfirmed) {
    return (
      <fieldset
        style={{
          borderTop: `2px solid ${THEME.winHighlight}`,
          borderLeft: `2px solid ${THEME.winHighlight}`,
          borderRight: `2px solid ${THEME.winShadow}`,
          borderBottom: `2px solid ${THEME.winShadow}`,
          padding: 'clamp(12px, 3.8vw, 18px)',
          marginBottom: '10px',
          background: THEME.winFace,
        }}
      >
        <legend className="font-bold px-1 text-xs">Confirmação de Presença</legend>
        <p style={{ fontSize: 12, fontWeight: 700, color: THEME.progress2, marginBottom: 6 }}>
          ✅ Você só precisa confirmar uma vez. Sua presença já está confirmada!
        </p>
        <p style={{ fontSize: 11, color: THEME.subText, marginBottom: 0 }}>
          Se precisar alterar algo, entre em contato comigo pelo WhatsApp.
        </p>
      </fieldset>
    );
  }

  return (
    <fieldset
      style={{
        borderTop: `2px solid ${THEME.winHighlight}`,
        borderLeft: `2px solid ${THEME.winHighlight}`,
        borderRight: `2px solid ${THEME.winShadow}`,
        borderBottom: `2px solid ${THEME.winShadow}`,
        padding: 'clamp(12px, 3.8vw, 18px)',
        marginBottom: '10px',
        background: THEME.winFace,
      }}
    >
      <legend className="font-bold px-1 text-xs">Confirmação de Presença</legend>

      <div className="mb-2.5">
        <label className="block mb-1 text-xs">Nome:</label>
        <input
          type="text"
          value={name}
          onChange={e => {
            setName(e.target.value);
            setIsConfirmed(false);
          }}
          style={xpInput}
        />
      </div>

      <div className="mb-2.5">
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={hasGuest}
            onChange={e => {
              setHasGuest(e.target.checked);
              setIsConfirmed(false);
            }}
          />
          Levar acompanhante
        </label>

        {hasGuest && (
          <div className="mt-2">
            <label className="block mb-1 text-xs">Nome do acompanhante:</label>
            <input
              type="text"
              value={guestName}
              onChange={e => {
                setGuestName(e.target.value);
                setIsConfirmed(false);
              }}
              style={xpInput}
            />
          </div>
        )}
      </div>

      <button
        onClick={onConfirm}
        disabled={!canOpenConfirmModal}
        style={{
          padding: '7px 16px',
          background: `linear-gradient(180deg, ${THEME.winHighlight} 0%, ${THEME.winFace2} 100%)`,
          borderTop: `2px solid ${THEME.winHighlight}`,
          borderLeft: `2px solid ${THEME.winHighlight}`,
          borderRight: `2px solid ${THEME.winShadow}`,
          borderBottom: `2px solid ${THEME.winShadow}`,
          fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
          fontSize: '11px',
          cursor: canOpenConfirmModal ? 'pointer' : 'not-allowed',
          width: '100%',
          opacity: canOpenConfirmModal ? 1 : 0.55,
        }}
      >
        Confirmar ✔
      </button>

      <button
        onClick={onDecline}
        disabled={!canOpenConfirmModal}
        style={{
          padding: '7px 16px',
          background: `linear-gradient(180deg, ${THEME.winFace} 0%, ${THEME.winFace2} 100%)`,
          borderTop: `2px solid ${THEME.winHighlight}`,
          borderLeft: `2px solid ${THEME.winHighlight}`,
          borderRight: `2px solid ${THEME.winShadow}`,
          borderBottom: `2px solid ${THEME.winShadow}`,
          fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
          fontSize: '11px',
          cursor: canOpenConfirmModal ? 'pointer' : 'not-allowed',
          width: '100%',
          opacity: canOpenConfirmModal ? 1 : 0.55,
          marginTop: '6px',
          color: THEME.subText,
        }}
      >
        Não vou poder ir ✘
      </button>
    </fieldset>
  );
}
