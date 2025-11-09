# Guía de contribución

## Requisitos previos
- Node.js 18+ (recomendado para ejecutar utilidades de desarrollo).
- Editor con soporte para ES modules y linting (VSCode recomendado).
- Conocimientos básicos de HTML, CSS (variables, layout) y JavaScript ES6.

## Flujo de trabajo sugerido
1. Crear una rama o copia local antes de realizar cambios.
2. Servir la aplicación con una herramienta estática para pruebas (`http-server`, `live-server`).
3. Realizar cambios en módulos específicos (evitar modificaciones globales sin justificación).
4. Probar manualmente:
   - Cambio de temas (`scripts/theme-manager.js`).
   - Fusión/acciones en historial (`scripts/chat-manager.js`).
   - Burbujas y botones (iconos en `scripts/chat-ui.js`).
   - Gestor de fondo (`scripts/background-manager.js`).
5. Actualizar documentación relevante en `docs/` (README, ARCHITECTURE, THEMING, release-notes).
6. Generar nuevo artefacto ZIP si la versión cambia.

## Estándares de código
- Usar ES modules y evitar variables globales no necesarias.
- Mantener nombres descriptivos y comentarios concisos.
- Respetar el formato existente (indentación de 4 espacios en JS y CSS actual).
- Encapsular estilos en archivos asociados (layout, sidebar, messages, themes).

## Reporte de issues
Al crear un issue nuevo, incluye:
- Descripción clara del problema o mejora propuesta.
- Pasos para reproducir (si aplica).
- Capturas de pantalla o logs.
- Propuesta de solución o áreas del código afectadas.

## Ciclo de release
- Incrementar la versión (ej. alfa-v54) en `index.html` y `docs/release-notes.md`.
- Actualizar `docs/README.md` con la descripción de cambios.
- Regenerar el ZIP de distribución (`Compress-Archive`).
