# Francia & Bélgica 2026 — Guía pública del viaje

**Web:** https://hernitxo.github.io/viaje-francia-belgica-2026/

Sitio interactivo, adaptable al móvil, con Google Maps JavaScript API, para el viaje del 8 al 15 de noviembre de 2026. Incluye agenda por días, mapa Leaflet/OpenStreetMap con ubicaciones, enlaces de rutas Google Maps, fichas de destinos, presupuesto y avisos prácticos.

## Estructura

- `docs/index.html`: página pública.
- `docs/styles.css`: estilos responsivos y tema claro/oscuro.
- `docs/app.js`: interacciones sin backend.
- `docs/data/trip.json`: **datos públicos editables** (9 días contando la recogida del coche, 23 lugares y 19 rutas).
- `docs/assets/`: recursos propios de la interfaz.
- `PUBLICACION.md`: criterios, fuentes y registro de publicaciones.
- `.github/workflows/validar-web.yml`: pruebas automáticas de sintaxis, datos y privacidad.

## Publicación y privacidad

GitHub Pages sirve la rama `main`, carpeta `/docs`. La publicación **solo se solicita expresamente desde ChatGPT**; las decisiones confirmadas proceden del documento maestro en Google Drive y las propuestas permanecen etiquetadas.

**No subir a este repositorio:** entradas, códigos QR, localizadores, reservas originales, archivos privados, teléfonos o datos personales de los viajeros.

Los enlaces de Google Maps se recalculan según tráfico y transporte; las líneas sobre el mapa de ciudades son esquemáticas, no itinerarios de conducción.

## Estado

- V1.2: integración Google Maps JavaScript, filtros de día y ciudad, ficha con navegación y vista móvil revisada.
- Validación automatizada en GitHub Actions: correcta.
- GitHub Pages: despliegue verificado como satisfactorio en su flujo de GitHub Actions.
