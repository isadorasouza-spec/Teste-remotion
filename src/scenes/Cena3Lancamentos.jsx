/**
 * Cena 3 — Lançamentos e notas (2027), foco Receitas + drawer "Classificação
 * fiscal" da linha de exportação (NCM 1902.20.00, CST ICMS 40, CFOP 7102).
 * Bloco 1:00–2:00, 600 frames.
 */
import React from "react";
import { LancamentosScreen } from "./lancamentosShared";

export const Cena3Lancamentos = () => (
  <LancamentosScreen
    focus="receitas"
    drawerRow={0}
    drawerContent={{ kind: "classificacao" }}
    drawerStart={360}
    storyStart={200}
  />
);

export default Cena3Lancamentos;
