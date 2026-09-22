/**
 * Cena 2 — Página do cliente (Vértice): grupo "Comparativo Reforma".
 * Recriada fiel a MvpSimulacaoClientePage.tsx + SimGroupSection/SimulacaoRow.
 * Bloco 0:30–1:00, 300 frames. Herói: contraste da carga 3,56% x 2,34%.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { THEME, brl, pct } from "../ui/tokens";
import { useCountUp, useEnter } from "../ui/motion";
import { AppShell, ClientTabs, Ic, ICON } from "../ui/AppShell";
import { Cursor, ClickRipple, useClickCursor } from "../ui/anim";

const DATA = {
  breadcrumb: ["Simulações", "VÉRTICE DISTRIBUIDORA ATACADISTA LTDA."],
  eyebrow: "Reforma tributária",
  title: "Vértice Distribuidora Atacadista Ltda.",
  desc: "Simulações e grupos criados para este cliente.",
  btnPrimary: "Nova simulação",
  tabs: ["Grupos (1)", "Individuais (0)"],
  searchPlaceholder: "Buscar simulação ou grupo",
  manage: "Gerenciar grupos",
  group: { nome: "Comparativo Reforma", cor: "#E0F9FF", count: 2 },
  viewGroup: "Ver análise",
  refresh: "Atualizar todas",
  cols: ["Simulação", "Resultado", "Grupos", "Ano", "Débitos · Créditos", "Carga tributária"],
  rows: [
    { nome: "Notas", sid: "SIM-01A039", atualizado: "02/09/2026", resultado: 379800, ano: "2027", debitos: 225812, creditos: 167205, carga: 3.56 },
    { nome: "Notas (2029)", sid: "SIM-01A063", atualizado: "02/09/2026", resultado: 390320, ano: "2029", debitos: 216782.8, creditos: 178064.5, carga: 2.34 },
  ],
};

const GRID = "2.2fr 1.3fr 1.6fr 1fr 1.3fr 1.1fr 44px";

const SimRow = ({ row, index, heroPulse, clickHi }) => {
  const appear = 58 + index * 16;
  const { opacity, y } = useEnter(appear);
  const resultado = useCountUp(row.resultado, appear + 6, 24);
  const debitos = useCountUp(row.debitos, appear + 8, 24);
  const creditos = useCountUp(row.creditos, appear + 10, 24);
  const carga = useCountUp(row.carga, appear + 12, 24);

  return (
    <div style={{ display: "grid", gridTemplateColumns: GRID, alignItems: "center", gap: 12,
      padding: "18px 22px", borderTop: `1px solid ${THEME.cardBorder}`, opacity, transform: `translateY(${y}px)`,
      background: clickHi ? `rgba(0,212,255,${0.14 * clickHi})` : "transparent" }}>
      {/* Simulação */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ position: "relative", width: 40, height: 46, borderRadius: 6, background: THEME.pageBg,
          border: `1px solid ${THEME.cardBorder}`, flexShrink: 0, display: "flex", alignItems: "flex-end",
          justifyContent: "center", paddingBottom: 6 }}>
          <span style={{ fontFamily: THEME.fontMono, fontWeight: 700, fontSize: 9, color: THEME.muted }}>SIM</span>
        </div>
        <div>
          <div style={{ fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 15.5, color: THEME.navy }}>{row.nome}</div>
          <div style={{ fontFamily: THEME.fontMono, fontSize: 11.5, color: THEME.muted, marginTop: 3 }}>
            {row.sid} · Atualizado {row.atualizado}
          </div>
        </div>
      </div>
      {/* Resultado highlight */}
      <div style={{ background: THEME.pageBg, borderRadius: 8, padding: "8px 12px" }}>
        <div style={{ fontFamily: THEME.fontBody, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: THEME.muted }}>Resultado</div>
        <div style={{ fontFamily: THEME.fontMono, fontWeight: 700, fontSize: 15, color: THEME.green,
          fontVariantNumeric: "tabular-nums", marginTop: 2 }}>{brl(resultado)}</div>
      </div>
      {/* Grupos */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: THEME.fontBody, fontWeight: 600,
          fontSize: 11, background: THEME.accentPillBg, color: THEME.accentPillText, padding: "4px 9px", borderRadius: 6 }}>
          <span style={{ width: 12, height: 12, display: "flex" }}><Ic d={ICON.sheet} size={12} /></span>Simulações
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: THEME.fontBody, fontWeight: 600,
          fontSize: 11, background: DATA.group.cor, color: THEME.navy, padding: "4px 10px", borderRadius: 999 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: THEME.ciano }} />{DATA.group.nome}
        </div>
      </div>
      {/* Ano */}
      <div style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 14, color: THEME.navy, fontVariantNumeric: "tabular-nums" }}>{row.ano}</div>
      {/* Débitos · Créditos */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <span style={{ fontFamily: THEME.fontMono, fontWeight: 700, fontSize: 9.5, color: THEME.red, width: 26 }}>Déb</span>
          <span style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 13.5, color: THEME.red, fontVariantNumeric: "tabular-nums" }}>{brl(debitos)}</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <span style={{ fontFamily: THEME.fontMono, fontWeight: 700, fontSize: 9.5, color: THEME.green, width: 26 }}>Cré</span>
          <span style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 13.5, color: THEME.green, fontVariantNumeric: "tabular-nums" }}>{brl(creditos)}</span>
        </div>
      </div>
      {/* Carga tributária (herói) */}
      <div style={{ justifySelf: "start", padding: "6px 12px", borderRadius: 8,
        background: `rgba(220,38,38,${0.06 + 0.12 * heroPulse})`,
        boxShadow: `0 0 0 ${2 * heroPulse}px rgba(220,38,38,${0.28 * heroPulse})` }}>
        <span style={{ fontFamily: THEME.fontMono, fontWeight: 700, fontSize: 15, color: THEME.red, fontVariantNumeric: "tabular-nums" }}>{pct(carga)}</span>
      </div>
      {/* actions */}
      <div style={{ justifySelf: "center", color: THEME.muted, fontSize: 20, fontWeight: 700, letterSpacing: 1 }}>⋯</div>
    </div>
  );
};

export const Cena2Comparativo = () => {
  const frame = useCurrentFrame();
  const eb = useEnter(8);
  const title = useEnter(12, 18);
  const desc = useEnter(16);
  const card = useEnter(38);
  const heroPulse = interpolate(frame, [104, 120, 250], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // cursor: no fim da cena, clica na simulação "Notas" (linha 0) → abre a Cena 3
  const cur = useClickCursor(frame, {
    from: { x: 1500, y: 360 }, to: { x: 470, y: 501 }, t0: 150, t1: 182, tClick: 188, appearAt: 146,
  });
  const clickHi = interpolate(frame, [186, 196, 230], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: THEME.pageBg }}>
      <AppShell breadcrumb={DATA.breadcrumb}>
        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: eb.opacity, transform: `translateY(${eb.y}px)` }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: THEME.ciano }} />
              <span style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 12, letterSpacing: "0.12em",
                textTransform: "uppercase", color: THEME.muted }}>{DATA.eyebrow}</span>
            </div>
            <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 38, letterSpacing: "-0.03em",
              color: THEME.navy, marginTop: 12, opacity: title.opacity, transform: `translateY(${title.y}px)` }}>{DATA.title}</div>
            <div style={{ fontFamily: THEME.fontBody, fontSize: 16, color: THEME.muted, marginTop: 10,
              opacity: desc.opacity, transform: `translateY(${desc.y}px)` }}>{DATA.desc}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 22px", borderRadius: 10,
            background: THEME.ciano, color: THEME.navy, fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 14,
            boxShadow: "0 10px 30px -10px rgba(0,212,255,0.7)", opacity: desc.opacity }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>{DATA.btnPrimary}
          </div>
        </div>

        {/* tabs + toolbar */}
        <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <ClientTabs tabs={DATA.tabs} activeIndex={0} appear={22} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, background: THEME.surface,
            border: `1px solid ${THEME.border}`, borderRadius: 10, padding: "12px 16px", opacity: card.opacity }}>
            <span style={{ width: 18, height: 18, display: "flex", color: THEME.muted }}><Ic d={ICON.search} size={18} /></span>
            <span style={{ fontFamily: THEME.fontBody, fontSize: 15, color: THEME.muted }}>{DATA.searchPlaceholder}</span>
          </div>
          <div style={{ fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 13, color: THEME.navy, background: THEME.surface,
            border: `1px solid ${THEME.border}`, padding: "11px 16px", borderRadius: 7, opacity: card.opacity }}>{DATA.manage}</div>
        </div>

        {/* group card */}
        <div style={{ marginTop: 18, background: THEME.surface, border: `1px solid ${THEME.cardBorder}`, borderRadius: 12,
          boxShadow: THEME.cardShadow, overflow: "hidden", opacity: card.opacity, transform: `translateY(${card.y}px)` }}>
          {/* section heading */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px",
            borderBottom: `1px solid ${THEME.cardBorder}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 12, height: 12, borderRadius: 4, background: DATA.group.cor }} />
              <span style={{ fontFamily: THEME.fontBody, fontWeight: 700, fontSize: 16, color: THEME.navy }}>{DATA.group.nome}</span>
              <span style={{ fontFamily: THEME.fontBody, fontSize: 13, color: THEME.muted }}>({DATA.group.count})</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 11.5,
                color: THEME.navy, border: `1px solid ${THEME.cardBorder}`, borderRadius: 6, padding: "8px 12px" }}>
                <span style={{ width: 13, height: 13, display: "flex", color: THEME.muted }}><Ic d={ICON.radar} size={13} /></span>{DATA.viewGroup}
              </div>
              <div style={{ fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 11.5, color: THEME.navy,
                border: `1px solid ${THEME.cardBorder}`, borderRadius: 6, padding: "8px 12px" }}>{DATA.refresh}</div>
            </div>
          </div>
          {/* column header */}
          <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 12, padding: "12px 22px", background: "#FBFCFE" }}>
            {DATA.cols.map((c) => (
              <div key={c} style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 10.5, letterSpacing: "0.1em",
                textTransform: "uppercase", color: THEME.muted }}>{c}</div>
            ))}
            <div />
          </div>
          {DATA.rows.map((r, i) => <SimRow key={r.sid} row={r} index={i} heroPulse={heroPulse} clickHi={i === 0 ? clickHi : 0} />)}
        </div>
      </AppShell>
      <ClickRipple x={470} y={501} p={cur.ripple} />
      {cur.opacity > 0 && <Cursor x={cur.x} y={cur.y} press={cur.press} opacity={cur.opacity} />}
    </AbsoluteFill>
  );
};

export default Cena2Comparativo;
