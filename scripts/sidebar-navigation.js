// sidebar-navigation.js - Sistema de navegación por tarjetas en el panel lateral

import { initializeInfoPanels, renderModelInfo, renderParamsInfo } from './floating-controls.js';
import { getCurrentAIConfig, setActiveModel } from './ai-config.js';

const NAV_CARDS = [
    {
        id: 'history',
        title: 'Historial',
        description: 'Consulta y administra tus conversaciones guardadas.',
        icon: '🕘',
        sectionId: 'nav-section-history'
    },
    {
        id: 'params',
        title: 'Parámetros',
        description: 'Revisa la temperatura y otros ajustes del modelo.',
        icon: '🎚️',
        sectionId: 'nav-section-params'
    },
    {
        id: 'model',
        title: 'Modelo',
        description: 'Detalles del modelo seleccionado y sus capacidades.',
        icon: '🤖',
        sectionId: 'nav-section-model'
    },
    {
        id: 'api-keys',
        title: 'API Keys',
        description: 'Administra tus claves API para servicios externos.',
        icon: '🔑',
        sectionId: 'nav-section-api-keys-c',
        targetPanel: 'C'
    },
    {
        id: 'settings',
        title: 'Settings',
        description: 'Configura la aplicación y personaliza tu experiencia.',
        icon: '⚙️',
        sectionId: 'nav-section-settings'
    }
];

let navigationContainer = null;
let panelBTitle = null;
let panelB = null;
let panelC = null;
let panelCTitle = null;
let panelCBody = null;
let panelBody = null;
let backButton = null;
let cardGrid = null;
let lastActiveCardId = null;
let modelCardContainer = null;
let metrics = {
    chats: 0,
    lastChatTitle: '',
    modelName: '',
    temperature: 0
};

// Función para inicializar el toggle del sidebar
function initializeSidebarToggle() {
    const toggleBtn = document.getElementById('chat-list-toggle');
    const sidebar = document.getElementById('chat-list-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const body = document.body;

    if (!toggleBtn || !sidebar) return;

    // Función para toggle
    function toggleSidebar() {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
        body.classList.toggle('sidebar-open');

        const isOpen = sidebar.classList.contains('open');
        // Enfocar el primer elemento del sidebar cuando se abre
        if (isOpen) {
            const firstCard = document.querySelector('.nav-card');
            if (firstCard) firstCard.focus();
        }
    }

    // Evento click en botón
    toggleBtn.addEventListener('click', toggleSidebar);

    // Cerrar con overlay
    if (overlay) {
        overlay.addEventListener('click', toggleSidebar);
    }

    // Cerrar con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            toggleSidebar();
        }
    });
}

export function initializeSidebarNavigation() {
    navigationContainer = document.querySelector('.card-navigation-container');
    if (!navigationContainer) return;

    panelBTitle = navigationContainer.querySelector('#panel-b-title');
    panelB = navigationContainer.querySelector('#panel-B');
    panelC = navigationContainer.querySelector('#panel-C');
    panelCTitle = navigationContainer.querySelector('#panel-c-title');
    panelCBody = panelC?.querySelector('.panel-body');
    panelBody = panelB?.querySelector('.panel-body');
    backButton = panelB?.querySelector('.back-button');
    cardGrid = navigationContainer.querySelector('#nav-card-grid');
    modelCardContainer = document.querySelector('.model-cards');

    bindEvents();
    bindMetricListeners();
    updateCardMetrics();
    resetSidebarNavigation();
    
    // Inicializar el toggle del sidebar
    initializeSidebarToggle();

    window.addEventListener('resize', handleLayoutResize, { passive: true });
}

export function resetSidebarNavigation() {
    if (!navigationContainer) return;

    navigationContainer.dataset.activePanel = 'A';
    clearActiveCard();
    hideAllSections();
    hideAllSectionsPanelC();
    if (panelBTitle) panelBTitle.textContent = '';
    if (panelCTitle) panelCTitle.textContent = '';
    if (panelBody) panelBody.scrollTo({ top: 0, behavior: 'auto' });
    if (panelCBody) panelCBody.scrollTo({ top: 0, behavior: 'auto' });
    if (cardGrid) cardGrid.scrollTo({ top: 0, behavior: 'auto' });

    // Restablecer foco al primer elemento disponible
    const firstCard = cardGrid?.querySelector('.nav-card');
    if (firstCard) {
        setTimeout(() => {
            firstCard.focus({ preventScroll: true });
        }, 0);
    }

    document.dispatchEvent(new CustomEvent('sidebar:panel-root'));
}

function renderCardGrid() {
    if (!cardGrid) return;
    cardGrid.innerHTML = '';

    const fragment = document.createDocumentFragment();

    cardGrid.classList.add('card-deck');

    NAV_CARDS.forEach(card => {
        const slotElement = document.createElement('div');
        slotElement.className = 'card-slot';

        const cardElement = document.createElement('article');
        cardElement.className = 'card nav-card';
        cardElement.dataset.cardId = card.id;
        cardElement.dataset.sectionId = card.sectionId;
        cardElement.setAttribute('role', 'button');
        cardElement.setAttribute('tabindex', '0');
        cardElement.innerHTML = createCardInnerHTML(card.id, card);

        slotElement.appendChild(cardElement);
        fragment.appendChild(slotElement);
    });

    cardGrid.appendChild(fragment);

    updateCardGridLayout();
}

function createCardInnerHTML(cardId, card) {
    const base = `
        <div class="nav-card-icon">${card.icon}</div>
        <div class="nav-card-content">
            <h4 class="nav-card-title">${card.title}</h4>
            <p class="nav-card-description">${card.description}</p>
            ${renderCardMetric(cardId)}
        </div>
    `;
    return base;
}

function renderCardMetric(cardId) {
    switch (cardId) {
        case 'history':
            return `
                <div class="nav-card-metric">
                    <span>Chats almacenados</span>
                    <strong>${metrics.chats}</strong>
                    <small>${metrics.chats > 0 ? `Último: ${escapeHtml(metrics.lastChatTitle)}` : 'Sin chats guardados'}</small>
                </div>`;
        case 'params':
            return `
                <div class="nav-card-metric">
                    <span>Temperatura activa</span>
                    <strong>${metrics.temperature}</strong>
                </div>`;
        case 'model':
            return `
                <div class="nav-card-metric">
                    <span>Modelo seleccionado</span>
                    <strong>${escapeHtml(metrics.modelName)}</strong>
                </div>`;
        case 'settings':
            return `
                <div class="nav-card-metric theme-metric">
                    <span>Tema activo</span>
                    <strong>Indigo Dark</strong>
                    <div class="theme-metric-swatches">
                        <span class="swatch"></span>
                        <span class="swatch alt"></span>
                    </div>
                </div>`;
        default:
            return '';
    }
}

function bindEvents() {
    if (!navigationContainer) return;

    navigationContainer.addEventListener('click', event => {
        const card = event.target.closest('.nav-card');
        if (card) {
            event.preventDefault();
            openSection(card.dataset.cardId, card);
        }
    });

    navigationContainer.addEventListener('keydown', event => {
        if (!event.target.classList.contains('nav-card')) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openSection(event.target.dataset.cardId, event.target);
        }
    });

    backButton?.addEventListener('click', () => {
        // Verificar si estamos en el panel C
        if (navigationContainer.dataset.activePanel === 'C') {
            navigationContainer.dataset.activePanel = 'B';
            // Ocultar todas las secciones del panel C
            if (panelC) {
                panelC.querySelectorAll('.nav-section').forEach(section => {
                    section.hidden = true;
                });
            }
            if (panelCTitle) panelCTitle.textContent = '';
            if (panelCBody) panelCBody.scrollTo({ top: 0, behavior: 'auto' });
            
            // Enfocar el botón de retroceso del panel B
            setTimeout(() => {
                const panelBBackButton = panelB?.querySelector('.back-button');
                panelBBackButton?.focus({ preventScroll: true });
            }, 120);
        } else {
            navigationContainer.dataset.activePanel = 'A';
            clearActiveCard();
            hideAllSections();
            if (panelBTitle) panelBTitle.textContent = '';
            if (panelBody) panelBody.scrollTo({ top: 0, behavior: 'auto' });

            setTimeout(() => {
                const activeCard = lastActiveCardId
                    ? cardGrid?.querySelector(`.nav-card[data-card-id="${lastActiveCardId}"]`)
                    : cardGrid?.querySelector('.nav-card');
                activeCard?.focus({ preventScroll: true });
            }, 120);

            document.dispatchEvent(new CustomEvent('sidebar:panel-root'));
        }
    });

    // Manejar el botón de añadir clave API en panel B
    document.addEventListener('click', event => {
        if (event.target.id === 'add-api-key-btn') {
            event.preventDefault();
            import('./ui-modals.js').then(module => {
                module.showCustomPrompt('Introduce la nueva clave API:').then(newKey => {
                    if (newKey !== null && newKey.trim() !== '') {
                        import('./api-keys-manager.js').then(manager => {
                            manager.addApiKey(newKey.trim());
                            // Recargar la sección de API keys
                            import('./api-keys-ui.js').then(ui => {
                                ui.loadApiKeys();
                            });
                        });
                    }
                });
            });
        }
        
        // Manejar el botón de añadir clave API en panel C
        if (event.target.id === 'add-api-key-btn-c') {
            event.preventDefault();
            import('./ui-modals.js').then(module => {
                module.showCustomPrompt('Introduce la nueva clave API:').then(newKey => {
                    if (newKey !== null && newKey.trim() !== '') {
                        import('./api-keys-manager.js').then(manager => {
                            manager.addApiKey(newKey.trim());
                            // Recargar la sección de API keys en panel C
                            loadApiKeysPanelC();
                        });
                    }
                });
            });
        }
    });
}

function openSection(cardId, sourceCard) {
    const cardConfig = NAV_CARDS.find(card => card.id === cardId);
    if (!cardConfig || !navigationContainer) return;

    lastActiveCardId = cardId;
    setActiveCard(cardId);
    showSection(cardConfig);

    navigationContainer.dataset.activePanel = 'B';
    if (panelBTitle) panelBTitle.textContent = cardConfig.title;
    if (panelBody) panelBody.scrollTo({ top: 0, behavior: 'auto' });

    setTimeout(() => {
        backButton?.focus({ preventScroll: true });
    }, 140);

    document.dispatchEvent(new CustomEvent('sidebar:section-enter', {
        detail: {
            sectionId: cardConfig.id,
            sectionElement: document.getElementById(cardConfig.sectionId)
        }
    }));
}

function showSection(cardConfig) {
    // Si el targetPanel es C, mostrar en panel C
    if (cardConfig.targetPanel === 'C') {
        hideAllSectionsPanelC();
        
        const section = document.getElementById(cardConfig.sectionId);
        if (!section) return;
        
        section.hidden = false;
        
        // Cargar las claves API en panel C
        loadApiKeysPanelC();
        
        // Cambiar a panel C
        navigationContainer.dataset.activePanel = 'C';
        if (panelCTitle) panelCTitle.textContent = cardConfig.title;
        if (panelCBody) panelCBody.scrollTo({ top: 0, behavior: 'auto' });
        
        setTimeout(() => {
            const panelCBackButton = panelC?.querySelector('.back-button');
            panelCBackButton?.focus({ preventScroll: true });
        }, 140);
        
        document.dispatchEvent(new CustomEvent('sidebar:section-enter', {
            detail: {
                sectionId: cardConfig.id,
                sectionElement: section
            }
        }));
        
        return;
    }
    
    // Comportamiento original para otros paneles
    hideAllSections();

    const section = document.getElementById(cardConfig.sectionId);
    if (!section) return;

    section.hidden = false;

    switch (cardConfig.id) {
        case 'history':
            // El gestor de chats se encarga de renderizar al escuchar el evento.
            break;
        case 'params':
            renderParamsInfo();
            break;
        case 'model':
            setupModelSelection();
            break;
        case 'api-keys':
            // Cargar las claves API
            import('./api-keys-ui.js').then(module => {
                module.loadApiKeys();
            });
            break;
        case 'settings':
        default:
            break;
    }

    if (cardConfig.id !== 'history') {
        initializeInfoPanels();
    }
}

function setupModelSelection() {
    if (!modelCardContainer) return;

    const currentConfig = getCurrentAIConfig();
    const { modelKey } = currentConfig;

    modelCardContainer.querySelectorAll('.model-card').forEach(card => {
        if (card.dataset.modelId === modelKey) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }

        if (!card.dataset.bindInitialized) {
            card.addEventListener('click', () => handleModelSelection(card.dataset.modelId));
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleModelSelection(card.dataset.modelId);
                }
            });
            card.dataset.bindInitialized = 'true';
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
        }
    });

    renderModelInfo();
}

function handleModelSelection(modelId) {
    try {
        setActiveModel(modelId);
        setupModelSelection();
        renderModelInfo();
        document.dispatchEvent(new CustomEvent('model:changed', { detail: { modelId } }));
    } catch (error) {
        console.error('Error al seleccionar modelo:', error);
    }
}

function bindMetricListeners() {
    document.addEventListener('model:changed', updateCardMetrics);
    document.addEventListener('chats:updated', updateCardMetrics);
}

function updateCardMetrics() {
    if (!cardGrid) return;
    metrics = collectMetrics();
    renderCardGrid();
    if (lastActiveCardId) {
        setActiveCard(lastActiveCardId);
    }
}

function updateCardGridLayout() {
    if (!cardGrid) return;

    const prefersCompact = window.matchMedia('(max-width: 720px)').matches;
    const limitedHeight = window.matchMedia('(max-height: 640px)').matches;

    let layout = 'horizontal';

    if (prefersCompact || limitedHeight) {
        layout = 'vertical';
    }

    if (cardGrid.dataset.layout !== layout) {
        cardGrid.dataset.layout = layout;
    }

    cardGrid.setAttribute('data-layout', layout);
}

function handleLayoutResize() {
    updateCardGridLayout();
}

function collectMetrics() {
    const config = getCurrentAIConfig();
    const chatSummary = collectChatSummary();
    return {
        chats: chatSummary.count,
        lastChatTitle: chatSummary.lastTitle,
        modelName: config.model?.name || '—',
        temperature: formatTemperature(config.temperature)
    };
}

function collectChatSummary() {
    const chats = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith('chat_') || key === 'chat_current') continue;
        try {
            const data = JSON.parse(localStorage.getItem(key));
            if (data && data.title) {
                chats.push({ title: data.title, timestamp: data.timestamp });
            }
        } catch (error) {
            console.error('No se pudo leer el chat almacenado:', error);
        }
    }

    chats.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

    return {
        count: chats.length,
        lastTitle: chats[0]?.title || ''
    };
}

function formatTemperature(value) {
    const numeric = Number(value ?? 0);
    return numeric.toFixed(2);
}

function escapeHtml(text) {
    return (text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function hideAllSections() {
    if (!panelB) return;
    panelB.querySelectorAll('.nav-section').forEach(section => {
        section.hidden = true;
    });
}

function hideAllSectionsPanelC() {
    if (!panelC) return;
    panelC.querySelectorAll('.nav-section').forEach(section => {
        section.hidden = true;
    });
}

function loadApiKeysPanelC() {
    // Cargar las claves API en el panel C
    import('./api-keys-ui.js').then(module => {
        // Crear un contenedor temporal para cargar las claves
        const tempContainer = document.createElement('div');
        module.loadApiKeys();
        
        // Copiar las claves del contenedor principal al panel C
        const mainApiKeyContainer = document.getElementById('api-key-container');
        const panelCApiKeyContainer = document.getElementById('api-key-container-c');
        
        if (mainApiKeyContainer && panelCApiKeyContainer) {
            panelCApiKeyContainer.innerHTML = mainApiKeyContainer.innerHTML;
            
            // Actualizar los IDs de los botones para evitar conflictos
            panelCApiKeyContainer.querySelectorAll('[id]').forEach(element => {
                if (element.id.includes('-btn')) {
                    element.id = element.id + '-c';
                }
            });
        }
    });
}

function setActiveCard(cardId) {
    clearActiveCard();
    const card = cardGrid?.querySelector(`.card-slot > .nav-card[data-card-id="${cardId}"]`);
    if (!card) return;
    card.classList.add('active');
    card.parentElement?.setAttribute('data-active', 'true');
    card.parentElement?.focus({ preventScroll: true });
}

function clearActiveCard() {
    if (!cardGrid) return;
    cardGrid.querySelectorAll('.card-slot[data-active="true"]').forEach(slot => {
        slot.removeAttribute('data-active');
    });
    cardGrid.querySelectorAll('.nav-card.active').forEach(card => {
        card.classList.remove('active');
    });
}