# Kontiva · Vídeo Reforma Tributária (Remotion)

Vídeo explainer (1920×1080, 30fps) do simulador de Reforma Tributária do Kontiva,
recriando a interface real do produto em Remotion e embrulhando tudo na moldura de
marca (abertura, transições de radar e encerramento). Feito a partir do PRD
`PRD-video-kontiva-remotion.md`.

> **Fidelidade ao produto (v2):** as 7 cenas foram reconstruídas a partir do código
> real do repositório `Bluemetrics/blueaccount-ai` (`apps/frontend`), não mais da
> reconstrução do Anexo A. A interface real de Simulações é CLARA (canvas
> `#F2F4F7`, cards brancos), com barra lateral e topbar navy `#0A1F3F` e acento
> ciano `#00D4FF`; fontes reais Space Grotesk (display), Inter (corpo/números) e
> Instrument Serif (itálico de acento). Layout, rótulos, colunas, abas e o drawer
> de linha seguem os componentes reais (`MvpSimulacoesPage`,
> `MvpSimulacaoClientePage`, `MvpSimulacaoEditorPage`, `MvpSimulacaoSeriePage`); os
> dados de negócio vêm do Anexo A. Onde a interface real conflita com o PRD (que
> descrevia um tema claro diferente e proibia ciano na UI), seguimos o código real,
> conforme pedido — inclusive a Cena 5, refeita para a tela real de Resultado.

## Comandos

```bash
npm install          # instala Remotion + @remotion/google-fonts
npm run dev          # abre o Remotion Studio (composição Master + cenas isoladas)
npm run compositions # lista todas as composições
npm run render       # gera out/master.mp4
```

`npm run dev` e `npm run render` funcionam direto numa máquina local com internet
(o Remotion baixa o próprio Chromium na primeira execução).

### Ambiente remoto / sandbox (sem download de navegador)

Neste ambiente de execução remoto o Remotion não consegue baixar o Chromium dele,
mas há um Chromium headless pré-instalado. Use o binário `headless_shell` (o Chrome
completo removeu o modo "old headless" que o Remotion usa) e ignore a checagem de
certificado do proxy de egresso (o tráfego continua passando pelo proxy de política;
isso só permite o download das Google Fonts):

```bash
export BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
export NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt

# listar composições
npx remotion compositions src/index.jsx \
  --browser-executable="$BROWSER" --ignore-certificate-errors

# still de prova por cena (exemplo)
npx remotion still src/index.jsx Cena1Clientes out/stills/Cena1Clientes.png \
  --frame=150 --browser-executable="$BROWSER" --ignore-certificate-errors

# render final
npx remotion render src/index.jsx Master out/master.mp4 \
  --browser-executable="$BROWSER" --ignore-certificate-errors --concurrency=4
```

O `--ignore-certificate-errors` também está ligado no `remotion.config.js`
(`Config.setChromiumIgnoreCertificateErrors(true)`) para o Studio/render.

## Composições registradas

| id                 | duração (frames / s) | bloco do roteiro         |
|--------------------|----------------------|--------------------------|
| `Master`           | 3070 / 102,3s        | vídeo final encadeado    |
| `IntroKontiva`     | 120 / 4s             | abertura (moldura)       |
| `Cena1Clientes`    | 300 / 10s            | 0:00–0:30                |
| `Cena2Comparativo` | 300 / 10s            | 0:30–1:00                |
| `Cena3Lancamentos` | 600 / 20s            | 1:00–2:00                |
| `Cena4Creditos`    | 500 / 16,7s          | 2:00–2:50                |
| `KontivaResultado` | 300 / 10s            | 2:50–3:40 (cena 5)       |
| `Cena6Comparacao`  | 500 / 16,7s          | 3:40–4:30                |
| `Cena7FluxoCaixa`  | 320 / 10,7s          | 4:30–4:48                |
| `OutroKontiva`     | 130 / 4,3s           | encerramento (moldura)   |

O `Master` encadeia Abertura → Cena 1..7 → Encerramento, com um `RadarWipe` de 20
frames centrado em cada corte (começa em `corte − 10`). Os offsets são a soma das
durações e `MASTER_DURATION` é o total.

## Estrutura de arquivos

```
src/
  index.jsx              registerRoot(RemotionRoot)
  Root.jsx               registra todas as composições
  Master.jsx             encadeia o vídeo final (DURATIONS, MASTER_DURATION, RadarWipe)
  KontivaFraming.jsx     moldura de marca: IntroKontiva, RadarWipe, OutroKontiva (existente)
  KontivaResultado.jsx   Cena 5 (existente, refatorada para usar ui/*)
  scenes/
    Cena1Clientes.jsx    lista de clientes
    Cena2Comparativo.jsx comparativo do cliente Vértice
    Cena3Lancamentos.jsx lançamentos e notas — foco Receitas + drawer Classificação fiscal
    Cena4Creditos.jsx    lançamentos e notas — foco Créditos/Custos + drawer Tratamento fiscal
    Cena6Comparacao.jsx  comparativo 2027×2029 + overlay de delta (moldura/ciano)
    Cena7FluxoCaixa.jsx  gráfico combinado + tabela mensal
    lancamentosShared.jsx  base comum das cenas 3 e 4 (dados + tabela + drawer)
  ui/
    tokens.js            tokens do produto (extraídos do THEME) + carga das fontes Outfit/Wix
    motion.js            useCountUp e useEnter (vocabulário de movimento)
    AppShell.jsx         chrome reutilizável: Sidebar, TopBar/breadcrumb, SegmentedTabs
```

## Onde editar

- **Cores/fontes do produto:** `src/ui/tokens.js` (bloco `THEME`).
- **Cores/fontes da marca (moldura):** `src/KontivaFraming.jsx` (bloco `BRAND`).
- **Copy da moldura** (tagline, CTA): `src/KontivaFraming.jsx` (bloco `COPY`).
- **Dados/valores de cada cena:** bloco `DATA` no topo da cena. As cenas 3 e 4
  compartilham `src/scenes/lancamentosShared.jsx` (bloco `LANC`).
- **Durações / timing do vídeo:** `DURATIONS` em `src/Master.jsx`. Havendo locução,
  troque cada duração pelo tamanho do respectivo bloco do roteiro; o resto (offsets,
  `RadarWipe`, `MASTER_DURATION`) se recalcula sozinho.
- **Chrome (sidebar/topbar/abas):** `src/ui/AppShell.jsx`.

## Princípio das duas camadas (seção 4 do PRD)

- **Interface do produto (cenas 1–7):** fiel ao produto, marca BlueMetrics — navy,
  azul, verde para créditos/positivos, vermelho para débitos/negativos, fontes Outfit
  e Wix Madefor Text. **Sem ciano dentro da UI.**
- **Moldura (abertura, `RadarWipe`, callouts, encerramento):** design de marketing —
  azul profundo e ciano, Inter, Instrument Serif itálica e JetBrains Mono, radar.

Única exceção onde o ciano aparece "sobre" uma tela: os **deltas da Cena 6**
(setas/variação de ICMS, resultado e carga). O PRD (seção 8) define esse realce como
overlay de moldura, não elemento nativo da tela — por isso o ciano é permitido ali.

## Fontes

Carregadas via `@remotion/google-fonts`, restritas ao subset `latin` e aos pesos
usados (reduz centenas de requests de rede em render):

- Produto (`src/ui/tokens.js`): **Outfit** (display), **Wix Madefor Text** (corpo/números).
- Moldura (`src/KontivaFraming.jsx`): **Inter** (display), **Instrument Serif** itálica
  (1 palavra por título-chave, carregada em `normal` + `italic`), **JetBrains Mono**
  (números/labels/eyebrows).

Nomes de módulo do `@remotion/google-fonts` confirmados e funcionando: `Outfit`,
`WixMadeforText`, `Inter`, `InstrumentSerif`, `JetBrainsMono`. Nenhuma correção de
nome de import foi necessária.

## Fidelidade aos dados (Anexo A)

Só os valores confirmados por print recebem contagem/close. Itens marcados como
(aprox) no Anexo A ficam estáticos e de-enfatizados, sem close-up:

- **Cena 3:** as 6 linhas de Receitas e seus totais são confirmados e contam. Custos
  Diretos aparecem como resumo (totais confirmados) com o rótulo "valores em
  conferência"; as 8 linhas individuais (aprox) não recebem close.
- **Cena 6:** no "Resumo do fluxo de caixa", Receitas/Custos de 2029 são aprox —
  mostrados com prefixo `≈`, em cinza, sem contagem de destaque.
- **Cena 7:** só os meses 2027-02 a 2027-06 são confirmados (barras + linha + tabela).
  Os meses 2027-07/08 e 2028+ (aprox) aparecem como placeholders tênues no gráfico e
  `—` na tabela. As lacunas reais de meses do eixo X são respeitadas.

## Pendências (seção 9 do PRD) — precisam de confirmação da Isadora

- **Ritmo/tamanho dos números:** o padrão da Cena 5 (piloto) foi replicado nas demais
  (`useCountUp`, `useEnter`). Validar e ajustar se necessário.
- **Cena 7, "cashback de até 540 dias":** não existe em nenhuma tela; **não foi
  inventado** nenhum elemento nativo. Fica na locução até decidir entre (a) card de
  destaque da moldura sobre o fluxo de caixa ou (b) manter só na narração.
- **Cena 6, deltas:** o overlay de variação (ciano) está implementado; confirmar se o
  formato agrada, já que não é nativo da tela real.
- **Locução:** sem narração gravada, foram usadas as durações piloto (seção 7). Com
  locução, sincronizar via `DURATIONS` em `Master.jsx`.

## Cards de impacto (v5)

Antes de cada tela entra um **card de impacto** no estilo da moldura de marca
(fundo navy, radar ciano, frase grande centralizada em Space Grotesk com uma
palavra em Instrument Serif itálica, sublinha em Inter e um traço ciano). Código
em `src/scenes/HookCard.jsx` (componente `HookCard`, dados em `HOOKS`); duração
`CARD_DUR = 84`. O `Master` intercala um card antes de cada segmento e o
`RadarWipe` revela a tela.

Frases (uma por tela):
- Abertura: "E se você enxergasse o impacto da Reforma *antes* dele acontecer?"
  (substitui a antiga tagline "Gestão contábil sem ponto cego"; a Abertura de
  marca passou a exibir "Clareza na Reforma *Tributária*").
- Cena 1: "Cada cliente vive uma Reforma *diferente*."
- Cena 2: "Mesmo negócio, dois anos, duas *cargas* tributárias."
- Cena 3: "Produtos parecidos, impostos bem *diferentes*."
- Cena 4: "Nem todo custo vira *crédito*."
- Cena 5: "Quanto sobra, quanto paga, quanto *recupera*."
- Cena 6: "O ICMS cai de R$ 105 mil para R$ 94 mil. Onde a Reforma *alivia*?"
- Cena 7: "Em que mês o caixa fica no *vermelho*?"

Total do vídeo com os cards: 3812 frames (~2:07). Cada card é uma composição
isolada no Studio (`Card0`..`Card7`).

## Animações da demo (v4)

Ajustes de ritmo e novas animações (helpers em `src/ui/anim.jsx`: `CameraStage`,
`Cursor`, `ClickRipple`, `useClickCursor`, `kf`):

- **Velocidade:** todos os movimentos (cursores, zooms, travellings) ficaram
  bem mais rápidos; durações das cenas reduzidas onde cabia.
- **Cena 2 → Cena 3:** no fim da Cena 2 o cursor clica na simulação **"Notas"**
  (com ripple e realce da linha), abrindo a tela de Lançamentos (Cena 3).
- **Cena 3:** a tela abre e a câmera **rola para baixo com zoom**, revelando as
  linhas de Receitas uma a uma (Massa, Pão, Manteiga, ...) até os totais e a
  seção Custos, depois volta ao enquadramento cheio. (O drawer de Classificação
  fiscal saiu da Cena 3 para não conflitar com a rolagem; a Classificação segue
  disponível na base, mas não é aberta aqui.)
- **Cena 4 (~0:38):** uma seta do mouse clica nas **colunas de crédito (IBS R$/
  CBS R$, grifadas em azul) da linha Manteiga** e só então abre o drawer
  "Tratamento fiscal".
- **Cena 6:** câmera dá **zoom em cada um dos 5 KPIs** (Cenários na série, Base
  tributável, ...), depois enquadra o **Comparativo anual** deslizando pelas
  colunas, e **rola para baixo** destacando o **Resumo do fluxo de caixa**.

Durações v4 (frames): c1 240 · c2 250 · c3 520 · c4 500 · c5 380 · c6 620 · c7 380.
Total 3140 frames (~1:45).

## Animações da demo (v3)

Camada extra de movimento, mantendo a interface real:

- **Cena 1:** um cursor de mouse desliza até o cliente **Vértice** (o que abre na
  Cena 2), clica (com ripple), e a linha salta "para frente" em 3D (`perspective`
  + `translateZ` + sombra + borda ciano) enquanto as outras recuam e escurecem.
  Duração 300 → 360 frames.
- **Cena 5:** uma "câmera" (wrapper com `transform: translate+scale`) dá zoom em
  cada um dos 4 KPIs em sequência, isolando um por vez (os demais escurecem), e
  volta ao overview mostrando a Apuração. Duração 300 → 440 frames.
- **Cena 7:** a câmera dá zoom no gráfico e faz um travelling horizontal seguindo
  a linha de saldo acumulado mês a mês (sobe no 2027-03, desce nos seguintes),
  passa pelas lacunas e volta ao enquadramento cheio, revelando a tabela mensal.
  Duração 320 → 440 frames. As coordenadas da câmera são calibradas em px de mundo
  (1920×1080) a partir do still do gráfico.

`Master.jsx` recalcula offsets e `MASTER_DURATION` a partir de `DURATIONS`
(agora 3390 frames ≈ 113s).

## Reconstrução para a interface real (v2)

- Origem: zip `blueaccount-ai-main.zip` (commitado no `main` deste repo), extraído e
  analisado (`apps/frontend/src`: `kontiva/kontiva.css` tokens, `components/nav`,
  `pages/Mvp*`).
- `src/ui/tokens.js`: tokens do produto trocados pelos reais (navy `#0A1F3F`, ciano
  `#00D4FF`, ciano-suave `#E0F9FF`, canvas `#F2F4F7`, verde `#16A34A`, vermelho
  `#DC2626`) e fontes reais (Space Grotesk, Inter, Instrument Serif).
- `src/ui/AppShell.jsx`: sidebar navy 260px com os grupos de navegação reais
  (Home/Clientes; Tributária; Cobranças; Administração), item ativo em ciano;
  topbar navy 64px com breadcrumb mono maiúsculo e seletor PT|EN. `SegmentedTabs`
  (abas do editor, maiúsculas) e `ClientTabs` (Grupos/Individuais).
- Cenas reconstruídas às telas reais: 1 = lista de clientes (cards), 2 = grupo
  "Comparativo Reforma" (SimulacaoRow), 3/4 = "Lançamentos e notas" (tabela de 9
  colunas + drawer de 6 abas: Classificação fiscal e Tratamento fiscal), 5 =
  ResultadoPanel (4 KPIs + Apuração IBS/CBS com "Total IVA"), 6 = série "Resumo"
  (5 KPIs + "Comparativo anual" com cabeçalho de 2 níveis + "Resumo do fluxo de
  caixa"), 7 = "Fluxo de caixa" (barras + linha de saldo acumulado + tabela mensal
  de 8 colunas).
- Formatação: BRL `R$ 1.234,00`; percentuais em pt-BR com vírgula (o código real
  tem um formatador com ponto em algumas telas e vírgula em outras; padronizamos na
  vírgula por ser o locale correto e coincidir com o Anexo A).
- Ciano dentro da UI agora é permitido (o produto real usa), revertendo a proibição
  do PRD. O overlay de delta da Cena 6 continua sendo moldura (ciano), pois a tela
  real não tem coluna de variação.

## Ajustes feitos nesta implementação

- Refatoração: extraídos `ui/tokens.js`, `ui/motion.js` e `ui/AppShell.jsx`; a Cena 5
  (`KontivaResultado.jsx`) foi movida para `src/` e passou a consumir esses módulos
  **sem mudança visual** (still de prova confere com o piloto original).
- `KontivaFraming.jsx` movido para `src/` sem alterar o design; só a carga de fontes
  foi restringida a pesos/subset e a Instrument Serif passou a carregar o estilo
  itálico de verdade.
- Carga de fontes otimizada (subset `latin` + pesos usados + `ignoreTooManyRequestsWarning`).
- `remotion.config.js`: `setChromiumIgnoreCertificateErrors(true)` para permitir o
  carregamento das Google Fonts atrás do proxy do ambiente remoto.

## Provas de compilação (feitas nesta sessão)

- `npx remotion compositions` lista as 10 composições, todas 1920×1080 30fps.
- Um `still` por cena renderizado em `out/stills/` (todas compilam).
- `out/master.mp4` renderizado com sucesso (3070 frames, ~7,8 MB).
