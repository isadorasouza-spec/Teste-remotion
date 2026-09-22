/**
 * AppShell — chrome reutilizável, recriado fiel ao workspace real do
 * blueaccount-ai (WorkspaceSidebar + WorkspaceLayout, mvp-home.css).
 *
 * Sidebar navy 260px (expandida, rotulada) com grupos de navegação reais,
 * item ativo em ciano; topbar navy 64px com breadcrumb (mono maiúsculo) e o
 * seletor PT|EN; canvas cinza-claro #F2F4F7. Cada cena troca só o conteúdo.
 */
import React from "react";
import { THEME } from "./tokens";
import { useEnter } from "./motion";

/* ---------------------------------------------------------------- ÍCONES */
const Ic = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);
const ICON = {
  home: <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5.4" /><path d="M17.5 20a6 6 0 0 0-3-5.2" /></>,
  caduceus: <><path d="M12 3v18" /><path d="M8 6c0 3 8 3 8 6s-8 3-8 6" /><circle cx="12" cy="3.5" r="1.3" /></>,
  sheet: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /><path d="M9 12h6M9 16h6" /></>,
  truck: <><rect x="2" y="7" width="12" height="9" rx="1" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>,
  doc: <><path d="M6 3h9l3 3v15H6z" /><path d="M9 12h6M9 16h4" /></>,
  radar: <><circle cx="12" cy="12" r="8.5" /><path d="M12 12 18 7" /><path d="M12 12v-8.5" opacity="0.5" /></>,
  money: <><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></>,
  alert: <><path d="M12 4 2.5 20h19z" /><path d="M12 10v4" /><path d="M12 17h.01" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" /></>,
  chevron: <path d="M9 6l6 6-6 6" />,
  pen: <><path d="M4 20h4L20 8l-4-4L4 16z" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.2-3.2" /></>,
};

/* grupos reais (workspace-nav.ts) */
const NAV = [
  { group: null, items: [{ k: "home", label: "Home" }, { k: "users", label: "Clientes" }] },
  { group: "Tributária", items: [
    { k: "caduceus", label: "Simulações", active: true },
    { k: "sheet", label: "Dados Operacionais" },
    { k: "sheet", label: "Notas Fiscais" },
    { k: "truck", label: "Fornecedores" },
  ] },
  { group: "Cobranças", items: [
    { k: "doc", label: "Contratos" },
    { k: "radar", label: "Relatórios" },
    { k: "sheet", label: "Documentos" },
    { k: "money", label: "Cobrança" },
  ] },
  { group: "Administração", items: [
    { k: "doc", label: "Guias" },
    { k: "alert", label: "Ações" },
    { k: "settings", label: "Configurações" },
  ] },
];

const SIDEBAR_W = 260;
const TOPBAR_H = 64;

const Brand = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px 22px" }}>
    <div style={{
      width: 34, height: 34, borderRadius: 9, background: THEME.ciano, color: THEME.navy,
      fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 20,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>K</div>
    <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 21, letterSpacing: "-0.03em", color: THEME.navTextHover }}>
      ontiva<span style={{ color: THEME.ciano }}>.ai</span>
    </div>
  </div>
);

const Sidebar = () => {
  const { opacity } = useEnter(0, 0);
  return (
    <div style={{
      position: "absolute", left: 0, top: 0, width: SIDEBAR_W, height: "100%",
      background: "rgba(10,31,63,0.97)", padding: "16px 16px 22px", opacity,
      display: "flex", flexDirection: "column",
      borderRight: "1px solid rgba(255,255,255,0.06)", overflow: "hidden",
    }}>
      {/* glow ciano no topo */}
      <div style={{ position: "absolute", top: -80, right: -60, width: 240, height: 240,
        background: "radial-gradient(circle, rgba(0,212,255,0.16), transparent 70%)", pointerEvents: "none" }} />
      <Brand />
      <div style={{ display: "flex", flexDirection: "column", gap: 4, position: "relative" }}>
        {NAV.map((sec, si) => (
          <div key={si} style={{ marginTop: sec.group ? 16 : 0 }}>
            {sec.group && (
              <div style={{ fontFamily: THEME.fontMono, fontWeight: 700, fontSize: 10, letterSpacing: "0.14em",
                textTransform: "uppercase", color: THEME.navSectionLabel, padding: "6px 12px 8px" }}>
                {sec.group}
              </div>
            )}
            {sec.items.map((it, ii) => (
              <div key={ii} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10,
                color: it.active ? THEME.ciano : THEME.navText,
                background: it.active ? THEME.navActiveBg : "transparent",
                fontFamily: THEME.fontBody, fontWeight: it.active ? 600 : 500, fontSize: 13,
              }}>
                <span style={{ width: 18, height: 18, display: "flex" }}><Ic d={ICON[it.k]} /></span>
                {it.label}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* rodapé: chip de usuário */}
      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10, padding: "10px 8px 0",
        borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: THEME.ciano, color: THEME.navy,
          fontFamily: THEME.fontDisplay, fontWeight: 700, fontSize: 11,
          display: "flex", alignItems: "center", justifyContent: "center" }}>IS</div>
        <div style={{ fontFamily: THEME.fontBody, fontSize: 12, color: THEME.navText, overflow: "hidden",
          whiteSpace: "nowrap", textOverflow: "ellipsis" }}>isadora@bluemetrics…</div>
      </div>
    </div>
  );
};

const LangToggle = () => (
  <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: 3 }}>
    {["PT", "EN"].map((l) => (
      <div key={l} style={{
        fontFamily: THEME.fontMono, fontWeight: 600, fontSize: 11, padding: "5px 10px", borderRadius: 7,
        background: l === "PT" ? THEME.ciano : "transparent",
        color: l === "PT" ? THEME.navy : "rgba(234,246,255,0.5)",
      }}>{l}</div>
    ))}
  </div>
);

const TopBar = ({ breadcrumb }) => {
  const { opacity } = useEnter(2);
  return (
    <div style={{
      position: "absolute", left: SIDEBAR_W, top: 0, right: 0, height: TOPBAR_H,
      background: "rgba(10,31,63,0.97)", borderBottom: "1px solid rgba(255,255,255,0.08)",
      display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", opacity,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: THEME.fontMono, fontSize: 11,
        letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(234,246,255,0.72)" }}>
        {breadcrumb.map((b, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: "rgba(234,246,255,0.34)" }}>/</span>}
            <span style={{ color: i === breadcrumb.length - 1 ? THEME.navTextHover : "rgba(234,246,255,0.72)" }}>{b}</span>
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 999,
          background: "rgba(0,212,255,0.12)", color: THEME.ciano, fontFamily: THEME.fontBody,
          fontWeight: 600, fontSize: 12.5 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: THEME.ciano }} /> Kontiva IA
        </div>
        <LangToggle />
      </div>
    </div>
  );
};

/* Abas em pílula estilo editor (RESULTADO / LANÇAMENTOS E NOTAS / FLUXO DE CAIXA). */
export const SegmentedTabs = ({ tabs, activeIndex = 0, appear = 8, upper = true }) => {
  const { opacity, y } = useEnter(appear);
  return (
    <div style={{ display: "inline-flex", gap: 4, background: THEME.pageBg, padding: 4, borderRadius: 10,
      border: "1px solid rgba(10,31,63,0.09)", width: "fit-content", opacity, transform: `translateY(${y}px)` }}>
      {tabs.map((t, i) => {
        const active = i === activeIndex;
        return (
          <div key={t} style={{
            padding: "9px 18px", borderRadius: 7, fontFamily: THEME.fontBody, fontWeight: 700, fontSize: 11,
            letterSpacing: "0.04em", textTransform: upper ? "uppercase" : "none",
            background: active ? THEME.surface : "transparent",
            color: active ? THEME.navy : THEME.muted,
            boxShadow: active ? "0 2px 8px rgba(10,31,63,0.08)" : "none",
          }}>{t}</div>
        );
      })}
    </div>
  );
};

/* Abas do cliente (Grupos / Individuais): pill branca, ativa ciano-suave + underline ciano. */
export const ClientTabs = ({ tabs, activeIndex = 0, appear = 8 }) => {
  const { opacity, y } = useEnter(appear);
  return (
    <div style={{ display: "inline-flex", gap: 4, background: THEME.surface, padding: 4, borderRadius: 10,
      border: `1px solid ${THEME.pageBg}`, width: "fit-content", opacity, transform: `translateY(${y}px)` }}>
      {tabs.map((t, i) => {
        const active = i === activeIndex;
        return (
          <div key={t} style={{
            padding: "9px 18px", borderRadius: 7, fontFamily: THEME.fontBody, fontWeight: 600, fontSize: 13,
            background: active ? THEME.cianoSoft : "transparent",
            color: active ? THEME.navy : THEME.muted,
            boxShadow: active ? `inset 0 -2px 0 ${THEME.ciano}` : "none",
          }}>{t}</div>
        );
      })}
    </div>
  );
};

export const AppShell = ({ breadcrumb, contentPadding = "34px 40px", children }) => (
  <>
    <Sidebar />
    <TopBar breadcrumb={breadcrumb} />
    <div style={{ position: "absolute", left: SIDEBAR_W, top: TOPBAR_H, right: 0, bottom: 0, padding: contentPadding }}>
      {children}
    </div>
  </>
);

export { ICON, Ic };
export default AppShell;
