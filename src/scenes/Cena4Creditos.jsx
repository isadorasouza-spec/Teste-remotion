/**
 * Cena 4 — Créditos e fornecedores. Mesma tela da Cena 3, foco nas colunas de
 * crédito (IBS R$ / CBS R$, grifadas em azul). Animação (v4): uma seta do mouse
 * clica nas colunas de crédito da linha Manteiga e aí abre o drawer "Tratamento
 * fiscal" (crédito IBS/CBS integral, ICMS gera crédito, alíquota 12%).
 * Bloco ~0:46–1:02.
 */
import React from "react";
import { LancamentosScreen } from "./lancamentosShared";

export const Cena4Creditos = () => (
  <LancamentosScreen
    mode="cursor"
    focus="custos"
    drawerRow={2}
    drawerContent={{ kind: "tratamento" }}
    drawerStart={140}
    creditStart={40}
  />
);

export default Cena4Creditos;
