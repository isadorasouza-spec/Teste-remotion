/**
 * Cena 5 — aba "Resultado" do editor de simulação (ResultadoPanel).
 * Recriada fiel a MvpSimulacaoEditorPage.tsx (blueaccount-ai): eyebrow "Visão
 * consolidada", 4 KPIs (Resumo executivo) com borda-esquerda de tom, e a tabela
 * "Apuração IBS/CBS" (Tributo · Base de receitas · Débitos · Base de custos/
 * despesas · Créditos · Saldo) com tfoot "Total IVA" em ciano-suave.
 *
 * Semântica de cor real: saldo a recolher = vermelho; a recuperar = verde.
 * Dados do Anexo A. Bloco 2:50–3:40, 300 frames.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { THEME, brl, pct } from "./ui/tokens";
import { useCountUp, useEnter } from "./ui/motion";
import { AppShell, SegmentedTabs } from "./ui/AppShell";

const DATA = {
  breadcrumb: ["Simulações", "VÉRTICE DISTRIBUIDORA ATACADISTA LTDA.", "NOTAS"],
  eyebrowEditor: "Simulação · reforma tributária IBS/CBS/ICMS/ISS",
  premissasLabel: "Premissas do cenário",
  premissas: ["2027", "MG", "IBS 0,10%", "CBS 9,20%"],
  tabs: ["Resultado", "Lançamentos e notas", "Fluxo de caixa"],
  eyebrow: "Visão consolidada",
  title: "Resultado da simulação",
  helper: "Os indicadores do cenário na ordem em que o motor os calcula. A formação do resultado abaixo abre cada passo, e as pendências fecham o painel.",
  kpis: [
    { label: "Margem bruta estimada", value: 701200, kind: "brl", tone: "positivo" },
    { label: "Resultado estimado do cenário", value: 379800, kind: "brl", tone: "positivo" },
    { label: "Carga tributária total (receita bruta)", value: 3.56, kind: "pct", tone: null },
    { label: "IVA líquido total", value: 46593, kind: "brl", tone: "positivo", detail: "a recuperar" },
  ],
  apTitle: "Apuração IBS/CBS",
  apSub: "IBS e CBS usam as mesmas bases elegíveis, com débitos, créditos e saldos apresentados separadamente.",
  apCols: ["Tributo", "Base de receitas", "Débitos", "Base de custos/despesas", "Créditos", "Saldo"],
  apRows: [
    { trib: "IBS", vals: [1600000, 484, 1115000, 985], saldo: 501, nota: "a recuperar", tone: "recuperar" },
    { trib: "CBS", vals: [1600000, 44528, 1115000, 90620], saldo: 46092, nota: "a recuperar", tone: "recuperar" },
  ],
  apTotal: { trib: "Total IVA", vals: [null, 45012, null, 91605], saldo: 46593, nota: "a recuperar", tone: "recuperar" },
};

const AP_FLEX = [1, 1.5, 1.2, 1.7, 1.2, 1.4];

const Kpi = ({ kpi, index }) => {
  const appear = 34 + index * 8;
  const { opacity, y } = useEnter(appear);
  const frame = useCurrentFrame();
  const counted = useCountUp(kpi.value, appear + 4, 26);
  const display = kpi.kind === "pct" ? pct(counted) : brl(counted);
  const toneBorder = kpi.tone === "positivo" ? THEME.green : kpi.tone === "negativo" ? THEME.red : THEME.cardBorder;
  const toneText = kpi.tone === "positivo" ? THEME.greenText : kpi.tone === "negativo" ? THEME.redText : THEME.navy;
  const isHero = kpi.detail === "a recuperar";
  const pulse = isHero ? interpolate(frame, [168, 182, 200], [0, 1, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <div style={{ flex: 1, background: THEME.pageBg, borderRadius: 10, border: `1px solid rgba(10,31,63,0.09)`,
      borderLeft: `3px solid ${toneBorder}`, padding: "16px 18px", opacity, transform: `translateY(${y}px)`,
      boxShadow: `0 0 0 ${2 * pulse}px rgba(22,163,74,${0.3 * pulse})` }}>
      <div style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 10.5, letterSpacing: "0.05em", textTransform: "uppercase",
        color: THEME.muted, lineHeight: 1.3, minHeight: 28 }}>{kpi.label}</div>
      <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 30, letterSpacing: "-0.025em", color: toneText,
        marginTop: 12, fontVariantNumeric: "tabular-nums" }}>{display}</div>
      {kpi.detail && (
        <div style={{ fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 11.5, color: THEME.green, marginTop: 5 }}>{kpi.detail}</div>
      )}
    </div>
  );
};

const ApCell = ({ children, flex, align = "right", strong, color }) => (
  <div style={{ flex, textAlign: align, fontFamily: THEME.fontMono, fontWeight: strong ? 700 : 500, fontSize: 13,
    color: color || THEME.body, fontVariantNumeric: "tabular-nums" }}>{children}</div>
);

const ApRow = ({ row, index, isFoot }) => {
  const appear = 92 + index * 12;
  const { opacity, y } = useEnter(isFoot ? 128 : appear);
  const v = row.vals.map((val, i) => useCountUp(val ?? 0, (isFoot ? 132 : appear) + 4 + i * 2, 22));
  const saldo = useCountUp(row.saldo, (isFoot ? 138 : appear) + 8, 24);
  const saldoColor = row.tone === "recuperar" ? THEME.green : THEME.red;
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "16px 18px",
      borderTop: `1px solid ${THEME.hairline}`, opacity, transform: `translateY(${y}px)`,
      background: isFoot ? THEME.cianoSoft : "transparent" }}>
      <ApCell flex={AP_FLEX[0]} align="left" strong color={THEME.navy}>{row.trib}</ApCell>
      <ApCell flex={AP_FLEX[1]}>{row.vals[0] == null ? "" : brl(v[0])}</ApCell>
      <ApCell flex={AP_FLEX[2]} strong={isFoot}>{brl(v[1])}</ApCell>
      <ApCell flex={AP_FLEX[3]}>{row.vals[2] == null ? "" : brl(v[2])}</ApCell>
      <ApCell flex={AP_FLEX[4]} strong={isFoot}>{brl(v[3])}</ApCell>
      <div style={{ flex: AP_FLEX[5], textAlign: "right" }}>
        <div style={{ fontFamily: THEME.fontMono, fontWeight: 700, fontSize: 13.5, color: saldoColor, fontVariantNumeric: "tabular-nums" }}>{brl(saldo)}</div>
        <div style={{ fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 10, color: saldoColor, marginTop: 2 }}>{row.nota}</div>
      </div>
    </div>
  );
};

const Header = () => {
  const eb = useEnter(16);
  const tt = useEnter(20, 18);
  const hp = useEnter(24);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
      <div>
        <div style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 10.5, letterSpacing: "0.05em", textTransform: "uppercase",
          color: THEME.muted, opacity: eb.opacity, transform: `translateY(${eb.y}px)` }}>{DATA.eyebrow}</div>
        <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 40, letterSpacing: "-0.03em", color: THEME.navy,
          marginTop: 8, opacity: tt.opacity, transform: `translateY(${tt.y}px)` }}>{DATA.title}</div>
      </div>
      <div style={{ maxWidth: 470, textAlign: "right", fontFamily: THEME.fontBody, fontSize: 14, lineHeight: 1.5,
        color: THEME.muted, opacity: hp.opacity }}>{DATA.helper}</div>
    </div>
  );
};

export const KontivaResultado = () => {
  return (
    <AbsoluteFill style={{ background: THEME.pageBg }}>
      <AppShell breadcrumb={DATA.breadcrumb} contentPadding="26px 34px">
        <div style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: THEME.muted }}>
          {DATA.eyebrowEditor}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
          <SegmentedTabs tabs={DATA.tabs} activeIndex={0} appear={10} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: THEME.surface, border: `1px solid ${THEME.cardBorder}`,
            padding: "9px 16px", borderRadius: 10 }}>
            <span style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: THEME.muted }}>{DATA.premissasLabel}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {DATA.premissas.map((p, i) => (
                <React.Fragment key={p}>
                  {i > 0 && <span style={{ color: THEME.muted, opacity: 0.5 }}>·</span>}
                  <span style={{ fontFamily: THEME.fontBody, fontWeight: 700, fontSize: 13, color: THEME.navy }}>{p}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, background: THEME.surface, borderRadius: 18, border: `1px solid ${THEME.cardBorder}`,
          boxShadow: THEME.cardShadow, padding: "30px 34px" }}>
          <Header />
          <div style={{ display: "flex", gap: 16 }}>
            {DATA.kpis.map((k, i) => <Kpi key={k.label} kpi={k} index={i} />)}
          </div>

          <div style={{ marginTop: 30 }}>
            <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 19, color: THEME.navy }}>{DATA.apTitle}</div>
            <div style={{ fontFamily: THEME.fontBody, fontSize: 14, color: THEME.muted, marginTop: 6 }}>{DATA.apSub}</div>
            <div style={{ marginTop: 16, border: `1px solid ${THEME.cardBorder}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "flex", padding: "12px 18px", background: THEME.pageBg }}>
                {DATA.apCols.map((c, i) => (
                  <div key={c} style={{ flex: AP_FLEX[i], textAlign: i === 0 ? "left" : "right", fontFamily: THEME.fontMono,
                    fontWeight: 700, fontSize: 9.5, letterSpacing: "0.05em", textTransform: "uppercase", color: THEME.muted }}>{c}</div>
                ))}
              </div>
              {DATA.apRows.map((r, i) => <ApRow key={r.trib} row={r} index={i} />)}
              <ApRow row={DATA.apTotal} index={0} isFoot />
            </div>
          </div>
        </div>
      </AppShell>
    </AbsoluteFill>
  );
};

export default KontivaResultado;
