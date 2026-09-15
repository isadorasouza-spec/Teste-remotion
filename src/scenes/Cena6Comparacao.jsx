/**
 * Cena 6 — Comparação 2027 x 2029 (aba Resumo do grupo). Bloco 3:40–4:30.
 * Remotion · 1920x1080 · 30fps · 500 frames piloto.
 *
 * A tela real é uma tabela com uma linha por ano, sem coluna de variação. Anima:
 * os 5 cards do topo contando, a tabela "Comparativo anual" revelando as duas
 * linhas, e um realce de DELTA desenhado pela MOLDURA (ciano, sobreposto) para
 * ICMS 105.200→94.680, resultado ~+10.520 e carga 3,56%→2,34%. O delta é overlay
 * de marketing (não é elemento nativo da tela) — por isso o ciano é permitido.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { THEME, brl, pct } from "../ui/tokens";
import { useCountUp, useEnter } from "../ui/motion";
import { AppShell, SegmentedTabs } from "../ui/AppShell";

const CIANO = "#00D4FF"; // pertence à moldura; usado só no overlay de delta

const DATA = {
  breadcrumb: ["SIMULAÇÕES", "VÉRTICE DISTRIBUIDORA ATACADISTA L…", "COMPARATIVO REFORMA"],
  tabs: ["RESUMO", "DETALHAMENTO POR LINHA"],
  cards: [
    { label: "CENÁRIOS NA SÉRIE", value: 2, kind: "int" },
    { label: "BASE TRIBUTÁVEL ACUMULADA", value: 5430000, kind: "brl" },
    { label: "DÉBITOS ACUMULADOS", value: 442594.8, kind: "brl", tone: "red" },
    { label: "CRÉDITOS ACUMULADOS", value: 345269.5, kind: "brl", tone: "green" },
    { label: "TRIBUTOS LÍQUIDOS ACUMULADOS", value: 97325.3, kind: "brl" },
  ],
  anualCols: ["ANO", "CENÁRIO", "BASE TRIBUTÁVEL", "DÉBITOS", "CRÉDITOS", "TRIBUTOS LÍQUIDOS", "IBS", "CBS", "ICMS", "ISS"],
  anual: [
    { ano: "2027", cenario: "Notas", vals: [2715000, 225812, 167205, 58607, -501, -46092, 105200, 0] },
    { ano: "2029", cenario: "Notas (2029)", vals: [2715000, 216782.8, 178064.5, 38718.3, -9368.7, -46593, 94680, 0] },
  ],
  fluxoCols: ["ANO", "CENÁRIO", "RECEITAS", "CUSTOS", "FLUXO DE CAIXA"],
  fluxo: [
    { ano: "2027", cenario: "Notas", receitas: 1645012, custos: 1265212, fluxo: 379800, aprox: false },
    { ano: "2029", cenario: "Notas (2029)", receitas: 1854062.8, custos: 1263742.8, fluxo: 390320, aprox: true },
  ],
};

const ANUAL_FLEX = [0.7, 1.4, 1.3, 1.2, 1.2, 1.3, 1.0, 1.1, 1.1, 0.8];
const FLUXO_FLEX = [0.7, 1.6, 1.5, 1.5, 1.5];

const signedBrl = (n) => (n < 0 ? `-${brl(Math.abs(n))}` : brl(n));

const colorFor = (colIndex, val) => {
  // DÉBITOS(3) red, CRÉDITOS(4) green, IBS/CBS(6,7) negativos → red, resto ink
  if (colIndex === 3) return THEME.red;
  if (colIndex === 4) return THEME.green;
  if ((colIndex === 6 || colIndex === 7) && val < 0) return THEME.red;
  return THEME.ink;
};

const TopCard = ({ card, index }) => {
  const appear = 30 + index * 8;
  const { opacity, y } = useEnter(appear);
  const counted = useCountUp(card.value, appear + 4, 24);
  const display =
    card.kind === "int" ? String(Math.round(counted)) : brl(counted);
  const valueColor = card.tone === "green" ? THEME.green : card.tone === "red" ? THEME.red : THEME.ink;
  return (
    <div
      style={{
        flex: 1,
        background: THEME.surface,
        borderRadius: 14,
        border: `1px solid ${THEME.line}`,
        padding: "18px 20px",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 11, letterSpacing: 0.6, color: THEME.muted, lineHeight: 1.3, minHeight: 28 }}>
        {card.label}
      </div>
      <div style={{ fontFamily: THEME.fontBody, fontWeight: 800, fontSize: 26, color: valueColor, marginTop: 10, fontVariantNumeric: "tabular-nums" }}>
        {display}
      </div>
    </div>
  );
};

const AnualRow = ({ row, index }) => {
  const appear = 90 + index * 22;
  const { opacity, y } = useEnter(appear);
  const vals = row.vals.map((v, i) => useCountUp(v, appear + 4 + i * 1.5, 22));
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "18px 22px", borderTop: `1px solid ${THEME.line}`, opacity, transform: `translateY(${y}px)` }}>
      <div style={{ flex: ANUAL_FLEX[0], fontFamily: THEME.fontDisplay, fontWeight: 800, fontSize: 17, color: THEME.ink }}>{row.ano}</div>
      <div style={{ flex: ANUAL_FLEX[1], fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 15, color: THEME.body }}>{row.cenario}</div>
      {vals.map((v, i) => (
        <div key={i} style={{ flex: ANUAL_FLEX[i + 2], textAlign: "right", fontFamily: THEME.fontBody, fontWeight: 700, fontSize: 15, color: colorFor(i + 2, row.vals[i]), fontVariantNumeric: "tabular-nums" }}>
          {signedBrl(v)}
        </div>
      ))}
    </div>
  );
};

const FluxoRow = ({ row, index }) => {
  const appear = 150 + index * 18;
  const { opacity, y } = useEnter(appear);
  const receitas = useCountUp(row.receitas, appear + 4, 22);
  const custos = useCountUp(row.custos, appear + 6, 22);
  const fluxo = useCountUp(row.fluxo, appear + 8, 22);
  // valores aproximados: sem contagem de destaque, de-enfatizados e estáticos
  const cell = (val, counted, color, muted) => (
    <div style={{ textAlign: "right", fontFamily: THEME.fontBody, fontWeight: 700, fontSize: 15, color: muted ? THEME.muted : color, fontVariantNumeric: "tabular-nums" }}>
      {muted ? `≈ ${brl(val)}` : brl(counted)}
    </div>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "16px 22px", borderTop: `1px solid ${THEME.line}`, opacity, transform: `translateY(${y}px)` }}>
      <div style={{ flex: FLUXO_FLEX[0], fontFamily: THEME.fontDisplay, fontWeight: 800, fontSize: 16, color: THEME.ink }}>{row.ano}</div>
      <div style={{ flex: FLUXO_FLEX[1], fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 15, color: THEME.body }}>{row.cenario}</div>
      <div style={{ flex: FLUXO_FLEX[2] }}>{cell(row.receitas, receitas, THEME.ink, row.aprox)}</div>
      <div style={{ flex: FLUXO_FLEX[3] }}>{cell(row.custos, custos, THEME.ink, row.aprox)}</div>
      <div style={{ flex: FLUXO_FLEX[4] }}>{cell(row.fluxo, fluxo, THEME.green, false)}</div>
    </div>
  );
};

const TableHead = ({ cols, flex }) => (
  <div style={{ display: "flex", padding: "12px 22px", background: "#F7F8FB" }}>
    {cols.map((c, i) => (
      <div key={c} style={{ flex: flex[i], textAlign: i <= 1 ? "left" : "right", fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 10.5, letterSpacing: 0.4, color: THEME.muted }}>{c}</div>
    ))}
  </div>
);

/* ---------------------------------------------- OVERLAY DE DELTA (moldura) */
const DeltaBadge = ({ appear, label, sub, xPct, yPx }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appear, fps, config: { damping: 200 } });
  const op = interpolate(s, [0, 1], [0, 1]);
  const ty = interpolate(s, [0, 1], [10, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: `${xPct}%`,
        top: yPx,
        transform: `translate(-50%, ${ty}px)`,
        opacity: op,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: "monospace",
          fontWeight: 700,
          fontSize: 16,
          color: "#06283D",
          background: CIANO,
          padding: "7px 13px",
          borderRadius: 10,
          boxShadow: "0 8px 24px -6px rgba(0,212,255,0.6)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
      {sub && (
        <div style={{ fontFamily: "monospace", fontSize: 11.5, color: CIANO, marginTop: 5, letterSpacing: 0.4 }}>{sub}</div>
      )}
    </div>
  );
};

export const Cena6Comparacao = () => {
  const frame = useCurrentFrame();
  const tt = useEnter(10, 20);

  // deltas entram depois que as linhas contaram (~f200)
  return (
    <AbsoluteFill style={{ background: THEME.pageBg }}>
      <AppShell breadcrumb={DATA.breadcrumb}>
        <div style={{ opacity: tt.opacity, transform: `translateY(${tt.y}px)` }}>
          <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 800, fontSize: 34, color: THEME.ink }}>
            Comparativo Reforma · 2027 vs 2029
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <SegmentedTabs tabs={DATA.tabs} activeIndex={0} appear={18} />
        </div>

        {/* 5 cards do topo */}
        <div style={{ display: "flex", gap: 14, marginTop: 20 }}>
          {DATA.cards.map((c, i) => (
            <TopCard key={c.label} card={c} index={i} />
          ))}
        </div>

        {/* Comparativo anual */}
        <div style={{ marginTop: 18, background: THEME.surface, borderRadius: 16, border: `1px solid ${THEME.line}`, boxShadow: "0 24px 60px -30px rgba(3,10,139,0.18)", overflow: "hidden", position: "relative" }}>
          <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 800, fontSize: 16, color: THEME.ink, padding: "16px 22px" }}>Comparativo anual</div>
          <TableHead cols={DATA.anualCols} flex={ANUAL_FLEX} />
          {DATA.anual.map((r, i) => (
            <AnualRow key={r.ano} row={r} index={i} />
          ))}

          {/* DELTA overlay (moldura/ciano) — ICMS caindo (posicionado sobre a coluna ICMS, entre as duas linhas) */}
          <DeltaBadge appear={210} label="ICMS  −R$ 10.520" sub="105.200 → 94.680" xPct={89} yPx={112} />
        </div>

        {/* Resumo do fluxo de caixa */}
        <div style={{ marginTop: 16, background: THEME.surface, borderRadius: 16, border: `1px solid ${THEME.line}`, overflow: "hidden", position: "relative" }}>
          <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 800, fontSize: 16, color: THEME.ink, padding: "16px 22px" }}>Resumo do fluxo de caixa</div>
          <TableHead cols={DATA.fluxoCols} flex={FLUXO_FLEX} />
          {DATA.fluxo.map((r, i) => (
            <FluxoRow key={r.ano} row={r} index={i} />
          ))}

          {/* DELTA overlay: resultado subindo + carga caindo (sobre a coluna Fluxo de caixa) */}
          <DeltaBadge appear={250} label="Resultado  +R$ 10.520" sub="carga 3,56% → 2,34%" xPct={88} yPx={104} />
        </div>
      </AppShell>
    </AbsoluteFill>
  );
};

export default Cena6Comparacao;
