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
5. Las indicaciones Google Maps usan modos separados; líneas Leaflet de conexión entre ciudades son un esquema, no navegación calle a calle.
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
