import type { Track } from "../types";
import { assetUrl } from "@/lib/utils";

export const TRACKS: Track[] = [
  {
    id: "1",
    title: "Baby",
    src: assetUrl("/audio/jb-baby.mp3"),
    tagline: "A primeira música e o primeiro contato com o primeiro amor da vida de Lu"
  },
  {
    id: "2",
    title: "Sorry",
    src: assetUrl("/audio/jb-sorry.mp3"),
    tagline: "Pra dançar de pisar em cima do computador e quebrar a tela",
    startAt: 4,
  },
  {
    id: "3",
    title: "Love Me",
    src: assetUrl("/audio/jb-love-me.mp3"),
    tagline: "De chorar querendo ir pra um show de Justin Bieber"
  },
  {
    id: "4",
    title: "One Less Lonely Girl",
    src: assetUrl("/audio/jb-one-less.mp3"),
    tagline: "O sonho era ser chamada pra esse palco e ele cantando pra mim"
  },
  {
    id: "5",
    title: "One Time",
    src: assetUrl("/audio/jb-one-time.mp3"),
    tagline: "Só aumentando a paixão."
  },
  {
    id: "6",
    title: "Beauty and a Beat",
    src: assetUrl("/audio/jb-beauty.mp3"),
    tagline: "De GRITAR e CANTAR alto em qualquer carro, estrada, quarto ou festa",
    startAt: 8,
  },
];

export const DEFAULT_TRACK_ID = "1";
