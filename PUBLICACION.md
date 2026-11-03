# Web del viaje · protocolo de publicación

## Estado

- Repositorio: https://github.com/HerniTxo/viaje-francia-belgica-2026
- Sitio público: https://hernitxo.github.io/viaje-francia-belgica-2026/
- Origen Pages: rama `main`, carpeta `/docs`.
- Fuentes originales: Google Drive, itinerario maestro y seis memorias Markdown.
- Archivo de datos públicos: `docs/data/trip.json`.
- No hay sincronización automática: la publicación requiere orden expresa en un chat del proyecto.

## Reglas editoriales

1. El itinerario maestro es la fuente principal de decisiones confirmadas. Los MD locales y global contienen detalles y propuestas.
2. Todo contenido distingue CONFIRMADO de PROPUESTA. El estatus de transporte, actividades, entradas y reservas no se infiere.
3. No subir QR, entradas, PDFs de reservas, nombres completos de viajeros, localizadores, correos, números de documentos ni datos sensibles.
4. Se pueden publicar direcciones y nombres de alojamientos comerciales, itinerarios, horarios confirmados y enlaces a mapas y fuentes oficiales.
5. Los horarios variables se consultan en la fuente oficial y se identifican si son estimados. El cierre del metro M6 del 08/11/2026 tiene fuente oficial RATP.
6. Los enlaces Google Maps son por tramos; el mapa Leaflet representa puntos y conexiones aproximadas, no calles navegables.
7. No conservar imágenes privadas o de terceros sin comprobar sus derechos de reutilización.

## Pasos al recibir «Actualiza la web»

1. Leer Google Docs maestro y MD global y locales relevantes.
2. Comparar el dato actualizado de Drive con `docs/data/trip.json` y última publicación.
3. Editar datos y, si procede, interfaz; preservar los enlaces del sitio.
4. Revisar la filtración de datos privados y la consistencia de fechas, precios y estados.
5. Comprobar enlaces, carga de JSON, filtros, mapas, rutas y calculadora.
6. Publicar mediante commit(s) en main y verificar la web en GitHub Pages. Si la comprobación pública falla, indicarlo.
7. Registrar commit, fecha y cambios aquí; registrar también la referencia en el MD global de Drive cuando sea posible.

## Historial

- **2026-11-03 — v1.0:** primera web completa: cronología diaria, 23 puntos de interés y alojamientos, 15 rutas, 6 tarjetas de destino, presupuesto interactivo, avisos y fuentes oficiales. Despliegue sujeto a verificación pública. 
