/**
 * Cena 4 — Créditos e fornecedores. Mesma tela da Cena 3, foco nas colunas de
 * crédito (IBS R$ / CBS R$) e na seção Custos Diretos (créditos recuperados),
 * com o drawer "Tratamento fiscal" da linha Manteiga (crédito IBS/CBS integral,
 * ICMS gera crédito, alíquota 12%). Bloco 2:00–2:50, 500 frames.
 */
import React from "react";
import { LancamentosScreen } from "./lancamentosShared";

export const Cena4Creditos = () => (
  <LancamentosScreen
    focus="custos"
    drawerRow={2}
    drawerContent={{ kind: "tratamento" }}
    drawerStart={300}
    creditStart={140}
  />
);

export default Cena4Creditos;
