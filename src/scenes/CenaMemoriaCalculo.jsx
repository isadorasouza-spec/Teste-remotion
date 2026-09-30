/**
 * Cena Memória de Cálculo — mostra a RASTREABILIDADE do número (a fonte e a
 * memória de cálculo, passo a passo) e o portão de APROVAÇÃO HUMANA: a apuração
 * fica "Aguardando aprovação" e nada é enviado à guia antes de um responsável
 * revisar e aprovar. Recriada no sistema visual do produto (blueaccount-ai).
 * 1920x1080 · 30fps.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { THEME, brl, pct } from "../ui/tokens";
import { useCountUp, useEnter } from "../ui/motion";
import { AppShell, Ic, ICON } from "../ui/AppShell";
import { CameraStage, kf, Cursor } from "../ui/anim";

const AMBER = "#F59E0B";
const AMBER_TEXT = "#92400E";
const AMBER_BG = "rgba(245,158,11,0.12)";

/* Passos da memória de cálculo (aritmética exata). */
const STEPS = [
  { op: "1", label: "Base de cálculo das saídas", value: 2715000, kind: "brl",
    fonte: "12 notas fiscais de saída · jun/2029", src: "notas" },
  { op: "×", label: "Alíquota de referência IBS + CBS", value: 26.5, kind: "pct",
    fonte: "LC 214/2025 · EC 132/2023", src: "legal" },
  { op: "=", label: "Débito bruto de IBS/CBS", value: 719475, kind: "brl", muted: true },
  { op: "−", label: "Créditos apropriados nas entradas", value: 564205, kind: "brl",
    fonte: "Notas de entrada com crédito · 8 fornecedores", src: "forn" },
  { op: "=", label: "Tributo líquido a recolher", value: 155270, kind: "brl", result: true },
];

const SOURCES = [
  { k: "sheet", title: "Notas fiscais de saída", meta: "12 documentos · jun/2029", tag: "notas" },
  { k: "truck", title: "Notas de entrada com crédito", meta: "8 fornecedores · crédito IBS/CBS", tag: "forn" },
  { k: "doc", title: "Base legal aplicada", meta: "LC 214/2025 · EC 132/2023", tag: "legal" },
  { k: "sheet", title: "Dados operacionais", meta: "Parametrização do regime e do período", tag: "dados" },
];

const DATA = {
  breadcrumb: ["Simulações", "VÉRTICE DISTRIBUIDORA ATACADISTA LTDA.", "APURAÇÃO 2029"],
  eyebrow: "Apuração · IBS/CBS",
  titleLead: "Memória de",
  titleAccent: "cálculo",
  sub: "Cada valor é rastreável até a sua fonte. A apuração fica pendente até a revisão e aprovação de um responsável.",
};

const fmt = (v, kind, counted) => (kind === "pct" ? pct(counted).replace(",00", "") : brl(counted));

/* --------------------------------------------------------------- PASSO */
const StepRow = ({ step, index, activeAmt }) => {
  const appear = 40 + index * 12;
  const { opacity, y } = useEnter(appear);
  const counted = useCountUp(step.value, appear + 4, 22);
  const on = activeAmt || 0;
  const accent = step.result ? THEME.ciano : on > 0.05 ? THEME.ciano : "transparent";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", borderRadius: 12,
      background: step.result ? THEME.cianoSoft : on > 0.05 ? "rgba(0,212,255,0.06)" : "transparent",
      border: `1px solid ${step.result ? "rgba(0,212,255,0.4)" : on > 0.05 ? "rgba(0,212,255,0.35)" : "transparent"}`,
      boxShadow: on > 0.05 && !step.result ? `0 10px 26px -14px rgba(0,212,255,0.6)` : "none",
      opacity, transform: `translateY(${y}px)`, position: "relative", zIndex: on > 0.05 ? 2 : 1 }}>
      {/* operador / índice */}
      <div style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
        background: step.result ? THEME.ciano : "rgba(10,31,63,0.05)", color: step.result ? THEME.navy : THEME.muted,
        fontFamily: step.op.length === 1 && isNaN(+step.op) ? THEME.fontBody : THEME.fontDisplay, fontWeight: 700, fontSize: 17 }}>{step.op}</div>
      {/* label + fonte */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: THEME.fontBody, fontWeight: step.result ? 700 : 600, fontSize: 15.5,
          color: step.muted ? THEME.muted : THEME.navy }}>{step.label}</div>
        {step.fonte && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 6, padding: "4px 10px", borderRadius: 8,
            background: THEME.surface, border: `1px solid ${on > 0.05 ? "rgba(0,212,255,0.5)" : THEME.cardBorder}` }}>
            <span style={{ width: 13, height: 13, display: "flex", color: THEME.ciano }}><Ic d={ICON.radar} size={13} /></span>
            <span style={{ fontFamily: THEME.fontMono, fontSize: 11, color: THEME.muted }}>Fonte:</span>
            <span style={{ fontFamily: THEME.fontMono, fontSize: 11, fontWeight: 600, color: THEME.navy }}>{step.fonte}</span>
          </div>
        )}
      </div>
      {/* valor */}
      <div style={{ fontFamily: THEME.fontMono, fontWeight: 700, fontSize: step.result ? 24 : 18,
        color: step.result ? THEME.navy : step.muted ? THEME.body : THEME.navy, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
        {step.op === "×" ? "" : ""}{fmt(step.value, step.kind, counted)}
      </div>
    </div>
  );
};

const SourceItem = ({ s, index }) => {
  const appear = 60 + index * 10;
  const { opacity, y } = useEnter(appear);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderRadius: 10,
      background: THEME.surface, border: `1px solid ${THEME.cardBorder}`, opacity, transform: `translateY(${y}px)` }}>
      <div style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 9, background: THEME.cianoSoft, color: THEME.navy,
        display: "flex", alignItems: "center", justifyContent: "center" }}><Ic d={ICON[s.k]} size={17} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 13.5, color: THEME.navy }}>{s.title}</div>
        <div style={{ fontFamily: THEME.fontMono, fontSize: 10.5, color: THEME.muted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.meta}</div>
      </div>
      <span style={{ width: 16, height: 16, display: "flex", color: THEME.muted, flexShrink: 0 }}><Ic d={ICON.chevron} size={16} /></span>
    </div>
  );
};

/* ------------------------------------------------------------------- CÂMERA */
/* overview → memória de cálculo (desce pelos passos) → painel de fontes →
 * barra de aprovação (cursor pousa em "Aprovar", pendente) → afasta. */
const CAM_T  = [0,   70,  100, 148, 190, 238, 300, 342, 392, 428, 466, 508, 528, 560];
const CAM_CX = [960, 960, 640, 640, 640, 640, 640, 1560,1100,1100,1360,1360,960, 960];
const CAM_CY = [540, 540, 360, 470, 560, 640, 640, 470, 729, 729, 729, 729, 540, 540];
const CAM_S  = [1.0, 1.0, 1.45,1.45,1.45,1.45,1.45,1.5, 1.3, 1.3, 1.55,1.55,1.0, 1.0];

/* janelas de destaque por passo (frame) */
const STEP_WIN = [[96, 146], [138, 190], [182, 234], [226, 278], [270, 300]];
/* cursor em MUNDO (dentro da câmera): repouso → botão "Aprovar apuração" (~1765,729) */
const CUR_T = [0, 392, 450, 560];
const CUR_X = [1720, 1720, 1765, 1765];
const CUR_Y = [820, 820, 729, 729];

export const CenaMemoriaCalculo = () => {
  const frame = useCurrentFrame();
  const eb = useEnter(8);
  const title = useEnter(12, 18);
  const sub = useEnter(18);
  const leftCard = useEnter(30);
  const rightCard = useEnter(44);
  const apprCard = useEnter(150);

  const camX = kf(frame, CAM_T, CAM_CX);
  const camY = kf(frame, CAM_T, CAM_CY);
  const camS = kf(frame, CAM_T, CAM_S);

  const stepAmt = (i) => {
    const [a, b] = STEP_WIN[i];
    return interpolate(frame, [a - 8, a + 6, b - 6, b + 6], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };

  // barra de aprovação: pulso de "aguardando" + realce no botão quando o cursor chega
  const apprPulse = interpolate(frame, [392, 420, 510, 540], [0, 1, 1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const btnGlow = interpolate(frame, [448, 472], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const curX = kf(frame, CUR_T, CUR_X);
  const curY = kf(frame, CUR_T, CUR_Y);
  const curOp = interpolate(frame, [380, 396, 520, 534], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: THEME.pageBg, overflow: "hidden" }}>
      <CameraStage cx={camX} cy={camY} s={camS}>
      <AppShell breadcrumb={DATA.breadcrumb} active="Simulações" contentPadding="22px 40px">
        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ maxWidth: 900 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: eb.opacity, transform: `translateY(${eb.y}px)` }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: THEME.ciano }} />
              <span style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: THEME.muted }}>{DATA.eyebrow}</span>
            </div>
            <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 36, letterSpacing: "-0.03em", color: THEME.navy, marginTop: 8,
              opacity: title.opacity, transform: `translateY(${title.y}px)` }}>
              {DATA.titleLead} <span style={{ fontFamily: THEME.fontSerif, fontStyle: "italic", fontWeight: 400 }}>{DATA.titleAccent}</span>.
            </div>
            <div style={{ fontFamily: THEME.fontBody, fontSize: 15, color: THEME.muted, marginTop: 8, lineHeight: 1.5, maxWidth: 780,
              opacity: sub.opacity, transform: `translateY(${sub.y}px)` }}>{DATA.sub}</div>
          </div>
          {/* status pill: aguardando aprovação */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 16px", borderRadius: 999,
            background: AMBER_BG, border: `1px solid rgba(245,158,11,0.4)`, flexShrink: 0,
            opacity: sub.opacity, boxShadow: `0 0 0 ${6 * apprPulse}px rgba(245,158,11,0.10)` }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: AMBER }} />
            <span style={{ fontFamily: THEME.fontBody, fontWeight: 700, fontSize: 13, color: AMBER_TEXT }}>Aguardando aprovação</span>
          </div>
        </div>

        {/* corpo: memória (esq) + fontes (dir) */}
        <div style={{ display: "flex", gap: 18, marginTop: 16, alignItems: "flex-start" }}>
          {/* memória de cálculo */}
          <div style={{ flex: 1.7, background: THEME.surface, borderRadius: 16, border: `1px solid ${THEME.cardBorder}`,
            boxShadow: THEME.cardShadow, padding: "18px 16px", opacity: leftCard.opacity, transform: `translateY(${leftCard.y}px)` }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "0 6px 6px" }}>
              <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 17, color: THEME.navy }}>Memória de cálculo</div>
              <div style={{ fontFamily: THEME.fontMono, fontSize: 11, color: THEME.muted }}>Como chegamos no valor a recolher</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {STEPS.map((s, i) => <StepRow key={i} step={s} index={i} activeAmt={stepAmt(i)} />)}
            </div>
          </div>

          {/* fontes / rastreabilidade */}
          <div style={{ flex: 1, background: THEME.pageBg, borderRadius: 16, border: `1px solid ${THEME.cardBorder}`,
            padding: "18px 16px", opacity: rightCard.opacity, transform: `translateY(${rightCard.y}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 4px 12px" }}>
              <span style={{ width: 16, height: 16, display: "flex", color: THEME.ciano }}><Ic d={ICON.radar} size={16} /></span>
              <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 16, color: THEME.navy }}>Fontes e rastreabilidade</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SOURCES.map((s, i) => <SourceItem key={i} s={s} index={i} />)}
            </div>
            <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 10, background: "rgba(0,212,255,0.06)", border: `1px solid rgba(0,212,255,0.2)` }}>
              <div style={{ fontFamily: THEME.fontBody, fontSize: 12.5, color: THEME.body, lineHeight: 1.5 }}>
                Toda apuração carrega o vínculo com os documentos e a base legal que a originaram.
              </div>
            </div>
          </div>
        </div>

        {/* barra de aprovação humana */}
        <div style={{ marginTop: 16, background: THEME.surface, borderRadius: 16, border: `1px solid ${btnGlow > 0.05 ? "rgba(0,212,255,0.4)" : THEME.cardBorder}`,
          boxShadow: `0 18px 44px -22px rgba(10,31,63,${0.25 + 0.25 * apprPulse})`, padding: "18px 22px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20,
          opacity: apprCard.opacity, transform: `translateY(${apprCard.y}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, background: AMBER_BG, color: AMBER_TEXT, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center" }}><Ic d={ICON.alert} size={22} /></div>
            <div>
              <div style={{ fontFamily: THEME.fontBody, fontWeight: 700, fontSize: 15.5, color: THEME.navy }}>Revisão humana obrigatória antes de gerar a guia</div>
              <div style={{ fontFamily: THEME.fontBody, fontSize: 13, color: THEME.muted, marginTop: 3 }}>
                Nenhum valor é enviado à guia sem a aprovação de um responsável. Revisor: <b style={{ color: THEME.body }}>Isadora Souza</b>.
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ padding: "12px 18px", borderRadius: 10, border: `1px solid ${THEME.border}`, color: THEME.navy,
              fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 13.5 }}>Solicitar ajuste</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 10, background: THEME.ciano, color: THEME.navy,
              fontFamily: THEME.fontBody, fontWeight: 700, fontSize: 13.5,
              boxShadow: `0 10px 30px -10px rgba(0,212,255,${0.5 + 0.4 * btnGlow})`, transform: `scale(${1 + 0.03 * btnGlow})` }}>
              <span style={{ width: 16, height: 16, display: "flex" }}><Ic d={<path d="M4 12l5 5L20 6" />} size={16} /></span>
              Aprovar apuração
            </div>
          </div>
        </div>
      </AppShell>
      <Cursor x={curX} y={curY} opacity={curOp} />
      </CameraStage>
    </AbsoluteFill>
  );
};

export default CenaMemoriaCalculo;
