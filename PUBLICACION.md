# Web del viaje · protocolo de publicación

## Estado y enlaces
- Repositorio: https://github.com/HerniTxo/viaje-francia-belgica-2026
- Sitio público: https://hernitxo.github.io/viaje-francia-belgica-2026/
- GitHub Pages: rama `main`, carpeta `/docs`, HTTPS.
- Fuente principal: Google Docs «00 - Itinerario maestro»; complementos: MD global y seis MD de destino/tema en Google Drive.
- Datos publicados: `docs/data/trip.json` (JSON público sin justificantes).
- Comprobación automática: `.github/workflows/validar-web.yml`.

## Reglas editoriales
1. Confirmado, propuesta y pendiente deben quedar claramente diferenciados; no asumir reservas de actividades o transporte.
2. No publicar QR, PDF originales, localizadores, números de reserva, nombres completos, correos, fotos de documentos ni datos personales.
3. Las direcciones comerciales de hoteles, las rutas y los precios presupuestados sí pueden aparecer; los importes no significan pagos realizados.
4. Consultar los horarios variables en fuentes oficiales. Dejar constancia de incertidumbre y no afirmar horarios no verificados.
5. La web utiliza Google Maps JavaScript API desde v1.2. Los enlaces de rutas por modo se abren en Google Maps; no hay trazado embebido de rutas ni acceso a listas personales de Google Maps.
6. Solo publicar fotografías e imágenes con permiso de reproducción y atribuciones pertinentes.

## Procedimiento «Actualiza la web»
1. Leer el itinerario maestro, MD global y MD locales afectados.
2. Comparar con la versión pública actual y no inventar cambios.
3. Editar solo lo necesario en `docs/data/trip.json` y en la interfaz.
4. Comprobar consistencia de fechas, alojamientos, estados, puntos, rutas y precios; filtrar datos privados.
5. Verificar GitHub Actions («Verificar web del viaje») y despliegue Pages sobre el commit.
6. Anotar fecha, versión, novedades y commit en este archivo; registrar referencia en MD global cuando se disponga de edición segura.
7. La web no se actualiza en segundo plano y nunca se publica sin orden expresa del usuario.

## Historial de publicación
- **03/11/2026 · versión 1.0:** guía completa inicial: 9 entradas de agenda (incluida recogida del coche el 7), 33 actividades, 23 lugares mapeados, 19 rutas Google Maps, seis tarjetas de destino, presupuesto interactivo y avisos. Se excluyen entradas y documentos privados. Validación Actions completada correctamente (ejecución #1, commit `f8fd4703`); Pages desplegó ese mismo commit con éxito (ejecución #11). Comprobación independiente del HTML público desde esta herramienta no disponible.

- **03/11/2026 · versión 1.1 (cambios de interfaz enviados a `main`):** mejoras de Leaflet para pantallas móviles (zona inicial Torcy, reajuste al cambiar orientación/tamaño y al enfocar marcadores), acceso «Cómo llegar» visible en el listado de lugares y en las tarjetas de alojamiento, enlaces de Google Maps construidos desde direcciones de los hoteles, ajustes de altura y legibilidad y actualización de caché a 1.1. Commit final de interfaz: `ec50de0a`. **Pendiente de verificación independiente del despliegue de GitHub Pages y prueba real en móvil.**

- **03/11/2026 · versión 1.2:** sustitución de Leaflet/OpenStreetMap por Google Maps JavaScript API, filtros por día y ciudad, puntos comerciales con enlaces directos y soporte de navegación móvil. Las rutas se abren en Google Maps; no se llama a servicios de cálculo de rutas, meteorología ni mapas estáticos desde el navegador. La clave pública debe permanecer restringida por referrer HTTPS y por API en Google Cloud.

## Estado para retomar · 03/11/2026

- **Google Maps: INCIDENCIA RESUELTA por confirmación del usuario.** El anterior `ApiNotActivatedMapError` ya no está pendiente. La versión 1.2 se considera el punto de partida. El último despliegue verificado por GitHub Actions fue correcto (`477a7aa1`); no se ha hecho auditoría visual independiente del mapa en distintos dispositivos.
- **API autorizadas en la clave web:** Maps JavaScript API, Maps Static API, Time Zone API y Weather API. Solamente se utiliza Maps JavaScript en la web; las otras tres se reservaron para posibles funcionalidades futuras. No incluir el valor completo de la clave en documentación ni en resúmenes; es una clave pública de navegador, que debe estar restringida a `https://hernitxo.github.io/*` y API concretas.
- **Mapa actual:** 23 lugares, filtros por ciudad/tipo/día, fichas con enlace para consultar y navegar por Google Maps. Las 19 rutas se abren mediante enlaces segmentados para coche/RER/bus/a pie. No se dibujan recorridos reales sobre el mapa ni se gestionan listas personales de Google Maps.
- **Pendientes técnicos (no bloqueantes):** migración de `google.maps.Marker` (obsoleto) a `AdvancedMarkerElement` con Map ID; mejorar navegación móvil y validar en distintos dispositivos; evaluar dibujo de rutas mediante servicio compatible, sin backend; posible integración de previsión meteorológica y de mapas estáticos, controlando cuotas y costes.
- **Pendientes de viaje:** parkings Nantes/Burdeos, visitas Gante, Máquinas de la Isla y Saint-Émilion (propuestas), horarios RER y Disney, peajes y combustible. Se mantienen los estados en las memorias originales, sin promover propuestas a confirmaciones.
- **Operativa:** el itinerario maestro contiene lo esencial, la memoria global y las seis memorias locales conservan detalles; la web solo se actualizará por petición expresa («Actualiza la web»), sin subir entradas ni reservas privadas.
- **Esta anotación solo registra el estado; no altera la web publicada.**
