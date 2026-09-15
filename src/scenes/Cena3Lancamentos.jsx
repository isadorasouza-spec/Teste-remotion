/**
 * Cena 3 — Lançamentos e notas (2027), foco em Receitas. Bloco 1:00–2:00.
 * Remotion · 1920x1080 · 30fps · 600 frames piloto.
 *
 * Anima premissas, abas e a seção Receitas revelando as 6 linhas com as colunas
 * contando; realça as linhas que a locução cita (exportação sem débito, cesta
 * básica a 40%, salmão integral) e abre o drawer da linha de exportação na aba
 * Classificação fiscal (NCM 1902.20.00, CST ICMS 40, CFOP 7102, NBS vazio).
 */
import React from "react";
import { LancamentosScreen, LANC } from "./lancamentosShared";

export const Cena3Lancamentos = () => {
  return (
    <LancamentosScreen
      activeTab={1}
      focus="receitas"
      drawerRow={0}
      drawerTabIndex={1}
      drawerContent={LANC.classificacao}
      drawerStart={360}
      calloutStart={200}
    />
  );
};

export default Cena3Lancamentos;
