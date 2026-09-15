/**
 * Master — encadeia o vídeo final.
 *
 * Ordem: Abertura, Cena 1..7, Encerramento, com um RadarWipe (20 frames)
 * centrado em cada corte (começa em corte-10). Os offsets são a soma das
 * durações; MASTER_DURATION é o total.
 *
 * Durações piloto na seção 7 do PRD. Havendo locução, ajustar cada duração ao
 * bloco do roteiro correspondente (mudar só DURATIONS abaixo).
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";

import { IntroKontiva, OutroKontiva, RadarWipe } from "./KontivaFraming";
import { KontivaResultado } from "./KontivaResultado";
import { Cena1Clientes } from "./scenes/Cena1Clientes";
import { Cena2Comparativo } from "./scenes/Cena2Comparativo";
import { Cena3Lancamentos } from "./scenes/Cena3Lancamentos";
import { Cena4Creditos } from "./scenes/Cena4Creditos";
import { Cena6Comparacao } from "./scenes/Cena6Comparacao";
import { Cena7FluxoCaixa } from "./scenes/Cena7FluxoCaixa";

/* Durações piloto (frames @30fps). */
export const DURATIONS = {
  intro: 120, // 4s
  c1: 300, // 10s
  c2: 300, // 10s
  c3: 600, // 20s
  c4: 500, // 16,7s
  c5: 300, // 10s
  c6: 500, // 16,7s
  c7: 320, // 10,7s
  outro: 130, // 4,3s
};

const WIPE = 20; // duração do RadarWipe

/* Sequência ordenada de segmentos (id + componente + duração). */
const SEGMENTS = [
  { id: "intro", component: IntroKontiva, dur: DURATIONS.intro },
  { id: "c1", component: Cena1Clientes, dur: DURATIONS.c1 },
  { id: "c2", component: Cena2Comparativo, dur: DURATIONS.c2 },
  { id: "c3", component: Cena3Lancamentos, dur: DURATIONS.c3 },
  { id: "c4", component: Cena4Creditos, dur: DURATIONS.c4 },
  { id: "c5", component: KontivaResultado, dur: DURATIONS.c5 },
  { id: "c6", component: Cena6Comparacao, dur: DURATIONS.c6 },
  { id: "c7", component: Cena7FluxoCaixa, dur: DURATIONS.c7 },
  { id: "outro", component: OutroKontiva, dur: DURATIONS.outro },
];

/* Offsets acumulados (frame inicial de cada segmento). */
const OFFSETS = SEGMENTS.reduce(
  (acc, s) => {
    acc.list.push(acc.sum);
    acc.sum += s.dur;
    return acc;
  },
  { sum: 0, list: [] }
);

export const MASTER_DURATION = OFFSETS.sum;

/* Cortes = fronteiras entre segmentos (início de cada segmento após o 1º). */
const CUTS = OFFSETS.list.slice(1);

export const Master = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A1F3F" }}>
      {SEGMENTS.map((s, i) => {
        const Comp = s.component;
        return (
          <Sequence key={s.id} from={OFFSETS.list[i]} durationInFrames={s.dur}>
            <Comp />
          </Sequence>
        );
      })}

      {/* RadarWipe centrado em cada corte (começa em corte-10). */}
      {CUTS.map((cut, i) => (
        <Sequence key={`wipe-${i}`} from={cut - WIPE / 2} durationInFrames={WIPE}>
          <RadarWipe />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export default Master;
