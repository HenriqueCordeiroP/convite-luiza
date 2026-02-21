import type { CommandContext } from "../types";

export type BasicCommandDeps = {
  launchConfettiRain: () => void;
  setLines: (fn: (prev: string[]) => string[]) => void;
};

export function handleBasicCommand(
  cmd: string,
  ctx: CommandContext,
  deps: BasicCommandDeps
): string | null | undefined {
  const { addLine } = ctx;
  const { launchConfettiRain, setLines } = deps;

  const commands: Record<string, () => string | null> = {
    help: () =>
      [
        '<span style="color:#3794CF">Comandos disponíveis:</span>',
        "help      — Lista todos os comandos",
        "whoami    — Quem é você aqui",
        "luiza    — Sobre a aniversariante",
        "party    — Chuva de confete 🎉",
        "cat      — Ler arquivos (bebidas, atrações)",
        "clear    — Limpar a tela do terminal",
        "ls       — Listar diretórios",
        "cd       — Navegar entre páginas",
        "musica   — Playlist Justin Bieber 🎧",
        "",
        '<span style="opacity:0.5">Digite o nome do comando para usar. Ex: musica list</span>',
      ].join("<br/>"),

    whoami: () => "visitante@formatura-luiza (aprovado pela Nika)",

    luiza: () =>
      [
        '<span style="color:#CB8CC2">Luiza Omena</span>',
        '<span style="opacity:0.6;font-style:italic">Olá, sou o ChatGPT, um modelo de linguagem treinado com bilhões de palavras para reconhecer padrões, organizar ideias e transformar tudo isso em texto coerente. Foi preferível delegar essa descrição a uma IA — então aqui vai Luiza através dos meus olhos digitais 👀</span>',
        "",
        "Luiza é o tipo de pessoa que equilibra lógica e intensidade com uma naturalidade curiosa. Formada em Ciência da Computação 🎓, ela gosta de resolver problemas difíceis — mas vive a vida sentindo tudo em volume alto.",
        "Ama animais de um jeito que não é negociável. Existe a Nika. A gordinha perfeita. Não é apenas um pet — é evento canônico na história da humanidade pessoal dela 🐶. E sim, vocês vão ver ela.",
        "Ela ama ler porque gosta de mundos. Quando encontra um livro bom, o resto do planeta vira ruído de fundo.",
        "Tem uma queda declarada por dragões, então Como Treinar Seu Dragão não é só o filme preferido — é praticamente parte da identidade. Se você explorou o site, já percebeu isso.",
        "Musicalmente existe uma constante estatística impressionante: Justin Bieber. Desde a primeira retrospectiva do Spotify, ele é o artista mais escutado todos os anos. Sem interrupções. Uma série histórica de respeito 🎧",
        "Entre código, música alta no quarto, histórias fantásticas e conversas longas sobre bichinhos, Luiza construiu um jeito muito próprio de existir. Organizada quando precisa. Intensa quase sempre. Entediante nunca.",
        "",
        '<span style="opacity:0.5;font-style:italic">// análise concluída: personalidade consistente, alto índice de afeto, leve tendência a dragões e bieberismo crônico.</span>',
      ].join("<br/>"),

    party: () => {
      launchConfettiRain();
      return "🎉 CONFETE LIBERADO 🎉";
    },

    clear: () => {
      setLines(() => []);
      return null;
    },

    ls: () =>
      [
        '<span style="color:#A6CEE8">drwxr-xr-x</span>  luiza/     <span style="opacity:0.4">← fotos da Luiza</span>',
        '<span style="color:#A6CEE8">drwxr-xr-x</span>  meninas/  <span style="opacity:0.4">← fotos das garotas</span>',
        '<span style="color:#A6CEE8">drwxr-xr-x</span>  retro/    <span style="opacity:0.4">← visual retrô</span>',
      ].join("<br/>"),
  };

  const handler = commands[cmd];
  if (handler) {
    return handler();
  }
  return undefined;
}
