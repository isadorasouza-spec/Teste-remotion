/**
 * Helpers de animação de "demo": câmera (zoom/pan sobre coordenadas de mundo
 * 1920x1080) e cursor de mouse com clique. Usados pelas cenas para dar
 * movimento de screencast (zoom em item, travelling, rolagem).
 */
import React from "react";
import { interpolate, Easing } from "remotion";
import { THEME } from "./tokens";

/* Transform de câmera: coloca o ponto de mundo (cx,cy) no centro da tela, escala s. */
export const camTransform = (cx, cy, s) =>
  `translate(${960 - cx * s}px, ${540 - cy * s}px) scale(${s})`;

/* Interpolação suave (ease in/out) sobre keyframes. */
export const kf = (frame, times, vals) =>
  interpolate(frame, times, vals, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

/* Wrapper de câmera: envolve o conteúdo da cena e aplica o transform. */
export const CameraStage = ({ cx, cy, s, children }) => (
  <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: camTransform(cx, cy, s) }}>
    {children}
  </div>
);

/* Cursor de mouse (ponteiro), com escala de "pressionar" no clique. */
export const Cursor = ({ x, y, press = 1, opacity = 1 }) => (
  <div style={{ position: "absolute", left: x - 6, top: y - 4, transform: `scale(${press})`, transformOrigin: "6px 4px",
    zIndex: 60, pointerEvents: "none", opacity, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))" }}>
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="M5 3 L5 19 L9.4 15.1 L12.2 21 L14.8 19.9 L12 14.1 L18 14 Z" fill="#fff" stroke="#0A1F3F" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  </div>
);

/* Onda de clique (ripple) num ponto. `p` vai de 0 a 1. */
export const ClickRipple = ({ x, y, p }) => {
  if (p <= 0 || p >= 1) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 12, height: 12, borderRadius: "50%",
      transform: `translate(-50%,-50%) scale(${1 + p * 6})`, border: `2px solid ${THEME.ciano}`, opacity: 1 - p,
      zIndex: 59, pointerEvents: "none" }} />
  );
};

/* Move o cursor de A para B entre [t0,t1], depois um clique em tClick. Retorna
 * {x,y,press,opacity,ripple} para desenhar. Coordenadas em mundo (tela cheia). */
export const useClickCursor = (frame, { from, to, t0, t1, tClick, appearAt }) => {
  const ease = Easing.out(Easing.cubic);
  const move = interpolate(frame, [t0, t1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  return {
    x: interpolate(move, [0, 1], [from.x, to.x]),
    y: interpolate(move, [0, 1], [from.y, to.y]),
    press: interpolate(frame, [tClick - 4, tClick + 1, tClick + 7], [1, 0.82, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    opacity: interpolate(frame, [appearAt, appearAt + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    ripple: interpolate(frame, [tClick, tClick + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  };
};
