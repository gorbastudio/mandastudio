// android-integration.js - Bridge helpers between the web app and the Android container

const DEFAULT_SYSTEM_BAR_COLOR = '#101018';
const HEX_COLOR_REGEX = /^#[0-9A-F]{6}$/;

function toHexComponent(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return null;
    const clamped = Math.max(0, Math.min(255, Math.round(num)));
    return clamped.toString(16).padStart(2, '0');
}

function normalizeToHex(colorValue) {
    if (!colorValue) return null;

    const trimmed = colorValue.trim();
    if (!trimmed) return null;

    if (HEX_COLOR_REGEX.test(trimmed.toUpperCase())) {
        return trimmed.toUpperCase();
    }

    const embeddedHex = trimmed.match(/#([0-9A-Fa-f]{6})/);
    if (embeddedHex) {
        return `#${embeddedHex[1].toUpperCase()}`;
    }

    const rgbMatch = trimmed.match(/rgba?\(([^)]+)\)/i);
    if (rgbMatch) {
        const parts = rgbMatch[1]
            .split(',')
            .map(part => part.trim())
            .filter(Boolean)
            .slice(0, 3);

        if (parts.length === 3) {
            const [r, g, b] = parts.map(toHexComponent);
            if (r && g && b) {
                return `#${r}${g}${b}`.toUpperCase();
            }
        }
    }

    return null;
}

function collectColorCandidates() {
    const root = document.documentElement;
    const styles = getComputedStyle(root);

    return [
        root.style.getPropertyValue('--android-system-bar-color'),
        styles.getPropertyValue('--android-system-bar-color'),
        styles.getPropertyValue('--system-bar-color'),
        styles.getPropertyValue('--status-bar-color'),
        styles.getPropertyValue('--background'),
        styles.getPropertyValue('--bg-main')
    ];
}

export function syncAndroidSystemBars() {
    if (!window.Android || typeof window.Android.setSystemBarColors !== 'function') {
        return;
    }

    const candidates = collectColorCandidates();
    let selectedColor = null;

    for (const candidate of candidates) {
        selectedColor = normalizeToHex(candidate);
        if (selectedColor) break;
    }

    if (!selectedColor) {
        selectedColor = DEFAULT_SYSTEM_BAR_COLOR;
    }

    try {
        window.Android.setSystemBarColors(selectedColor);
    } catch (error) {
        console.error('[android-integration] No se pudo aplicar el color a las barras del sistema:', error);
    }
}

export function initializeAndroidBridge() {
    const invokeSync = () => {
        try {
            syncAndroidSystemBars();
        } catch (error) {
            console.error('[android-integration] Error durante la sincronización inicial:', error);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', invokeSync, { once: true });
    } else {
        invokeSync();
    }
}

// Expone funciones utilitarias para depuración manual desde la consola.
if (typeof window !== 'undefined') {
    window.syncAndroidSystemBars = syncAndroidSystemBars;
}
