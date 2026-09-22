/**
 * Cena 6 — Comparação 2027 x 2029 (série do grupo, aba "Resumo").
 * Recriada fiel a MvpSimulacaoSeriePage.tsx: eyebrow "Visão consolidada da
 * série", 5 KPIs acumulados, tabela "Comparativo anual" (cabeçalho em 2 níveis
 * Apuração + Tributos líquidos, uma linha por ano) e "Resumo do fluxo de caixa".
 * A tela real não tem coluna de variação; os deltas são overlay de MOLDURA
 * (ciano), como manda o PRD. Bloco 3:40–4:30, 500 frames.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { THEME, brl } from "../ui/tokens";
import { useCountUp, useEnter } from "../ui/motion";
import { AppShell, SegmentedTabs, Ic, ICON } from "../ui/AppShell";

const CIANO = "#00D4FF";

const DATA = {
  breadcrumb: ["Simulações", "VÉRTICE DISTRIBUIDORA ATACADISTA LTDA.", "COMPARATIVO REFORMA"],
  eyebrow: "Visão consolidada da série",
  title: "Comparativo Reforma",
  desc: "Resultados e fluxo de caixa dos cenários de Vértice, comparados ano a ano.",
  tabs: ["Resumo", "Detalhamento por linha"],
  kpis: [
    { label: "Cenários na série", value: 2, kind: "int" },
    { label: "Base tributável acumulada", value: 5430000, kind: "brl" },
    { label: "Débitos acumulados", value: 442594.8, kind: "brl" },
    { label: "Créditos acumulados", value: 345269.5, kind: "brl" },
    { label: "Tributos líquidos acumulados", value: 97325.3, kind: "brl" },
  ],
  note: "Os totais da série somam valores nominais de anos diferentes, sem correção monetária ou desconto a valor presente.",
  annualTitle: "Comparativo anual",
  cols: [
    { k: "ano", label: "Ano", w: 62, grp: null },
    { k: "cenario", label: "Cenário", w: 122, grp: null },
    { k: "base", label: "Base tributável", w: 166, grp: "ap" },
    { k: "deb", label: "Débitos", w: 150, grp: "ap" },
    { k: "cred", label: "Créditos", w: 150, grp: "ap" },
    { k: "tribliq", label: "Tributos líquidos", w: 158, grp: "ap" },
    { k: "ibs", label: "IBS", w: 126, grp: "tl" },
    { k: "cbs", label: "CBS", w: 138, grp: "tl" },
    { k: "icms", label: "ICMS", w: 138, grp: "tl" },
    { k: "iss", label: "ISS", w: 100, grp: "tl" },
    { k: "difal", label: "DIFAL", w: 118, grp: "tl" },
  ],
  annual: [
    { ano: "2027", cenario: "Notas", base: 2715000, deb: 225812, cred: 167205, tribliq: 58607, ibs: -501, cbs: -46092, icms: 105200, iss: 0, difal: null },
    { ano: "2029", cenario: "Notas (2029)", base: 2715000, deb: 216782.8, cred: 178064.5, tribliq: 38718.3, ibs: -9368.7, cbs: -46593, icms: 94680, iss: 0, difal: null },
  ],
  cashTitle: "Resumo do fluxo de caixa",
  cashCols: ["Ano", "Cenário", "Receitas", "Custos", "Fluxo de caixa"],
  cash: [
    { ano: "2027", cenario: "Notas", receitas: 1645012, custos: 1265212, fluxo: 379800, aprox: false },
    { ano: "2029", cenario: "Notas (2029)", receitas: 1854062.8, custos: 1263742.8, fluxo: 390320, aprox: true },
  ],
};

const CASH_FLEX = [0.7, 1.6, 1.5, 1.5, 1.5];
const signedBrl = (n) => (n < 0 ? `-${brl(Math.abs(n))}` : brl(n));

const Kpi = ({ kpi, index }) => {
  const appear = 30 + index * 8;
  const { opacity, y } = useEnter(appear);
  const counted = useCountUp(kpi.value, appear + 4, 24);
  const display = kpi.kind === "int" ? String(Math.round(counted)) : brl(counted);
  return (
    <div style={{ flex: 1, background: THEME.pageBg, borderRadius: 10, border: "1px solid rgba(10,31,63,0.09)",
      padding: "16px 18px", opacity, transform: `translateY(${y}px)` }}>
      <div style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase",
        color: THEME.muted, lineHeight: 1.3, minHeight: 26 }}>{kpi.label}</div>
      <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 24, letterSpacing: "-0.025em", color: THEME.navy,
        marginTop: 10, fontVariantNumeric: "tabular-nums" }}>{display}</div>
    </div>
  );
};

const TOTAL_W = DATA.cols.reduce((s, c) => s + c.w, 0);

const AnnualRow = ({ row, index }) => {
  const appear = 96 + index * 22;
  const { opacity, y } = useEnter(appear);
  const keys = ["base", "deb", "cred", "tribliq", "ibs", "cbs", "icms", "iss"];
  const counted = {};
  keys.forEach((k, i) => { counted[k] = useCountUp(row[k], appear + 4 + i * 1.5, 22); });
  return (
    <div style={{ display: "flex", alignItems: "center", borderTop: `1px solid ${THEME.hairline}`, opacity, transform: `translateY(${y}px)` }}>
      {DATA.cols.map((c) => {
        const raw = row[c.k];
        let content;
        if (c.k === "ano") content = row.ano;
        else if (c.k === "cenario") content = row.cenario;
        else if (raw == null) content = "—";
        else content = signedBrl(counted[c.k] ?? raw);
        const isText = c.k === "ano" || c.k === "cenario";
        return (
          <div key={c.k} style={{ width: c.w, flexShrink: 0, padding: "16px 10px", textAlign: isText ? "left" : "right",
            fontFamily: isText ? (c.k === "ano" ? THEME.fontDisplay : THEME.fontBody) : THEME.fontMono,
            fontWeight: c.k === "ano" ? 700 : isText ? 500 : 600, fontSize: c.k === "ano" ? 15 : 12,
            color: isText ? THEME.navy : THEME.body, fontVariantNumeric: "tabular-nums" }}>{content}</div>
        );
      })}
    </div>
  );
};

const CashRow = ({ row, index }) => {
  const appear = 150 + index * 18;
  const { opacity, y } = useEnter(appear);
  const receitas = useCountUp(row.receitas, appear + 4, 22);
  const custos = useCountUp(row.custos, appear + 6, 22);
  const fluxo = useCountUp(row.fluxo, appear + 8, 22);
  const cell = (val, counted, muted, color) => (
    <div style={{ textAlign: "right", fontFamily: THEME.fontMono, fontWeight: 700, fontSize: 13.5,
      color: muted ? THEME.muted : color, fontVariantNumeric: "tabular-nums" }}>{muted ? `≈ ${brl(val)}` : brl(counted)}</div>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "16px 18px", borderTop: `1px solid ${THEME.hairline}`, opacity, transform: `translateY(${y}px)` }}>
      <div style={{ flex: CASH_FLEX[0], fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 15, color: THEME.navy }}>{row.ano}</div>
      <div style={{ flex: CASH_FLEX[1], fontFamily: THEME.fontBody, fontWeight: 500, fontSize: 14, color: THEME.body }}>{row.cenario}</div>
      <div style={{ flex: CASH_FLEX[2] }}>{cell(row.receitas, receitas, row.aprox, THEME.navy)}</div>
      <div style={{ flex: CASH_FLEX[3] }}>{cell(row.custos, custos, row.aprox, THEME.navy)}</div>
      <div style={{ flex: CASH_FLEX[4] }}>{cell(row.fluxo, fluxo, false, "#166534")}</div>
    </div>
  );
};

const DeltaBadge = ({ appear, label, sub, xPct, yPx }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appear, fps, config: { damping: 200 } });
  const op = interpolate(s, [0, 1], [0, 1]);
  const ty = interpolate(s, [0, 1], [10, 0]);
  return (
    <div style={{ position: "absolute", left: `${xPct}%`, top: yPx, transform: `translate(-50%, ${ty}px)`, opacity: op,
      display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none", zIndex: 5 }}>
      <div style={{ fontFamily: THEME.fontMono, fontWeight: 700, fontSize: 15, color: "#06283D", background: CIANO,
        padding: "7px 13px", borderRadius: 10, boxShadow: "0 10px 26px -6px rgba(0,212,255,0.7)", whiteSpace: "nowrap" }}>{label}</div>
      {sub && <div style={{ fontFamily: THEME.fontMono, fontSize: 11.5, color: THEME.navy, background: THEME.cianoSoft,
        padding: "3px 8px", borderRadius: 6, marginTop: 5, whiteSpace: "nowrap" }}>{sub}</div>}
    </div>
  );
};

export const Cena6Comparacao = () => {
  const tt = useEnter(10, 18);
  return (
    <AbsoluteFill style={{ background: THEME.pageBg }}>
      <AppShell breadcrumb={DATA.breadcrumb} contentPadding="26px 34px">
        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", opacity: tt.opacity, transform: `translateY(${tt.y}px)` }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: THEME.ciano }} />
              <span style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: THEME.muted }}>{DATA.eyebrow}</span>
            </div>
            <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 34, letterSpacing: "-0.03em", color: THEME.navy, marginTop: 10 }}>{DATA.title}</div>
            <div style={{ fontFamily: THEME.fontBody, fontSize: 15, color: THEME.muted, marginTop: 8, maxWidth: 620 }}>{DATA.desc}</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 16px", borderRadius: 10, background: THEME.ciano,
              color: THEME.navy, fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 13 }}>Exportar PDF</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 16px", borderRadius: 10, border: `1px solid ${THEME.border}`,
              color: THEME.navy, fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 13 }}>Voltar às simulações</div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}><SegmentedTabs tabs={DATA.tabs} activeIndex={0} appear={16} upper={false} /></div>

        {/* 5 KPIs */}
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          {DATA.kpis.map((k, i) => <Kpi key={k.label} kpi={k} index={i} />)}
        </div>

        {/* Comparativo anual */}
        <div style={{ marginTop: 16, background: THEME.surface, borderRadius: 16, border: `1px solid ${THEME.cardBorder}`,
          boxShadow: THEME.cardShadow, overflow: "hidden", position: "relative" }}>
          <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 16, color: THEME.navy, padding: "16px 18px" }}>{DATA.annualTitle}</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ width: TOTAL_W }}>
              {/* header nível 1 */}
              <div style={{ display: "flex", background: THEME.pageBg, borderTop: `1px solid ${THEME.hairline}` }}>
                <div style={{ width: DATA.cols[0].w + DATA.cols[1].w, flexShrink: 0 }} />
                <div style={{ width: DATA.cols.slice(2, 6).reduce((s, c) => s + c.w, 0), flexShrink: 0, textAlign: "center",
                  fontFamily: THEME.fontMono, fontWeight: 700, fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase",
                  color: THEME.muted, padding: "8px 0", borderLeft: `1px solid ${THEME.hairline}` }}>Apuração</div>
                <div style={{ flex: 1, textAlign: "center", fontFamily: THEME.fontMono, fontWeight: 700, fontSize: 9.5,
                  letterSpacing: "0.08em", textTransform: "uppercase", color: THEME.muted, padding: "8px 0", borderLeft: `1px solid ${THEME.hairline}` }}>Tributos líquidos</div>
              </div>
              {/* header nível 2 */}
              <div style={{ display: "flex", background: THEME.pageBg, borderTop: `1px solid ${THEME.hairline}` }}>
                {DATA.cols.map((c) => (
                  <div key={c.k} style={{ width: c.w, flexShrink: 0, padding: "10px", textAlign: c.k === "ano" || c.k === "cenario" ? "left" : "right",
                    fontFamily: THEME.fontMono, fontWeight: 700, fontSize: 9.5, letterSpacing: "0.05em", textTransform: "uppercase", color: THEME.muted }}>{c.label}</div>
                ))}
              </div>
              {DATA.annual.map((r, i) => <AnnualRow key={r.ano} row={r} index={i} />)}
            </div>
          </div>
          {/* DELTA overlay (moldura/ciano) sobre a coluna ICMS */}
          <DeltaBadge appear={210} label="ICMS  −R$ 10.520" sub="105.200 → 94.680" xPct={78} yPx={150} />
        </div>

        {/* Resumo do fluxo de caixa */}
        <div style={{ marginTop: 14, background: THEME.surface, borderRadius: 16, border: `1px solid ${THEME.cardBorder}`, overflow: "hidden", position: "relative" }}>
          <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 16, color: THEME.navy, padding: "16px 18px" }}>{DATA.cashTitle}</div>
          <div style={{ display: "flex", padding: "10px 18px", background: THEME.pageBg, borderTop: `1px solid ${THEME.hairline}` }}>
            {DATA.cashCols.map((c, i) => (
              <div key={c} style={{ flex: CASH_FLEX[i], textAlign: i <= 1 ? "left" : "right", fontFamily: THEME.fontMono,
                fontWeight: 700, fontSize: 9.5, letterSpacing: "0.05em", textTransform: "uppercase", color: THEME.muted }}>{c}</div>
            ))}
          </div>
          {DATA.cash.map((r, i) => <CashRow key={r.ano} row={r} index={i} />)}
          <DeltaBadge appear={250} label="Resultado  +R$ 10.520" sub="carga 3,56% → 2,34%" xPct={84} yPx={104} />
        </div>
      </AppShell>
    </AbsoluteFill>
  );
};

export default Cena6Comparacao;
