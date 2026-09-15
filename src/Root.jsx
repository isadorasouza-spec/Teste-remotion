/**
 * Root — registra todas as composições.
 *
 * Cada cena é uma composição isolada (para validação individual) e a
 * composição-mestre `Master` encadeia o vídeo final. Todas em 1920x1080 30fps.
 *
 * Durações piloto (seção 7 do PRD). Se houver locução gravada, ajustar as
 * durações aos blocos do roteiro. Os offsets do Master são calculados a partir
 * de DURATIONS em Master.jsx.
 */
import React from "react";
import { Composition } from "remotion";

import { IntroKontiva, OutroKontiva } from "./KontivaFraming";
import { KontivaResultado } from "./KontivaResultado";
import { Cena1Clientes } from "./scenes/Cena1Clientes";
import { Cena2Comparativo } from "./scenes/Cena2Comparativo";
import { Cena3Lancamentos } from "./scenes/Cena3Lancamentos";
import { Cena4Creditos } from "./scenes/Cena4Creditos";
import { Cena6Comparacao } from "./scenes/Cena6Comparacao";
import { Cena7FluxoCaixa } from "./scenes/Cena7FluxoCaixa";
import { Master, MASTER_DURATION, DURATIONS } from "./Master";

const V = { fps: 30, width: 1920, height: 1080 };

export const RemotionRoot = () => {
  return (
    <>
      {/* Composição-mestre: o vídeo final encadeado */}
      <Composition
        id="Master"
        component={Master}
        durationInFrames={MASTER_DURATION}
        {...V}
      />

      {/* Moldura de marca */}
      <Composition
        id="IntroKontiva"
        component={IntroKontiva}
        durationInFrames={DURATIONS.intro}
        {...V}
      />
      <Composition
        id="OutroKontiva"
        component={OutroKontiva}
        durationInFrames={DURATIONS.outro}
        {...V}
      />

      {/* Cenas de conteúdo (interface do produto) */}
      <Composition
        id="Cena1Clientes"
        component={Cena1Clientes}
        durationInFrames={DURATIONS.c1}
        {...V}
      />
      <Composition
        id="Cena2Comparativo"
        component={Cena2Comparativo}
        durationInFrames={DURATIONS.c2}
        {...V}
      />
      <Composition
        id="Cena3Lancamentos"
        component={Cena3Lancamentos}
        durationInFrames={DURATIONS.c3}
        {...V}
      />
      <Composition
        id="Cena4Creditos"
        component={Cena4Creditos}
        durationInFrames={DURATIONS.c4}
        {...V}
      />
      <Composition
        id="KontivaResultado"
        component={KontivaResultado}
        durationInFrames={DURATIONS.c5}
        {...V}
      />
      <Composition
        id="Cena6Comparacao"
        component={Cena6Comparacao}
        durationInFrames={DURATIONS.c6}
        {...V}
      />
      <Composition
        id="Cena7FluxoCaixa"
        component={Cena7FluxoCaixa}
        durationInFrames={DURATIONS.c7}
        {...V}
      />
    </>
  );
};
