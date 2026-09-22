/**
 * Cena 1 — "Simulações" home / lista de clientes. Bloco 0:00–0:30.
 * Recriada fiel a MvpSimulacoesPage.tsx (blueaccount-ai). 360 frames.
 *
 * Animação extra (v3): o cursor do mouse desliza até o cliente Vértice (o que
 * será aberto na Cena 2), clica, e a linha salta "para frente" num efeito 3D
 * (perspective + translateZ), enquanto as outras recuam e escurecem.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { THEME } from "../ui/tokens";
import { useCountUp, useEnter } from "../ui/motion";
import { AppShell, Ic, ICON } from "../ui/AppShell";
import { Cursor, ClickRipple, useClickCursor } from "../ui/anim";

const SELECTED = 4; // Vértice

const DATA = {
  breadcrumb: ["Simulações", "Cenários tributários"],
  betaBadge: "Estimativa de apoio",
  betaText:
    "Valores finais das alíquotas e datas da reforma ainda podem sofrer mudanças. Os resultados são estimativas de apoio e não substituem a análise do profissional responsável.",
  eyebrow: "Reforma tributária",
  titleA: "Escolha um ",
  titleAccent: "cliente",
  titleB: " para ver as simulações.",
  desc: "Só aparecem aqui os clientes que já têm alguma simulação tributária criada.",
  btnGhost: "Ver cronograma",
  btnPrimary: "Nova simulação",
  searchPlaceholder: "Buscar cliente, simulação ou grupo",
  count: 5,
  cta: "Ver simulações",
  clients: [
    { ini: "BM", nome: "Bella Moda Indústria Têxtil Ltda.", sims: 2, grupos: 0 },
    { ini: "BS", nome: "Brasa Sul Indústria de Alimentos Ltda.", sims: 11, grupos: 1 },
    { ini: "CA", nome: "Construtora Atlas Ltda.", sims: 1, grupos: 0 },
    { ini: "MS", nome: "MobiTech Soluções Digitais Ltda.", sims: 7, grupos: 2 },
    { ini: "VD", nome: "Vértice Distribuidora Atacadista Ltda.", sims: 5, grupos: 1 },
  ],
};

const Metric = ({ value, label }) => (
  <div style={{ textAlign: "left" }}>
    <div style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 15, color: THEME.navy, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    <div style={{ fontFamily: THEME.fontBody, fontSize: 11, color: THEME.muted, marginTop: 2 }}>{label}</div>
  </div>
);

const ClientCard = ({ c, index, sel }) => {
  const appear = 46 + index * 9;
  const { opacity, y } = useEnter(appear);
  const isSel = index === SELECTED;
  // efeito 3D: selecionado avança (translateZ, escala, sombra, borda ciano); os demais recuam e escurecem
  const lift = isSel
    ? { tz: 70 * sel, scale: 1 + 0.04 * sel, shadow: sel, border: sel, z: 10, dim: 0 }
    : { tz: -26 * sel, scale: 1 - 0.03 * sel, shadow: 0, border: 0, z: 1, dim: 0.55 * sel };
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr auto", alignItems: "center", gap: 20,
      background: THEME.surface, border: `1px solid ${lift.border ? THEME.ciano : THEME.cardBorder}`, borderRadius: 12,
      padding: "16px 20px", position: "relative", zIndex: lift.z,
      opacity: opacity * (1 - lift.dim), transform: `translateY(${y}px) translateZ(${lift.tz}px) scale(${lift.scale})`,
      boxShadow: lift.shadow ? `0 ${30 * lift.shadow}px ${60 * lift.shadow}px -${20 * lift.shadow}px rgba(10,31,63,0.45), 0 0 0 ${1 * lift.border}px rgba(0,212,255,0.5)` : "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 46, height: 46, borderRadius: 10, background: isSel && sel > 0.3 ? THEME.ciano : "rgba(10,31,63,0.08)",
          color: THEME.navy, fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 15,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{c.ini}</div>
        <div style={{ fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 16, color: THEME.navy }}>{c.nome}</div>
      </div>
      <Metric value={c.sims} label={c.sims === 1 ? "simulação" : "simulações"} />
      <Metric value={c.grupos} label={c.grupos === 1 ? "grupo" : "grupos"} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 999,
        background: isSel && sel > 0.3 ? THEME.ciano : "rgba(10,31,63,0.04)",
        color: isSel && sel > 0.3 ? THEME.navy : THEME.muted, fontFamily: THEME.fontBody, fontWeight: 600,
        fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {DATA.cta}<span style={{ width: 14, height: 14, display: "flex" }}><Ic d={ICON.chevron} size={14} /></span>
      </div>
    </div>
  );
};

export const Cena1Clientes = () => {
  const frame = useCurrentFrame();
  const beta = useEnter(4);
  const eb = useEnter(12);
  const title = useEnter(16, 18);
  const desc = useEnter(22);
  const actions = useEnter(24);
  const search = useEnter(34);

  const count = Math.round(useCountUp(DATA.count, 40, 16));

  // cursor: entra ~104, desliza rápido até a linha da Vértice, clica ~140
  const cur = useClickCursor(frame, {
    from: { x: 1360, y: 430 }, to: { x: 1784, y: 760 },
    t0: 106, t1: 134, tClick: 140, appearAt: 100,
  });
  const sel = interpolate(frame, [144, 168], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: THEME.pageBg }}>
      <AppShell breadcrumb={DATA.breadcrumb}>
        {/* banner beta */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: THEME.betaBg, border: `1px solid ${THEME.betaBorder}`,
          borderRadius: 10, padding: "10px 14px", opacity: beta.opacity, transform: `translateY(${beta.y}px)` }}>
          <div style={{ fontFamily: THEME.fontBody, fontWeight: 700, fontSize: 11, letterSpacing: "0.04em", color: THEME.betaBadgeText,
            background: THEME.betaBadgeBg, padding: "4px 10px", borderRadius: 7, flexShrink: 0 }}>{DATA.betaBadge}</div>
          <div style={{ fontFamily: THEME.fontBody, fontSize: 13.5, color: "#7A6524", lineHeight: 1.4 }}>{DATA.betaText}</div>
        </div>

        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 26 }}>
          <div style={{ maxWidth: 940 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: eb.opacity, transform: `translateY(${eb.y}px)` }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: THEME.ciano }} />
              <span style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: THEME.muted }}>{DATA.eyebrow}</span>
            </div>
            <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 42, letterSpacing: "-0.03em", color: THEME.navy,
              marginTop: 14, lineHeight: 1.08, opacity: title.opacity, transform: `translateY(${title.y}px)` }}>
              {DATA.titleA}<span style={{ fontFamily: THEME.fontSerif, fontStyle: "italic", fontWeight: 400 }}>{DATA.titleAccent}</span>{DATA.titleB}
            </div>
            <div style={{ fontFamily: THEME.fontBody, fontSize: 16, color: THEME.muted, marginTop: 12, opacity: desc.opacity, transform: `translateY(${desc.y}px)` }}>{DATA.desc}</div>
          </div>
          <div style={{ display: "flex", gap: 12, opacity: actions.opacity, transform: `translateY(${actions.y}px)`, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 20px", borderRadius: 10, border: `1px solid ${THEME.border}`,
              color: THEME.navy, fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 14 }}>
              <span style={{ width: 16, height: 16, display: "flex", color: THEME.muted }}><Ic d={ICON.sheet} size={16} /></span>{DATA.btnGhost}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 22px", borderRadius: 10, background: THEME.ciano,
              color: THEME.navy, fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 14, boxShadow: "0 10px 30px -10px rgba(0,212,255,0.7)" }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>{DATA.btnPrimary}
            </div>
          </div>
        </div>

        {/* toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 28, opacity: search.opacity, transform: `translateY(${search.y}px)` }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 10, padding: "13px 16px" }}>
            <span style={{ width: 18, height: 18, display: "flex", color: THEME.muted }}><Ic d={ICON.search} size={18} /></span>
            <span style={{ fontFamily: THEME.fontBody, fontSize: 15, color: THEME.muted }}>{DATA.searchPlaceholder}</span>
          </div>
          <div style={{ fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 13, color: THEME.navy, background: THEME.surface,
            border: `1px solid ${THEME.cardBorder}`, padding: "11px 16px", borderRadius: 7, fontVariantNumeric: "tabular-nums" }}>{count} clientes</div>
        </div>

        {/* lista (com perspectiva 3D) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 18, perspective: 1600, perspectiveOrigin: "70% 80%" }}>
          {DATA.clients.map((c, i) => <ClientCard key={c.ini} c={c} index={i} sel={sel} />)}
        </div>
      </AppShell>

      <ClickRipple x={1784} y={760} p={cur.ripple} />
      {cur.opacity > 0 && <Cursor x={cur.x} y={cur.y} press={cur.press} opacity={cur.opacity} />}
    </AbsoluteFill>
  );
};

export default Cena1Clientes;
