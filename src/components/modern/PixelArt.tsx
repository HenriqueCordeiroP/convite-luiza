import { useMemo, useState } from "react";
import { assetUrl } from "@/lib/utils";

const BALLOON_SRC = assetUrl("/assets/22_balloon.png");

// 30 x 29
const GRID_COLS = 30;
const GRID_ROWS = 29;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;

const COLORS: Record<number, { hex: string }> = {
  0: { hex: "#FFFFFF" },
  1: { hex: "#191F26" },
  2: { hex: "#AFCE54" },
};

const TOOTHLESS_ROWS: string[] = [
  "000000000000000000000000000000",
  "000000111000000000000111000000",
  "000000111000000000000111000000",
  "000001111000000000000111100000",
  "000001111000000000000111100000",
  "000011111000000000000111110000",
  "000011111000000000000111110000",
  "000111111000110011000111111000",
  "000111111001110011100111111000",
  "000111111001114411100111111000",
  "000111111441111111144111111000",
  "000111111111111111111111111000",
  "000011111111111111111111110000",
  "000011111111111111111111110000",
  "000041111111111111111111140000",
  "011411111111111111111111114110",
  "011111122211111111112221111110",
  "011111222221111111122222111110",
  "001111222142111111241222111100",
  "001111222142111111241222111100",
  "000111222112111111211222111000",
  "000411122112111111211221114000",
  "001111111111111111111111111100",
  "001111111111111111111111111100",
  "000111111113333333311111111000",
  "000000111111133331111111000000",
  "000000000111113311111000000000",
  "000000000000111111000000000000",
  "000000000000000000000000000000",
];

// Flatten + normaliza 3->1 e 4->0
const TOOTHLESS_GRID: number[] = TOOTHLESS_ROWS.join("")
  .split("")
  .map((c) => Number(c))
  .map((v) => (v === 3 ? 1 : v === 4 ? 0 : v));

export function PixelArt() {
  const [filled, setFilled] = useState<(number | null)[]>(
    Array(TOTAL_CELLS).fill(null),
  );
  const [selectedColor, setSelectedColor] = useState<number>(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const paintableColors = useMemo(
    () => Object.keys(COLORS).map(Number).sort((a, b) => a - b),
    [],
  );

  const fillCell = (index: number) => {
    setFilled((prev) => {
      const next = [...prev];
      next[index] = selectedColor;
      return next;
    });
  };

  const filledCount = filled.filter((v) => v !== null).length;
  const progress = Math.round((filledCount / TOTAL_CELLS) * 100);

  const getCellBackground = (index: number): string => {
    const target = TOOTHLESS_GRID[index];

    if (showAnswer) return COLORS[target].hex;

    const userColor = filled[index];
    if (userColor !== null) return COLORS[userColor].hex;

    return "rgba(255,255,255,0.06)";
  };

  const getCellNumber = (index: number): number | null => {
    const target = TOOTHLESS_GRID[index];
    if (showAnswer) return null;
    if (filled[index] !== null) return null;
    return target;
  };

return (
  <section className="py-20 px-6">
    <div className="max-w-3xl mx-auto text-center">
      <p className="font-mono text-xs tracking-[4px] uppercase text-[#7BB1D9] mb-4">
        Pinte!
      </p>

      <h2 className="font-modern text-3xl sm:text-4xl font-bold mb-2 leading-tight">
        Pinte por{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(to right, #CB8CC2, #3794CF, #077BC6)",
            textShadow: `
              0 0 6px rgba(255,255,255,0.22),
              0 0 28px rgba(55,148,207,0.16)
            `,
          }}
        >
          Números
        </span>
      </h2>

      <p className="opacity-60 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
        Use a paleta e preencha cada número com a cor correspondente pra tentar
        chegar no personagem preferido de Lu.
        Se não tiver com muita paciência pra isso, pode ver a resposta direto também! :)
      </p>

      <div className="mx-auto max-w-[620px] rounded-3xl border border-white/[0.10] bg-white/[0.04] backdrop-blur-md shadow-[0_18px_70px_rgba(0,0,0,0.35)]">
        <div className="p-5 sm:p-7">
          {/* Palette */}
          <div className="flex gap-2 justify-center flex-wrap mb-6">
            {paintableColors.map((num) => {
              const hex = COLORS[num].hex;
              const isSelected = num === selectedColor;

              return (
                <button
                  key={num}
                  onClick={() => setSelectedColor(num)}
                  className="w-10 h-10 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center font-mono text-xs font-bold"
                  style={{
                    background: hex,
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: isSelected
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.18)",
                    boxShadow: isSelected
                      ? "0 0 0 3px rgba(55,148,207,0.18), 0 10px 28px rgba(0,0,0,0.25)"
                      : "none",
                    transform: isSelected
                      ? "translateY(-1px)"
                      : "translateY(0)",
                    color:
                      num === 0 || num === 2
                        ? "#111"
                        : "rgba(255,255,255,0.75)",
                  }}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Progress */}
          <div className="max-w-[540px] mx-auto mb-5">
            <div className="flex justify-between text-xs font-mono opacity-50 mb-1">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, #CB8CC2, #3794CF, #077BC6)",
                }}
              />
            </div>
          </div>

          {/* Grid wrapper (arte intacta) */}
          <div className="rounded-2xl border border-white/[0.10] bg-black/35 p-3 sm:p-4">
            <div
              className="grid max-w-[540px] mx-auto select-none"
              style={{
                gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                gap: 1,
              }}
              onMouseLeave={() => setIsDrawing(false)}
            >
              {Array.from({ length: TOTAL_CELLS }).map((_, i) => {
                const number = getCellNumber(i);

                return (
                  <div
                    key={i}
                    className="aspect-square rounded-[2px] flex items-center justify-center transition-colors duration-150 cursor-pointer hover:brightness-125"
                    style={{
                      background: getCellBackground(i),
                      fontSize: "clamp(4px, 1vw, 7px)",
                      color: "rgba(255,255,255,0.35)",
                      fontFamily: "monospace",
                      lineHeight: 1,
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setIsDrawing(true);
                      fillCell(i);
                    }}
                    onMouseEnter={() => {
                      if (isDrawing) fillCell(i);
                    }}
                    onMouseUp={() => setIsDrawing(false)}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      fillCell(i);
                    }}
                  >
                    {number}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center mt-5">
            <button
              onClick={() => {
                setFilled(Array(TOTAL_CELLS).fill(null));
                setShowAnswer(false);
              }}
              className="px-5 py-2 rounded-full border border-white/[0.14] bg-white/[0.05] backdrop-blur-md font-mono text-xs cursor-pointer opacity-60 hover:opacity-100 hover:border-[#CB8CC2] transition-all"
            >
              Limpar
            </button>
            <button
              onClick={() => setShowAnswer((prev) => !prev)}
              className="px-5 py-2 rounded-full border border-white/[0.14] bg-white/[0.05] backdrop-blur-md font-mono text-xs cursor-pointer opacity-60 hover:opacity-100 hover:border-[#3794CF] transition-all"
            >
              {showAnswer ? "Esconder resposta" : "Ver resposta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);
}
