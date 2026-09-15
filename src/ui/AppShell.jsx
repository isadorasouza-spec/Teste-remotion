/**
 * AppShell — chrome reutilizável da interface do produto.
 *
 * Reúne a barra lateral navy, a topbar com breadcrumb e a moldura da área de
 * conteúdo, extraídos de KontivaResultado.jsx sem alterar o visual. Cada cena
 * de dados (1 a 7) usa este shell e troca apenas o conteúdo da área principal.
 *
 * Também exporta SegmentedTabs (o controle de abas em pílula) e os ícones da
 * sidebar, para reuso pelas cenas.
 */
import React from "react";
import { THEME } from "./tokens";
import { useEnter } from "./motion";

/* ------------------------------------------------------------------- ÍCONES */
export const Icon = ({ d, active }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? "#fff" : "rgba(255,255,255,0.72)"}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {d}
  </svg>
);

export const ICONS = {
  home: <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.4" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </>
  ),
  truck: (
    <>
      <rect x="2" y="7" width="12" height="9" rx="1" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  coin: (
    <>
      <ellipse cx="12" cy="7" rx="7" ry="3" />
      <path d="M5 7v6c0 1.7 3.1 3 7 3s7-1.3 7-3V7" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 2.5 20h19z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </>
  ),
};

/* -------------------------------------------------------------------- SIDEBAR */
const Sidebar = ({ activeNav = 3 }) => {
  const { opacity, y } = useEnter(0, 0);
  const set = ["home", "user", "doc", "target", "grid", "truck", "coin", "alert"];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 84,
        height: "100%",
        background: THEME.navy,
        opacity,
        transform: `translateX(${y - 24 * (1 - opacity)}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 18,
        gap: 26,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "#fff",
          color: THEME.navy,
          fontFamily: THEME.fontDisplay,
          fontWeight: 800,
          fontSize: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        K.
      </div>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          background: "rgba(255,255,255,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon d={<path d="M9 6l6 6-6 6" />} />
      </div>
      {set.map((k, i) => {
        const active = i === activeNav;
        return (
          <div
            key={k}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: active ? THEME.blue : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {i === 3 ? (
              <span
                style={{
                  color: active ? "#fff" : "rgba(255,255,255,0.72)",
                  fontFamily: THEME.fontDisplay,
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                T
              </span>
            ) : (
              <Icon d={ICONS[k]} active={active} />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* --------------------------------------------------------------------- TOPBAR */
const TopBar = ({ breadcrumb }) => {
  const { opacity } = useEnter(2);
  return (
    <div
      style={{
        position: "absolute",
        left: 84,
        top: 0,
        right: 0,
        height: 76,
        background: THEME.surface,
        borderBottom: `1px solid ${THEME.line}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 34px",
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          fontFamily: THEME.fontBody,
          fontSize: 14,
          letterSpacing: 0.6,
          color: THEME.muted,
          fontWeight: 600,
        }}
      >
        {breadcrumb.map((b, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ opacity: 0.5 }}>/</span>}
            <span>{b}</span>
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div
          style={{
            padding: "9px 16px",
            borderRadius: 10,
            border: `1px solid ${THEME.line}`,
            fontFamily: THEME.fontBody,
            fontSize: 14,
            fontWeight: 600,
            color: THEME.ink,
          }}
        >
          Perguntar ao ChatGPT
        </div>
        <div style={{ fontFamily: THEME.fontBody, fontSize: 14, fontWeight: 700, color: THEME.ink }}>
          PT
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------- SEGMENTED TABS */
/* Controle de abas em pílula (RESULTADO / LANÇAMENTOS E NOTAS / …). */
export const SegmentedTabs = ({ tabs, activeIndex = 0, appear = 8 }) => {
  const { opacity, y } = useEnter(appear);
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        background: "#EDEFF4",
        padding: 6,
        borderRadius: 12,
        width: "fit-content",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      {tabs.map((t, i) => {
        const active = i === activeIndex;
        return (
          <div
            key={t}
            style={{
              padding: "11px 20px",
              borderRadius: 9,
              fontFamily: THEME.fontDisplay,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 0.4,
              background: active ? THEME.surface : "transparent",
              color: active ? THEME.ink : THEME.muted,
              boxShadow: active ? "0 2px 8px rgba(3,10,139,0.10)" : "none",
            }}
          >
            {t}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ APPSHELL */
/* Sidebar + TopBar + área de conteúdo. As cenas passam o conteúdo em children. */
export const AppShell = ({ breadcrumb, activeNav = 3, contentPadding = "34px 40px", children }) => {
  return (
    <>
      <Sidebar activeNav={activeNav} />
      <TopBar breadcrumb={breadcrumb} />
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 76,
          right: 0,
          bottom: 0,
          padding: contentPadding,
        }}
      >
        {children}
      </div>
    </>
  );
};

export default AppShell;
