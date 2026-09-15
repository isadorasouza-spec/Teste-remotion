/**
 * Kontiva — Cena 5: "Resultado da simulação" (bloco 2:50–3:40 do roteiro)
 * Remotion · 1920x1080 · 30fps
 *
 * Cena piloto, já validada. Refatorada para consumir os módulos compartilhados
 * (ui/tokens, ui/motion, ui/AppShell) SEM mudar o resultado visual. Os tokens
 * antes no bloco THEME agora vêm de ui/tokens; a sidebar/topbar/abas vêm do
 * AppShell; useCountUp/useEnter vêm de ui/motion.
 *
 * A INTERFACE é fiel ao produto (marca BlueMetrics). Ciano/radar não entra aqui.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { THEME, brl, pct } from "./ui/tokens";
import { useCountUp, useEnter } from "./ui/motion";
import { AppShell, SegmentedTabs } from "./ui/AppShell";

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

/* --------------------------------------------------------------- EXEC CARDS */
const ExecCard = ({ card, index }) => {
  const appear = 34 + index * 7;
  const { opacity, y } = useEnter(appear);
  const frame = useCurrentFrame();
  const counted = useCountUp(card.value, appear + 4, 26);
  const barGrow = interpolate(frame, [appear, appear + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
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
    <div
      style={{
        flex: 1,
        background: THEME.surface,
        borderRadius: 14,
        border: `1px solid ${THEME.line}`,
        borderLeft: "none",
        padding: "22px 24px",
        position: "relative",
        overflow: "hidden",
        opacity,
        transform: `translateY(${y}px)`,
        boxShadow: isHero ? `0 0 0 ${2 * pulse}px rgba(23,163,74,${0.35 * pulse})` : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 4,
          height: "100%",
          background: accentColor,
          transform: `scaleY(${barGrow})`,
          transformOrigin: "top",
        }}
      />
      <div
        style={{
          fontFamily: THEME.fontDisplay,
          fontWeight: 700,
          fontSize: 12.5,
          letterSpacing: 0.7,
          color: THEME.muted,
          marginBottom: 14,
          lineHeight: 1.3,
        }}
      >
        {card.label}
      </div>
      <div
        style={{
          fontFamily: THEME.fontBody,
          fontWeight: 800,
          fontSize: 34,
          color: valueColor,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {display}
      </div>
      {card.note && (
        <div
          style={{
            fontFamily: THEME.fontDisplay,
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: 0.8,
            color: THEME.green,
            marginTop: 6,
          }}
        >
          {card.note}
        </div>
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
  const saldoPulse = isHeroSaldo
    ? interpolate(frame, [174, 190], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const cell = (content, align = "right", strong = false, color = THEME.body) => (
    <div
      style={{
        flex: 1,
        textAlign: align,
        fontFamily: THEME.fontBody,
        fontWeight: strong ? 800 : 500,
        fontSize: 18,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {content}
    </div>
  );

  const v = row.vals.map((val, i) => useCountUp(val, appear + 4 + i * 2, 22));
  const saldoCounted = useCountUp(row.saldo, appear + 8, 24);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "18px 22px",
        borderTop: `1px solid ${THEME.line}`,
        opacity,
        transform: `translateY(${y}px)`,
        background: isHeroSaldo ? `rgba(23,163,74,${0.05 * saldoPulse})` : "transparent",
      }}
    >
      <div
        style={{
          flex: 1,
          fontFamily: THEME.fontDisplay,
          fontWeight: 800,
          fontSize: 18,
          color: THEME.ink,
        }}
      >
        {row.tributo}
      </div>
      {cell(brl(v[0]))}
      {cell(brl(v[1]))}
      {cell(brl(v[2]))}
      {cell(brl(v[3]))}
      <div style={{ flex: 1, textAlign: "right" }}>
        <div
          style={{
            fontFamily: THEME.fontBody,
            fontWeight: 800,
            fontSize: 18,
            color: THEME.green,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {brl(saldoCounted)}
        </div>
        <div
          style={{
            fontFamily: THEME.fontDisplay,
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: 0.7,
            color: THEME.green,
            marginTop: 2,
          }}
        >
          {row.saldoNote}
        </div>
      </div>
    </div>
  );
};

const Apuracao = () => {
  const head = useEnter(84);
  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ opacity: head.opacity, transform: `translateY(${head.y}px)` }}>
        <div
          style={{
            fontFamily: THEME.fontDisplay,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 0.7,
            color: THEME.muted,
          }}
        >
          {DATA.apEyebrow}
        </div>
        <div style={{ fontFamily: THEME.fontBody, fontSize: 16, color: THEME.body, marginTop: 6 }}>
          {DATA.apSub}
        </div>
      </div>
      <div
        style={{
          marginTop: 18,
          border: `1px solid ${THEME.line}`,
          borderRadius: 14,
          overflow: "hidden",
          opacity: head.opacity,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", padding: "14px 22px", background: "#F7F8FB" }}>
          {DATA.apCols.map((c, i) => (
            <div
              key={c}
              style={{
                flex: 1,
                textAlign: i === 0 ? "left" : "right",
                fontFamily: THEME.fontDisplay,
                fontWeight: 700,
                fontSize: 11.5,
                letterSpacing: 0.6,
                color: THEME.muted,
              }}
            >
              {c}
            </div>
          ))}
        </div>
        {DATA.apRows.map((r, i) => (
          <ApRow key={r.tributo} row={r} index={i} />
        ))}
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
        <div
          style={{
            fontFamily: THEME.fontDisplay,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 0.8,
            color: THEME.muted,
            opacity: eb.opacity,
            transform: `translateY(${eb.y}px)`,
          }}
        >
          {DATA.eyebrow}
        </div>
        <div
          style={{
            fontFamily: THEME.fontDisplay,
            fontWeight: 800,
            fontSize: 46,
            color: THEME.ink,
            marginTop: 8,
            opacity: tt.opacity,
            transform: `translateY(${tt.y}px)`,
          }}
        >
          {DATA.title}
        </div>
      </div>
      <div
        style={{
          maxWidth: 440,
          textAlign: "right",
          fontFamily: THEME.fontBody,
          fontSize: 15,
          lineHeight: 1.5,
          color: THEME.muted,
          opacity: hp.opacity,
        }}
      >
        {DATA.helper}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------- COMPOSIÇÃO */
export const KontivaResultado = () => {
  return (
    <AbsoluteFill style={{ background: THEME.pageBg }}>
      <AppShell breadcrumb={DATA.breadcrumb}>
        <SegmentedTabs tabs={DATA.tabs} activeIndex={0} />
        <div
          style={{
            marginTop: 26,
            background: THEME.surface,
            borderRadius: 20,
            border: `1px solid ${THEME.line}`,
            boxShadow: "0 24px 60px -30px rgba(3,10,139,0.18)",
            padding: "42px 46px",
          }}
        >
          <Header />
          <div
            style={{
              fontFamily: THEME.fontDisplay,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: 0.7,
              color: THEME.muted,
              marginBottom: 16,
            }}
          >
            {DATA.cardsEyebrow}
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {DATA.cards.map((c, i) => (
              <ExecCard key={c.label} card={c} index={i} />
            ))}
          </div>
          <Apuracao />
        </div>
      </AppShell>
    </AbsoluteFill>
  );
};

export default KontivaResultado;
