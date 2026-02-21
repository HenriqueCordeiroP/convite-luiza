import { StampIcon } from './StampIcon';

interface EventDetailsProps {
  date: string;
  time: string;
  placeTitle: string;
  place: string;
}

export function EventDetails({ date, time, placeTitle, place }: EventDetailsProps) {
  return (
    <div className="mt-8 detailsWrap">
      <div className="detailsGrid">
        <div className="detailItem">
          <div className="detailRow">
            <StampIcon kind="calendar" />
            <div>
              <div className="label sans">Data</div>
              <div className="value sans" style={{ marginTop: 2 }}>
                {date}
              </div>
            </div>
          </div>
        </div>

        <div className="sep">
          <div className="sepLine" />
        </div>

        <div className="detailItem">
          <div className="detailRow">
            <StampIcon kind="clock" />
            <div>
              <div className="label sans">Horário</div>
              <div className="value sans" style={{ marginTop: 2 }}>
                {time}
              </div>
            </div>
          </div>
        </div>

        <div className="sep">
          <div className="sepLine" />
        </div>

        <div className="detailItem">
          <div className="detailRow">
            <StampIcon kind="pin" />
            <div className="min-w-0">
              <div className="label sans">{placeTitle}</div>
              <div className="value sans" style={{ marginTop: 2 }}>
                {place}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
