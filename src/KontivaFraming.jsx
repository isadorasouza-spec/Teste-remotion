/**
 * Kontiva — Camada de MARCA (moldura das animações)
 * Remotion · 1920x1080 · 30fps
 *
 * Aqui vive o design system de marketing (radar/ciano), que embrulha as cenas
 * de interface. Três peças reutilizáveis:
 *   - IntroKontiva : abertura (logo lockup, tagline, varredura de radar)
 *   - RadarWipe    : transição entre cenas (feixe ciano varre e revela)
 *   - OutroKontiva : encerramento (tagline + chamada)
 *
 * A INTERFACE do produto (telas de dados) NÃO usa estas cores; ela é fiel à
 * marca BlueMetrics (ver KontivaResultado.jsx). Ciano só aqui, na moldura.
 *
 * COMO USAR
 *   npm i @remotion/google-fonts
 *   Copie para src/KontivaFraming.jsx e registre no Root (snippet no fim).
 *   A tagline e as chamadas estão em COPY — ajuste o texto ali.
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const LATIN = { subsets: ["latin"], ignoreTooManyRequestsWarning: true };
const { fontFamily: INTER } = loadInter("normal", { weights: ["400", "700", "800"], ...LATIN });
// Instrument Serif itálica é usada em 1 palavra por título-chave: carrega os dois estilos.
loadSerif("italic", { weights: ["400"], ...LATIN });
const { fontFamily: SERIF } = loadSerif("normal", { weights: ["400"], ...LATIN });
const { fontFamily: MONO } = loadMono("normal", { weights: ["400", "700"], ...LATIN });

/* ------------------------------------------------------- TOKENS (marketing) */
const BRAND = {
  navy: "#0A1F3F",
  navy2: "#122A52",
  ciano: "#00D4FF",
  cianoSoft: "#E0F9FF",
  onDark: "#EAF6FF",     // texto sobre escuro (nunca branco puro)
  fontDisplay: `${INTER}, system-ui, sans-serif`,
  fontSerif: `${SERIF}, Georgia, serif`,
  fontMono: `${MONO}, ui-monospace, monospace`,
};

/* Textos editáveis — mantidos junto pra revisão de copy. */
const COPY = {
  eyebrow: "KONTIVA · REFORMA TRIBUTÁRIA",
  // tagline oficial; a palavra em <i> vai em Instrument Serif itálica
  headline: ["Clareza na", "Reforma", { i: "Tributária" }],
  outroEyebrow: "KONTIVA.AI",
  outroLine: ["Veja o impacto", { i: "antes" }, "que ele aconteça."],
  outroCta: "Fale com a gente no WhatsApp",
};

/* --------------------------------------------------------------- UTILITÁRIOS */
const easeOut = Easing.out(Easing.cubic);

const useReveal = (appear, rise = 24) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appear, fps, config: { damping: 200 } });
  return { opacity: interpolate(s, [0, 1], [0, 1]), y: interpolate(s, [0, 1], [rise, 0]) };
};

/* Fundo escuro com tint radial de ciano (assinatura do design system). */
const DarkBackdrop = ({ children }) => (
  <AbsoluteFill style={{
    background: `radial-gradient(1200px 700px at 70% 20%, ${BRAND.navy2} 0%, ${BRAND.navy} 55%)`,
  }}>{children}</AbsoluteFill>
);

/* Anel de radar + feixe que varre uma vez. */
const RadarSweep = ({ appear = 0, cx = "72%", cy = "34%", size = 520 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [appear, appear + 46], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const angle = interpolate(frame, [appear, appear + 90], [-120, 200],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  return (
    <div style={{ position: "absolute", left: cx, top: cy, width: size, height: size,
      transform: "translate(-50%,-50%)", opacity: 0.9 }}>
      {[0.4, 0.7, 1].map((r, i) => (
        <div key={i} style={{
          position: "absolute", inset: `${(1 - r) * 50}%`, borderRadius: "50%",
          border: `1px solid rgba(0,212,255,${0.10 + 0.08 * i})`,
          transform: `scale(${interpolate(t, [0, 1], [0.6, 1])})`, opacity: t,
        }} />
      ))}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%", opacity: t,
        background: `conic-gradient(from ${angle}deg, rgba(0,212,255,0.35) 0deg, rgba(0,212,255,0) 60deg)`,
        WebkitMaskImage: "radial-gradient(circle, #000 60%, transparent 71%)",
        maskImage: "radial-gradient(circle, #000 60%, transparent 71%)",
      }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 8, height: 8,
        borderRadius: "50%", background: BRAND.ciano, transform: "translate(-50%,-50%)",
        boxShadow: `0 0 14px 4px rgba(0,212,255,0.6)`, opacity: t }} />
    </div>
  );
};

/* Renderiza uma linha com uma palavra em Instrument Serif itálica. */
const HeroLine = ({ parts, baseStyle }) => (
  <>
    {parts.map((p, i) =>
      typeof p === "string"
        ? <span key={i} style={baseStyle}>{p}{i < parts.length - 1 ? " " : ""}</span>
        : <span key={i} style={{ ...baseStyle, fontFamily: BRAND.fontSerif, fontStyle: "italic",
            fontWeight: 400 }}>{p.i}{i < parts.length - 1 ? " " : ""}</span>
    )}
  </>
);

/* ------------------------------------------------------------------- INTRO */
export const IntroKontiva = () => {
  const eb = useReveal(14);
  const l1 = useReveal(24, 28);
  const l2 = useReveal(30, 28);
  const l3 = useReveal(36, 28);
  const frame = useCurrentFrame();
  const underline = interpolate(frame, [44, 60], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const h = { fontFamily: BRAND.fontDisplay, fontWeight: 800, fontSize: 92, color: BRAND.onDark,
    letterSpacing: "-0.03em", lineHeight: 1.02 };

  return (
    <DarkBackdrop>
      <RadarSweep appear={6} />
      <div style={{ position: "absolute", left: 120, top: 380, maxWidth: 1100 }}>
        <div style={{ fontFamily: BRAND.fontMono, fontSize: 18, letterSpacing: 4, color: BRAND.ciano,
          opacity: eb.opacity, transform: `translateY(${eb.y}px)`, marginBottom: 26 }}>
          {COPY.eyebrow}
        </div>
        <div style={{ opacity: l1.opacity, transform: `translateY(${l1.y}px)` }}>
          <HeroLine parts={[COPY.headline[0]]} baseStyle={h} />
        </div>
        <div style={{ opacity: l2.opacity, transform: `translateY(${l2.y}px)` }}>
          <HeroLine parts={[COPY.headline[1]]} baseStyle={h} />
        </div>
        <div style={{ opacity: l3.opacity, transform: `translateY(${l3.y}px)`, position: "relative",
          display: "inline-block" }}>
          <HeroLine parts={[COPY.headline[2]]} baseStyle={h} />
          <div style={{ position: "absolute", left: 0, bottom: -10, height: 3, width: "100%",
            background: BRAND.ciano, transform: `scaleX(${underline})`, transformOrigin: "left",
            boxShadow: "0 0 12px rgba(0,212,255,0.7)" }} />
        </div>
      </div>
      {/* lockup de texto (alternativa oficial ao PNG do logo) */}
      <div style={{ position: "absolute", left: 120, top: 110, fontFamily: BRAND.fontDisplay,
        fontWeight: 800, fontSize: 30, color: BRAND.onDark, opacity: eb.opacity }}>
        Kontiva<span style={{ color: BRAND.ciano }}>.ai</span>
      </div>
    </DarkBackdrop>
  );
};

/* ------------------------------------------------- TRANSIÇÃO (RADAR WIPE) */
/* Coloque numa Sequence curta (~20f) entre duas cenas. */
export const RadarWipe = () => {
  const frame = useCurrentFrame();
  const cover = interpolate(frame, [0, 8, 12, 20], [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const beam = interpolate(frame, [0, 20], [-10, 110],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: BRAND.navy, opacity: cover }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${beam}%`, width: 180,
        background: `linear-gradient(90deg, transparent, rgba(0,212,255,0.55), transparent)`,
        filter: "blur(2px)", opacity: cover }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------- OUTRO */
export const OutroKontiva = () => {
  const eb = useReveal(10);
  const ln = useReveal(20, 26);
  const cta = useReveal(34);
  const frame = useCurrentFrame();
  const ctaGlow = 0.5 + 0.5 * Math.sin(frame / 10);
  const h = { fontFamily: BRAND.fontDisplay, fontWeight: 800, fontSize: 72, color: BRAND.onDark,
    letterSpacing: "-0.03em", lineHeight: 1.05 };
  return (
    <DarkBackdrop>
      <RadarSweep appear={0} cx="50%" cy="42%" size={640} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ fontFamily: BRAND.fontMono, fontSize: 18, letterSpacing: 5, color: BRAND.ciano,
          opacity: eb.opacity, transform: `translateY(${eb.y}px)`, marginBottom: 24 }}>
          {COPY.outroEyebrow}
        </div>
        <div style={{ opacity: ln.opacity, transform: `translateY(${ln.y}px)`, maxWidth: 1200 }}>
          <HeroLine parts={COPY.outroLine} baseStyle={h} />
        </div>
        <div style={{ marginTop: 44, opacity: cta.opacity, transform: `translateY(${cta.y}px)` }}>
          <div style={{ fontFamily: BRAND.fontDisplay, fontWeight: 700, fontSize: 22, color: BRAND.navy,
            background: BRAND.ciano, padding: "16px 30px", borderRadius: 12,
            boxShadow: `0 12px 40px -8px rgba(0,212,255,${0.5 * ctaGlow})` }}>
            {COPY.outroCta}
          </div>
        </div>
      </AbsoluteFill>
    </DarkBackdrop>
  );
};

/* ============================================================================
 * REGISTRO — src/Root.jsx (cada peça é uma Composition; a RadarWipe entra
 * como Sequence dentro da composição-mestre, não sozinha):
 *
 *   import { IntroKontiva, OutroKontiva } from "./KontivaFraming";
 *
 *   <Composition id="IntroKontiva" component={IntroKontiva}
 *     durationInFrames={120} fps={30} width={1920} height={1080} />
 *   <Composition id="OutroKontiva" component={OutroKontiva}
 *     durationInFrames={130} fps={30} width={1920} height={1080} />
 * ========================================================================== */
