import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStoredRsvp, saveRsvp, saveDecline } from "@/lib/rsvpStorage";
import type { RsvpStorage } from "@/components/shared/constants";

interface RsvpSectionProps {
  onConfirm: () => void;
}

export function RsvpSection({ onConfirm }: RsvpSectionProps) {
  const [name, setName] = useState("");
  const [bringingGuest, setBringingGuest] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [alreadyConfirmed, setAlreadyConfirmed] = useState<RsvpStorage | null>(
    null,
  );

  useEffect(() => {
    setAlreadyConfirmed(getStoredRsvp());
  }, []);

  const alreadyResponded = !!alreadyConfirmed;
  const canSubmit = name.trim().length > 0 && !alreadyResponded;

  const handleConfirm = () => {
    if (!canSubmit) return;
    saveRsvp({
      confirmed: true,
      name: name.trim(),
      hasGuest: bringingGuest,
      guestName: guestName.trim() || undefined,
    });
    setConfirmed(true);
    setAlreadyConfirmed(getStoredRsvp());
    onConfirm();
    setTimeout(() => setConfirmed(false), 4000);
  };

  const handleDecline = () => {
    if (!canSubmit) return;
    saveDecline({ name: name.trim() });
    setDeclined(true);
    setAlreadyConfirmed(getStoredRsvp());
    onConfirm();
    setTimeout(() => setDeclined(false), 4000);
  };

  if (alreadyConfirmed) {
    const isDeclined = !!alreadyConfirmed.declined;
    return (
      <section id="confirmar-presenca" className="py-20 px-6 relative">
        <div className="max-w-lg mx-auto text-center">
          <p className="font-mono text-xs tracking-[4px] uppercase text-[#7BB1D9] mb-4">
            Confirme presença
          </p>
          <h2 className="font-modern text-3xl sm:text-4xl font-bold mb-8 leading-tight">
            Vamo <span className="text-[#3794CF]" style={{ textShadow: '0 0 24px rgba(55,148,207,0.4)' }}>comemorar</span>?
          </h2>

          <div className="glass rounded-3xl p-8 sm:p-12">
            {isDeclined ? (
              <>
                <p className="text-[#CB8CC2] font-modern font-bold mb-4">
                  Entendido! Vamos sentir sua falta.
                </p>
                <p className="opacity-70 mb-6 leading-relaxed">
                  Se mudar de ideia, entre em contato comigo pelo{" "}
                  <a
                    href="https://wa.me/5581986889461"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7BB1D9] hover:text-[#3794CF] underline underline-offset-2 transition-colors"
                  >
                    WhatsApp
                  </a>
                  .
                </p>
              </>
            ) : (
              <>
                <p className="text-[#3794CF] font-modern font-bold mb-4">
                  Você só precisa confirmar uma vez.
                  <br/>Sua presença já está confirmada!
                </p>
                <p className="opacity-70 mb-6 leading-relaxed">
                  Se precisar alterar algo (nome, acompanhante, etc.), entre em
                  contato comigo pelo{" "}
                  <a
                    href="https://wa.me/5581986889461"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7BB1D9] hover:text-[#3794CF] underline underline-offset-2 transition-colors"
                  >
                    WhatsApp
                  </a>
                  .
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="confirmar-presenca" className="py-20 px-6 relative">
      <div className="max-w-lg mx-auto text-center">
        <p className="font-mono text-xs tracking-[4px] uppercase text-[#7BB1D9] mb-4">
          Confirme presença
        </p>
        <h2 className="font-modern text-3xl sm:text-4xl font-bold mb-8 leading-tight">
          Vamo <span className="text-[#3794CF]" style={{ textShadow: '0 0 24px rgba(55,148,207,0.4)' }}>comemorar</span>?
        </h2>

        <div className="glass rounded-3xl p-8 sm:p-12">
          <p className="opacity-50 mb-8 leading-relaxed">
            Confirme sua presença e faça parte dessa celebração! Vou adorar ter
            você lá.
          </p>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome *"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6 text-sm font-mono placeholder:opacity-30 focus:outline-none focus:border-[#3794CF]/60 transition-colors"
          />

          <div className="mb-8">
            <AnimatePresence mode="wait">
              {!bringingGuest ? (
                <motion.button
                  key="add-guest-btn"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setBringingGuest(true)}
                  className="px-5 py-2.5 rounded-xl glass font-mono text-sm cursor-pointer hover:border-[#3794CF] transition-all"
                >
                  Vou levar alguém +1
                </motion.button>
              ) : (
                <motion.div
                  key="guest-input"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Nome do acompanhante"
                    autoFocus
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono placeholder:opacity-30 focus:outline-none focus:border-[#3794CF]/60 transition-colors"
                  />
                  <button
                    onClick={() => {
                      setBringingGuest(false);
                      setGuestName("");
                    }}
                    className="w-10 h-10 rounded-full glass flex items-center justify-center text-lg hover:border-[#CB8CC2] transition-colors cursor-pointer shrink-0"
                    title="Remover acompanhante"
                  >
                    ×
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            type="button"
            whileHover={canSubmit ? { scale: 1.05 } : undefined}
            whileTap={canSubmit ? { scale: 0.95 } : undefined}
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={!canSubmit}
            className={`px-10 py-4 rounded-full font-modern font-bold text-base tracking-wider transition-all duration-300 ${
              confirmed
                ? "bg-emerald-500 text-white cursor-default"
                : canSubmit
                  ? "bg-[#3794CF] text-white hover:shadow-[0_0_40px_rgba(55,148,207,0.5)] cursor-pointer"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
            }`}
          >
            {confirmed ? "Presença Confirmada!" : "Confirmar Presença"}
          </motion.button>

          <div className="mt-4">
            <motion.button
              type="button"
              whileHover={canSubmit ? { scale: 1.03 } : undefined}
              whileTap={canSubmit ? { scale: 0.97 } : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleDecline();
              }}
              disabled={!canSubmit}
              className={`px-8 py-3 rounded-full font-modern text-sm tracking-wider transition-all duration-300 ${
                declined
                  ? "border border-[#CB8CC2] text-[#CB8CC2] cursor-default"
                  : canSubmit
                    ? "border border-white/20 text-white/60 hover:border-[#CB8CC2]/50 hover:text-[#CB8CC2] cursor-pointer"
                    : "border border-white/5 text-white/20 cursor-not-allowed"
              }`}
            >
              {declined ? "Resposta registrada!" : "Não vou poder ir"}
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
