/**
 * Tokens da INTERFACE do produto (marca BlueMetrics).
 * Extraídos do bloco THEME de KontivaResultado.jsx — fonte de verdade das
 * cores/fontes das cenas 1 a 7. Ciano/radar (marketing) NÃO vive aqui; ele
 * fica em KontivaFraming.jsx (a moldura).
 *
 * As fontes do produto (Outfit + Wix Madefor Text) são carregadas aqui, uma
 * única vez, e reusadas por todas as cenas de dados.
 */
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadWix } from "@remotion/google-fonts/WixMadeforText";

const LATIN = { subsets: ["latin"], ignoreTooManyRequestsWarning: true };
const { fontFamily: OUTFIT } = loadOutfit("normal", { weights: ["600", "700", "800"], ...LATIN });
const { fontFamily: WIX } = loadWix("normal", { weights: ["500", "600", "700", "800"], ...LATIN });

export const THEME = {
  navy: "#030A8B", // barra lateral / marca
  blue: "#0C27E8", // primário / aba ativa / tile ativo
  ink: "#0B1533", // títulos e texto forte
  body: "#3A4256", // texto corpo
  muted: "#8B93A6", // eyebrows, cabeçalho de tabela, secundário
  line: "#E6E9F1", // bordas
  surface: "#FFFFFF", // cards e painéis
  pageBg: "#F4F6FA", // fundo de conteúdo
  green: "#17A34A", // valores positivos / créditos / "a recuperar"
  red: "#E0463A", // débitos / negativos
  fontDisplay: `${OUTFIT}, system-ui, sans-serif`,
  fontBody: `${WIX}, system-ui, sans-serif`,
};

/* --------------------------------------------------------------- FORMATADORES */
const nf = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export const brl = (n) => `R$ ${nf.format(n)}`;
export const pct = (n) => `${nf.format(n)}%`;
