# Panel Layout Intentions

## Executive Summary
- **Propósito**: Coordinar a los equipos de Front-end, UI/UX y Core Platform para entregar un panel lateral cuyos módulos (tarjetas) compartan un sistema de reglas heredadas, garantizando consistencia visual con la visión de Manda Studio.
- **Estado actual**: El layout vigente depende de contenedores flex personalizados por sección; cada tarjeta define sus propios tamaños, provocando estiramientos de lado a lado y composiciones disparejas respecto a las capturas de referencia.
- **Próximo hito**: Consolidar un set común de clases, tokens y breakpoints para todas las tarjetas, logrando autoacomodo fluido a partir de 720 px sin que ninguna tarjeta se expanda a ocupar el ancho completo del panel.
- **KPIs asociados**: mantener proporciones y espaciados alineados con las vistas `Settings`, `Historial`, `Parámetros`, `Modelos` y `API Keys` compartidas en el hilo actual.

## Contexto y Visión
- **Ubicación**: El panel lateral se define en `index.html` dentro de `.card-navigation-container` y es renderizado dinámicamente por `scripts/sidebar-navigation.js`.
- **Visión**: Proveer navegación contextual mediante tarjetas (`.nav-card`) que reflejen estado del sistema, accesos a historial, parámetros, modelos, API keys y configuración general.
- **Criterios de experiencia**: Distribución responsiva tipo mosaico, consistencia cromática entre temas (`styles/dark.css`, `styles/themes/gray-theme.css`), lectura clara y sensación de aplicación profesional.

## Snapshot de Implementación Actual
- **Renderizado**: `renderCardGrid()` continúa siendo el punto de inserción, pero ahora deposita tarjetas en contenedores flex (`.card-deck`) dentro de `section#panel-A`.
- **CSS principal**: `styles/navigation-styles.css` y `styles/nav-cards.css` contienen reglas ad-hoc por tarjeta (anchos fijos, `margin` manuales), mientras que `styles/panel-layout.css` y `styles/sidebar-layout.css` definen la estructura general del panel.
- **Temas**: `styles/dark.css` y `styles/themes/gray-theme.css` siguen aplicando overrides con `!important`, hoy impactan bordes, sombras y anchos máximos, generando diferencias entre tarjetas de distintos módulos.
- **Referencia positiva**: El conjunto de tarjetas del menú `Settings` respeta dimensiones coherentes (`width: 18rem`, `max-width: 22rem`, `aspect-ratio: 4/3`) y se dispone mediante `.nav-card-grid` con `flex-wrap: wrap` y `gap: 1.25rem`, ofreciendo un punto de partida para la normalización.

## Problemas Observados
- **Anchos inconsistentes**: Las tarjetas se estiran a `width: 100%` en vista desktop, perdiendo la proporción contenida observada en las capturas (`~320–360 px` cada módulo).
- **Espaciado desigual**: El uso de `margin` manual provoca huecos distintos entre filas; en algunos paneles (p. ej. `Historial`) las tarjetas quedan pegadas al borde izquierdo.
- **Herencia fragmentada**: Cada vista redefine tipografías, paddings y radios; sin un set común de tokens los equipos están replicando estilos.
- **Falta de agrupadores**: Las tarjetas no comparten un contenedor “deck” que limite el ancho total ni gestione `gap`, lo que impide autoacomodo uniforme cuando el panel cambia de tamaño.

> **Decisión reciente**: Se abandona definitivamente el enfoque de CSS Grid para estas tarjetas. En su lugar, se implementará un sistema de reglas heredadas basado en flexbox + anchuras mínimas/máximas compartidas, que permita autoacomodo con límites claros para evitar estiramientos extremos.

## Hipótesis de Causa Raíz
- **Tokens dispersos**: La ausencia de variables compartidas para anchos, `gap` y radios obliga a declarar valores absolutos en cada tarjeta.
- **Contenedores sin límite**: `.card-navigation-container` permite expansión total; sin un `max-width` heredado las tarjetas intentan ocupar el 100 %.
- **Overrides temáticos**: Los temas aplican `width: 100% !important` o `padding` desalineados que desfiguran el layout unificado.
- **JS sin conocimiento del layout**: `updateCardGridLayout()` solo alterna `data-layout`, pero no sincroniza las clases nuevas (`.card-deck`, `.card-slot`), generando estados mezclados.

## Estrategias en Curso y Log de Investigación
- **Mapa de tokens**: Inventariar todos los valores actuales de ancho, `gap`, `padding` y radios para consolidarlos en variables CSS (`--card-width`, `--card-gap`, etc.).
- **Prototipo `card-deck`**: Construir un contenedor flex reutilizable con `flex-wrap: wrap`, `gap` homogéneo y `justify-content: flex-start` que limite `max-width` y centre el contenido.
- **Sincronización JS**: Actualizar `renderCardGrid()` y `updateCardGridLayout()` para que utilicen clases semánticas (`.card-deck`, `.card-slot`, `.card`) en lugar de `data-layout` legacy.
- **Auditoría de temas**: Identificar reglas con `!important` que afecten dimensiones; preparar overrides neutros o tokens específicos por tema.
- **Verificación visual**: Comparar las vistas `Settings`, `Historial`, `Parámetros`, `Modelos` y `API Keys` con las capturas provistas para validar proporciones.

## Objetivos y Criterios de Éxito
- **O1**: Mantener tarjetas en bloques de 320–360 px de ancho con `gap` constante (24 px desktop) y composición centrada.
- **O2**: Garantizar autoacomodo responsive: 1 columna (<600 px), 2 columnas (≥720 px) y 3 columnas máximo (≥1080 px) sin que las tarjetas se estiren a `100%`.
- **O3**: Asegurar que todos los módulos hereden tipografías, paddings y radios desde el sistema común, permitiendo overrides solo por variante.
- **O4**: Documentar tokens, clases y hooks JS para QA y otros equipos, incluyendo checklist visual por vista.

## Collaboration Backlog
| Prioridad | Tarea | Responsable sugerido | Artefactos involucrados | Estado |
| --- | --- | --- | --- | --- |
| Alta | Definir tokens globales de layout (`--card-width`, `--card-gap`, `--deck-max-width`) y aterrizarlos en `styles/base.css` | Front-end | `styles/base.css`, `styles/navigation-styles.css` | Pendiente |
| Alta | Refactorizar `renderCardGrid()` / `updateCardGridLayout()` para aplicar `.card-deck` y `.card-slot` | Core Platform JS | `scripts/sidebar-navigation.js` | Pendiente |
| Media | Ajustar temas (`dark.css`, `themes/gray-theme.css`) para consumir tokens en vez de `!important` | UI Theming | `styles/dark.css`, `styles/themes/gray-theme.css` | Pendiente |
| Media | Crear guía visual con specs por variante de tarjeta y validar contra capturas | Product Design | `PANEL-INTENTIONS.md`, assets UI | En progreso |
| Baja | Instrumentar pruebas responsivas automáticas (Percy/Playwright screenshot) con breakpoints clave | QA | `tests/visual/`, ambiente CI | Planificado |

## Riesgos y Dependencias
- **Herencia no rastreada**: Múltiples hojas pueden seguir reescribiendo valores; requiere coordinación transversal.
- **Regresiones en otros breakpoints**: Cambios para el panel podrían afectar vista móvil del chat.
- **Tiempo de QA**: Validación visual en dispositivos reales (Android WebView) podría extenderse.
- **Dependencia de temas**: El nuevo `data-theme="gray"` debe alinearse con los ajustes propuestos para no reintroducir el problema.

## Propuestas de Solución (para discutir)
- **S1 (Prioritaria)**: Formalizar el sistema `card-deck` → `card-slot` → `card` con reglas heredadas (flex-wrap, `gap`, `max-width`, `align-content`, sombras y radios) que todas las vistas deben consumir.
- **S2**: Introducir tokens CSS globales para dimensiones, tipografía y elevación; evitar valores hardcodeados en cada tarjeta.
- **S3**: Integrar toggles JS (`deckLayout = "compact" | "spread"`) que solo modifiquen tokens (p. ej. `--card-gap`, `--card-min-width`) sin cambiar markup.
- **S4**: Documentar variantes de tarjeta (regular, emphasis, wide) y sus overrides permitidos, con ejemplos en `docs/`.
- **S5**: Mantener un fallback de columna única para móviles usando media queries basados en los tokens compartidos.

## Próximos Pasos Inmediatos
- **P1**: Consolidar y publicar tokens en `styles/base.css`; incluir tabla en este documento.
- **P2**: Adaptar `scripts/sidebar-navigation.js` para generar `div.card-deck > div.card-slot > article.card`.
- **P3**: Revisar temas para retirar `!important` en dimensiones y sustituir por tokens.
- **P4**: Capturar comparativas por vista con el nuevo sistema y adjuntarlas.

## Plan de Implementación del Sistema Heredado (2025-10-26)
- **Principios**:
  - Todas las tarjetas consumen los mismos tokens: `--card-min-width: 320px`, `--card-max-width: 360px`, `--card-gap: 24px`, `--deck-max-width: 1140px`.
  - Cada `card-deck` centra su contenido con `margin-inline: auto`, aplica `padding-inline: var(--deck-horizontal-padding, 24px)` y no permite que las tarjetas lleguen a los bordes.
  - Los temas solo pueden ajustar colores, sombras y tipografía mediante variables; cualquier cambio dimensional debe pasar por tokens.
- **Reglas base extraídas de `Settings`**:
  - `.nav-card` (`styles/nav-cards.css`) fija `width: 18rem`, `max-width: 22rem`, `aspect-ratio: 4 / 3`, `padding: 18px` y `border-radius: var(--radius)`; estos valores alimentan `--card-min-width`, `--card-max-width` y `--card-padding`.
  - `.nav-card-grid` (`styles/navigation-styles.css`) aplica `display: flex`, `flex-wrap: wrap`, `gap: 1.25rem` y `justify-content: center`; estos parámetros definen `--card-gap` y `--deck-justify` para replicar el comportamiento balanceado observado en las capturas.
  - En modo vertical (`[data-layout="vertical"]`) las tarjetas expanden `width: 100%`; el sistema heredado debe conservar este fallback usando `--card-vertical-width: 100%` para vistas enfocadas en detalle.
- **Cambios planeados**:
  - `styles/navigation-styles.css`: Introducir clases `.card-deck`, `.card-slot`, `.card`, `.card--wide`, `.card--tall`, `.card--inline-controls` con reglas heredadas.
  - `styles/nav-cards.css`: Depender de tokens globales para `padding`, `border-radius`, `box-shadow` y estados hover.
  - `scripts/sidebar-navigation.js`: Generar estructura semántica (`<article>` para tarjetas) y exponer `deckLayout` para toggles compactos.
- **Resultado esperado**: Distribución flexible que replica las composiciones de las capturas (2 columnas principales, máximo 3) sin necesidad de CSS Grid.
- **Control de calidad**: Checklist visual por vista, verificación en resoluciones 480 px, 768 px, 1024 px y 1280 px.

## Ciclo Intensivo de Mejora Continua
- **Cadencia**: Ciclo continuo de 4 etapas consecutivas; cada iteración produce un incremento verificable y una bitácora adjunta a `PANEL-INTENTIONS.md`.
- **Equipo núcleo**: Front-end (lidera tokens y layout), UI/UX (define specs visuales), Core Platform JS (instrumenta hooks), QA (automatiza validaciones) y Product Design (documenta hallazgos).

### Etapas del ciclo
- **E1 · Descubrimiento**
  - Auditoría de vistas activa (`Settings`, `Historial`, `Parámetros`, `Modelos`, `API Keys`).
  - Inventario de brechas respecto a tokens y layout heredado.
  - Entregable: informe con capturas marcadas y checklist de tokens incumplidos.
- **E2 · Prototipo guiado**
  - Ajustes controlados en rama `feature/deck-iteration-N` aplicando tokens.
  - Validación en Storybook/Sandbox con medidas (`card-deck` medido con rulers DevTools).
  - Entregable: pull request con snippet comparativo y notas de compatibilidad móvil.
- **E3 · Validación integrada**
  - QA ejecuta pruebas visuales (`tests/visual/`) y smoke funcional en panel real.
  - Métricas recolectadas: `DeckCoverage%`, `CardHarmonyScore`, `OverflowIncidents`.
  - Entregable: reporte de QA con semáforo por vista.
- **E4 · Cierre y aprendizaje**
  - Retro de 30 min, actualización de `PANEL-INTENTIONS.md` y sincronización con roadmap.
  - Documentar ajustes pendientes para el próximo ciclo (gap de tokens, solicitudes de UX).
  - Entregable: sección "Notas de Iteración N" agregada al apéndice.

### Métricas clave
- **DeckCoverage%**: Porcentaje de tarjetas que respetan `--card-min-width`/`--card-max-width` en los breakpoints meta.
- **CardHarmonyScore**: Evaluación heurística 0–100 combinando alineación, espaciado y consistencia tipográfica; objetivo ≥85.
- **OverflowIncidents**: Recuento de veces que una tarjeta excede bordes o provoca scroll horizontal; objetivo 0.
- **ThemeDrift**: Número de overrides por tema fuera de tokens; objetivo ≤2 por iteración.

### Tabla de iteraciones intensivas (primer bloque)
| Iteración | Objetivo focal | Responsable líder | Entregables clave |
| --- | --- | --- | --- |
| I1 | Formalizar `card-deck` en `Settings` y `API Keys` | Front-end | PR tokens + reporte QA + notas iteración |
| I2 | Extender reglas a `Historial` y `Parámetros` | Core Platform JS | Actualización `renderCardGrid()`, métricas DeckCoverage |
| I3 | Afinar temas (`dark`, `gray`) y estados hover | UI/UX + Theming | Tabla ThemeDrift, snapshots visuales, checklist móvil |

- **Checkpoint operativo**: Reunión breve para revisar métricas y bloqueadores.
- **Review integral**: Demostración interna de la iteración y aprobación para merge.
- **Control de riesgos**: Flag inmediato si `DeckCoverage% < 70%` o `OverflowIncidents > 0`, priorizando hotfix.
- **Documentación**: Cada ciclo añade sección en el apéndice con capturas antes/después, métricas y acuerdos.

## Apéndice
- **Capturas de referencia**: Consultar galería suministrada en el hilo actual (capturas `settings` en layouts esperados).
- **Snippets clave**:
  - `styles/navigation-styles.css` — definición de `.nav-card-grid` y spacing.
  - `styles/nav-cards.css` — configuración de `aspect-ratio`, `max-width` y estados hover.
  - `scripts/sidebar-navigation.js` — funciones `renderCardGrid()` y `updateCardGridLayout()`.
- **Historial**: Este documento debe actualizarse con cada iteración; considerar añadir fechas y firmas cuando se registren acuerdos de diseño.
