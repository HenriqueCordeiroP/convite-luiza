import { MARQUEE_ITEMS } from '@/components/shared/constants';

export function MarqueeStrip() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="overflow-hidden py-6 border-y border-white/[0.08]">
      <div className="flex gap-12 animate-marquee hover:[animation-play-state:paused] w-max">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="font-modern text-xl sm:text-2xl font-bold whitespace-nowrap opacity-30 hover:opacity-100 hover:text-[#3794CF] transition-all duration-300 cursor-default">
              {item}
            </span>
            <span className="text-[#7BB1D9] opacity-50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
