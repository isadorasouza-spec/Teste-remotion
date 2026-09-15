/**
 * Cena 1 — Lista de clientes (tela inicial de Simulações). Bloco 0:00–0:30.
 * Remotion · 1920x1080 · 30fps · 300 frames piloto.
 *
 * Interface fiel ao produto (marca BlueMetrics). Anima: chrome, banner de aviso,
 * tag Reforma Tributária, título/subtítulo, botões e a lista revelando linha a
 * linha. Herói: contador do badge "5 clientes" e a entrada escalonada das linhas.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { THEME } from "../ui/tokens";
import { useCountUp, useEnter } from "../ui/motion";
import { AppShell } from "../ui/AppShell";

const ORANGE = "#E8811F";
const ORANGE_SOFT = "#FDF3E7";

const DATA = {
  breadcrumb: ["SIMULAÇÕES"],
  bannerStrong: "RECURSO EM FASE DE TESTES",
  banner:
    "Valores finais das alíquotas e datas da reforma ainda podem sofrer mudanças.",
  tag: "REFORMA TRIBUTÁRIA",
  titleParts: [
    { t: "Escolha um " },
    { t: "cliente", i: true },
    { t: " para ver as simulações." },
  ],
  subtitle:
    "Só aparecem aqui os clientes que já têm alguma simulação tributária criada.",
  btnGhost: "Ver cronograma",
  btnPrimary: "Nova simulação",
  searchPlaceholder: "Buscar cliente, simulação ou grupo",
  count: 5,
  rowBtn: "VER SIMULAÇÕES",
  clients: [
    { initials: "BM", name: "Bella Moda Indústria Têxtil Ltda.", sims: 2, groups: 0 },
    { initials: "BS", name: "Brasa Sul Indústria de Alimentos Ltda.", sims: 11, groups: 1 },
    { initials: "CA", name: "Construtora Atlas Ltda.", sims: 1, groups: 0 },
    { initials: "MS", name: "MobiTech Soluções Digitais Ltda.", sims: 7, groups: 2 },
    { initials: "VD", name: "Vértice Distribuidora Atacadista Ltda.", sims: 5, groups: 1 },
  ],
};

const Avatar = ({ initials }) => (
  <div
    style={{
      width: 46,
      height: 46,
      borderRadius: 12,
      background: "#EDEFFB",
      color: THEME.navy,
      fontFamily: THEME.fontDisplay,
      fontWeight: 800,
      fontSize: 16,
      letterSpacing: 0.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {initials}
  </div>
);

const Metric = ({ value, label }) => (
  <div style={{ width: 130, textAlign: "center" }}>
    <div
      style={{
        fontFamily: THEME.fontBody,
        fontWeight: 800,
        fontSize: 22,
        color: THEME.ink,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontFamily: THEME.fontDisplay,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: 0.6,
        color: THEME.muted,
        marginTop: 2,
      }}
    >
      {label}
    </div>
  </div>
);

const ClientRow = ({ client, index }) => {
  const appear = 70 + index * 14;
  const { opacity, y } = useEnter(appear);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "20px 26px",
        borderTop: index === 0 ? "none" : `1px solid ${THEME.line}`,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <Avatar initials={client.initials} />
      <div
        style={{
          flex: 1,
          fontFamily: THEME.fontDisplay,
          fontWeight: 700,
          fontSize: 20,
          color: THEME.ink,
        }}
      >
        {client.name}
      </div>
      <Metric value={client.sims} label={client.sims === 1 ? "SIMULAÇÃO" : "SIMULAÇÕES"} />
      <Metric value={client.groups} label={client.groups === 1 ? "GRUPO" : "GRUPOS"} />
      <div
        style={{
          padding: "12px 20px",
          borderRadius: 10,
          border: `1px solid ${THEME.line}`,
          fontFamily: THEME.fontDisplay,
          fontWeight: 700,
          fontSize: 12.5,
          letterSpacing: 0.6,
          color: THEME.blue,
          flexShrink: 0,
        }}
      >
        {DATA.rowBtn}
      </div>
    </div>
  );
};

export const Cena1Clientes = () => {
  const frame = useCurrentFrame();
  const banner = useEnter(6);
  const tag = useEnter(16);
  const title = useEnter(22, 22);
  const sub = useEnter(28);
  const btns = useEnter(32);
  const search = useEnter(44);

  const countRaw = useCountUp(DATA.count, 50, 22);
  const count = Math.round(countRaw);
  // realce (herói) do badge de contagem em azul do produto
  const badgePulse = interpolate(frame, [72, 84, 100], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: THEME.pageBg }}>
      <AppShell breadcrumb={DATA.breadcrumb}>
        {/* Banner de aviso */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: ORANGE_SOFT,
            border: `1px solid ${ORANGE}33`,
            borderRadius: 12,
            padding: "12px 18px",
            opacity: banner.opacity,
            transform: `translateY(${banner.y}px)`,
          }}
        >
          <div
            style={{
              fontFamily: THEME.fontDisplay,
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: 0.7,
              color: "#fff",
              background: ORANGE,
              padding: "5px 10px",
              borderRadius: 7,
              flexShrink: 0,
            }}
          >
            {DATA.bannerStrong}
          </div>
          <div style={{ fontFamily: THEME.fontBody, fontSize: 14.5, color: "#8A5A22" }}>
            {DATA.banner}
          </div>
        </div>

        {/* Card principal */}
        <div
          style={{
            marginTop: 24,
            background: THEME.surface,
            borderRadius: 20,
            border: `1px solid ${THEME.line}`,
            boxShadow: "0 24px 60px -30px rgba(3,10,139,0.18)",
            padding: "36px 40px",
          }}
        >
          {/* Header: tag + título + botões */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ maxWidth: 900 }}>
              <div
                style={{
                  display: "inline-block",
                  fontFamily: THEME.fontDisplay,
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: 0.9,
                  color: THEME.blue,
                  background: "#EDEFFB",
                  padding: "6px 12px",
                  borderRadius: 8,
                  opacity: tag.opacity,
                  transform: `translateY(${tag.y}px)`,
                }}
              >
                {DATA.tag}
              </div>
              <div
                style={{
                  fontFamily: THEME.fontDisplay,
                  fontWeight: 800,
                  fontSize: 40,
                  color: THEME.ink,
                  marginTop: 16,
                  lineHeight: 1.15,
                  opacity: title.opacity,
                  transform: `translateY(${title.y}px)`,
                }}
              >
                {DATA.titleParts.map((p, i) => (
                  <span key={i} style={{ fontStyle: p.i ? "italic" : "normal" }}>
                    {p.t}
                  </span>
                ))}
              </div>
              <div
                style={{
                  fontFamily: THEME.fontBody,
                  fontSize: 16,
                  color: THEME.muted,
                  marginTop: 12,
                  opacity: sub.opacity,
                  transform: `translateY(${sub.y}px)`,
                }}
              >
                {DATA.subtitle}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                opacity: btns.opacity,
                transform: `translateY(${btns.y}px)`,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  padding: "13px 22px",
                  borderRadius: 11,
                  background: THEME.ink,
                  color: "#fff",
                  fontFamily: THEME.fontDisplay,
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {DATA.btnGhost}
              </div>
              <div
                style={{
                  padding: "13px 22px",
                  borderRadius: 11,
                  background: THEME.blue,
                  color: "#fff",
                  fontFamily: THEME.fontDisplay,
                  fontWeight: 700,
                  fontSize: 14,
                  boxShadow: "0 10px 24px -10px rgba(12,39,232,0.6)",
                }}
              >
                {DATA.btnPrimary}
              </div>
            </div>
          </div>

          {/* Busca + badge de contagem */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 30,
              opacity: search.opacity,
              transform: `translateY(${search.y}px)`,
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 12,
                border: `1px solid ${THEME.line}`,
                borderRadius: 12,
                padding: "14px 18px",
                background: "#FBFCFE",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={THEME.muted} strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.2-3.2" />
              </svg>
              <div style={{ fontFamily: THEME.fontBody, fontSize: 15, color: THEME.muted }}>
                {DATA.searchPlaceholder}
              </div>
            </div>
            <div
              style={{
                fontFamily: THEME.fontDisplay,
                fontWeight: 800,
                fontSize: 14,
                color: THEME.blue,
                background: "#EDEFFB",
                padding: "12px 18px",
                borderRadius: 11,
                fontVariantNumeric: "tabular-nums",
                boxShadow: `0 0 0 ${3 * badgePulse}px rgba(12,39,232,${0.25 * badgePulse})`,
              }}
            >
              {count} clientes
            </div>
          </div>

          {/* Lista */}
          <div
            style={{
              marginTop: 20,
              border: `1px solid ${THEME.line}`,
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            {DATA.clients.map((c, i) => (
              <ClientRow key={c.initials} client={c} index={i} />
            ))}
          </div>
        </div>
      </AppShell>
    </AbsoluteFill>
  );
};

export default Cena1Clientes;
