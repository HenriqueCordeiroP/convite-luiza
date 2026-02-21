import React from 'react';
import { motion } from 'framer-motion';
import { EventDetails } from './learn-more/EventDetails';
import { MapEmbed } from './learn-more/MapEmbed';

interface Props {
  onBack?: () => void;
}

const THEME = {
  navy: '#0668BC',
  deep: '#06122A',
  lilac: '#CBBACE',
  plum: '#CB8CC2',
  paper: '#ECE9D8',
  ink: '#101114',
};

const EVENT = {
  name: 'Luiza Omena',
  title: 'Formatura e Aniversário',
  date: '14 de março de 2026',
  time: '16h',
  placeTitle: 'Local do Evento',
  place: 'Rua Antônio Vitrúvio, número 49, Poço da panela, Recife - PE.',
  rsvpTitle: 'Confirmação de presença',
  rsvpText: 'Gentileza confirmar presença para melhor organização do evento.',
  rsvpNote: '(a confirmação é realizada na primeira tela)',
  mapsHref: 'https://maps.google.com',
  mapEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.641387635871!2d-34.927826824703295!3d-8.03585879199102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab190a56d46115%3A0x4752e50a206efaf0!2sR.%20Ant%C3%B4nio%20Vitr%C3%BAvio%20-%20Po%C3%A7o%20da%20Panela%2C%20Recife%20-%20PE%2C%2052061-210!5e0!3m2!1sen!2sbr!4v1770832595877!5m2!1sen!2sbr',
};

export default function LearnMore({ onBack }: Props) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: `
          radial-gradient(900px 600px at 20% 10%, rgba(203,186,206,0.28), rgba(0,0,0,0) 55%),
          radial-gradient(900px 600px at 80% 18%, rgba(203,140,194,0.20), rgba(0,0,0,0) 55%),
          linear-gradient(180deg, ${THEME.navy} 0%, #0a2744 55%, ${THEME.deep} 100%)
        `,
      }}
    >
      <style>{`
        .shell{
          max-width: 900px;
          margin: 0 auto;
          padding: 14px 16px 28px;
        }

        .card{
          position: relative;
          border-radius: 22px;
          background: linear-gradient(180deg, rgba(236,233,216,0.985), rgba(236,233,216,0.94));
          box-shadow: 0 28px 80px rgba(0,0,0,0.38);
          overflow: hidden;
        }

        .card::before{
          content:"";
          position:absolute;
          inset: 12px;
          border-radius: 18px;
          border: 1px solid rgba(10,36,106,0.22);
          pointer-events:none;
        }

        .corner{
          position:absolute;
          width: 86px;
          height: 86px;
          opacity: 0.33;
          pointer-events:none;
          background:
            radial-gradient(circle at 30% 30%, ${THEME.lilac} 0%, rgba(0,0,0,0) 55%),
            radial-gradient(circle at 70% 70%, ${THEME.plum} 0%, rgba(0,0,0,0) 55%);
        }
        .c1{ top:-18px; left:-18px; border-bottom-right-radius: 90px; }
        .c2{ top:-18px; right:-18px; border-bottom-left-radius: 90px; }
        .c3{ bottom:-18px; left:-18px; border-top-right-radius: 90px; }
        .c4{ bottom:-18px; right:-18px; border-top-left-radius: 90px; }

        .rule{
          height: 1px;
          background: linear-gradient(
            90deg,
            rgba(10,36,106,0) 0%,
            rgba(10,36,106,0.20) 18%,
            rgba(203,140,194,0.32) 50%,
            rgba(10,36,106,0.20) 82%,
            rgba(10,36,106,0) 100%
          );
        }

        .serif{ font-family: ui-serif, Georgia, "Times New Roman", Times, serif; }
        .sans{ font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }

        .btn-back{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:10px 14px;
          border-radius:14px;
          font-weight:600;
          font-size:14px;
          color: rgba(255,255,255,0.92);
          border:1px solid rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.08);
          transition: transform 180ms ease, filter 180ms ease;
          user-select:none;
        }
        .btn-back:hover{ transform: translateY(-1px); filter: brightness(0.98); }

        .detailsWrap{
          border-radius: 18px;
          padding: 14px;
          background: linear-gradient(180deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.40) 100%);
          border: 1px solid rgba(10,36,106,0.18);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.55);
        }

        .detailsGrid{
          display:grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .detailItem{
          padding: 12px;
          border-radius: 14px;
          background: rgba(255,255,255,0.35);
          border: 1px solid rgba(10,36,106,0.12);
        }

        .detailRow{
          display:flex;
          align-items:center;
          gap: 12px;
        }

        .label{
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.10em;
          color: rgba(10,36,106,0.70);
        }

        .value{
          font-size: 14px;
          font-weight: 700;
          color: rgba(0,0,0,0.78);
          line-height: 1.15;
          word-break: break-word;
        }

        .sep{
          display:none;
        }

        @media (min-width: 640px){
          .detailsGrid{
            grid-template-columns: 1fr auto 1fr auto 1fr;
            gap: 0;
            align-items: stretch;
          }
          .detailItem{
            border-radius: 14px;
          }
          .sep{
            display:grid;
            place-items:center;
            padding: 0 8px;
          }
          .sepLine{
            width:1px;
            height: 64%;
            background: linear-gradient(
              180deg,
              rgba(10,36,106,0) 0%,
              rgba(10,36,106,0.18) 35%,
              rgba(203,140,194,0.22) 65%,
              rgba(10,36,106,0) 100%
            );
          }
        }

        .mapWrap{
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(10,36,106,0.18);
          background: linear-gradient(180deg, rgba(255,255,255,0.56), rgba(255,255,255,0.38));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.55);
        }

        .mapHeader{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding: 12px 14px;
        }

        .mapTitle{
          display:flex;
          align-items:center;
          gap: 10px;
          min-width:0;
        }

        .mapTitleText{
          font-weight: 700;
          font-size: 13px;
          color: rgba(10,36,106,0.92);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mapLink{
          font-size: 12px;
          font-weight: 700;
          color: ${THEME.plum};
          text-decoration: none;
          white-space: nowrap;
        }
        .mapLink:hover{ text-decoration: underline; }

        .mapFrame{
          width: 100%;
          height: 260px;
          border: 0;
          display:block;
          filter: invert(0.92) hue-rotate(190deg) saturate(0.55) brightness(0.82) contrast(0.95);
        }

        @media (min-width: 640px){
          .mapFrame{ height: 320px; }
        }

        @media (max-width: 520px){
          .shell{ padding-top: 12px; }
        }
      `}</style>

      <div className="shell">
        <div className="flex items-center justify-end mb-4">
          {onBack ? (
            <button type="button" onClick={onBack} className="btn-back sans">
              ← voltar
            </button>
          ) : null}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <div className="corner c1" />
          <div className="corner c2" />
          <div className="corner c3" />
          <div className="corner c4" />

          <div className="px-5 sm:px-10 py-8 sm:py-10">
            <div className="text-center">
              <div className="serif text-3xl sm:text-5xl font-semibold" style={{ color: THEME.ink }}>
                {EVENT.title}
              </div>

              <div className="mt-3 flex items-center justify-center gap-3">
                <span className="rule w-16 sm:w-24" />
                <span
                  className="sans text-xs sm:text-sm font-semibold"
                  style={{
                    color: THEME.navy,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                  }}
                >
                  {EVENT.name}
                </span>
                <span className="rule w-16 sm:w-24" />
              </div>

              <p className="mt-4 sans text-sm sm:text-base text-black/70 leading-relaxed max-w-[56ch] mx-auto">
                {EVENT.name} tem a satisfação de convidar para a celebração de sua formatura e aniversário.
              </p>
            </div>

            <div className="mt-7 rule" />

            <EventDetails
              date={EVENT.date}
              time={EVENT.time}
              placeTitle={EVENT.placeTitle}
              place={EVENT.place}
            />

            <MapEmbed
              placeTitle={EVENT.placeTitle}
              mapsHref={EVENT.mapsHref}
              mapEmbedSrc={EVENT.mapEmbedSrc}
            />

            <div className="mt-7 rule" />

            <div className="mt-6 text-center">
              <div className="sans font-semibold" style={{ color: THEME.navy }}>
                {EVENT.rsvpTitle}
              </div>
              <div className="mt-1 sans text-sm text-black/70">{EVENT.rsvpText}</div>
              <div className="mt-2 sans text-xs text-black/55">{EVENT.rsvpNote}</div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
