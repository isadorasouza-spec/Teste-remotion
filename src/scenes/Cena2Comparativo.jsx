/**
 * Cena 2 — Comparativo Reforma (cliente Vértice). Bloco 0:30–1:00.
 * Remotion · 1920x1080 · 30fps · 300 frames piloto.
 *
 * Página do cliente Vértice, card "Comparativo Reforma (2)" com as duas
 * simulações (2027 e 2029). Herói: contraste da carga 3,56% (2027) vs 2,34%
 * (2029). Resultado e Créditos em verde; Débitos e Carga em vermelho.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { THEME, brl, pct } from "../ui/tokens";
import { useCountUp, useEnter } from "../ui/motion";
import { AppShell, SegmentedTabs } from "../ui/AppShell";

const DATA = {
  breadcrumb: ["SIMULAÇÕES", "VÉRTICE DISTRIBUIDORA ATACADISTA LTDA."],
  title: "Vértice Distribuidora Atacadista Ltda.",
  subtitle: "Simulações e grupos criados para este cliente.",
  tabs: ["Grupos (1)", "Individuais (0)"],
  cardTitle: "Comparativo Reforma",
  cardCount: 2,
  updated: "Atualizado 02/09/2026",
  btnGhost: "Ver análise",
  btnPrimary: "Atualizar todas",
  cols: ["SIMULAÇÃO", "RESULTADO", "GRUPOS", "ANO", "DÉBITOS", "CRÉDITOS", "CARGA TRIBUTÁRIA"],
  rows: [
    {
      name: "Notas",
      code: "SIM-01A039",
      resultado: 379800,
      ano: "2027",
      debitos: 225812,
      creditos: 167205,
      carga: 3.56,
    },
    {
      name: "Notas (2029)",
      code: "SIM-01A063",
      resultado: 390320,
      ano: "2029",
      debitos: 216782.8,
      creditos: 178064.5,
      carga: 2.34,
    },
  ],
};

const COL_FLEX = [2.2, 1.3, 1.3, 0.8, 1.3, 1.3, 1.4];

const Cell = ({ children, align = "right", flex, style }) => (
  <div style={{ flex, textAlign: align, ...style }}>{children}</div>
);

const SimRow = ({ row, index, heroPulse }) => {
  const appear = 70 + index * 20;
  const { opacity, y } = useEnter(appear);
  const resultado = useCountUp(row.resultado, appear + 6, 24);
  const debitos = useCountUp(row.debitos, appear + 8, 24);
  const creditos = useCountUp(row.creditos, appear + 10, 24);
  const carga = useCountUp(row.carga, appear + 12, 24);

  const numStyle = (color, strong = true) => ({
    fontFamily: THEME.fontBody,
    fontWeight: strong ? 800 : 600,
    fontSize: 19,
    color,
    fontVariantNumeric: "tabular-nums",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "22px 24px",
        borderTop: `1px solid ${THEME.line}`,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <Cell align="left" flex={COL_FLEX[0]}>
        <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 19, color: THEME.ink }}>
          {row.name}
        </div>
        <div style={{ fontFamily: THEME.fontBody, fontSize: 12.5, color: THEME.muted, marginTop: 3, letterSpacing: 0.4 }}>
          {row.code}
        </div>
      </Cell>
      <Cell flex={COL_FLEX[1]}>
        <div style={numStyle(THEME.green)}>{brl(resultado)}</div>
      </Cell>
      <Cell flex={COL_FLEX[2]}>
        <div
          style={{
            display: "inline-block",
            fontFamily: THEME.fontDisplay,
            fontWeight: 700,
            fontSize: 12,
            color: THEME.muted,
            background: "#F1F3F8",
            padding: "5px 10px",
            borderRadius: 7,
          }}
        >
          {DATA.cardTitle}
        </div>
      </Cell>
      <Cell flex={COL_FLEX[3]}>
        <div style={{ fontFamily: THEME.fontBody, fontWeight: 700, fontSize: 18, color: THEME.ink, fontVariantNumeric: "tabular-nums" }}>
          {row.ano}
        </div>
      </Cell>
      <Cell flex={COL_FLEX[4]}>
        <div style={numStyle(THEME.red)}>{brl(debitos)}</div>
      </Cell>
      <Cell flex={COL_FLEX[5]}>
        <div style={numStyle(THEME.green)}>{brl(creditos)}</div>
      </Cell>
      <Cell flex={COL_FLEX[6]}>
        <div
          style={{
            display: "inline-block",
            padding: "6px 12px",
            borderRadius: 9,
            background: `rgba(224,70,58,${0.08 + 0.12 * heroPulse})`,
            boxShadow: `0 0 0 ${2 * heroPulse}px rgba(224,70,58,${0.28 * heroPulse})`,
            ...numStyle(THEME.red),
          }}
        >
          {pct(carga)}
        </div>
      </Cell>
    </div>
  );
};

export const Cena2Comparativo = () => {
  const frame = useCurrentFrame();
  const title = useEnter(10, 22);
  const sub = useEnter(16);
  const cardHead = useEnter(40);

  // herói: realce das duas cargas em contraste (~f150)
  const heroPulse = interpolate(frame, [150, 168, 250], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: THEME.pageBg }}>
      <AppShell breadcrumb={DATA.breadcrumb}>
        {/* Título + subtítulo */}
        <div style={{ opacity: title.opacity, transform: `translateY(${title.y}px)` }}>
          <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 800, fontSize: 40, color: THEME.ink }}>
            {DATA.title}
          </div>
        </div>
        <div
          style={{
            fontFamily: THEME.fontBody,
            fontSize: 16,
            color: THEME.muted,
            marginTop: 10,
            opacity: sub.opacity,
            transform: `translateY(${sub.y}px)`,
          }}
        >
          {DATA.subtitle}
        </div>

        {/* Abas */}
        <div style={{ marginTop: 24 }}>
          <SegmentedTabs tabs={DATA.tabs} activeIndex={0} appear={24} />
        </div>

        {/* Card do grupo */}
        <div
          style={{
            marginTop: 22,
            background: THEME.surface,
            borderRadius: 20,
            border: `1px solid ${THEME.line}`,
            boxShadow: "0 24px 60px -30px rgba(3,10,139,0.18)",
            overflow: "hidden",
            opacity: cardHead.opacity,
            transform: `translateY(${cardHead.y}px)`,
          }}
        >
          {/* Header do card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "26px 28px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 800, fontSize: 24, color: THEME.ink }}>
                {DATA.cardTitle}
              </div>
              <div
                style={{
                  fontFamily: THEME.fontDisplay,
                  fontWeight: 800,
                  fontSize: 14,
                  color: "#fff",
                  background: THEME.blue,
                  minWidth: 28,
                  height: 28,
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 8px",
                }}
              >
                {DATA.cardCount}
              </div>
              <div style={{ fontFamily: THEME.fontBody, fontSize: 12.5, color: THEME.muted }}>
                {DATA.updated}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  padding: "11px 18px",
                  borderRadius: 10,
                  border: `1px solid ${THEME.line}`,
                  fontFamily: THEME.fontDisplay,
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: THEME.ink,
                }}
              >
                {DATA.btnGhost}
              </div>
              <div
                style={{
                  padding: "11px 18px",
                  borderRadius: 10,
                  background: THEME.blue,
                  fontFamily: THEME.fontDisplay,
                  fontWeight: 700,
                  fontSize: 13.5,
                  color: "#fff",
                }}
              >
                {DATA.btnPrimary}
              </div>
            </div>
          </div>

          {/* Cabeçalho de colunas */}
          <div style={{ display: "flex", padding: "14px 24px", background: "#F7F8FB" }}>
            {DATA.cols.map((c, i) => (
              <Cell
                key={c}
                align={i === 0 ? "left" : "right"}
                flex={COL_FLEX[i]}
                style={{
                  fontFamily: THEME.fontDisplay,
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: 0.5,
                  color: THEME.muted,
                }}
              >
                {c}
              </Cell>
            ))}
          </div>

          {/* Linhas */}
          {DATA.rows.map((r, i) => (
            <SimRow key={r.code} row={r} index={i} heroPulse={heroPulse} />
          ))}
        </div>
      </AppShell>
    </AbsoluteFill>
  );
};

export default Cena2Comparativo;
