import {
  Archivo,
  Archivo_Black,
  Bebas_Neue,
  Caveat,
  DM_Serif_Display,
  Fraunces,
  IBM_Plex_Mono,
  Inter,
  Lora,
  Manrope,
  Nunito,
  Oswald,
  Playfair_Display,
  Press_Start_2P,
  Roboto_Slab,
  Sora,
  Space_Grotesk,
  Space_Mono,
  VT323,
  Work_Sans
} from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });
export const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
export const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
export const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
export const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
export const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-worksans", display: "swap" });
export const lora = Lora({ subsets: ["latin"], variable: "--font-lora", display: "swap" });
export const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
export const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
export const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-dmserif", display: "swap" });
export const robotoSlab = Roboto_Slab({ subsets: ["latin"], variable: "--font-robotoslab", display: "swap" });
export const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas", display: "swap" });
export const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", display: "swap" });
export const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivoblack", display: "swap" });
export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap"
});
export const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-spacemono", display: "swap" });
export const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap" });
export const vt323 = VT323({ subsets: ["latin"], weight: "400", variable: "--font-vt323", display: "swap" });
export const pressStart = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-pressstart", display: "swap" });

export const allFonts = [
  inter,
  space,
  archivo,
  manrope,
  sora,
  nunito,
  workSans,
  lora,
  fraunces,
  playfair,
  dmSerif,
  robotoSlab,
  bebas,
  oswald,
  archivoBlack,
  ibmPlexMono,
  spaceMono,
  caveat,
  vt323,
  pressStart
];
