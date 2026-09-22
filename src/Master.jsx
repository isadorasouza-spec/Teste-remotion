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
import { HookCard, HOOKS, CARD_DUR } from "./scenes/HookCard";

/* Um card de impacto por cena. */
const card = (i) => ({ id: `card${i}`, component: () => <HookCard data={HOOKS[i]} />, dur: CARD_DUR });

/* Durações piloto (frames @30fps). */
export const DURATIONS = {
  intro: 120, // 4s
  c1: 240, // 8s   (v4: cursor rápido + destaque 3D do cliente Vértice)
  c2: 250, // 8,3s (v4: cursor clica em "Notas" → abre a Cena 3)
  c3: 520, // 17,3s (v4: rolagem com zoom revelando as linhas de Receitas)
  c4: 500, // 16,7s (v4: seta clica nas colunas de crédito da Manteiga → drawer)
  c5: 380, // 12,7s (zoom em cada um dos 4 KPIs, mais rápido)
  c6: 620, // 20,7s (v4: zoom nos 5 KPIs + Comparativo anual + rolagem ao fluxo)
  c7: 380, // 12,7s (zoom + travelling seguindo o gráfico, mais rápido)
  outro: 130, // 4,3s
};

const WIPE = 20; // duração do RadarWipe

/* Sequência ordenada de segmentos: um card de impacto antecede cada tela. */
const SEGMENTS = [
  card(0), { id: "intro", component: IntroKontiva, dur: DURATIONS.intro },
  card(1), { id: "c1", component: Cena1Clientes, dur: DURATIONS.c1 },
  card(2), { id: "c2", component: Cena2Comparativo, dur: DURATIONS.c2 },
  card(3), { id: "c3", component: Cena3Lancamentos, dur: DURATIONS.c3 },
  card(4), { id: "c4", component: Cena4Creditos, dur: DURATIONS.c4 },
  card(5), { id: "c5", component: KontivaResultado, dur: DURATIONS.c5 },
  card(6), { id: "c6", component: Cena6Comparacao, dur: DURATIONS.c6 },
  card(7), { id: "c7", component: Cena7FluxoCaixa, dur: DURATIONS.c7 },
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
