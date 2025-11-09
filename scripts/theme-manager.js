// theme-manager.js - Gestiona la aplicación del tema gris único

const THEME_STYLESHEET_PATH = 'styles/themes/gray-theme.css';

export function initializeThemeManager() {
    applyTheme();
}

export function applyTheme() {
    const stylesheet = document.getElementById('theme-stylesheet');
    if (!stylesheet) {
        console.error('No se encontró la hoja de estilos del tema (theme-stylesheet).');
        return;
    }

    stylesheet.setAttribute('href', THEME_STYLESHEET_PATH);
    document.documentElement.setAttribute('data-theme', 'gray');
}

// Compatibilidad: expone applyTheme para utilizarse desde la consola si es necesario
window.applyTheme = applyTheme;
