/**
 * Cena Fornecedores — "Fornecedores e Compradores" (acompanhamento de quem gera
 * crédito e quem não gera). Recriada fiel a FornecedoresPage.tsx (blueaccount-ai).
 * 1920x1080 · 30fps · 360 frames.
 *
 * Coluna-chave: "Crédito IBS/CBS", com o badge fn-credito:
 *   integral   → ciano  "Crédito integral"
 *   presumido  → âmbar  "Crédito presumido"
 *   sem_credito→ cinza  "Sem crédito"
 * A linha sem regime informado ganha borda de atenção (âmbar).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { THEME } from "../ui/tokens";
import { useCountUp, useEnter } from "../ui/motion";
import { AppShell, Ic, ICON } from "../ui/AppShell";
import { CameraStage, kf } from "../ui/anim";

const AMBER = "#F59E0B";
const AMBER_TEXT = "#92400E";

const DATA = {
  breadcrumb: ["Fornecedores e Compradores", "Todos"],
  eyebrow: "Reforma tributária",
  titleLead: "Fornecedores e",
  titleAccent: "Compradores",
  sub: "Mantenha os dados de quem vende e de quem compra da empresa. Cadastre uma vez e reutilize nas compras e vendas das simulações.",
  create: "Novo fornecedor ou comprador",
  stats: [
    { n: 6, label: "Ativos" },
    { n: 1, label: "Sem regime" },
    { n: 1, label: "Sem ramo (CNAE)" },
    { n: 2, label: "Crédito presumido", accent: true },
  ],
  searchPlaceholder: "Buscar por CNPJ, razão social ou ramo...",
  filters: ["Todos os perfis", "Ativos"],
  cols: ["Fornecedor ou comprador", "Regime / Local", "Ramo (CNAE)", "Crédito IBS/CBS", ""],
  rows: [
    { nome: "Peças & Componentes Eletrônicos Ltda.", cnpj: "12.345.678/0001-90", regime: "Lucro Real", local: "SP · Campinas", cnae: "4665-6/00", ramo: "Comércio atacadista de componentes eletrônicos", perfil: "integral" },
    { nome: "Metalúrgica Vale do Aço S.A.", cnpj: "23.456.789/0001-12", regime: "Lucro Presumido", local: "MG · Betim", cnae: "2451-2/00", ramo: "Fundição de ferro e aço", perfil: "integral" },
    { nome: "TransLog Transportes Ltda.", cnpj: "34.567.890/0001-45", regime: "Simples Nacional", local: "PR · Curitiba", cnae: "4930-2/02", ramo: "Transporte rodoviário de carga", perfil: "presumido" },
    { nome: "Papelaria Central ME", cnpj: "45.678.901/0001-33", regime: "Simples Nacional", local: "SP · São Paulo", cnae: "4761-0/03", ramo: "Artigos de papelaria", perfil: "presumido" },
    { nome: "Materiais de Uso e Consumo Ltda.", cnpj: "56.789.012/0001-08", regime: "MEI", local: "CE · Fortaleza", cnae: "4744-0/99", ramo: "Materiais de construção", perfil: "sem_credito" },
    { nome: "João Santos Serviços", cnpj: "67.890.123/0001-77", regime: null, local: "BA · Salvador", cnae: null, ramo: null, perfil: "sem_credito", attention: true },
  ],
};

const GRID = "2.6fr 1.4fr 1.6fr 0.9fr 132px";

const PERFIL = {
  integral: { label: "Crédito integral", bg: THEME.cianoSoft, color: THEME.navy, border: "rgba(0,212,255,0.4)" },
  presumido: { label: "Crédito presumido", bg: "rgba(245,158,11,0.12)", color: AMBER_TEXT, border: "rgba(245,158,11,0.28)" },
  sem_credito: { label: "Sem crédito", bg: "rgba(107,114,128,0.12)", color: THEME.muted, border: "rgba(107,114,128,0.2)" },
};

const DOT = { integral: "#00D4FF", presumido: "#F59E0B", sem_credito: "#6B7280" };

const CreditoBadge = ({ perfil, pulse = 0 }) => {
  const p = PERFIL[perfil];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 10,
      fontFamily: THEME.fontMono, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase",
      background: p.bg, color: p.color, border: `1px solid ${p.border}`,
      transform: `scale(${1 + 0.06 * pulse})`, transformOrigin: "left center",
      boxShadow: pulse ? `0 0 0 ${3 * pulse}px ${p.border}, 0 6px 18px -6px ${p.border}` : "none" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: DOT[perfil] }} />
      {p.label}
    </span>
  );
};

const Stat = ({ s, index }) => {
  const appear = 30 + index * 6;
  const { opacity, y } = useEnter(appear);
  const n = Math.round(useCountUp(s.n, appear + 4, 20));
  return (
    <div style={{ flex: 1, background: s.accent ? THEME.cianoSoft : THEME.surface, border: `1px solid ${s.accent ? "rgba(0,212,255,0.4)" : THEME.cardBorder}`,
      borderRadius: 12, padding: "16px 20px", opacity, transform: `translateY(${y}px)` }}>
      <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 30, letterSpacing: "-0.025em", color: THEME.navy, fontVariantNumeric: "tabular-nums" }}>{n}</div>
      <div style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase", color: THEME.muted, marginTop: 4 }}>{s.label}</div>
    </div>
  );
};

const Row = ({ row, index, creditPulse }) => {
  const appear = 60 + index * 9;
  const { opacity, y } = useEnter(appear);
  const foc = creditPulse || 0;
  const focBorder = PERFIL[row.perfil].border;
  return (
    <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 14, alignItems: "center", padding: "14px 18px",
      background: THEME.surface,
      border: `1px solid ${foc > 0.05 ? focBorder : row.attention ? "rgba(245,158,11,0.45)" : THEME.cardBorder}`,
      borderRadius: 8, position: "relative", zIndex: foc > 0.05 ? 2 : 1,
      boxShadow: foc ? `0 10px 30px -12px ${focBorder}` : "none",
      opacity, transform: `translateY(${y}px)` }}>
      {/* Fornecedor + CNPJ */}
      <div>
        <div style={{ fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 15, color: THEME.navy }}>{row.nome}</div>
        <div style={{ fontFamily: THEME.fontMono, fontSize: 11, color: THEME.muted, marginTop: 3 }}>{row.cnpj}</div>
      </div>
      {/* Regime / Local */}
      <div>
        <div style={{ fontFamily: THEME.fontBody, fontSize: 12.5, color: row.regime ? THEME.body : AMBER_TEXT, fontWeight: row.regime ? 500 : 600 }}>
          {row.regime || "Regime não informado"}
        </div>
        <div style={{ fontFamily: THEME.fontMono, fontSize: 11, color: THEME.muted, marginTop: 3 }}>{row.local}</div>
      </div>
      {/* Ramo (CNAE) */}
      <div style={{ minWidth: 0 }}>
        {row.cnae ? (
          <>
            <div style={{ fontFamily: THEME.fontMono, fontSize: 11, color: THEME.muted }}>{row.cnae}</div>
            <div style={{ fontFamily: THEME.fontBody, fontSize: 12.5, color: THEME.body, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.ramo}</div>
          </>
        ) : (
          <div style={{ fontFamily: THEME.fontBody, fontSize: 12.5, color: THEME.muted }}>Ramo não informado</div>
        )}
      </div>
      {/* Crédito IBS/CBS */}
      <div><CreditoBadge perfil={row.perfil} pulse={creditPulse} /></div>
      {/* ações */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${THEME.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: THEME.muted }}>
          <Ic d={ICON.pen} size={14} />
        </div>
      </div>
    </div>
  );
};

/* Centros verticais (mundo 1920x1080) das 6 linhas, na ordem de DATA.rows. */
const ROW_CY = [497, 571, 645, 719, 793, 867];
/* Coreografia da câmera: entra na coluna de crédito e desce linha a linha,
 * parando (holds = keyframes repetidos) em cada TIPO de crédito, depois afasta. */
const CAM_T  = [0,   108,  138,  164,  184,  210,  230,  256,  276,  302,  322,  348,  368,  398,  430,  480];
const CAM_CX = [960, 960, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 960,  960];
const CAM_S  = [1.0, 1.0, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.85, 1.0,  1.0];
const CAM_CY = [540, 540, 497,  497,  571,  571,  645,  645,  719,  719,  793,  793,  867,  867,  540,  540];

export const CenaFornecedores = () => {
  const frame = useCurrentFrame();
  const eb = useEnter(8);
  const title = useEnter(12, 18);
  const sub = useEnter(18);
  const btn = useEnter(22);
  const tool = useEnter(48);
  const head = useEnter(56);

  // câmera
  const camX = kf(frame, CAM_T, CAM_CX);
  const camY = kf(frame, CAM_T, CAM_CY);
  const camS = kf(frame, CAM_T, CAM_S);
  // o quanto estamos "aproximados" (0 tela cheia → 1 em close)
  const zoom = interpolate(camS, [1.25, 1.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // realce herói: a coluna "Crédito IBS/CBS" acende quando aproximamos
  const creditPulse = zoom;
  // pulso por linha: acende o badge da linha que está centralizada no close
  const rowPulse = (i) =>
    zoom * interpolate(Math.abs(camY - ROW_CY[i]), [0, 46], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: THEME.pageBg, overflow: "hidden" }}>
      <CameraStage cx={camX} cy={camY} s={camS}>
      <AppShell breadcrumb={DATA.breadcrumb} active="Fornecedores" contentPadding="30px 40px">
        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ maxWidth: 1000 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: eb.opacity, transform: `translateY(${eb.y}px)` }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: THEME.ciano }} />
              <span style={{ fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: THEME.muted }}>{DATA.eyebrow}</span>
            </div>
            <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 40, letterSpacing: "-0.03em", color: THEME.navy, marginTop: 12,
              opacity: title.opacity, transform: `translateY(${title.y}px)` }}>
              {DATA.titleLead} <span style={{ fontFamily: THEME.fontSerif, fontStyle: "italic", fontWeight: 400 }}>{DATA.titleAccent}</span>.
            </div>
            <div style={{ fontFamily: THEME.fontBody, fontSize: 15.5, color: THEME.muted, marginTop: 10, lineHeight: 1.5, maxWidth: 820,
              opacity: sub.opacity, transform: `translateY(${sub.y}px)` }}>{DATA.sub}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 22px", borderRadius: 10, background: THEME.ciano, color: THEME.navy,
            fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 14, boxShadow: "0 10px 30px -10px rgba(0,212,255,0.7)", flexShrink: 0,
            opacity: btn.opacity, transform: `translateY(${btn.y}px)` }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>{DATA.create}
          </div>
        </div>

        {/* stats */}
        <div style={{ display: "flex", gap: 14, marginTop: 24 }}>
          {DATA.stats.map((s, i) => <Stat key={s.label} s={s} index={i} />)}
        </div>

        {/* toolbar */}
        <div style={{ display: "flex", gap: 12, marginTop: 22, opacity: tool.opacity, transform: `translateY(${tool.y}px)` }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 10, padding: "12px 16px" }}>
            <span style={{ width: 18, height: 18, display: "flex", color: THEME.muted }}><Ic d={ICON.search} size={18} /></span>
            <span style={{ fontFamily: THEME.fontBody, fontSize: 15, color: THEME.muted }}>{DATA.searchPlaceholder}</span>
          </div>
          {DATA.filters.map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 10, padding: "12px 16px",
              fontFamily: THEME.fontBody, fontSize: 14, fontWeight: 500, color: THEME.navy }}>
              {f}<span style={{ color: THEME.muted, fontSize: 11 }}>▾</span>
            </div>
          ))}
        </div>

        {/* cabeçalho da tabela */}
        <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 14, padding: "12px 18px", marginTop: 16,
          opacity: head.opacity, transform: `translateY(${head.y}px)` }}>
          {DATA.cols.map((c, i) => (
            <div key={i} style={{ fontFamily: THEME.fontMono, fontWeight: 700, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase",
              color: i === 3 && creditPulse ? THEME.navy : THEME.muted }}>{c}</div>
          ))}
        </div>

        {/* linhas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {DATA.rows.map((r, i) => <Row key={r.cnpj} row={r} index={i} creditPulse={rowPulse(i)} />)}
        </div>
      </AppShell>
      </CameraStage>
    </AbsoluteFill>
  );
};

export default CenaFornecedores;
