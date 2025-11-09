document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('logo-btn'); // El botón que ahora controlará el panel derecho
    const rightPanel = document.querySelector('.right-panel'); // El panel lateral derecho
    const overlay = document.querySelector('.sidebar-overlay'); // El overlay general
    const body = document.body;

    if (!toggleBtn || !rightPanel) {
        console.warn('[right-panel-controller] No se encontró el botón o el panel lateral derecho.');
        return;
    }

    const state = {
        isOpen: !rightPanel.classList.contains('closed'), // El panel está abierto si NO tiene la clase 'closed'
        isTransitioning: false,
        restoreFocus: null
    };

    const syncUI = () => {
        const currentlyOpen = !rightPanel.classList.contains('closed');
        state.isOpen = currentlyOpen;
        toggleBtn.setAttribute('aria-expanded', String(currentlyOpen));
        toggleBtn.dataset.state = currentlyOpen ? 'open' : 'closed';
        toggleBtn.classList.toggle('is-active', currentlyOpen);
        rightPanel.dataset.state = currentlyOpen ? 'open' : 'closed';
        body.classList.toggle('right-panel-open', currentlyOpen); // Nueva clase para el body
        if (overlay) {
            overlay.classList.toggle('active', currentlyOpen);
        }
    };

    const finishTransition = (nextOpenState) => {
        state.isTransitioning = false;
        state.isOpen = nextOpenState;
        syncUI();

        if (!nextOpenState) {
            const focusTarget = state.restoreFocus;
            state.restoreFocus = null;
            if (focusTarget && typeof focusTarget.focus === 'function') {
                try {
                    focusTarget.focus({ preventScroll: true });
                } catch (error) {
                    console.error('[right-panel-controller] No se pudo restaurar el foco:', error);
                }
            }
        }
    };

    const openRightPanel = () => {
        if (state.isTransitioning || state.isOpen) {
            return;
        }
        state.isTransitioning = true;
        state.restoreFocus = document.activeElement && !rightPanel.contains(document.activeElement)
            ? document.activeElement
            : toggleBtn;
        rightPanel.classList.remove('closed'); // Quitar la clase 'closed' para abrir el panel
        requestAnimationFrame(() => syncUI());
    };

    const closeRightPanel = () => {
        if (state.isTransitioning || !state.isOpen) {
            return;
        }
        state.isTransitioning = true;
        rightPanel.classList.add('closed'); // Añadir la clase 'closed' para cerrar el panel
        syncUI();
    };

    const toggleRightPanel = () => {
        try {
            if (state.isOpen) {
                closeRightPanel();
            } else {
                openRightPanel();
            }
        } catch (error) {
            console.error('[right-panel-controller] Error al alternar el panel derecho:', error);
            state.isTransitioning = false;
        }
    };

    rightPanel.addEventListener('transitionend', (event) => {
        if (event.propertyName !== 'transform') { // Asumiendo que 'transform' es la propiedad de transición
            return;
        }
        finishTransition(!rightPanel.classList.contains('closed'));
    });

    toggleBtn.addEventListener('click', (event) => {
        event.preventDefault();
        toggleRightPanel();
    });

    overlay?.addEventListener('click', () => {
        closeRightPanel();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeRightPanel();
        }
    });

    window.addEventListener('resize', () => {
        syncUI();
    });

    window.rightPanelController = { // Controlador global para el panel derecho
        open: openRightPanel,
        close: closeRightPanel,
        toggle: toggleRightPanel,
        getState: () => ({ ...state })
    };

    syncUI();
});
