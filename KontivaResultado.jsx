/**
 * Kontiva — Cena piloto: "Resultado da simulação" (bloco 2:50–3:40 do roteiro)
 * Remotion · 1920x1080 · 30fps
 *
 * A INTERFACE é recriada fiel ao produto (marca BlueMetrics: navy #030A8B,
 * azul #0C27E8, verde para créditos, fontes Outfit + Wix Madefor Text).
 * O visual radar/ciano do design system de marketing NÃO entra dentro da tela;
 * ele fica para a moldura/transições na composição-mestre.
 *
 * COMO USAR
 * 1. Num projeto Remotion:  npm i @remotion/google-fonts
 * 2. Copie este arquivo para  src/KontivaResultado.jsx
 * 3. Registre no src/Root.jsx (snippet no fim deste arquivo, comentado).
 * 4. Preview:  npx remotion studio      Render:  npx remotion render KontivaResultado
 *
 * Todos os tokens de cor/fonte estão em THEME e os dados em DATA — trocar
 * a marca ou os números é mexer só nesses dois blocos.
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Sequence,
} from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadWix } from "@remotion/google-fonts/WixMadeforText";

const { fontFamily: OUTFIT } = loadOutfit();
const { fontFamily: WIX } = loadWix();

/* ------------------------------------------------------------------ TOKENS */
const THEME = {
  navy: "#030A8B",        // barra lateral / marca
  blue: "#0C27E8",        // primário / aba ativa / tile "T"
  ink: "#0B1533",         // títulos e texto forte
  body: "#3A4256",        // texto corpo
  muted: "#8B93A6",       // eyebrows, cabeçalho de tabela, secundário
  line: "#E6E9F1",        // bordas
  surface: "#FFFFFF",
  pageBg: "#F4F6FA",
  green: "#17A34A",       // valores positivos / créditos / "a recuperar"
  red: "#E0463A",         // débitos / negativos (não usado nesta tela)
  fontDisplay: `${OUTFIT}, system-ui, sans-serif`,
  fontBody: `${WIX}, system-ui, sans-serif`,
};

/* -------------------------------------------------------------------- DADOS */
/* Valores confirmados por screenshot real (alta confiança). */
const DATA = {
  breadcrumb: ["SIMULAÇÕES", "VÉRTICE DISTRIBUIDORA ATACADISTA L…", "NOTAS"],
  tabs: ["RESULTADO", "LANÇAMENTOS E NOTAS", "FLUXO DE CAIXA"],
  eyebrow: "VISÃO CONSOLIDADA",
  title: "Resultado da simulação",
  helper:
    "Leia primeiro os indicadores finais e avance para a apuração, a formação econômica e as pendências do cenário.",
  cardsEyebrow: "RESUMO EXECUTIVO",
  cards: [
    { label: "RESULTADO ESTIMADO DO CENÁRIO", value: 379800, kind: "brl", accent: "green" },
    { label: "MARGEM ESTIMADA", value: 701200, kind: "brl", accent: "green" },
    { label: "CARGA TRIBUTÁRIA TOTAL (RECEITA BRUTA)", value: 3.56, kind: "pct", accent: "none" },
    { label: "IVA LÍQUIDO TOTAL", value: 46593, kind: "brl", accent: "green", note: "A RECUPERAR" },
  ],
  apEyebrow: "APURAÇÃO IBS/CBS",
  apSub: "IBS e CBS usam as mesmas bases elegíveis, com débitos, créditos e saldos apresentados separadamente.",
  apCols: ["TRIBUTO", "BASE DE RECEITAS", "DÉBITOS", "BASE DE CUSTOS/DESPESAS", "CRÉDITOS", "SALDO"],
  apRows: [
    { tributo: "IBS", vals: [1600000, 484, 1115000, 985], saldo: 501, saldoNote: "A RECUPERAR" },
    { tributo: "CBS", vals: [1600000, 44528, 1115000, 90620], saldo: 46092, saldoNote: "A RECUPERAR" },
  ],
};

/* --------------------------------------------------------------- FORMATADORES */
const nf = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const brl = (n) => `R$ ${nf.format(n)}`;
const pct = (n) => `${nf.format(n)}%`;

/* Conta de 0 até value entre [start, start+dur]. */
const useCountUp = (value, start, dur = 26) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return value * p;
};

/* Entrada padrão: fade + subida, via spring. */
const useEnter = (appear, rise = 18) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appear, fps, config: { damping: 200 } });
  return { opacity: interpolate(s, [0, 1], [0, 1]), y: interpolate(s, [0, 1], [rise, 0]) };
};

/* ------------------------------------------------------------------- ÍCONES */
const Icon = ({ d, active }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke={active ? "#fff" : "rgba(255,255,255,0.72)"} strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);
const ICONS = {
  home: <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  user: <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>,
  doc: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /></>,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.4" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></>,
  truck: <><rect x="2" y="7" width="12" height="9" rx="1" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>,
  coin: <><ellipse cx="12" cy="7" rx="7" ry="3" /><path d="M5 7v6c0 1.7 3.1 3 7 3s7-1.3 7-3V7" /></>,
  alert: <><path d="M12 4 2.5 20h19z" /><path d="M12 10v4" /><path d="M12 17h.01" /></>,
};

/* -------------------------------------------------------------------- CHROME */
const Sidebar = () => {
  const { opacity, y } = useEnter(0, 0);
  const set = ["home", "user", "doc", "target", "grid", "truck", "coin", "alert"];
  return (
    <div style={{
      position: "absolute", left: 0, top: 0, width: 84, height: "100%",
      background: THEME.navy, opacity, transform: `translateX(${(y - 0) - 24 * (1 - opacity)}px)`,
      display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 18, gap: 26,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, background: "#fff",
        color: THEME.navy, fontFamily: THEME.fontDisplay, fontWeight: 800, fontSize: 22,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>K.</div>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.10)",
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon d={<path d="M9 6l6 6-6 6" />} />
      </div>
      {set.map((k, i) => {
        const active = k === "target"; // a tela ativa é o tile "T"; uso 'target' como marcador
        return (
          <div key={k} style={{
            width: 40, height: 40, borderRadius: 10,
            background: i === 3 ? THEME.blue : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {i === 3
              ? <span style={{ color: "#fff", fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 18 }}>T</span>
              : <Icon d={ICONS[k]} active={active} />}
          </div>
        );
      })}
    </div>
  );
};

const TopBar = () => {
  const { opacity } = useEnter(2);
  return (
    <div style={{
      position: "absolute", left: 84, top: 0, right: 0, height: 76, background: THEME.surface,
      borderBottom: `1px solid ${THEME.line}`, display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 34px", opacity,
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", fontFamily: THEME.fontBody,
        fontSize: 14, letterSpacing: 0.6, color: THEME.muted, fontWeight: 600 }}>
        {DATA.breadcrumb.map((b, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ opacity: 0.5 }}>/</span>}
            <span>{b}</span>
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ padding: "9px 16px", borderRadius: 10, border: `1px solid ${THEME.line}`,
          fontFamily: THEME.fontBody, fontSize: 14, fontWeight: 600, color: THEME.ink }}>
          Perguntar ao ChatGPT
        </div>
        <div style={{ fontFamily: THEME.fontBody, fontSize: 14, fontWeight: 700, color: THEME.ink }}>PT</div>
      </div>
    </div>
  );
};

const Tabs = () => {
  const { opacity, y } = useEnter(8);
  return (
    <div style={{ display: "flex", gap: 6, background: "#EDEFF4", padding: 6, borderRadius: 12,
      width: "fit-content", opacity, transform: `translateY(${y}px)` }}>
      {DATA.tabs.map((t, i) => {
        const active = i === 0;
        return (
          <div key={t} style={{
            padding: "11px 20px", borderRadius: 9, fontFamily: THEME.fontDisplay, fontWeight: 700,
            fontSize: 14, letterSpacing: 0.4,
            background: active ? THEME.surface : "transparent",
            color: active ? THEME.ink : THEME.muted,
            boxShadow: active ? "0 2px 8px rgba(3,10,139,0.10)" : "none",
          }}>{t}</div>
        );
      })}
    </div>
  );
};

/* --------------------------------------------------------------- EXEC CARDS */
const ExecCard = ({ card, index }) => {
  const appear = 34 + index * 7;
  const { opacity, y } = useEnter(appear);
  const frame = useCurrentFrame();
  const counted = useCountUp(card.value, appear + 4, 26);
  const barGrow = interpolate(frame, [appear, appear + 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });

  // Realce do card herói (IVA líquido) a partir de ~f168
  const isHero = card.label.startsWith("IVA");
  const pulse = isHero
    ? Math.max(0, Math.sin((frame - 168) / 9)) * (frame > 168 ? 1 : 0)
    : 0;

  const accentColor = card.accent === "green" ? THEME.green : THEME.line;
  const valueColor = card.accent === "green" ? THEME.green : THEME.ink;
  const display = card.kind === "pct" ? pct(counted) : brl(counted);

  return (
    <div style={{
      flex: 1, background: THEME.surface, borderRadius: 14, border: `1px solid ${THEME.line}`,
      borderLeft: "none", padding: "22px 24px", position: "relative", overflow: "hidden",
      opacity, transform: `translateY(${y}px)`,
      boxShadow: isHero ? `0 0 0 ${2 * pulse}px rgba(23,163,74,${0.35 * pulse})` : "none",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 4, height: "100%",
        background: accentColor, transform: `scaleY(${barGrow})`, transformOrigin: "top" }} />
      <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 12.5,
        letterSpacing: 0.7, color: THEME.muted, marginBottom: 14, lineHeight: 1.3 }}>
        {card.label}
      </div>
      <div style={{ fontFamily: THEME.fontBody, fontWeight: 800, fontSize: 34, color: valueColor,
        fontVariantNumeric: "tabular-nums" }}>
        {display}
      </div>
      {card.note && (
        <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 11,
          letterSpacing: 0.8, color: THEME.green, marginTop: 6 }}>{card.note}</div>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------- APURAÇÃO */
const ApRow = ({ row, index }) => {
  const appear = 92 + index * 12;
  const { opacity, y } = useEnter(appear);
  const isHeroSaldo = row.tributo === "CBS";
  const frame = useCurrentFrame();
  const saldoPulse = isHeroSaldo ? interpolate(frame, [174, 190], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  const cell = (content, align = "right", strong = false, color = THEME.body) => (
    <div style={{ flex: 1, textAlign: align, fontFamily: THEME.fontBody,
      fontWeight: strong ? 800 : 500, fontSize: 18, color,
      fontVariantNumeric: "tabular-nums" }}>{content}</div>
  );

  const v = row.vals.map((val, i) => useCountUp(val, appear + 4 + i * 2, 22));
  const saldoCounted = useCountUp(row.saldo, appear + 8, 24);

  return (
    <div style={{ display: "flex", alignItems: "center", padding: "18px 22px",
      borderTop: `1px solid ${THEME.line}`, opacity, transform: `translateY(${y}px)`,
      background: isHeroSaldo ? `rgba(23,163,74,${0.05 * saldoPulse})` : "transparent" }}>
      <div style={{ flex: 1, fontFamily: THEME.fontDisplay, fontWeight: 800, fontSize: 18, color: THEME.ink }}>
        {row.tributo}
      </div>
      {cell(brl(v[0]))}
      {cell(brl(v[1]))}
      {cell(brl(v[2]))}
      {cell(brl(v[3]))}
      <div style={{ flex: 1, textAlign: "right" }}>
        <div style={{ fontFamily: THEME.fontBody, fontWeight: 800, fontSize: 18, color: THEME.green,
          fontVariantNumeric: "tabular-nums" }}>{brl(saldoCounted)}</div>
        <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 10,
          letterSpacing: 0.7, color: THEME.green, marginTop: 2 }}>{row.saldoNote}</div>
      </div>
    </div>
  );
};

const Apuracao = () => {
  const head = useEnter(84);
  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ opacity: head.opacity, transform: `translateY(${head.y}px)` }}>
        <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 13,
          letterSpacing: 0.7, color: THEME.muted }}>{DATA.apEyebrow}</div>
        <div style={{ fontFamily: THEME.fontBody, fontSize: 16, color: THEME.body, marginTop: 6 }}>
          {DATA.apSub}
        </div>
      </div>
      <div style={{ marginTop: 18, border: `1px solid ${THEME.line}`, borderRadius: 14, overflow: "hidden",
        opacity: head.opacity }}>
        <div style={{ display: "flex", alignItems: "center", padding: "14px 22px", background: "#F7F8FB" }}>
          {DATA.apCols.map((c, i) => (
            <div key={c} style={{ flex: 1, textAlign: i === 0 ? "left" : "right",
              fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 11.5, letterSpacing: 0.6,
              color: THEME.muted }}>{c}</div>
          ))}
        </div>
        {DATA.apRows.map((r, i) => <ApRow key={r.tributo} row={r} index={i} />)}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------- HEADER */
const Header = () => {
  const eb = useEnter(18);
  const tt = useEnter(22, 22);
  const hp = useEnter(26);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30 }}>
      <div>
        <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 13, letterSpacing: 0.8,
          color: THEME.muted, opacity: eb.opacity, transform: `translateY(${eb.y}px)` }}>
          {DATA.eyebrow}
        </div>
        <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 800, fontSize: 46, color: THEME.ink,
          marginTop: 8, opacity: tt.opacity, transform: `translateY(${tt.y}px)` }}>
          {DATA.title}
        </div>
      </div>
      <div style={{ maxWidth: 440, textAlign: "right", fontFamily: THEME.fontBody, fontSize: 15,
        lineHeight: 1.5, color: THEME.muted, opacity: hp.opacity }}>
        {DATA.helper}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------- COMPOSIÇÃO */
export const KontivaResultado = () => {
  return (
    <AbsoluteFill style={{ background: THEME.pageBg }}>
      <Sidebar />
      <TopBar />
      <div style={{ position: "absolute", left: 84, top: 76, right: 0, bottom: 0, padding: "34px 40px" }}>
        <Tabs />
        <div style={{ marginTop: 26, background: THEME.surface, borderRadius: 20,
          border: `1px solid ${THEME.line}`, boxShadow: "0 24px 60px -30px rgba(3,10,139,0.18)",
          padding: "42px 46px" }}>
          <Header />
          <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 13, letterSpacing: 0.7,
            color: THEME.muted, marginBottom: 16 }}>{DATA.cardsEyebrow}</div>
          <div style={{ display: "flex", gap: 20 }}>
            {DATA.cards.map((c, i) => <ExecCard key={c.label} card={c} index={i} />)}
          </div>
          <Apuracao />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ============================================================================
 * REGISTRO — cole no seu src/Root.jsx:
 *
 * import { KontivaResultado } from "./KontivaResultado";
 *
 * <Composition
 *   id="KontivaResultado"
 *   component={KontivaResultado}
 *   durationInFrames={300}   // 10s de piloto; o bloco final sincroniza com a locução
 *   fps={30}
 *   width={1920}
 *   height={1080}
 * />
 * ========================================================================== */

export default KontivaResultado;
