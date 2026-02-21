import { useState, useRef, useCallback, useEffect } from "react";
import { TRACKS, DEFAULT_TRACK_ID } from "../data/tracks";
import type { Track } from "../types";

type AddLineFn = (html: string) => void;

export function useMusicPlayer(addLine: AddLineFn, escapeHtml: (t: string) => string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState(DEFAULT_TRACK_ID);
  const [isMusicLoading, setIsMusicLoading] = useState(false);
  const loaderIntervalRef = useRef<number | null>(null);

  const getTrackById = useCallback((id: string) => TRACKS.find((t) => t.id === id) ?? null, []);
  const getTrackByTitle = useCallback((title: string) => {
    const normalized = title.toLowerCase().trim();
    return TRACKS.find((t) => t.title.toLowerCase().includes(normalized)) ?? null;
  }, []);

  const getTrack = useCallback((idOrTitle: string): Track | null => {
    const byId = getTrackById(idOrTitle);
    if (byId) return byId;
    return getTrackByTitle(idOrTitle);
  }, [getTrackById, getTrackByTitle]);

  const getNextTrackId = useCallback((afterTrackId?: string) => {
    const id = afterTrackId ?? currentTrackId;
    const idx = TRACKS.findIndex((t) => t.id === id);
    const nextIdx = idx < 0 ? 0 : (idx + 1) % TRACKS.length;
    return TRACKS[nextIdx].id;
  }, [currentTrackId]);

  const stopTerminalLoader = useCallback(() => {
    if (loaderIntervalRef.current) {
      window.clearInterval(loaderIntervalRef.current);
      loaderIntervalRef.current = null;
    }
  }, []);

  const startTerminalLoader = useCallback(
    (label: string) => {
      stopTerminalLoader();
      addLine(`<span style="opacity:0.75">${escapeHtml(label)}</span>`);
    },
    [addLine, escapeHtml, stopTerminalLoader]
  );

  const ensureAudio = useCallback((src: string, loop: boolean) => {
    if (audioRef.current && audioRef.current.src.includes(src)) {
      audioRef.current.loop = loop;
      return audioRef.current;
    }
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch {}
    }
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.loop = loop;
    audio.volume = 0.9;
    audioRef.current = audio;
    return audio;
  }, []);

  const playTrack = useCallback(
    async (idOrTitle: string, onSuccess?: (track: Track) => void): Promise<boolean> => {
      const track = getTrack(idOrTitle);
      if (!track) {
        addLine(
          `🎧 Música não encontrada. Use <span style="color:#A6CEE8">musica list</span> para ver a playlist disponível.`
        );
        return false;
      }

      setCurrentTrackId(track.id);
      setIsMusicLoading(true);
      startTerminalLoader(`Carregando: ${track.title} — Justin Bieber`);

      const audio = ensureAudio(track.src, false);

      const onCanPlay = () => {
        setIsMusicLoading(false);
        stopTerminalLoader();
        addLine(`Tocando: <span style="color:#CB8CC2">${escapeHtml(track.title)}</span> — ${escapeHtml(track.tagline)}`);
      };

      const onWaiting = () => {
        setIsMusicLoading(true);
        addLine(`<span style="opacity:0.5">Carregando áudio…</span>`);
      };

      const onError = () => {
        setIsMusicLoading(false);
        stopTerminalLoader();
        addLine(
          `Erro ao carregar <span style="color:#A6CEE8">${escapeHtml(track.title)}</span>. Verifique se o arquivo existe em <span style="opacity:0.75">public/audio</span>.`
        );
      };

      const onEnded = () => {
        setIsMusicOn(false);
        const nextId = getNextTrackId(track.id);
        playTrack(nextId);
      };

      audio.addEventListener("canplay", onCanPlay, { once: true });
      audio.addEventListener("error", onError, { once: true });
      audio.addEventListener("waiting", onWaiting);
      audio.addEventListener("ended", onEnded);

      const doPlay = async () => {
        if (track.startAt != null && track.startAt > 0) {
          if (audio.readyState < 1) {
            await new Promise<void>((resolve) => {
              audio.addEventListener("loadedmetadata", () => resolve(), { once: true });
            });
          }
          audio.currentTime = track.startAt;
        }
        await audio.play();
      };

      try {
        await doPlay();
        setIsMusicOn(true);
        addLine(`🎧 <span style="color:#CB8CC2">${escapeHtml(track.title)}</span>`);
        onSuccess?.(track);

        setTimeout(() => audio.removeEventListener("waiting", onWaiting), 8000);
        return true;
      } catch {
        setIsMusicLoading(false);
        stopTerminalLoader();
        audio.removeEventListener("ended", onEnded);
        addLine(
          `O navegador bloqueou o áudio. Tente novamente: <span style="color:#A6CEE8">musica play ${escapeHtml(track.id)}</span>`
        );
        return false;
      }
    },
    [
      addLine,
      ensureAudio,
      getTrack,
      getNextTrackId,
      startTerminalLoader,
      stopTerminalLoader,
      escapeHtml,
    ]
  );

  const stopMusic = useCallback(() => {
    stopTerminalLoader();
    setIsMusicLoading(false);
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {}
    }
    setIsMusicOn(false);
  }, [stopTerminalLoader]);

  useEffect(() => {
    return () => {
      stopTerminalLoader();
      try {
        audioRef.current?.pause();
      } catch {}
    };
  }, [stopTerminalLoader]);

  const playNextTrack = useCallback(async () => {
    const nextId = getNextTrackId(currentTrackId);
    await playTrack(nextId);
  }, [currentTrackId, getNextTrackId, playTrack]);

  return {
    TRACKS,
    DEFAULT_TRACK_ID,
    audioRef,
    isMusicOn,
    isMusicLoading,
    currentTrackId,
    getTrackById,
    getTrackByTitle,
    getTrack,
    playTrack,
    playNextTrack,
    stopMusic,
  };
}
