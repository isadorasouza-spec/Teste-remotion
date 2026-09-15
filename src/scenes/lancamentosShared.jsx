/**
 * Base compartilhada das Cenas 3 e 4 — tela "Lançamentos e notas" (2027).
 *
 * A mesma tela serve às duas cenas; muda só o foco e o drawer:
 *   - Cena 3: foco em Receitas + drawer "Classificação fiscal" (linha exportação).
 *   - Cena 4: foco nas colunas de crédito / Custos + drawer "Tratamento fiscal"
 *             e "Impostos da linha" (linha Manteiga).
 *
 * Só os valores confirmados por print (Receitas e os totais) recebem contagem
 * em destaque. As 8 linhas de Custos Diretos são aproximadas (Anexo A) — a seção
 * aparece resumida, sem close nos dígitos.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { THEME, brl, pct } from "../ui/tokens";
import { useCountUp, useEnter } from "../ui/motion";
import { AppShell, SegmentedTabs } from "../ui/AppShell";

export const LANC = {
  breadcrumb: ["SIMULAÇÕES", "VÉRTICE DISTRIBUIDORA ATACADISTA L…", "NOTAS"],
  premissas: "2027 · MG · IBS 0,10% · CBS 9,20%",
  tabs: ["RESULTADO", "LANÇAMENTOS E NOTAS", "FLUXO DE CAIXA"],
  cols: ["DESCRIÇÃO", "VALOR INFORMADO", "VALOR BRUTO", "IBS %", "CBS %", "IBS R$", "CBS R$", "LÍQUIDO"],
  receitas: [
    { desc: "Massa alimentícia recheada para exportação", informado: 400000, bruto: 400000, ibsPct: 0, cbsPct: 0, ibsRs: 0, cbsRs: 0, liquido: 400000, tag: { label: "EXPORTAÇÃO · SEM DÉBITO", tone: "green" } },
    { desc: "Pão de forma", informado: 300000, bruto: 311160, ibsPct: 0.04, cbsPct: 3.68, ibsRs: 120, cbsRs: 11040, liquido: 279000, tag: { label: "CESTA BÁSICA · 40%", tone: "blue" } },
    { desc: "Manteiga - cesta básica", informado: 380000, bruto: 380000, ibsPct: 0, cbsPct: 0, ibsRs: 0, cbsRs: 0, liquido: 311600, tag: { label: "CESTA BÁSICA · 40%", tone: "blue" } },
    { desc: "Extrato de tomate", informado: 240000, bruto: 248928, ibsPct: 0.04, cbsPct: 3.68, ibsRs: 96, cbsRs: 8832, liquido: 196800, tag: { label: "CESTA BÁSICA · 40%", tone: "blue" } },
    { desc: "Salmão fresco refrigerado", informado: 150000, bruto: 163950, ibsPct: 0.1, cbsPct: 9.2, ibsRs: 150, cbsRs: 13800, liquido: 123000, tag: { label: "TRIBUTAÇÃO INTEGRAL", tone: "red" } },
    { desc: "Refrigerante", informado: 110000, bruto: 120230, ibsPct: 0.1, cbsPct: 9.2, ibsRs: 110, cbsRs: 10120, liquido: 90200, tag: { label: "TRIBUTAÇÃO INTEGRAL", tone: "red" } },
  ],
  receitasTotais: { informado: 1580000, bruto: 1624268, carga: 223668, das: 0, liquido: 1400600 },
  custosTotais: { informado: 775000, bruto: 834985, carga: 0, creditos: 135585, liquido: 699400 },
  // Conteúdo dos drawers (valores confirmados no Anexo A)
  drawerTabs: ["Resumo da linha", "Classificação fiscal", "Partes envolvidas", "Base de cálculo", "Tratamento fiscal", "Impostos da linha"],
  classificacao: [
    { k: "NCM", v: "1902.20.00" },
    { k: "CST ICMS", v: "40 · Isenta" },
    { k: "CFOP", v: "7102" },
    { k: "NBS", v: "—" },
  ],
  tratamento: [
    { k: "IBS", v: "Cheia 0,10% · efetiva 0,04%" },
    { k: "CBS", v: "Cheia 9,20% · efetiva 3,68%" },
    { k: "Fator IBS/CBS", v: "40% / 40%" },
    { k: "Crédito IBS/CBS", v: "Integral", tone: "green" },
    { k: "ICMS", v: "Gera crédito · alíquota 12,00%" },
    { k: "Crédito ICMS", v: "Integral", tone: "green" },
  ],
  impostos: [
    { k: "IBS", v: "R$ 36,00", c: "crédito R$ 36,00" },
    { k: "CBS", v: "R$ 3.312,00", c: "crédito R$ 3.312,00" },
    { k: "ICMS", v: "R$ 10.800,00", c: "crédito R$ 10.800,00" },
    { k: "ISS / DIFAL", v: "R$ 0,00", c: "—" },
  ],
};

const COL_FLEX = [2.6, 1.2, 1.2, 0.7, 0.7, 1.0, 1.0, 1.2];

const toneColor = (tone) =>
  tone === "green" ? THEME.green : tone === "red" ? THEME.red : THEME.blue;
const toneSoft = (tone) =>
  tone === "green" ? "rgba(23,163,74,0.10)" : tone === "red" ? "rgba(224,70,58,0.10)" : "#EDEFFB";

const TagChip = ({ tag, appear }) => {
  const { opacity } = useEnter(appear);
  return (
    <span
      style={{
        display: "inline-block",
        marginTop: 5,
        fontFamily: THEME.fontDisplay,
        fontWeight: 800,
        fontSize: 10.5,
        letterSpacing: 0.5,
        color: toneColor(tag.tone),
        background: toneSoft(tag.tone),
        padding: "3px 8px",
        borderRadius: 6,
        opacity,
      }}
    >
      {tag.label}
    </span>
  );
};

const num = (color, strong = true, size = 15) => ({
  fontFamily: THEME.fontBody,
  fontWeight: strong ? 800 : 600,
  fontSize: size,
  color,
  fontVariantNumeric: "tabular-nums",
});

/* Uma linha de lançamento com contagem dos valores confirmados. */
const LancRow = ({ row, index, appear, highlightCredit, calloutPulse }) => {
  const { opacity, y } = useEnter(appear);
  const informado = useCountUp(row.informado, appear + 4, 20);
  const bruto = useCountUp(row.bruto, appear + 6, 20);
  const ibsRs = useCountUp(row.ibsRs, appear + 8, 20);
  const cbsRs = useCountUp(row.cbsRs, appear + 8, 20);
  const liquido = useCountUp(row.liquido, appear + 10, 20);

  const creditBg = highlightCredit ? `rgba(23,163,74,${0.10 * highlightCredit})` : "transparent";
  const rowGlow = calloutPulse
    ? `inset 3px 0 0 ${toneColor(row.tag?.tone)}`
    : "none";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "11px 22px",
        borderTop: index === 0 ? "none" : `1px solid ${THEME.line}`,
        opacity,
        transform: `translateY(${y}px)`,
        background: calloutPulse ? `${toneSoft(row.tag?.tone)}` : "transparent",
        boxShadow: rowGlow,
      }}
    >
      <div style={{ flex: COL_FLEX[0] }}>
        <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 600, fontSize: 15.5, color: THEME.ink }}>
          {row.desc}
        </div>
        {row.tag && <TagChip tag={row.tag} appear={appear + 16} />}
      </div>
      <div style={{ flex: COL_FLEX[1], textAlign: "right", ...num(THEME.body, false) }}>{brl(informado)}</div>
      <div style={{ flex: COL_FLEX[2], textAlign: "right", ...num(THEME.ink) }}>{brl(bruto)}</div>
      <div style={{ flex: COL_FLEX[3], textAlign: "right", ...num(THEME.muted, false) }}>{pct(row.ibsPct)}</div>
      <div style={{ flex: COL_FLEX[4], textAlign: "right", ...num(THEME.muted, false) }}>{pct(row.cbsPct)}</div>
      <div style={{ flex: COL_FLEX[5], textAlign: "right", borderRadius: 6, background: creditBg, ...num(THEME.green) }}>{brl(ibsRs)}</div>
      <div style={{ flex: COL_FLEX[6], textAlign: "right", borderRadius: 6, background: creditBg, ...num(THEME.green) }}>{brl(cbsRs)}</div>
      <div style={{ flex: COL_FLEX[7], textAlign: "right", ...num(THEME.ink) }}>{brl(liquido)}</div>
    </div>
  );
};

/* Drawer inline (acordeão) sob uma linha. */
const Drawer = ({ open, start, activeTab, content }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (!open) return null;
  const H = 210;
  return (
    <div style={{ height: H * t, overflow: "hidden", opacity: t }}>
      <div style={{ background: "#F7F8FB", borderTop: `1px solid ${THEME.line}`, padding: "18px 24px" }}>
        {/* Abas do drawer */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {LANC.drawerTabs.map((tb, i) => {
            const active = i === activeTab;
            return (
              <div
                key={tb}
                style={{
                  fontFamily: THEME.fontDisplay,
                  fontWeight: 700,
                  fontSize: 12,
                  padding: "7px 13px",
                  borderRadius: 8,
                  background: active ? THEME.surface : "transparent",
                  color: active ? THEME.blue : THEME.muted,
                  border: `1px solid ${active ? THEME.line : "transparent"}`,
                  boxShadow: active ? "0 2px 8px rgba(3,10,139,0.08)" : "none",
                }}
              >
                {tb}
              </div>
            );
          })}
        </div>
        {/* Conteúdo em grade chave/valor */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 40px" }}>
          {content.map((item, i) => {
            const rowT = interpolate(frame, [start + 8 + i * 3, start + 20 + i * 3], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div key={item.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: rowT, borderBottom: `1px solid ${THEME.line}`, paddingBottom: 8 }}>
                <span style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 13, color: THEME.muted, letterSpacing: 0.3 }}>{item.k}</span>
                <span style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                  <span style={{ fontFamily: THEME.fontBody, fontWeight: 800, fontSize: 15, color: item.tone === "green" ? THEME.green : THEME.ink, fontVariantNumeric: "tabular-nums" }}>{item.v}</span>
                  {item.c && <span style={{ fontFamily: THEME.fontBody, fontSize: 12.5, color: THEME.green }}>{item.c}</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TotChip = ({ label, value, tone, appear }) => {
  const { opacity, y } = useEnter(appear);
  const counted = useCountUp(value, appear + 4, 22);
  return (
    <div style={{ opacity, transform: `translateY(${y}px)` }}>
      <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 10.5, letterSpacing: 0.6, color: THEME.muted }}>{label}</div>
      <div style={{ ...num(tone === "green" ? THEME.green : THEME.ink, true, 18), marginTop: 3 }}>{brl(counted)}</div>
    </div>
  );
};

const SectionHeader = ({ label, count, appear, accent }) => {
  const { opacity, y } = useEnter(appear);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 22px", opacity, transform: `translateY(${y}px)` }}>
      <div style={{ width: 8, height: 8, borderRadius: 3, background: accent || THEME.blue }} />
      <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 800, fontSize: 17, color: THEME.ink }}>{label}</div>
      {count != null && (
        <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 12, color: THEME.muted, background: "#F1F3F8", padding: "3px 9px", borderRadius: 6 }}>{count}</div>
      )}
    </div>
  );
};

/**
 * Tela completa. Props:
 *  - focus: "receitas" | "custos"
 *  - drawerRow: índice da linha de Receitas onde o drawer abre (ou null)
 *  - drawerTabIndex, drawerContent
 *  - drawerStart, calloutStart, creditStart: frames de eventos
 */
export const LancamentosScreen = ({
  activeTab = 1,
  focus = "receitas",
  drawerRow = null,
  drawerTabIndex = 1,
  drawerContent = [],
  drawerStart = 320,
  calloutStart = 190,
  creditStart = 999,
}) => {
  const frame = useCurrentFrame();
  const premissas = useEnter(8);
  const secHead = useEnter(24);

  const calloutPulse = interpolate(frame, [calloutStart, calloutStart + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const creditPulse = interpolate(frame, [creditStart, creditStart + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rowsStart = 44;
  const rowStep = 14;

  return (
    <AbsoluteFill style={{ background: THEME.pageBg }}>
      <AppShell breadcrumb={LANC.breadcrumb}>
        {/* Premissas + abas */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: premissas.opacity, transform: `translateY(${premissas.y}px)` }}>
          <SegmentedTabs tabs={LANC.tabs} activeIndex={activeTab} appear={12} />
          <div
            style={{
              fontFamily: THEME.fontBody,
              fontWeight: 700,
              fontSize: 14,
              color: THEME.ink,
              background: THEME.surface,
              border: `1px solid ${THEME.line}`,
              padding: "10px 16px",
              borderRadius: 10,
              letterSpacing: 0.3,
            }}
          >
            {LANC.premissas}
          </div>
        </div>

        {/* Card da tabela */}
        <div
          style={{
            marginTop: 20,
            background: THEME.surface,
            borderRadius: 18,
            border: `1px solid ${THEME.line}`,
            boxShadow: "0 24px 60px -30px rgba(3,10,139,0.18)",
            overflow: "hidden",
          }}
        >
          <SectionHeader label="Receitas" count={6} appear={24} accent={THEME.green} />

          {/* Cabeçalho de colunas */}
          <div style={{ display: "flex", padding: "10px 22px", background: "#F7F8FB", borderTop: `1px solid ${THEME.line}` }}>
            {LANC.cols.map((c, i) => {
              const isCredit = i === 5 || i === 6;
              return (
                <div
                  key={c}
                  style={{
                    flex: COL_FLEX[i],
                    textAlign: i === 0 ? "left" : "right",
                    fontFamily: THEME.fontDisplay,
                    fontWeight: 700,
                    fontSize: 10.5,
                    letterSpacing: 0.4,
                    color: isCredit && creditPulse ? THEME.green : THEME.muted,
                    borderRadius: 5,
                    background: isCredit ? `rgba(23,163,74,${0.12 * creditPulse})` : "transparent",
                  }}
                >
                  {c}
                </div>
              );
            })}
          </div>

          {/* Linhas de Receitas + drawer */}
          {LANC.receitas.map((row, i) => {
            const appear = rowsStart + i * rowStep;
            const isCallout =
              focus === "receitas" && (i === 0 || i === 4) ? calloutPulse : 0;
            return (
              <React.Fragment key={row.desc}>
                <LancRow
                  row={row}
                  index={i}
                  appear={appear}
                  highlightCredit={focus === "custos" ? creditPulse : 0}
                  calloutPulse={isCallout}
                />
                {drawerRow === i && (
                  <Drawer
                    open
                    start={drawerStart}
                    activeTab={drawerTabIndex}
                    content={drawerContent}
                  />
                )}
              </React.Fragment>
            );
          })}

          {/* Totais de Receitas */}
          <div style={{ display: "flex", gap: 40, padding: "18px 24px", background: "#FBFCFE", borderTop: `1px solid ${THEME.line}` }}>
            <TotChip label="INFORMADO" value={LANC.receitasTotais.informado} appear={150} />
            <TotChip label="BRUTO" value={LANC.receitasTotais.bruto} appear={156} />
            <TotChip label="CARGA" value={LANC.receitasTotais.carga} appear={162} />
            <TotChip label="DAS" value={LANC.receitasTotais.das} appear={168} />
            <TotChip label="LÍQUIDO" value={LANC.receitasTotais.liquido} tone="green" appear={174} />
          </div>
        </div>

        {/* Custos Diretos — resumo (linhas individuais são aproximadas: sem close) */}
        <div
          style={{
            marginTop: 16,
            background: THEME.surface,
            borderRadius: 18,
            border: `1px solid ${focus === "custos" && creditPulse ? THEME.green : THEME.line}`,
            boxShadow: focus === "custos" ? `0 0 0 ${2 * creditPulse}px rgba(23,163,74,${0.18 * creditPulse})` : "none",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <SectionHeader label="Custos Diretos" count="8 lançamentos" appear={focus === "custos" ? 30 : 60} accent={THEME.blue} />
            <div style={{ fontFamily: THEME.fontBody, fontSize: 12, color: THEME.muted, paddingRight: 22 }}>
              valores em conferência
            </div>
          </div>
          <div style={{ display: "flex", gap: 40, padding: "16px 24px", background: "#FBFCFE", borderTop: `1px solid ${THEME.line}` }}>
            <TotChip label="INFORMADO" value={LANC.custosTotais.informado} appear={focus === "custos" ? 46 : 70} />
            <TotChip label="BRUTO" value={LANC.custosTotais.bruto} appear={focus === "custos" ? 52 : 76} />
            <TotChip label="CRÉDITOS RECUPERADOS" value={LANC.custosTotais.creditos} tone="green" appear={focus === "custos" ? 58 : 82} />
            <TotChip label="LÍQUIDO" value={LANC.custosTotais.liquido} appear={focus === "custos" ? 64 : 88} />
          </div>
        </div>
      </AppShell>
    </AbsoluteFill>
  );
};
