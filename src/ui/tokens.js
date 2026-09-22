/**
 * Tokens da INTERFACE do produto — extraídos do código real do repositório
 * Bluemetrics/blueaccount-ai (apps/frontend/src/kontiva/kontiva.css :root).
 *
 * A tela real de Simulações é CLARA: canvas cinza-claro, sidebar/topbar navy,
 * cards brancos, acento ciano. Os valores abaixo são os hex reais do produto.
 * Fontes reais: Space Grotesk (display), Inter (corpo/números), Instrument
 * Serif (itálico de acento).
 */
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";

const LATIN = { subsets: ["latin"], ignoreTooManyRequestsWarning: true };
const { fontFamily: SPACE } = loadSpaceGrotesk("normal", { weights: ["500", "600", "700"], ...LATIN });
const { fontFamily: INTER } = loadInter("normal", { weights: ["400", "500", "600", "700"], ...LATIN });
loadSerif("italic", { weights: ["400"], ...LATIN });
const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400"], ...LATIN });

export const THEME = {
  navy: "#0A1F3F", // sidebar, topbar, títulos, texto forte
  navy2: "#122A52", // hover navy
  ciano: "#00D4FF", // acento (nav ativa, botão primário, foco)
  cianoSoft: "#E0F9FF", // fill de acento suave (chips, tfoot, líquido)
  surface: "#FFFFFF", // cards
  pageBg: "#F2F4F7", // canvas
  muted: "#6B7280", // texto secundário / labels
  body: "#374151", // texto corpo
  border: "rgba(10,31,63,0.14)", // bordas em superfícies claras
  cardBorder: "rgba(10,31,63,0.08)", // borda de card/linha
  hairline: "rgba(10,31,63,0.07)", // divisórias de tabela
  green: "#16A34A", // positivo / a recuperar
  greenText: "#15803D",
  red: "#DC2626", // negativo / a recolher
  redText: "#B91C1C",
  accentPillBg: "#EEF2FF", // pill "Simulações"
  accentPillText: "#3B4FE8",
  // banner beta
  betaBg: "#FFF8E6",
  betaBorder: "#F2D98A",
  betaBadgeBg: "#FBEBBF",
  betaBadgeText: "#8A6100",
  // sidebar (sobre o navy)
  navText: "rgba(234,246,255,0.6)",
  navTextHover: "#EAF6FF",
  navSectionLabel: "rgba(234,246,255,0.35)",
  navActiveBg: "rgba(0,212,255,0.12)",
  // sombras
  cardShadow: "0 24px 68px -24px rgba(10,31,63,0.18)",
  fontDisplay: `${SPACE}, system-ui, sans-serif`,
  fontBody: `${INTER}, system-ui, sans-serif`,
  fontMono: `${INTER}, ui-monospace, monospace`,
  fontSerif: `${SERIF}, Georgia, serif`,
};

/* --------------------------------------------------------------- FORMATADORES */
const nf = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const brl = (n) => `R$ ${nf.format(n)}`;
/* Percentual em pt-BR (vírgula), 2 casas — coerente com o Anexo A e o locale. */
export const pct = (n) => `${nf.format(n)}%`;
