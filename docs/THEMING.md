# Theming en Manda Studio

## Visión general
La aplicación utiliza un enfoque basado en variables CSS para alternar entre esquemas de color. Cada tema se define en una hoja dedicada (`styles/theme-*.css`) y se activa al actualizar el atributo `data-theme` en `:root` junto con el `href` del `<link id="theme-stylesheet">`.

## Temas disponibles
- `dark`: Paleta oscura clásica (`styles/theme-dark.css`).
- `light`: Paleta clara (`styles/theme-light.css`).
- `indigo-dark`: Paleta índigo en tonos oscuros (`styles/theme-indigo.css`).
- `indigo-light`: Variante clara (`styles/theme-indigo-light.css`).

## Archivo base
`styles/variables.css` define las variables por defecto. Los temas las sobrescriben con valores acordes a cada estilo.

### Compatibilidad con variables legadas
Para garantizar que componentes antiguos sigan funcionando, los temas Indigo (`styles/theme-indigo*.css`) redefinen variables como `--bg-main`, `--gradient-chat`, `--accent-solid`, `--input-field-bg` y `--button-icon-color`. Si agregas un tema nuevo, revisa qué variables dependen los componentes antes de publicarlo.

## Gestor de temas
- Archivo: `scripts/theme-manager.js`.
- Funciones clave:
  - `initializeThemeManager()`: carga el tema guardado en `localStorage` y vincula eventos a radios y chips (`.theme-chip`).
  - `applyTheme(themeId)`: actualiza la hoja enlazada (`THEME_OPTIONS`) e inyecta el atributo `data-theme`.
  - `highlightSelectedOption(theme)`: sincroniza el estado visual de los controles.

## Controles en la UI
En `index.html`, la tarjeta "Tema de la interfaz" presenta cuatro botones `button.theme-chip[data-theme]` que invocan `applyTheme` al hacer clic.
Además existen radios (cuando estén activos) con `name="theme-mode"`; ambos controles se sincronizan mediante `highlightSelectedOption()`.

## Buenas prácticas
- Mantener los temas limitados a variables (sin redefinir reglas estructurales).
- Preferir colores en formato hex o `rgba()` para consistencia.
- Cuando se agregue un nuevo tema, actualizar `THEME_OPTIONS`, añadir su hoja `styles/theme-<nombre>.css` y sumar el chip correspondiente en la tarjeta de Configuraciones.
- Probar cada tema revisando: contraste de texto, botones de acciones por mensaje, bandeja de entrada y nueva imagen de fondo.
