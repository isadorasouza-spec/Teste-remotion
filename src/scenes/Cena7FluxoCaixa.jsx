/**
 * Cena 7 — Fluxo de caixa (2027). Bloco 4:30–4:48.
 * Remotion · 1920x1080 · 30fps · 320 frames piloto.
 *
 * Gráfico combinado (barras = saldo do mês, linha = saldo acumulado) e tabela
 * mensal. As barras crescem mês a mês e a linha de saldo acumulado se desenha;
 * a tabela revela as linhas confirmadas (2027-02 a 2027-06). As lacunas reais
 * de meses são respeitadas (2027-09 → 2028-09, 2028-11 → 2029-01) e os meses
 * aproximados (07, 08 e 2028+) ficam de-enfatizados, sem close.
 *
 * Pendência PRD (seção 9): "cashback de até 540 dias" não existe em nenhuma tela
 * — não inventado aqui; fica para a locução até a Isadora decidir.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { THEME, brl } from "../ui/tokens";
import { useCountUp, useEnter } from "../ui/motion";
import { AppShell, SegmentedTabs } from "../ui/AppShell";

const DATA = {
  breadcrumb: ["SIMULAÇÕES", "VÉRTICE DISTRIBUIDORA ATACADISTA L…", "NOTAS"],
  tabs: ["RESULTADO", "LANÇAMENTOS E NOTAS", "FLUXO DE CAIXA"],
  title: "Fluxo de caixa",
  checkbox: "Simular split payment do IBS/CBS em 2027",
  helper: "Entradas, saídas e saldo tributário mês a mês.",
  xLabels: [
    "2027-02", "2027-03", "2027-04", "2027-05", "2027-06", "2027-07",
    "2027-08", "2027-09", "2028-09", "2028-11", "2029-01", "2029-02",
  ],
  // saldo do mês (barras) e saldo acumulado (linha) — só 2027-02..06 confirmados
  saldoMes: [-209856, 467608, -391700, -51432, -100115, null, null, null, null, null, null, null],
  saldoAcum: [-209856, 257752, -133948, -185380, -285495, null, null, null, null, null, null, null],
  cols: ["MÊS", "ENTRADA OPERACIONAL", "SAÍDA OPERACIONAL", "DÉBITO DE TRIBUTO PAGO", "CRÉDITO DE TRIBUTO UTILIZADO", "SALDO CREDOR ACUMULADO", "SALDO DO MÊS", "SALDO ACUMULADO"],
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

/* --------------------------------------------------------------- GRÁFICO */
const Chart = () => {
  const frame = useCurrentFrame();
  const enter = useEnter(20);

  const W = 1180;
  const H = 360;
  const padL = 124;
  const padR = 24;
  const padT = 18;
  const padB = 44;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const n = DATA.xLabels.length;
  const colW = plotW / n;
  const zeroY = padT + plotH / 2;
  const cx = (i) => padL + colW * (i + 0.5);
  const vY = (v) => zeroY - (v / YMAX) * (plotH / 2);

  const yTicks = [500000, 250000, 0, -250000, -500000];

  // barras confirmadas
  const barStart = 40;
  const barStep = 8;

  // linha acumulada: progresso de desenho
  const confirmed = DATA.saldoAcum
    .map((v, i) => (v == null ? null : { x: cx(i), y: vY(v) }))
    .filter(Boolean);
  const pathD = confirmed.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const lineProg = interpolate(frame, [70, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ opacity: enter.opacity, transform: `translateY(${enter.y}px)` }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        {/* grid + rótulos Y */}
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={vY(t)} y2={vY(t)} stroke={THEME.line} strokeWidth={1} />
            <text x={padL - 12} y={vY(t) + 4} textAnchor="end" fontFamily={THEME.fontBody} fontSize={12} fill={THEME.muted}>
              {t === 0 ? "R$ 0,00" : signedBrl(t)}
            </text>
          </g>
        ))}
        {/* linha do zero reforçada */}
        <line x1={padL} x2={W - padR} y1={zeroY} y2={zeroY} stroke="#C9CFDD" strokeWidth={1.4} />

        {/* barras (saldo do mês) */}
        {DATA.saldoMes.map((v, i) => {
          if (v == null) {
            // meses aproximados: placeholder tênue, sem valor (sem close)
            return (
              <rect
                key={i}
                x={cx(i) - colW * 0.22}
                y={zeroY - 6}
                width={colW * 0.44}
                height={12}
                rx={3}
                fill="#EEF1F6"
              />
            );
          }
          const grow = interpolate(frame, [barStart + i * barStep, barStart + i * barStep + 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const full = vY(v);
          const h = Math.abs(full - zeroY) * grow;
          const y = v >= 0 ? zeroY - h : zeroY;
          const color = v >= 0 ? THEME.green : THEME.red;
          return (
            <rect key={i} x={cx(i) - colW * 0.26} y={y} width={colW * 0.52} height={h} rx={4} fill={color} opacity={0.9} />
          );
        })}

        {/* linha do saldo acumulado (desenho progressivo) */}
        <path
          d={pathD}
          fill="none"
          stroke={THEME.navy}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - lineProg}
        />
        {confirmed.map((p, i) => {
          const show = interpolate(frame, [70 + i * 10, 78 + i * 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return <circle key={i} cx={p.x} cy={p.y} r={4.5} fill={THEME.navy} opacity={show} />;
        })}

        {/* rótulos X */}
        {DATA.xLabels.map((l, i) => (
          <text key={l} x={cx(i)} y={H - 16} textAnchor="middle" fontFamily={THEME.fontBody} fontSize={11} fill={i < 5 ? THEME.body : THEME.muted}>
            {l}
          </text>
        ))}
      </svg>
    </div>
  );
};

/* --------------------------------------------------------------- TABELA */
const TableRow = ({ row, index }) => {
  const appear = 150 + index * 12;
  const { opacity, y } = useEnter(appear);
  // useCountUp chamado sempre (valor nulo vira 0) para manter a ordem de hooks estável.
  const counted = row.vals.map((v, i) => useCountUp(v ?? 0, appear + 4 + i, 18));
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "12px 22px", borderTop: `1px solid ${THEME.line}`, opacity, transform: `translateY(${y}px)`, background: row.aprox ? "#FAFBFD" : "transparent" }}>
      <div style={{ flex: COL_FLEX[0], fontFamily: THEME.fontDisplay, fontWeight: 800, fontSize: 15, color: row.aprox ? THEME.muted : THEME.ink }}>
        {row.mes}
      </div>
      {row.vals.map((v, i) => {
        if (v == null) {
          return (
            <div key={i} style={{ flex: COL_FLEX[i + 1], textAlign: "right", fontFamily: THEME.fontBody, fontSize: 14, color: "#C2C8D6" }}>
              —
            </div>
          );
        }
        const isSaldo = i >= 5;
        const color = v < 0 ? THEME.red : isSaldo ? THEME.green : i === 4 ? THEME.green : THEME.body;
        return (
          <div key={i} style={{ flex: COL_FLEX[i + 1], textAlign: "right", fontFamily: THEME.fontBody, fontWeight: isSaldo ? 800 : 600, fontSize: 14.5, color, fontVariantNumeric: "tabular-nums" }}>
            {signedBrl(counted[i])}
          </div>
        );
      })}
    </div>
  );
};

export const Cena7FluxoCaixa = () => {
  const title = useEnter(8, 20);
  const sub = useEnter(14);

  return (
    <AbsoluteFill style={{ background: THEME.pageBg }}>
      <AppShell breadcrumb={DATA.breadcrumb}>
        <SegmentedTabs tabs={DATA.tabs} activeIndex={2} appear={6} />

        {/* Título + checkbox + helper */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 22, opacity: title.opacity, transform: `translateY(${title.y}px)` }}>
          <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 800, fontSize: 34, color: THEME.ink }}>{DATA.title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${THEME.blue}`, background: THEME.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4L19 7" /></svg>
            </div>
            <div style={{ fontFamily: THEME.fontBody, fontSize: 14.5, fontWeight: 600, color: THEME.ink }}>{DATA.checkbox}</div>
          </div>
        </div>
        <div style={{ fontFamily: THEME.fontBody, fontSize: 15, color: THEME.muted, marginTop: 6, opacity: sub.opacity }}>{DATA.helper}</div>

        {/* Card do gráfico */}
        <div style={{ marginTop: 16, background: THEME.surface, borderRadius: 16, border: `1px solid ${THEME.line}`, boxShadow: "0 24px 60px -30px rgba(3,10,139,0.18)", padding: "18px 20px" }}>
          {/* Legenda */}
          <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 8, paddingLeft: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: THEME.green }} />
              <span style={{ fontFamily: THEME.fontBody, fontSize: 13, color: THEME.body }}>Saldo do mês</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 22, height: 3, borderRadius: 2, background: THEME.navy }} />
              <span style={{ fontFamily: THEME.fontBody, fontSize: 13, color: THEME.body }}>Saldo acumulado</span>
            </div>
          </div>
          <Chart />
        </div>

        {/* Tabela mensal */}
        <div style={{ marginTop: 14, background: THEME.surface, borderRadius: 16, border: `1px solid ${THEME.line}`, overflow: "hidden" }}>
          <div style={{ display: "flex", padding: "12px 22px", background: "#F7F8FB" }}>
            {DATA.cols.map((c, i) => (
              <div key={c} style={{ flex: COL_FLEX[i], textAlign: i === 0 ? "left" : "right", fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 9.5, letterSpacing: 0.3, color: THEME.muted, lineHeight: 1.2 }}>{c}</div>
            ))}
          </div>
          {DATA.rows.map((r, i) => (
            <TableRow key={r.mes} row={r} index={i} />
          ))}
        </div>
      </AppShell>
    </AbsoluteFill>
  );
};

export default Cena7FluxoCaixa;
