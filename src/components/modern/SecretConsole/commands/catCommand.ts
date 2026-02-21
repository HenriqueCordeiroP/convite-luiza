import { VFS } from "../data/vfs";
import type { CommandContext } from "../types";

export function handleCatCommand(cmd: string, ctx: CommandContext): boolean {
  const { addLine, escapeHtml } = ctx;

  if (cmd === "cat") {
    addLine(
      [
        '<span style="color:#3794CF">Arquivos disponíveis:</span>',
        '<span style="color:#A6CEE8">bebidas.txt</span>   — Lista de bebidas do evento',
        '<span style="color:#A6CEE8">atracoes.txt</span>  — Atrações e DJs',
        "",
        '<span style="opacity:0.4;font-style:italic">// Exemplo: cat bebidas.txt</span>',
      ].join("<br/>")
    );
    return true;
  }

  if (cmd.startsWith("cat ")) {
    const file = cmd.slice(4).trim();
    const content = VFS[file];
    if (content) {
      addLine(content);
    } else {
      addLine(`Arquivo não encontrado: ${escapeHtml(file)}`);
    }
    return true;
  }

  return false;
}
