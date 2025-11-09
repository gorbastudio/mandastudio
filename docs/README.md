# Manda Studio — Alfa v53

## Overview
Manda Studio es una interfaz web para gestionar conversaciones asistidas por IA, con énfasis en personalización de temas, manejo de adjuntos y control detallado del historial de chats.

## Características principales
- **Theming dinámico**: Conmutación entre temas `dark`, `light`, `indigo-dark` e `indigo-light` mediante CSS variables (`scripts/theme-manager.js`).
- **Gestión de chats**: `scripts/chat-manager.js` renderiza tarjetas con acciones (copiar, descargar, renombrar, eliminar, fusionar) y controla la selección múltiple.
- **Entrada enriquecida**: `scripts/input-tray.js` integra adjuntos multiformato respaldados por `scripts/file-handler.js`.
- **Fondos personalizables**: `scripts/background-manager.js` aplica imágenes manteniendo relación de aspecto, opacidad ajustable y sincronización con `resize`.
- **Acciones con iconos**: cada mensaje ofrece botones circulares (copiar, eliminar, regenerar) con iconografía SVG accesible (`scripts/chat-ui.js`, `styles/messages.css`).
- **Accesibilidad**: Etiquetas `aria`, foco consistente, componentes con `sr-only` y controles navegables por teclado.

## Estructura del repositorio
```
PAGES/
├── components/          # Iconos SVG y recursos gráficos
├── docs/                # Documentación en Markdown
├── scripts/             # Lógica modular del front-end
├── styles/              # Hojas de estilo y temas
├── templates/           # Plantillas base (cuando aplica)
├── index.html           # Punto de entrada de la SPA
└── serverter-alfa02.exe # Servidor local empaquetado
```

## Inicio rápido
- **Descomprimir** la carpeta `PAGES` o clonar el repositorio.
- **Abrir `index.html`** en un navegador moderno.
- **Elegir tema** desde Configuraciones → Temas.
- **Adjuntar archivos** con el botón de clip o arrastrando al input tray.
- **Configurar fondo** usando los campos "Fondo del área de mensajes" para URL y opacidad.

## Flujo sugerido de desarrollo
1. Servir el proyecto con una herramienta estática (`http-server`, `live-server`, etc.).
2. Editar módulos en `scripts/` y `styles/`, recargar el navegador.
3. Verificar manualmente en cada commit: cambios de tema, carga de fondos, acciones del historial, íconos por mensaje y merge de chats.
4. Documentar nuevas capacidades en `docs/` (ver archivos `ARCHITECTURE.md`, `THEMING.md`, `release-notes.md`).

## Créditos
- Autor: Gorba Studio.
- Versión documentada: **Manda Studio alfa-v53**.
