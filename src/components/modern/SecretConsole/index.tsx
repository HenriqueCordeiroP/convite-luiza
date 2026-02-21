"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { escapeHtml } from "./utils";
import { useMusicPlayer } from "./hooks/useMusicPlayer";
import { launchConfettiRain } from "./components/ConfettiRain";
import { MusicWaveform } from "./components/MusicWaveform";
import { handleCdCommand } from "./commands/cdCommand";
import { handleCatCommand } from "./commands/catCommand";
import { handleMusicaCommand } from "./commands/musicaCommand";
import { handleBasicCommand } from "./commands/basicCommands";

export interface SecretConsoleProps {
  onBackToRetro: () => void;
}

const INITIAL_LINES: string[] = [
  '<span style="opacity:0.4;font-style:italic">// Bem-vindo ao terminal secreto da Luiza!</span>',
  '<span style="opacity:0.4;font-style:italic">// Digite "help" para ver os comandos disponíveis</span>',
  '<span style="color:#A6CEE8">$</span> <span style="color:#3794CF">echo</span> <span style="color:#CB8CC2">"Olá, visitante! 👋"</span>',
  "Olá, visitante! 👋",
];

export function SecretConsole({ onBackToRetro }: SecretConsoleProps) {
  const [lines, setLines] = useState<string[]>(INITIAL_LINES);
  const [input, setInput] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);

  const addLine = useCallback((html: string) => {
    setLines((prev) => [...prev, html]);
  }, []);

  const setLinesFn = useCallback((fn: (prev: string[]) => string[]) => {
    setLines(fn);
  }, []);

  const music = useMusicPlayer(addLine, escapeHtml);

  const ctx = useMemo(
    () => ({
      addLine,
      setLines: setLinesFn,
      escapeHtml,
      onBackToRetro,
    }),
    [addLine, setLinesFn, onBackToRetro]
  );

  const musicDeps = useMemo(
    () => ({
      TRACKS: music.TRACKS,
      isMusicOn: music.isMusicOn,
      isMusicLoading: music.isMusicLoading,
      currentTrackId: music.currentTrackId,
      getTrackById: music.getTrackById,
      playTrack: music.playTrack,
      playNextTrack: music.playNextTrack,
      stopMusic: music.stopMusic,
      DEFAULT_TRACK_ID: music.DEFAULT_TRACK_ID,
    }),
    [
      music.TRACKS,
      music.isMusicOn,
      music.isMusicLoading,
      music.currentTrackId,
      music.getTrackById,
      music.playTrack,
      music.playNextTrack,
      music.stopMusic,
      music.DEFAULT_TRACK_ID,
    ]
  );

  const handleCommand = useCallback(
    async (cmd: string) => {
      addLine(`<span style="color:#A6CEE8">$</span> ${escapeHtml(cmd)}`);

      if (handleCdCommand(cmd, ctx)) return;
      if (handleCatCommand(cmd, ctx)) return;
      if (handleMusicaCommand(cmd, ctx, musicDeps)) return;

      const result = handleBasicCommand(cmd, ctx, {
        launchConfettiRain,
        setLines: setLinesFn,
      });

      if (result != null) {
        addLine(result);
      } else if (result === undefined) {
        addLine(
          `comando não encontrado: ${escapeHtml(cmd)}<br/><span style="opacity:0.4">Tente "help"</span>`
        );
      }
    },
    [addLine, escapeHtml, ctx, musicDeps, setLinesFn]
  );

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const currentTrack = music.getTrackById(music.currentTrackId);

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-mono text-xs tracking-[4px] uppercase text-[#7BB1D9] mb-4">
          Para os devs
        </p>
        <h2 className="font-modern text-3xl sm:text-4xl font-bold mb-2 leading-tight">
          Terminal <span className="text-[#3794CF]">integrado</span>
        </h2>
        <p className="opacity-50 text-sm mb-8">
          Tente: <code className="text-[#3794CF]">help</code>
        </p>

        <div className="max-w-[700px] mx-auto rounded-2xl overflow-hidden border bg-black/60 text-left">
          <div
            ref={bodyRef}
            className="p-5 font-mono text-[13px] min-h-[200px] max-h-[300px] overflow-y-auto"
          >
            {lines.map((line, i) => (
              <div key={i} dangerouslySetInnerHTML={{ __html: line }} />
            ))}
            {music.isMusicOn && (
              <MusicWaveform
                isPlaying={music.isMusicOn}
                barCount={21}
                trackTitle={currentTrack?.title ?? ""}
              />
            )}
          </div>

          <div className="px-5 py-3 border-t flex items-center gap-2 min-w-0">
            <span className="text-[#CB8CC2] font-bold font-mono shrink-0">$</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  handleCommand(input.trim().toLowerCase());
                  setInput("");
                }
              }}
              className="flex-1 bg-transparent outline-none font-mono text-[#7BB1D9] min-w-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
