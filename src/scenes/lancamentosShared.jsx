/**
 * Base das Cenas 3 e 4 — aba "Lançamentos e notas" do editor de simulação.
 * Recriada fiel a MvpSimulacaoEditorPage.tsx (blueaccount-ai): premissas do
 * cenário, abas do editor, seção Receitas com totais, tabela de 9 colunas
 * (Descrição · Valor informado · Valor bruto · IBS % · CBS % · IBS R$ · CBS R$ ·
 * Líquido) e o drawer de linha com as 6 abas reais.
 *
 * Cena 3: foco Receitas + drawer "Classificação fiscal" (linha exportação).
 * Cena 4: foco Custos/créditos + drawer "Tratamento fiscal" (linha Manteiga).
 * Dados do Anexo A; percentuais em pt-BR (vírgula).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { THEME, brl, pct } from "../ui/tokens";
import { useCountUp, useEnter } from "../ui/motion";
import { AppShell, SegmentedTabs, Ic, ICON } from "../ui/AppShell";
import { CameraStage, Cursor, ClickRipple, useClickCursor, kf } from "../ui/anim";

export const LANC = {
  breadcrumb: ["Simulações", "VÉRTICE DISTRIBUIDORA ATACADISTA LTDA.", "NOTAS"],
  eyebrow: "Simulação · reforma tributária IBS/CBS/ICMS/ISS",
  premissasLabel: "Premissas do cenário",
  premissas: ["2027", "MG", "IBS 0,10%", "CBS 9,20%"],
  tabs: ["Resultado", "Lançamentos e notas", "Fluxo de caixa"],
  cols: ["Descrição", "Valor informado", "Valor bruto", "IBS %", "CBS %", "IBS R$", "CBS R$", "Líquido"],
  receitas: [
    { desc: "Massa alimentícia recheada para exportação", inf: 400000, bruto: 400000, ibsP: 0, cbsP: 0, ibs: 0, cbs: 0, liq: 400000, tag: { t: "Exportação · sem débito", tone: "green" } },
    { desc: "Pão de forma", inf: 300000, bruto: 311160, ibsP: 0.04, cbsP: 3.68, ibs: 120, cbs: 11040, liq: 279000, tag: { t: "Cesta básica · 40%", tone: "cyan" } },
    { desc: "Manteiga - cesta básica", inf: 380000, bruto: 380000, ibsP: 0, cbsP: 0, ibs: 0, cbs: 0, liq: 311600, tag: { t: "Cesta básica · 40%", tone: "cyan" } },
    { desc: "Extrato de tomate", inf: 240000, bruto: 248928, ibsP: 0.04, cbsP: 3.68, ibs: 96, cbs: 8832, liq: 196800, tag: { t: "Cesta básica · 40%", tone: "cyan" } },
    { desc: "Salmão fresco refrigerado", inf: 150000, bruto: 163950, ibsP: 0.1, cbsP: 9.2, ibs: 150, cbs: 13800, liq: 123000, tag: { t: "Tributação integral", tone: "red" } },
    { desc: "Refrigerante", inf: 110000, bruto: 120230, ibsP: 0.1, cbsP: 9.2, ibs: 110, cbs: 10120, liq: 90200, tag: { t: "Tributação integral", tone: "red" } },
  ],
  receitasTot: [
    { l: "Total informado", v: 1580000 },
    { l: "Total bruto", v: 1624268 },
    { l: "Carga tributária", v: 223668 },
    { l: "DAS aplicado", v: 0 },
    { l: "Total líquido", v: 1400600, strong: true },
  ],
  custosTot: [
    { l: "Total informado", v: 775000 },
    { l: "Total bruto", v: 834985 },
    { l: "Créditos recuperados", v: 135585, tone: "green" },
    { l: "Total líquido", v: 699400, strong: true },
  ],
  drawerTabs: ["Resumo da linha", "Classificação fiscal", "Partes envolvidas", "Base de cálculo", "Tratamento fiscal", "Impostos da linha"],
  classificacao: {
    titulo: "Natureza do produto",
    campos: [
      { k: "NCM", v: "1902.20.00" },
      { k: "CST ICMS", v: "40 — Isenta" },
      { k: "CFOP", v: "7102" },
      { k: "Natureza do CFOP", v: "Exportação" },
      { k: "NBS", v: "—" },
    ],
  },
  tratamento: {
    blocoA: { titulo: "IBS e CBS", campos: [
      { k: "Fator de IBS", v: "40%" },
      { k: "Fator de CBS", v: "40%" },
      { k: "Fornecedor IBS/CBS", v: "Padrão" },
      { k: "Crédito IBS/CBS", v: "Integral", tone: "green" },
    ] },
    blocoB: { titulo: "ICMS e ISS", campos: [
      { k: "Tratamento ICMS", v: "Gera crédito", tone: "green" },
      { k: "Alíquota ICMS", v: "12,00%" },
      { k: "Alíquota ISS", v: "—" },
      { k: "Regra crédito ICMS", v: "Integral" },
    ] },
  },
};

const GRID = "2.6fr 1.1fr 1.1fr 0.7fr 0.7fr 0.9fr 0.9fr 1fr 44px";

const toneColor = (t) => (t === "green" ? THEME.green : t === "red" ? THEME.red : THEME.navy);
const toneBg = (t) => (t === "green" ? "rgba(22,163,74,0.10)" : t === "red" ? "rgba(220,38,38,0.10)" : THEME.cianoSoft);

const Tag = ({ tag, appear }) => {
  const { opacity } = useEnter(appear);
  return (
    <span style={{ display: "inline-block", marginTop: 5, fontFamily: THEME.fontBody, fontWeight: 700, fontSize: 10,
      letterSpacing: "0.02em", color: toneColor(tag.tone), background: toneBg(tag.tone), padding: "2px 8px", borderRadius: 6, opacity }}>
      {tag.t}
    </span>
  );
};

const calc = (v) => ({ fontFamily: THEME.fontMono, fontWeight: 500, fontSize: 12.5, color: THEME.muted,
  fontVariantNumeric: "tabular-nums", textAlign: "right" });

const Row = ({ row, index, appear, creditFocus, storyPulse }) => {
  const { opacity, y } = useEnter(appear);
  const inf = useCountUp(row.inf, appear + 4, 20);
  const bruto = useCountUp(row.bruto, appear + 6, 20);
  const ibs = useCountUp(row.ibs, appear + 8, 20);
  const cbs = useCountUp(row.cbs, appear + 8, 20);
  const liq = useCountUp(row.liq, appear + 10, 20);
  const creditBg = creditFocus ? `rgba(0,212,255,${0.10 * creditFocus})` : "transparent";

  return (
    <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 6, alignItems: "center", padding: "8px 16px",
      borderTop: index === 0 ? "none" : `1px solid ${THEME.hairline}`, opacity, transform: `translateY(${y}px)`,
      background: storyPulse ? `rgba(0,212,255,${0.10 * storyPulse})` : "transparent" }}>
      <div>
        <div style={{ fontFamily: THEME.fontBody, fontWeight: 500, fontSize: 14.5, color: THEME.navy }}>{row.desc}</div>
        {row.tag && <Tag tag={row.tag} appear={appear + 14} />}
      </div>
      <div style={calc()}>{brl(inf)}</div>
      <div style={calc()}>{brl(bruto)}</div>
      <div style={{ ...calc(), color: THEME.muted }}>{pct(row.ibsP)}</div>
      <div style={{ ...calc(), color: THEME.muted }}>{pct(row.cbsP)}</div>
      <div style={{ ...calc(), background: creditBg, borderRadius: 5 }}>{brl(ibs)}</div>
      <div style={{ ...calc(), background: creditBg, borderRadius: 5 }}>{brl(cbs)}</div>
      <div style={{ textAlign: "right" }}>
        <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-end", background: THEME.cianoSoft,
          padding: "5px 9px", borderRadius: 6 }}>
          <span style={{ fontFamily: THEME.fontMono, fontSize: 8, letterSpacing: "0.06em", textTransform: "uppercase", color: THEME.navy, opacity: 0.68 }}>Total da linha</span>
          <span style={{ fontFamily: THEME.fontMono, fontWeight: 700, fontSize: 12.5, color: THEME.navy, fontVariantNumeric: "tabular-nums" }}>{brl(liq)}</span>
        </span>
      </div>
      <div style={{ justifySelf: "center", color: "#CBD5E1", display: "flex" }}><Ic d={ICON.chevron} size={15} /></div>
    </div>
  );
};

const KV = ({ campo, appear, start }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, opacity: t, borderBottom: `1px solid ${THEME.hairline}`, paddingBottom: 8 }}>
      <span style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: THEME.muted }}>{campo.k}</span>
      <span style={{ fontFamily: THEME.fontBody, fontWeight: 700, fontSize: 14.5, color: campo.tone === "green" ? THEME.green : THEME.navy }}>{campo.v}</span>
    </div>
  );
};

const DrawerBlock = ({ titulo, campos, start, cols = 2 }) => (
  <div>
    <div style={{ fontFamily: THEME.fontBody, fontWeight: 700, fontSize: 12, letterSpacing: "0.04em", textTransform: "uppercase",
      color: THEME.muted, marginBottom: 12 }}>{titulo}</div>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "14px 32px" }}>
      {campos.map((c, i) => <KV key={c.k} campo={c} start={start + i * 3} />)}
    </div>
  </div>
);

const Drawer = ({ start, activeTab, content }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const H = content.kind === "tratamento" ? 210 : 200;
  return (
    <div style={{ height: H * t, overflow: "hidden", opacity: t, borderTop: `1px solid ${THEME.hairline}`, background: "#FBFCFE" }}>
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {LANC.drawerTabs.map((tb, i) => {
            const active = i === activeTab;
            return (
              <div key={tb} style={{ fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 11.5, padding: "7px 12px", borderRadius: 8,
                background: active ? THEME.cianoSoft : "transparent", color: active ? THEME.navy : THEME.muted,
                border: `1px solid ${active ? "rgba(0,212,255,0.4)" : "transparent"}` }}>{tb}</div>
            );
          })}
        </div>
        {content.kind === "classificacao" && (
          <DrawerBlock titulo={LANC.classificacao.titulo} campos={LANC.classificacao.campos} start={start + 8} cols={3} />
        )}
        {content.kind === "tratamento" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
            <DrawerBlock titulo={LANC.tratamento.blocoA.titulo} campos={LANC.tratamento.blocoA.campos} start={start + 8} cols={2} />
            <DrawerBlock titulo={LANC.tratamento.blocoB.titulo} campos={LANC.tratamento.blocoB.campos} start={start + 12} cols={2} />
          </div>
        )}
      </div>
    </div>
  );
};

const TotalBadge = ({ item, appear }) => {
  const { opacity, y } = useEnter(appear);
  const v = useCountUp(item.v, appear + 4, 22);
  return (
    <div style={{ minWidth: 128, opacity, transform: `translateY(${y}px)` }}>
      <div style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 9.5, letterSpacing: "0.05em", textTransform: "uppercase", color: THEME.muted }}>{item.l}</div>
      <div style={{ fontFamily: THEME.fontMono, fontWeight: 700, fontSize: 15, marginTop: 3,
        color: item.tone === "green" ? THEME.green : THEME.navy, fontVariantNumeric: "tabular-nums" }}>{brl(v)}</div>
    </div>
  );
};

const SectionHeader = ({ label, count, totals, appear, totAppear }) => {
  const { opacity, y } = useEnter(appear);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px",
      opacity, transform: `translateY(${y}px)`, gap: 24, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: THEME.fontBody, fontWeight: 700, fontSize: 15, color: THEME.navy }}>{label}</span>
        {count != null && <span style={{ fontFamily: THEME.fontBody, fontSize: 12, color: THEME.muted }}>({count})</span>}
      </div>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {totals.map((tt, i) => <TotalBadge key={tt.l} item={tt} appear={totAppear + i * 5} />)}
      </div>
    </div>
  );
};

/* Câmera de rolagem (Cena 3): desce pela lista revelando linha a linha com zoom.
 * cx ~1000 e zoom moderado (1.35) mantêm a coluna Descrição visível à esquerda. */
const SCROLL_T = [0, 36, 70, 100, 128, 156, 184, 214, 250, 292, 520];
const SCROLL_X = [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 960, 960];
const SCROLL_Y = [300, 320, 352, 407, 462, 517, 572, 628, 700, 540, 540];
const SCROLL_S = [1.22, 1.35, 1.35, 1.35, 1.35, 1.35, 1.35, 1.3, 1.2, 1.0, 1.0];

export const LancamentosScreen = ({ mode = "scroll", focus = "receitas", drawerRow, drawerContent, drawerStart = 320, creditStart = 999 }) => {
  const frame = useCurrentFrame();
  const eb = useEnter(4);
  const prem = useEnter(8);
  const creditPulse = interpolate(frame, [creditStart, creditStart + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // câmera
  const scroll = mode === "scroll";
  const cx = scroll ? kf(frame, SCROLL_T, SCROLL_X) : 960;
  const cy = scroll ? kf(frame, SCROLL_T, SCROLL_Y) : 540;
  const s = scroll ? kf(frame, SCROLL_T, SCROLL_S) : 1;

  // timings de revelação das linhas por modo
  const rowStart = scroll ? 34 : 24;
  const rowStep = scroll ? 26 : 8;
  const totAppearReceitas = scroll ? 200 : 60;

  // cursor (Cena 4): clica nas colunas de crédito da linha Manteiga → abre o drawer
  const cur = useClickCursor(frame, {
    from: { x: 1300, y: 300 }, to: { x: 1560, y: 405 }, t0: 96, t1: 128, tClick: 134, appearAt: 92,
  });

  return (
    <AbsoluteFill style={{ background: THEME.pageBg, overflow: "hidden" }}>
      <CameraStage cx={cx} cy={cy} s={s}>
      <AppShell breadcrumb={LANC.breadcrumb} contentPadding="26px 34px">
        {/* eyebrow + premissas */}
        <div style={{ opacity: eb.opacity, transform: `translateY(${eb.y}px)` }}>
          <div style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: THEME.muted }}>{LANC.eyebrow}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12,
          opacity: prem.opacity, transform: `translateY(${prem.y}px)` }}>
          <SegmentedTabs tabs={LANC.tabs} activeIndex={1} appear={14} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: THEME.surface, border: `1px solid ${THEME.cardBorder}`,
            padding: "9px 16px", borderRadius: 10 }}>
            <span style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: THEME.muted }}>{LANC.premissasLabel}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {LANC.premissas.map((p, i) => (
                <React.Fragment key={p}>
                  {i > 0 && <span style={{ color: THEME.muted, opacity: 0.5 }}>·</span>}
                  <span style={{ fontFamily: THEME.fontBody, fontWeight: 700, fontSize: 13, color: THEME.navy }}>{p}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* card tabela */}
        <div style={{ marginTop: 18, background: THEME.surface, border: `1px solid ${THEME.cardBorder}`, borderRadius: 16,
          boxShadow: THEME.cardShadow, overflow: "hidden" }}>
          <SectionHeader label="Receitas" count={6} totals={LANC.receitasTot} appear={16} totAppear={totAppearReceitas} />
          {/* thead */}
          <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 6, padding: "8px 16px", background: "#F8FAFC", borderTop: `1px solid ${THEME.hairline}` }}>
            {LANC.cols.map((c, i) => {
              const isCredit = i === 5 || i === 6;
              return (
                <div key={c} style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 10, letterSpacing: "0.06em",
                  textTransform: "uppercase", color: isCredit && creditPulse ? THEME.navy : THEME.muted, textAlign: i === 0 ? "left" : "right",
                  background: isCredit ? `rgba(0,212,255,${0.14 * creditPulse})` : "transparent", borderRadius: 5, padding: "1px 2px" }}>{c}</div>
              );
            })}
            <div />
          </div>
          {LANC.receitas.map((row, i) => {
            const appear = rowStart + i * rowStep;
            const hi = !scroll && i === 2 ? interpolate(frame, [132, 142, 260], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
            return (
              <React.Fragment key={row.desc}>
                <Row row={row} index={i} appear={appear} creditFocus={focus === "custos" ? creditPulse : 0} storyPulse={hi} />
                {drawerRow === i && <Drawer start={drawerStart} activeTab={drawerContent.kind === "classificacao" ? 1 : 4} content={drawerContent} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Custos Diretos — resumo (linhas individuais aproximadas: sem close) */}
        <div style={{ marginTop: 14, background: THEME.surface, border: `1px solid ${focus === "custos" && creditPulse ? "rgba(0,212,255,0.5)" : THEME.cardBorder}`,
          borderRadius: 16, boxShadow: focus === "custos" ? `0 0 0 ${2 * creditPulse}px rgba(0,212,255,${0.16 * creditPulse})` : "none", overflow: "hidden" }}>
          <SectionHeader label="Custos Diretos" count="8" totals={LANC.custosTot} appear={scroll ? 250 : 56} totAppear={scroll ? 262 : 66} />
        </div>
      </AppShell>
      </CameraStage>
      {mode === "cursor" && (
        <>
          <ClickRipple x={1560} y={405} p={cur.ripple} />
          {cur.opacity > 0 && <Cursor x={cur.x} y={cur.y} press={cur.press} opacity={cur.opacity} />}
        </>
      )}
    </AbsoluteFill>
  );
};
