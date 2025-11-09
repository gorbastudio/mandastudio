# Guía de despliegue

## Requisitos mínimos
- Navegador moderno (Chrome 110+, Edge 110+, Firefox 115+).
- Servidor estático opcional (`http-server`, `live-server`, `nginx`, etc.).
- Acceso para modificar `localStorage` (requerido por el historial de chats y preferencias de tema).

## Pasos rápidos (servidor estático)
1. Instalar un servidor estático, por ejemplo `npm install -g http-server`.
2. Desde la carpeta `PAGES`, ejecutar `http-server -p 8080`.
3. Abrir `http://localhost:8080/index.html` en un navegador.

## Despliegue en hosting básico
1. Subir todos los archivos de `PAGES/` (incluyendo subcarpetas `scripts/`, `styles/`, `components/` y `docs/`).
2. Configurar el hosting para servir `index.html` como archivo raíz.
3. Verificar rutas relativas: los temas (`styles/theme-*.css`) y scripts asumen la misma estructura de carpetas.

## Consideraciones
- `localStorage` es específico por dominio; asegúrate de usar HTTPS en producción para evitar bloqueos.
- Si se añaden proveedores externos (APIs), la configuración debe almacenarse en `scripts/google-api.js` o archivos similares.
- Para distribuciones offline, incluye `MandaStudio-alfa-v53.zip` y las notas en `docs/`.
