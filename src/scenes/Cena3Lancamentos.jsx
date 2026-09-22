/**
 * Cena 3 — Lançamentos e notas (2027), foco Receitas. Bloco ~0:26–0:46.
 * Animação (v4): a tela abre e a "câmera" rola para baixo com zoom, revelando
 * as linhas de Receitas uma a uma (Massa, Pão, Manteiga, ...) até os totais e a
 * seção Custos Diretos, depois volta ao enquadramento cheio.
 */
import React from "react";
import { LancamentosScreen } from "./lancamentosShared";

export const Cena3Lancamentos = () => (
  <LancamentosScreen mode="scroll" focus="receitas" drawerRow={null} />
);

export default Cena3Lancamentos;
