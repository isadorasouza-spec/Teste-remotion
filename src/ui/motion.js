/**
 * Vocabulário de movimento compartilhado (seção 6 do PRD).
 * Extraído dos helpers de KontivaResultado.jsx para que todas as cenas de
 * dados usem exatamente a mesma motricidade. Toda animação é por frame —
 * nada de CSS transition/animation.
 */
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

export const easeOut = Easing.out(Easing.cubic);

/* Conta de 0 até value entre [start, start+dur], ease-out, tabular. */
export const useCountUp = (value, start, dur = 26) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  return value * p;
};

/* Entrada padrão: fade + subida, via spring (damping 200). */
export const useEnter = (appear, rise = 18) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - appear, fps, config: { damping: 200 } });
  return {
    opacity: interpolate(s, [0, 1], [0, 1]),
    y: interpolate(s, [0, 1], [rise, 0]),
  };
};
