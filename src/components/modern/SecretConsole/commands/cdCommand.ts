import type { CommandContext } from "../types";

export function handleCdCommand(cmd: string, ctx: CommandContext): boolean {
  const { addLine, escapeHtml, onBackToRetro } = ctx;

  if (cmd === "cd") {
    addLine(
      [
        '<span style="color:#3794CF">Uso:</span> cd &lt;diretório&gt;',
        "",
        "Exemplos:",
        '  <span style="color:#A6CEE8">cd luiza</span>   — Abre fotos da Luiza',
        '  <span style="color:#A6CEE8">cd meninas</span> — Abre fotos das meninas',
        '  <span style="color:#A6CEE8">cd retro</span>   — Volta ao visual retrô',
        "",
        '<span style="opacity:0.4;font-style:italic">// Use "ls" para ver os diretórios disponíveis</span>',
      ].join("<br/>")
    );
    return true;
  }

  if (cmd === "cd luiza") {
    addLine('<span style="color:#3794CF">Abrindo luiza/...</span>');
    window.open("/luiza", "_blank");
    return true;
  }

  if (cmd === "cd meninas") {
    addLine('<span style="color:#3794CF">Abrindo meninas/...</span>');
    window.open("/meninas", "_blank");
    return true;
  }

  if (cmd === "cd retro") {
    addLine('<span style="color:#3794CF">Abrindo retro/...</span>');
    onBackToRetro();
    return true;
  }

  if (cmd.startsWith("cd ")) {
    const dir = cmd.slice(3).trim();
    addLine(
      `<span style="color:#0668BC">cd:</span> ${escapeHtml(dir)}: diretório não encontrado`
    );
    return true;
  }

  return false;
}
