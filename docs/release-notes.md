# Notas de lanzamiento — Manda Studio alfa-v53

## Fecha
2025-10-25

## Nuevas funciones
- **Gestor de fondos** (`scripts/background-manager.js`): carga imágenes personalizadas, conserva ratio, responde a redimensionamientos y permite ajustar opacidad.
- **Temas Indigo** (`styles/theme-indigo.css`, `styles/theme-indigo-light.css`): nuevas paletas con integración completa vía el gestor de temas y compatibilidad con variables legadas.
- **Acciones con iconos** (`scripts/chat-ui.js`, `styles/messages.css`): botones por mensaje usan iconografía accesible para copiar, eliminar y regenerar.
- **Reset global** (`styles/base.css`): margen/padding cero y eliminación de bordes redondeados para ocupar todo el viewport.
- **Documentación oficial** (`docs/`): se agregaron guías de overview, arquitectura, theming y notas de release.

## Mejoras
- Sidebar, tarjetas de configuración y bandeja inferior sin sombras ni bordes visibles.
- Botón de envío restaurado al icono SVG original (`components/send-svgrepo-com (6).svg`).
- Burbujas de mensajes ajustadas al 100% del ancho disponible con acciones circulares homogéneas.
- Se añadió archivo ZIP empaquetado `MandaStudio-alfa-v53.zip` listo para distribución.
- Documentación extendida para facilitar incorporación de nuevos contribuidores.

## Correcciones
- Fusión de chats documentada; evita crear duplicados al reconfigurar lógica.
- Burbujas de mensajes ajustadas al 100% del ancho disponible.
- Botón de copiar código reposicionado con espacio interno adicional.

## Consideraciones pendientes
- Integrar lógica mejorada para fusionar chats sin crear nuevos registros si se necesita sobrescribir existentes.
- Agregar pruebas automáticas o validaciones para manejo de adjuntos y temas.
- Documentar procesos de despliegue cuando se habilite un servidor dedicado o se integre un backend.
