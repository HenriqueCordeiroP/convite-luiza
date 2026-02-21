import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { THEME } from '@/components/shared/constants';
import { getStoredRsvp, ensureSenderId } from '@/lib/rsvpStorage';
import { sendMessage, subscribeToMessages, type Message } from '@/lib/messagesFirestore';

interface RetroMessagesModalProps {
  show: boolean;
  onClose: () => void;
}

function formatRelativeTime(timestamp: { toDate: () => Date } | null): string {
  if (!timestamp) return '';
  const now = Date.now();
  const then = timestamp.toDate().getTime();
  const diffSec = Math.floor((now - then) / 1000);

  if (diffSec < 60) return 'agora';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}min`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h`;
  return `${Math.floor(diffSec / 86400)}d`;
}

export function RetroMessagesModal({ show, onClose }: RetroMessagesModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;
    return subscribeToMessages(setMessages);
  }, [show]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    const stored = getStoredRsvp();
    const rsvp = stored ? ensureSenderId(stored) : null;
    await sendMessage(trimmed, rsvp?.name, rsvp?.senderId).catch(() => {});
    setText('');
    setSending(false);
  };

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
          <span>Mensagens para Luiza 💬</span>
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

        {/* Messages list */}
        <div
          ref={listRef}
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            margin: 10,
            padding: 8,
            background: '#fff',
            borderTop: `1px solid ${THEME.winShadow}`,
            borderLeft: `1px solid ${THEME.winShadow}`,
            borderRight: `1px solid ${THEME.winHighlight}`,
            borderBottom: `1px solid ${THEME.winHighlight}`,
          }}
        >
          {messages.length === 0 && (
            <p
              style={{
                textAlign: 'center',
                color: THEME.subText,
                fontSize: 11,
                marginTop: 16,
              }}
            >
              Nenhuma mensagem ainda. Seja o primeiro!
            </p>
          )}
          {messages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: 'inline-block',
                  background: '#E8F0FE',
                  borderRadius: 6,
                  padding: '4px 8px',
                  fontSize: 12,
                  maxWidth: '85%',
                  wordBreak: 'break-word',
                  fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
                }}
              >
                {msg.text}
              </div>
              <div style={{ fontSize: 9, color: THEME.subText, marginTop: 1, marginLeft: 4 }}>
                {formatRelativeTime(msg.createdAt)}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            padding: '6px 10px 10px',
          }}
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Escreva uma mensagem..."
            style={{
              flex: 1,
              padding: '5px 8px',
              fontSize: 12,
              fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
              borderTop: `1px solid ${THEME.winShadow}`,
              borderLeft: `1px solid ${THEME.winShadow}`,
              borderRight: `1px solid ${THEME.winHighlight}`,
              borderBottom: `1px solid ${THEME.winHighlight}`,
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!text.trim() || sending}
            style={{
              padding: '5px 14px',
              fontSize: 11,
              fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
              background: `linear-gradient(180deg, ${THEME.winHighlight} 0%, ${THEME.winFace2} 100%)`,
              borderTop: `2px solid ${THEME.winHighlight}`,
              borderLeft: `2px solid ${THEME.winHighlight}`,
              borderRight: `2px solid ${THEME.winShadow}`,
              borderBottom: `2px solid ${THEME.winShadow}`,
              cursor: text.trim() && !sending ? 'pointer' : 'not-allowed',
              opacity: text.trim() && !sending ? 1 : 0.55,
            }}
          >
            Enviar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
