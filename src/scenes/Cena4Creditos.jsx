/**
 * Cena 4 — Créditos e fornecedores. Bloco 2:00–2:50.
 * Remotion · 1920x1080 · 30fps · 500 frames piloto.
 *
 * Mesma tela da Cena 3, com foco nas colunas de crédito (IBS R$ / CBS R$) e na
 * seção Custos Diretos (créditos recuperados). Abre o drawer da linha Manteiga
 * na aba Tratamento fiscal: crédito IBS/CBS integral, ICMS gera crédito,
 * alíquota 12%. Não dá close em centavos aproximados dos Custos.
 */
import React from "react";
import { LancamentosScreen, LANC } from "./lancamentosShared";

export const Cena4Creditos = () => {
  return (
    <LancamentosScreen
      activeTab={1}
      focus="custos"
      drawerRow={2}
      drawerTabIndex={4}
      drawerContent={LANC.tratamento}
      drawerStart={300}
      creditStart={140}
    />
  );
};

export default Cena4Creditos;
