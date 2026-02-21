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
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4 text-sm font-mono placeholder:opacity-30 focus:outline-none focus:border-[#3794CF]/60 transition-colors"
          />

          <div className="mb-4 text-left">
            <label className="inline-flex items-center gap-3 cursor-pointer select-none group">
              <span
                className={`relative w-5 h-5 rounded-md border transition-all duration-200 flex items-center justify-center shrink-0 ${
                  bringingGuest
                    ? "bg-[#3794CF] border-[#3794CF]"
                    : "bg-white/5 border-white/20 group-hover:border-white/40"
                }`}
              >
                {bringingGuest && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <input
                type="checkbox"
                checked={bringingGuest}
                onChange={(e) => {
                  setBringingGuest(e.target.checked);
                  if (!e.target.checked) setGuestName("");
                }}
                className="sr-only"
              />
              <span className="font-mono text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                Vou levar alguém (+1)
              </span>
            </label>
          </div>

          <AnimatePresence>
            {bringingGuest && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Nome do acompanhante"
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4 text-sm font-mono placeholder:opacity-30 focus:outline-none focus:border-[#3794CF]/60 transition-colors"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 mt-4">
            <motion.button
              type="button"
              whileHover={canSubmit ? { scale: 1.03 } : undefined}
              whileTap={canSubmit ? { scale: 0.95 } : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleConfirm();
              }}
              disabled={!canSubmit}
              className={`flex-1 py-3.5 rounded-full font-modern font-bold text-sm tracking-wider transition-all duration-300 ${
                confirmed
                  ? "bg-emerald-500 text-white cursor-default"
                  : canSubmit
                    ? "bg-[#3794CF] text-white hover:shadow-[0_0_40px_rgba(55,148,207,0.5)] cursor-pointer"
                    : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              {confirmed ? "Confirmado!" : "Confirmar"}
            </motion.button>

            <motion.button
              type="button"
              whileHover={canSubmit ? { scale: 1.03 } : undefined}
              whileTap={canSubmit ? { scale: 0.95 } : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleDecline();
              }}
              disabled={!canSubmit}
              className={`flex-1 py-3.5 rounded-full font-modern text-sm tracking-wider transition-all duration-300 ${
                declined
                  ? "border border-[#CB8CC2] text-[#CB8CC2] cursor-default"
                  : canSubmit
                    ? "border border-white/20 text-white/60 hover:border-[#CB8CC2]/50 hover:text-[#CB8CC2] cursor-pointer"
                    : "border border-white/5 text-white/20 cursor-not-allowed"
              }`}
            >
              {declined ? "Registrado!" : "Não posso ir"}
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
