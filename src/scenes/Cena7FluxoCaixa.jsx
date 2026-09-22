/**
 * Cena 7 — aba "Fluxo de caixa" do editor. Recriada fiel a FluxoCaixaPanel
 * (MvpSimulacaoEditorPage.tsx): checkbox de split payment, gráfico combinado
 * (barras "Saldo do mês" verde/vermelha + linha "Saldo acumulado" navy) e a
 * tabela mensal de 8 colunas. Respeita as lacunas reais de meses; meses 07/08
 * (aprox) ficam de-enfatizados. Bloco 4:30–4:48, 320 frames.
 *
 * Pendência PRD: "cashback de até 540 dias" não existe na tela; não inventado.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { THEME, brl } from "../ui/tokens";
import { useCountUp, useEnter } from "../ui/motion";
import { AppShell, SegmentedTabs } from "../ui/AppShell";

const POS = "#16A34A";
const NEG = "#DC2626";
const LINE = "#0A1F3F";

const DATA = {
  breadcrumb: ["Simulações", "VÉRTICE DISTRIBUIDORA ATACADISTA LTDA.", "NOTAS"],
  tabs: ["Resultado", "Lançamentos e notas", "Fluxo de caixa"],
  title: "Fluxo de caixa",
  checkbox: "Simular split payment do IBS/CBS em 2027",
  desc: "Entradas, saídas e saldo tributário mês a mês.",
  meses: ["2027-02", "2027-03", "2027-04", "2027-05", "2027-06", "2027-07", "2027-08", "2027-09", "2028-09", "2028-11", "2029-01", "2029-02"],
  saldoMes: [-209856, 467608, -391700, -51432, -100115, null, null, null, null, null, null, null],
  saldoAcum: [-209856, 257752, -133948, -185380, -285495, null, null, null, null, null, null, null],
  cols: ["Mês", "Entrada operacional", "Saída operacional", "Débito de tributo pago", "Crédito de tributo utilizado", "Saldo credor acumulado", "Saldo do mês", "Saldo acumulado"],
  rows: [
    { mes: "2027-02", vals: [0, 209856, 0, 0, 0, -209856, -209856] },
    { mes: "2027-03", vals: [913108, 491850, -32400, 13950, 13950, 467608, 257752] },
    { mes: "2027-04", vals: [0, 266042, 134400, 8742, 22692, -391700, -133948] },
    { mes: "2027-05", vals: [0, 62232, -10800, 0, 22692, -51432, -185380] },
    { mes: "2027-06", vals: [0, 100115, 0, 0, 22692, -100115, -285495] },
    { mes: "2027-07", vals: [null, null, null, null, null, null, null], aprox: true },
    { mes: "2027-08", vals: [null, null, null, null, null, null, null], aprox: true },
  ],
};

const COL_FLEX = [1.0, 1.35, 1.35, 1.35, 1.5, 1.4, 1.25, 1.3];
const YMAX = 500000;
const signedBrl = (n) => (n < 0 ? `-${brl(Math.abs(n))}` : brl(n));

const Chart = () => {
  const frame = useCurrentFrame();
  const enter = useEnter(18);
  const W = 1220, H = 340, padL = 118, padR = 20, padT = 14, padB = 40;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const n = DATA.meses.length, colW = plotW / n;
  const zeroY = padT + plotH / 2;
  const cx = (i) => padL + colW * (i + 0.5);
  const vY = (v) => zeroY - (v / YMAX) * (plotH / 2);
  const yTicks = [500000, 250000, 0, -250000, -500000];
  const confirmed = DATA.saldoAcum.map((v, i) => (v == null ? null : { x: cx(i), y: vY(v) })).filter(Boolean);
  const pathD = confirmed.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const lineProg = interpolate(frame, [66, 116], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ opacity: enter.opacity, transform: `translateY(${enter.y}px)` }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={vY(t)} y2={vY(t)} stroke="rgba(10,31,63,0.08)" strokeWidth={1} strokeDasharray="3 3" />
            <text x={padL - 12} y={vY(t) + 4} textAnchor="end" fontFamily={THEME.fontMono} fontSize={11} fill={THEME.muted}>
              {t === 0 ? "R$ 0,00" : signedBrl(t)}
            </text>
          </g>
        ))}
        <line x1={padL} x2={W - padR} y1={zeroY} y2={zeroY} stroke="rgba(10,31,63,0.2)" strokeWidth={1.2} />
        {DATA.saldoMes.map((v, i) => {
          if (v == null) return <rect key={i} x={cx(i) - colW * 0.22} y={zeroY - 5} width={colW * 0.44} height={10} rx={3} fill="#EDF0F5" />;
          const grow = interpolate(frame, [36 + i * 7, 50 + i * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const full = vY(v), h = Math.abs(full - zeroY) * grow, y = v >= 0 ? zeroY - h : zeroY;
          return <rect key={i} x={cx(i) - colW * 0.26} y={y} width={colW * 0.52} height={h} rx={3} fill={v >= 0 ? POS : NEG} />;
        })}
        <path d={pathD} fill="none" stroke={LINE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lineProg} />
        {confirmed.map((p, i) => {
          const show = interpolate(frame, [66 + i * 10, 74 + i * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={LINE} opacity={show} />;
        })}
        {DATA.meses.map((l, i) => (
          <text key={l} x={cx(i)} y={H - 14} textAnchor="middle" fontFamily={THEME.fontMono} fontSize={10.5} fill={i < 5 ? THEME.body : THEME.muted}>{l}</text>
        ))}
      </svg>
    </div>
  );
};

const TableRow = ({ row, index }) => {
  const appear = 150 + index * 12;
  const { opacity, y } = useEnter(appear);
  const counted = row.vals.map((v, i) => useCountUp(v ?? 0, appear + 4 + i, 18));
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "11px 18px", borderTop: `1px solid ${THEME.hairline}`,
      opacity, transform: `translateY(${y}px)`, background: row.aprox ? "#FAFBFD" : "transparent" }}>
      <div style={{ flex: COL_FLEX[0], fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 14, color: row.aprox ? THEME.muted : THEME.navy }}>{row.mes}</div>
      {row.vals.map((v, i) => {
        if (v == null) return <div key={i} style={{ flex: COL_FLEX[i + 1], textAlign: "right", fontFamily: THEME.fontMono, fontSize: 13, color: "#C2C8D6" }}>—</div>;
        const isSaldo = i >= 5;
        const color = isSaldo ? (v < 0 ? NEG : v > 0 ? POS : THEME.body) : THEME.body;
        return (
          <div key={i} style={{ flex: COL_FLEX[i + 1], textAlign: "right", fontFamily: THEME.fontMono, fontWeight: isSaldo ? 700 : 500,
            fontSize: 12.5, color, fontVariantNumeric: "tabular-nums" }}>{signedBrl(counted[i])}</div>
        );
      })}
    </div>
  );
};

const Legend = () => (
  <div style={{ display: "flex", gap: 24, alignItems: "center", paddingLeft: 6, marginBottom: 6 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 14, height: 14, borderRadius: 3, background: POS }} />
      <span style={{ fontFamily: THEME.fontBody, fontSize: 12.5, color: THEME.body }}>Saldo do mês</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 22, height: 3, borderRadius: 2, background: LINE }} />
      <span style={{ fontFamily: THEME.fontBody, fontSize: 12.5, color: THEME.body }}>Saldo acumulado</span>
    </div>
  </div>
);

export const Cena7FluxoCaixa = () => {
  const head = useEnter(8, 18);
  return (
    <AbsoluteFill style={{ background: THEME.pageBg }}>
      <AppShell breadcrumb={DATA.breadcrumb} contentPadding="24px 34px">
        <SegmentedTabs tabs={DATA.tabs} activeIndex={2} appear={6} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18,
          opacity: head.opacity, transform: `translateY(${head.y}px)` }}>
          <div>
            <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 30, letterSpacing: "-0.03em", color: THEME.navy }}>{DATA.title}</div>
            <div style={{ fontFamily: THEME.fontBody, fontSize: 14.5, color: THEME.muted, marginTop: 6 }}>{DATA.desc}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${THEME.border}`, background: THEME.surface }} />
            <span style={{ fontFamily: THEME.fontBody, fontSize: 14, fontWeight: 500, color: THEME.navy }}>{DATA.checkbox}</span>
          </div>
        </div>

        <div style={{ marginTop: 14, background: THEME.surface, borderRadius: 16, border: `1px solid ${THEME.cardBorder}`, boxShadow: THEME.cardShadow, padding: "16px 18px" }}>
          <Legend />
          <Chart />
        </div>

        <div style={{ marginTop: 12, background: THEME.surface, borderRadius: 16, border: `1px solid ${THEME.cardBorder}`, overflow: "hidden" }}>
          <div style={{ display: "flex", padding: "11px 18px", background: THEME.pageBg }}>
            {DATA.cols.map((c, i) => (
              <div key={c} style={{ flex: COL_FLEX[i], textAlign: i === 0 ? "left" : "right", fontFamily: THEME.fontMono,
                fontWeight: 700, fontSize: 9, letterSpacing: "0.04em", textTransform: "uppercase", color: THEME.muted, lineHeight: 1.2 }}>{c}</div>
            ))}
          </div>
          {DATA.rows.map((r, i) => <TableRow key={r.mes} row={r} index={i} />)}
        </div>
      </AppShell>
    </AbsoluteFill>
  );
};

export default Cena7FluxoCaixa;
