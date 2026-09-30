/**
 * Cena Custo Real — "Custo real por fornecedor ao longo da reforma".
 * Compara, ano a ano da transição da Reforma Tributária, o CUSTO REAL de uma
 * mesma compra (R$ 100.000) conforme o perfil de crédito IBS/CBS do fornecedor:
 *   integral  (ciano)  → recupera 100% do crédito disponível no ano
 *   presumido (âmbar)  → recupera ~40% (crédito presumido)
 *   sem crédito(cinza) → não recupera nada
 * O crédito de IBS/CBS aproveitável cresce conforme a transição (2026→2033),
 * então a diferença de custo real entre os fornecedores se abre ano a ano.
 *
 * Gráfico de linhas divergentes + tabela "Custo real por ano". Recriado no
 * mesmo sistema visual do produto (blueaccount-ai). 1920x1080 · 30fps.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { THEME, brl } from "../ui/tokens";
import { useCountUp, useEnter } from "../ui/motion";
import { AppShell, Ic, ICON } from "../ui/AppShell";
import { CameraStage, kf } from "../ui/anim";

const AMBER = "#F59E0B";
const AMBER_TEXT = "#92400E";
const GREEN = "#15803D";
const CIANO_LINE = "#0FB5E6"; // ciano com contraste p/ linha sobre branco

const ANOS = ["2026", "2027", "2029", "2031", "2033"];

/* custo real (R$) de uma compra de 100.000 por perfil, por ano da transição */
const SERIES = {
  integral:   { label: "Crédito integral",  color: CIANO_LINE, dot: THEME.ciano, vals: [99000, 91200, 89400, 85900, 73500] },
  presumido:  { label: "Crédito presumido", color: AMBER,      dot: AMBER,       vals: [99600, 96480, 95760, 94360, 89400] },
  sem_credito:{ label: "Sem crédito",       color: THEME.muted,dot: THEME.muted, vals: [100000, 100000, 100000, 100000, 100000] },
};
const ORDER = ["integral", "presumido", "sem_credito"];
/* economia do fornecedor com crédito integral vs. sem crédito, por ano */
const ECON = SERIES.sem_credito.vals.map((v, i) => v - SERIES.integral.vals[i]);

const DATA = {
  breadcrumb: ["Fornecedores e Compradores", "Custo real"],
  eyebrow: "Reforma tributária · custo real",
  titleLead: "Custo real por",
  titleAccent: "fornecedor",
  sub: "Mesma compra de R$ 100.000, comparada ano a ano da transição. O custo real cai conforme o fornecedor gera crédito de IBS/CBS, e a diferença se abre até a reforma completa.",
};

/* ------------------------------------------------------------------ GRÁFICO */
const CW = 1500, CH = 384;      // caixa do gráfico
const PL = 104, PR = 132, PT = 26, PB = 46;
const X0 = PL, X1 = CW - PR, Y0 = PT, Y1 = CH - PB;
const VMIN = 70000, VMAX = 100000;
const xAt = (i) => X0 + (X1 - X0) * (i / (ANOS.length - 1));
const yAt = (v) => Y1 - (v - VMIN) / (VMAX - VMIN) * (Y1 - Y0);

/* polyline parcial: revela os pontos conforme prog (0→1) sobre n-1 segmentos */
const partialPath = (vals, prog) => {
  const n = vals.length;
  const total = n - 1;
  const cursor = Math.max(0, Math.min(total, prog * total));
  const done = Math.floor(cursor);
  const frac = cursor - done;
  const pts = [];
  for (let i = 0; i <= done && i < n; i++) pts.push([xAt(i), yAt(vals[i])]);
  if (done < total) {
    const x = xAt(done) + (xAt(done + 1) - xAt(done)) * frac;
    const y = yAt(vals[done]) + (yAt(vals[done + 1]) - yAt(vals[done])) * frac;
    pts.push([x, y]);
  }
  return pts;
};

const Chart = ({ draw, gap = 0 }) => {
  const grid = [70000, 80000, 90000, 100000];
  const gx = xAt(ANOS.length - 1);
  const gyTop = yAt(SERIES.sem_credito.vals[ANOS.length - 1]);
  const gyBot = yAt(SERIES.integral.vals[ANOS.length - 1]);
  return (
    <svg width="100%" viewBox={`0 0 ${CW} ${CH}`} style={{ display: "block" }}>
      {/* grades horizontais + rótulos Y */}
      {grid.map((g) => (
        <g key={g}>
          <line x1={X0} y1={yAt(g)} x2={X1} y2={yAt(g)} stroke={THEME.hairline} strokeWidth="1" />
          <text x={X0 - 14} y={yAt(g) + 4} textAnchor="end"
            fontFamily={THEME.fontMono} fontSize="13" fill={THEME.muted}>{brl(g).replace(",00", "")}</text>
        </g>
      ))}
      {/* rótulos X (anos) */}
      {ANOS.map((a, i) => (
        <text key={a} x={xAt(i)} y={Y1 + 28} textAnchor="middle"
          fontFamily={THEME.fontDisplay} fontWeight="700" fontSize="16" fill={THEME.navy}>{a}</text>
      ))}
      {/* linhas + marcadores */}
      {ORDER.map((k) => {
        const s = SERIES[k];
        const pts = partialPath(s.vals, draw);
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
        return (
          <g key={k}>
            <path d={d} fill="none" stroke={s.color} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 4px 8px rgba(10,31,63,0.12))" }} />
            {s.vals.map((v, i) => {
              const shown = draw >= i / (ANOS.length - 1) - 0.001;
              if (!shown) return null;
              return <circle key={i} cx={xAt(i)} cy={yAt(v)} r={i === ANOS.length - 1 ? 7 : 5}
                fill="#fff" stroke={s.color} strokeWidth="3.5" />;
            })}
            {/* valor de 2033 no ponto final (aparece ao concluir o traçado) */}
            {draw > 0.985 && (
              <text x={xAt(ANOS.length - 1) + 14} y={yAt(s.vals[s.vals.length - 1]) + 5} textAnchor="start"
                fontFamily={THEME.fontMono} fontWeight="700" fontSize="14" fill={s.color}>{brl(s.vals[s.vals.length - 1]).replace(",00", "")}</text>
            )}
          </g>
        );
      })}
      {/* colchete da divergência em 2033 (integral × sem crédito) */}
      {gap > 0.02 && (
        <g opacity={gap}>
          <line x1={gx - 30} y1={gyTop} x2={gx - 30} y2={gyBot} stroke={THEME.ciano} strokeWidth="2.5" />
          <line x1={gx - 36} y1={gyTop} x2={gx - 24} y2={gyTop} stroke={THEME.ciano} strokeWidth="2.5" />
          <line x1={gx - 36} y1={gyBot} x2={gx - 24} y2={gyBot} stroke={THEME.ciano} strokeWidth="2.5" />
          <rect x={gx - 244} y={(gyTop + gyBot) / 2 - 20} width={196} height={40} rx={9} fill={THEME.ciano} />
          <text x={gx - 146} y={(gyTop + gyBot) / 2 - 2} textAnchor="middle"
            fontFamily={THEME.fontMono} fontWeight="700" fontSize="16" fill={THEME.navy}>− R$ 26.500</text>
          <text x={gx - 146} y={(gyTop + gyBot) / 2 + 14} textAnchor="middle"
            fontFamily={THEME.fontMono} fontWeight="600" fontSize="10.5" fill={THEME.navy}>integral × sem crédito · −26,5%</text>
        </g>
      )}
    </svg>
  );
};

/* -------------------------------------------------------------------- TABELA */
const TFLEX = [0.8, 1.4, 1.4, 1.4, 1.5];
const TableRow = ({ i, appear, rowPulse }) => {
  const { opacity, y } = useEnter(appear);
  const integ = useCountUp(SERIES.integral.vals[i], appear + 4, 20);
  const pres = useCountUp(SERIES.presumido.vals[i], appear + 6, 20);
  const semc = useCountUp(SERIES.sem_credito.vals[i], appear + 8, 20);
  const econ = useCountUp(ECON[i], appear + 10, 20);
  const foc = rowPulse || 0;
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderTop: `1px solid ${THEME.hairline}`,
      background: foc > 0.05 ? "rgba(0,212,255,0.06)" : "transparent", opacity, transform: `translateY(${y}px)`,
      position: "relative", zIndex: foc > 0.05 ? 2 : 1 }}>
      <div style={{ flex: TFLEX[0], fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 16, color: THEME.navy }}>{ANOS[i]}</div>
      <div style={{ flex: TFLEX[1], textAlign: "right", fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 13.5, color: CIANO_LINE, fontVariantNumeric: "tabular-nums" }}>{brl(integ)}</div>
      <div style={{ flex: TFLEX[2], textAlign: "right", fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 13.5, color: AMBER_TEXT, fontVariantNumeric: "tabular-nums" }}>{brl(pres)}</div>
      <div style={{ flex: TFLEX[3], textAlign: "right", fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 13.5, color: THEME.muted, fontVariantNumeric: "tabular-nums" }}>{brl(semc)}</div>
      <div style={{ flex: TFLEX[4], textAlign: "right", fontFamily: THEME.fontMono, fontWeight: 700, fontSize: 13.5, color: GREEN, fontVariantNumeric: "tabular-nums" }}>
        − {brl(econ).replace(",00", "")} <span style={{ color: THEME.muted, fontWeight: 600 }}>({(ECON[i] / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%)</span>
      </div>
    </div>
  );
};

const LegendDot = ({ c }) => <span style={{ width: 10, height: 10, borderRadius: 3, background: c, display: "inline-block" }} />;

/* ------------------------------------------------------------------- CÂMERA */
/* overview → entra no gráfico → percorre os anos (esq→dir) → destaca a
 * divergência de 2033 → desce e percorre a tabela → afasta. */
const CAM_T  = [0,   64,  92,  120, 150, 180, 214, 250, 286, 330, 360, 430, 470, 520];
const CAM_CX = [960, 960, 560, 760, 980, 1200,1360,1360, 960, 960, 960, 960, 960, 960];
const CAM_CY = [540, 540, 360, 360, 360, 360, 360, 360, 360, 740, 820, 820, 540, 540];
const CAM_S  = [1.0, 1.0, 1.55,1.55,1.55,1.55,1.7, 1.7, 1.0, 1.55,1.55,1.55,1.0, 1.0];

export const CenaCustoReal = () => {
  const frame = useCurrentFrame();
  const eb = useEnter(8);
  const title = useEnter(12, 18);
  const sub = useEnter(18);
  const chartCard = useEnter(30);
  const tableCard = useEnter(120);

  // o gráfico desenha enquanto a câmera percorre os anos
  const draw = interpolate(frame, [92, 214], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const camX = kf(frame, CAM_T, CAM_CX);
  const camY = kf(frame, CAM_T, CAM_CY);
  const camS = kf(frame, CAM_T, CAM_S);

  // destaque da divergência 2033 (aparece no fim do travelling do gráfico)
  const gapOp = interpolate(frame, [214, 236, 300, 320], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // pulso por linha da tabela durante a descida
  const tableRowPulse = (i) => {
    const base = 336 + i * 18;
    return interpolate(frame, [base - 10, base, base + 22, base + 34], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };

  return (
    <AbsoluteFill style={{ background: THEME.pageBg, overflow: "hidden" }}>
      <CameraStage cx={camX} cy={camY} s={camS}>
      <AppShell breadcrumb={DATA.breadcrumb} active="Fornecedores" contentPadding="26px 40px">
        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ maxWidth: 1060 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: eb.opacity, transform: `translateY(${eb.y}px)` }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: THEME.ciano }} />
              <span style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: THEME.muted }}>{DATA.eyebrow}</span>
            </div>
            <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 38, letterSpacing: "-0.03em", color: THEME.navy, marginTop: 10,
              opacity: title.opacity, transform: `translateY(${title.y}px)` }}>
              {DATA.titleLead} <span style={{ fontFamily: THEME.fontSerif, fontStyle: "italic", fontWeight: 400 }}>{DATA.titleAccent}</span>.
            </div>
            <div style={{ fontFamily: THEME.fontBody, fontSize: 15, color: THEME.muted, marginTop: 8, lineHeight: 1.5, maxWidth: 900,
              opacity: sub.opacity, transform: `translateY(${sub.y}px)` }}>{DATA.sub}</div>
          </div>
          {/* legenda */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "14px 18px", borderRadius: 12, background: THEME.surface,
            border: `1px solid ${THEME.cardBorder}`, flexShrink: 0, opacity: sub.opacity }}>
            {ORDER.map((k) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 13, color: THEME.navy }}>
                <LegendDot c={SERIES[k].color} />{SERIES[k].label}
              </div>
            ))}
          </div>
        </div>

        {/* card do gráfico */}
        <div style={{ marginTop: 18, background: THEME.surface, borderRadius: 16, border: `1px solid ${THEME.cardBorder}`,
          boxShadow: THEME.cardShadow, padding: "20px 24px 14px", position: "relative", opacity: chartCard.opacity, transform: `translateY(${chartCard.y}px)` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 17, color: THEME.navy }}>Custo real de uma compra de R$ 100.000</div>
            <div style={{ fontFamily: THEME.fontMono, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase", color: THEME.muted }}>Por ano da transição</div>
          </div>
          <Chart draw={draw} gap={gapOp} />
        </div>

        {/* card da tabela */}
        <div style={{ marginTop: 14, background: THEME.surface, borderRadius: 16, border: `1px solid ${THEME.cardBorder}`,
          overflow: "hidden", opacity: tableCard.opacity, transform: `translateY(${tableCard.y}px)` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
            <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 16, color: THEME.navy }}>Custo real por ano</div>
          </div>
          {/* cabeçalho */}
          <div style={{ display: "flex", padding: "10px 20px", background: THEME.pageBg, borderTop: `1px solid ${THEME.hairline}` }}>
            {[{ t: "Ano" }, { t: "Crédito integral", c: CIANO_LINE }, { t: "Crédito presumido", c: AMBER }, { t: "Sem crédito", c: THEME.muted }, { t: "Economia (integral × sem crédito)" }].map((h, i) => (
              <div key={i} style={{ flex: TFLEX[i], display: "flex", alignItems: "center", justifyContent: i === 0 ? "flex-start" : "flex-end", gap: 6,
                fontFamily: THEME.fontMono, fontWeight: 700, fontSize: 9.5, letterSpacing: "0.05em", textTransform: "uppercase", color: THEME.muted }}>
                {h.c && <LegendDot c={h.c} />}{h.t}
              </div>
            ))}
          </div>
          {ANOS.map((a, i) => <TableRow key={a} i={i} appear={128 + i * 12} rowPulse={tableRowPulse(i)} />)}
        </div>
      </AppShell>
      </CameraStage>
    </AbsoluteFill>
  );
};

export default CenaCustoReal;
