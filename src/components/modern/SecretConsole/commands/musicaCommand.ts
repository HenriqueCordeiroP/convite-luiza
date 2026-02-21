import type { CommandContext } from "../types";

export type MusicaCommandDeps = {
  TRACKS: { id: string; title: string; tagline: string }[];
  isMusicOn: boolean;
  isMusicLoading: boolean;
  currentTrackId: string;
  getTrackById: (id: string) => { id: string; title: string } | null;
  playTrack: (idOrTitle: string) => Promise<boolean>;
  playNextTrack: () => void | Promise<unknown>;
  stopMusic: () => void;
  DEFAULT_TRACK_ID: string;
};

/* ✅ Normalização para aceitar acento, caixa alta etc */
function normalizeCmd(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function handleMusicaCommand(
  cmd: string,
  ctx: CommandContext,
  deps: MusicaCommandDeps
): boolean {
  const { addLine, escapeHtml } = ctx;
  const {
    TRACKS,
    isMusicOn,
    isMusicLoading,
    currentTrackId,
    getTrackById,
    playTrack,
    playNextTrack,
    stopMusic,
    DEFAULT_TRACK_ID,
  } = deps;

  const ncmd = normalizeCmd(cmd);

  if (ncmd === "musica" || ncmd === "musicas") {
    addLine(
      [
        '<span style="color:#3794CF">🎧 Comando de música — Playlist Justin Bieber</span>',
        "",
        '<span style="color:#A6CEE8">Como usar:</span>',
        '  <span style="color:#CB8CC2">musica list</span>   — Ver todas as músicas da playlist',
        '  <span style="color:#CB8CC2">musica play &lt;nº ou nome&gt;</span> — Tocar por número ou título',
        '  <span style="color:#CB8CC2">musica next</span>   — Pular para a próxima faixa',
        '  <span style="color:#CB8CC2">musica on</span>    — Iniciar playlist (começa pela primeira)',
        '  <span style="color:#CB8CC2">musica off</span>   — Pausar música',
        '  <span style="color:#CB8CC2">musica status</span> — Ver faixa atual e estado',
        "",
        '<span style="opacity:0.6">Exemplos de play:</span>',
        '  <span style="color:#A6CEE8">musica play 2</span>        — Toca a música #2',
        '  <span style="color:#A6CEE8">musica play Baby</span>     — Toca "Baby" pelo nome',
        '  <span style="color:#A6CEE8">musica play beauty</span>  — Também funciona com parte do nome',
        "",
        '<span style="opacity:0.4;font-style:italic">// As músicas passam sozinhas automaticamente ao terminar</span>',
      ].join("<br/>")
    );
    return true;
  }

  if (ncmd === "musica list") {
    addLine(
      [
        '<span style="color:#3794CF">📋 Playlist disponível:</span>',
        "",
        ...TRACKS.map(
          (t) =>
            `  <span style="color:#A6CEE8">${escapeHtml(t.id)}</span> — ${escapeHtml(t.title)} <span style="opacity:0.5">(${escapeHtml(t.tagline)})</span>`
        ),
        "",
        '<span style="opacity:0.5">Tocar: musica play 1 ou musica play Baby</span>',
      ].join("<br/>")
    );
    return true;
  }

  if (ncmd === "musica status") {
    const t = getTrackById(currentTrackId);
    if (!t) {
      addLine(
        '🎧 Nenhuma faixa selecionada. Use <span style="color:#A6CEE8">musica on</span> para começar.'
      );
      return true;
    }
    addLine(
      [
        `🎧 Faixa atual: <span style="color:#CB8CC2">${escapeHtml(t.title)}</span>`,
        `Status: ${
          isMusicOn
            ? '<span style="color:#3794CF">▶ tocando</span>'
            : '<span style="opacity:0.6">⏸ pausado</span>'
        }${isMusicLoading ? ' <span style="opacity:0.5">(carregando…)</span>' : ""}`,
      ].join("<br/>")
    );
    return true;
  }

  if (ncmd === "musica off") {
    stopMusic();
    addLine("Música (infelizmente) pausada.");
    return true;
  }

  if (ncmd === "musica on") {
    playTrack(DEFAULT_TRACK_ID);
    return true;
  }

  if (ncmd === "musica next") {
    playNextTrack();
    addLine('<span style="opacity:0.7">Avançando para a próxima faixa…</span>');
    return true;
  }

  if (ncmd.startsWith("musica play ")) {
    const arg = cmd.replace(/musica\s+play\s+/i, "").trim();
    playTrack(arg);
    return true;
  }

  return false;
}
