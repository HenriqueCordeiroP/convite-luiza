import { MiniPinIcon } from './MiniPinIcon';

interface MapEmbedProps {
  placeTitle: string;
  mapsHref: string;
  mapEmbedSrc: string;
}

export function MapEmbed({ placeTitle, mapsHref, mapEmbedSrc }: MapEmbedProps) {
  return (
    <div className="mt-6 mapWrap">
      <div className="mapHeader">
        <div className="mapTitle">
          <MiniPinIcon />
          <div className="mapTitleText sans">{placeTitle}</div>
        </div>

        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mapLink sans"
        >
          Abrir no Google Maps →
        </a>
      </div>

      <div className="rule" />

      <iframe
        src={mapEmbedSrc}
        className="mapFrame"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Localização do evento"
      />
    </div>
  );
}
