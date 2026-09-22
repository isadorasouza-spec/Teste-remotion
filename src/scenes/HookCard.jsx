/**
 * HookCard — cartão de impacto (moldura de marca) que antecede cada tela.
 * Fundo navy com varredura de radar ciano; frase grande em Space Grotesk, com
 * uma palavra em Instrument Serif itálica; sublinha em Inter. Entra a frase
 * linha a linha, segura, e o RadarWipe da composição-mestre revela a tela.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { THEME } from "../ui/tokens";

export const CARD_DUR = 84;

const easeOut = Easing.out(Easing.cubic);

const Radar = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const angle = interpolate(frame, [0, 130], [-120, 240], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const size = 1200;
  return (
    <div style={{ position: "absolute", left: "50%", top: "50%", width: size, height: size, transform: "translate(-50%,-50%)", opacity: 0.5 }}>
      {[0.34, 0.55, 0.78, 1].map((r, i) => (
        <div key={i} style={{ position: "absolute", inset: `${(1 - r) * 50}%`, borderRadius: "50%",
          border: `1px solid rgba(0,212,255,${0.05 + 0.05 * i})`, transform: `scale(${interpolate(t, [0, 1], [0.7, 1])})`, opacity: t }} />
      ))}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", opacity: t * 0.7,
        background: `conic-gradient(from ${angle}deg, rgba(0,212,255,0.22) 0deg, rgba(0,212,255,0) 64deg)`,
        WebkitMaskImage: "radial-gradient(circle, #000 58%, transparent 70%)", maskImage: "radial-gradient(circle, #000 58%, transparent 70%)" }} />
    </div>
  );
};

const Line = ({ parts, appear, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appear, fps, config: { damping: 200 } });
  const op = interpolate(s, [0, 1], [0, 1]);
  const y = interpolate(s, [0, 1], [30, 0]);
  return (
    <div style={{ opacity: op, transform: `translateY(${y}px)` }}>
      {parts.map((p, i) =>
        typeof p === "string"
          ? <span key={i} style={style}>{p}</span>
          : <span key={i} style={{ ...style, fontFamily: THEME.fontSerif, fontStyle: "italic", fontWeight: 400, color: THEME.cianoSoft }}>{p.i}</span>
      )}
    </div>
  );
};

export const HookCard = ({ data }) => {
  const frame = useCurrentFrame();
  const ebS = spring({ frame: frame - 4, fps: 30, config: { damping: 200 } });
  const ebOp = interpolate(ebS, [0, 1], [0, 1]);
  const subOp = interpolate(frame, [32, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const underline = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });

  const h = { fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 88, color: "#EAF6FF", letterSpacing: "-0.035em", lineHeight: 1.07 };

  return (
    <AbsoluteFill style={{ background: `radial-gradient(1300px 900px at 50% 46%, #16386B 0%, ${THEME.navy} 62%)` }}>
      <Radar />
      {/* vinheta para dar contraste ao texto central */}
      <AbsoluteFill style={{ background: "radial-gradient(1100px 620px at 50% 48%, rgba(10,31,63,0.55) 0%, rgba(10,31,63,0) 70%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 120px" }}>
        {/* lockup de marca */}
        <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 30, color: "#EAF6FF", opacity: ebOp, marginBottom: 40 }}>
          Kontiva<span style={{ color: THEME.ciano }}>.ai</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: ebOp, marginBottom: 30 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: THEME.ciano }} />
          <span style={{ fontFamily: THEME.fontMono, fontSize: 20, letterSpacing: "0.34em", color: THEME.ciano, textTransform: "uppercase" }}>{data.eyebrow}</span>
        </div>
        <div style={{ maxWidth: 1640 }}>
          {data.lines.map((parts, i) => <Line key={i} parts={parts} appear={14 + i * 8} style={h} />)}
        </div>
        <div style={{ height: 4, width: 150, background: THEME.ciano, borderRadius: 2, marginTop: 30,
          transform: `scaleX(${underline})`, boxShadow: "0 0 14px rgba(0,212,255,0.75)" }} />
        {data.sub && (
          <div style={{ fontFamily: THEME.fontDisplay, fontSize: 28, color: "rgba(234,246,255,0.78)", marginTop: 30, maxWidth: 1100,
            lineHeight: 1.45, opacity: subOp }}>{data.sub}</div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Copy dos cards (frase grande + sublinha), na ordem das telas. */
export const HOOKS = [
  { eyebrow: "Kontiva · Reforma Tributária",
    lines: [["E se você enxergasse o impacto"], ["da Reforma ", { i: "antes" }, " dele acontecer?"]] },
  { eyebrow: "Clientes",
    lines: [["Cada cliente vive uma"], ["Reforma ", { i: "diferente" }, "."]],
    sub: "Aqui, todas num lugar só." },
  { eyebrow: "Comparativo",
    lines: [["Mesmo negócio, dois anos,"], ["duas ", { i: "cargas" }, " tributárias."]],
    sub: "Compare 2027 e 2029 lado a lado, em segundos." },
  { eyebrow: "Lançamentos e notas",
    lines: [["Produtos parecidos,"], ["impostos bem ", { i: "diferentes" }, "."]],
    sub: "Cesta básica, exportação ou tributação integral: cada nota, um tratamento." },
  { eyebrow: "Créditos e fornecedores",
    lines: [["Nem todo custo"], ["vira ", { i: "crédito" }, "."]],
    sub: "Depende do que você compra, e de quem. Descubra quais." },
  { eyebrow: "Resultado",
    lines: [["Quanto sobra, quanto paga,"], ["quanto ", { i: "recupera" }, "."]],
    sub: "A simulação inteira em quatro indicadores, sem planilha." },
  { eyebrow: "2027 × 2029",
    lines: [["O ICMS cai de R$ 105 mil"], ["para R$ 94 mil. Onde a Reforma ", { i: "alivia" }, "?"]],
    sub: "Dois anos, frente a frente: o que sobe e o que cai." },
  { eyebrow: "Fluxo de caixa",
    lines: [["Em que mês o caixa"], ["fica no ", { i: "vermelho" }, "?"]],
    sub: "Imposto tem hora pra sair do caixa. Entradas, saídas e saldo, mês a mês." },
];

/* Componentes nomeados (um por card) para registro no Root. */
export const CardComps = HOOKS.map((h) => {
  const C = () => <HookCard data={h} />;
  return C;
});

export default HookCard;
