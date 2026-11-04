## Ubicaciones de tres librerías · 04/11/2026

Añadidas coordenadas y direcciones verificadas de Brüsel, Pêle-Mêle Bruselas y Casa del Cómic; actualizados horarios disponibles y fichas.

## Bruselas · 04/11/2026

Guía de visitas, barrios, miradores, cervecerías, juegos y tiendas con fichas y mapas. Ruta del cómic separada con enlace al mapa oficial desde inicio y mapa de Bruselas. Lugares como propuestas; horarios pendientes de confirmación. Maestro y memoria de Gante consultados.

## Wintercircus y De Krook · 04/11/2026

Gante → Eventos: instalación audiovisual gratuita del 10 al 15 de noviembre, visita gratuita a la arena y al Wintercircus y referencia opcional a De Krook; horarios especiales y disponibilidad por confirmar. Fuentes oficiales enlazadas y mapa conjunto con ubicaciones corregidas. Información contrastada con itinerario maestro y memoria de Gante; actividades propuestas, sin entradas reservadas.

## Guía del parque y favoritos · 04/11/2026

Nueva pestaña Disney → Guía del parque: 51 fichas de atracciones, paseos y espectáculos, separadas por parque, con imagen oficial, descripción, ubicación, información práctica y enlace a Disney. Se excluyen actividades claramente infantiles y se conservan como descartadas las tres preferencias anteriores. Crush y la pausa de A Celebration in Arendelle se señalan explícitamente.

Favoritos locales por navegador, lista editable y mapa interactivo conjunto de ambos parques. Búsqueda y filtros de espectáculos, atracciones, Navidad e interiores. Horarios secundarios identificados como orientativos y enlazados; se remite a la app para confirmar las funciones del 9–10/11.

Las fichas compartidas de toda la web pasan de imágenes Maps Static a mapas interactivos normales. Se conserva la planificación y los planos con rutas anteriores. Validación: sintaxis JS, 8 días, 10 páginas, 35 rutas, fuentes e imágenes oficiales de las 51 fichas, referencias de recursos cotejadas con el árbol remoto, privacidad, búsqueda, favoritos y persistencia en navegador, ficha móvil sin desbordamiento horizontal. Las ubicaciones se contrastan en mapas interactivos; los eventos itinerantes usan referencias de sector identificadas. El mapa conjunto utiliza coordenadas revisadas, sin depender de Geocoding ni Places, y agrupa las fichas que comparten punto.

## Guía visual móvil y fichas de lugares · 03/11/2026

Se elimina En marcha, valoración/calculadora de colas y checklist de la guía completa. Secuencias visuales por día, esquemas conservados. Fichas modales compartidas por toda la web para menciones de lugares registrados: nombres subrayados, descripción, mapa Google Static bajo demanda, enlace de ampliación y referencia al plano del parque para Disney. Catálogo común de atracciones, teatros, restaurantes, tiendas, consignas y lugares del resto del viaje. Navegación y contenidos anteriores conservados. Los marcadores sin coordenadas verificadas se resuelven por nombre mediante Maps Static, sin inventar coordenadas.

## Guía Disney complementaria · 03/11/2026

Nueva página disney-guia-completa.html y pestaña Guía completa en Disney, conservando planes y mapas anteriores. Itinerarios adultos 9–10, alternativas por lluvia/colas, nueve fichas, valoración de espera, checklist local, esquemas de zonas y enlaces Google a pie por etapas. Fuentes oficiales para operaciones y fuentes secundarias identificadas para funciones e históricos. Tales 21:00 y Cascade 20:50 como referencias pendientes de app, sin elevarlas a confirmación. Pronóstico consultado por fecha. Sin reincorporar PDF retirado ni datos privados. Validación de estructura y privacidad y pruebas de decisión superadas.

## Retirada de recurso · 03/11/2026

A petición del viajero se retira de la web el último folleto PDF completo de 12 páginas. Eliminado también el archivo de Drive. Se conservan los mapas personalizados con rutas. La referencia histórica en la memoria Disney queda pendiente de limpieza por indisponibilidad del entorno de edición.

## Actualización 2.1 · 03/11/2026

Disney: ajuste de final de jornada con shows a las 21:00 como hipótesis explícita, consignas SNCF/Disney y PDF completo 2026. París–Torcy: ruta sin bus RER A–M8–M9, variante M9 y regreso orientativo, conservando alternativas. Tiempo trasladado a pestaña propia por destino y cargado solo al abrirla. Maestro y memorias relevantes contrastados. Sin documentos privados ni datos de entradas publicados.

# Web del viaje · protocolo de publicación

## Francés útil · 03/11/2026

Nueva página `#/frances`, bajo Práctico en el menú. Contiene 46 frases en siete pestañas: Básico, Comer, Hotel, Tren y taxi, Coche, Disney y visitas, Ayuda. Cada frase incluye francés, traducción, pronunciación aproximada para hispanohablantes y Escuchar/Parar.

El audio son archivos MP3 franceses incluidos en `docs/assets/francais/`, voz `fr-FR-DeniseNeural`, generados a ritmo algo más lento para aprender. Solo se descarga el audio seleccionado; al cambiar de frase o página se detiene el anterior. No necesita voces francesas instaladas en el móvil ni nueva clave de API. Los originales de texto y el audio se relacionan mediante el hash del francés; el validador detecta audios desfasados cuando se edita el texto. El script opcional `scripts/generate-french-audio.py` permite regenerarlos.

Se incorporaron antes los cambios remotos de Disney y del tiempo hasta `2ed8667`; esta actualización conserva esas modificaciones. Recursos y datos usan `v=2.2`. El itinerario sigue siendo de ocho días; hay nueve páginas de destino y una página práctica. No se consulta el tiempo en la página de francés.

## Versión actual: 2.0 · 03/11/2026

Rediseño solicitado por el viajero: móvil, menú lateral y páginas por lugar. Torcy–París se mantiene unida; Disney tiene una única página con planes del lunes 9 y martes 10. El itinerario comienza el día 8. Brujas y Bruselas tienen páginas propias, sin inventar recorridos o trenes aún no decididos.

Se conservan alojamiento, trayectos, rutas nocturnas de París con sus regresos, planes Disney y paseos que ya existían. Se incorporan los mapas de Disney recuperados de Drive (JPG optimizados y PDF con atribuciones), planos oficiales enlazados de RER A / M1 / bus 30 y CSV de gasolineras. Se retiran portada decorativa, simulador de presupuesto y lista personal de preparación. Google Maps se conserva y se carga solo en la pestaña de mapa de cada destino.

Se han revisado maestro y memorias de Drive y el material de sus carpetas. El esquema más reciente del usuario incorpora Saint-Émilion el 15 y excursiones desde Gante como opciones; no implica compra de actividades ni billetes. La fecha exacta de Disney sigue sin horario oficial recuperable: la franja de trabajo permanece provisional. RATP confirma cierre total de M6 el 8, por encima del antiguo esquema con M6. El paseo B se divide en tramos para preservar las paradas en Maps móvil.

La guía ya no tiene presupuesto global ni nueve entradas de agenda: son ocho días (8–15), nueve páginas y treinta rutas. Las instrucciones de estructura y próximos pasos están en `CAMINO-A-SEGUIR.md`. Los detalles de versiones anteriores, debajo, son históricos y no describen esta interfaz.

Validación local: sintaxis, referencias de páginas/pestañas, rutas, archivos, fechas y privacidad. Pruebas visuales en navegador con ancho de móvil, menú lateral, navegación y planos. Validación y publicación remotas: comprobar en las ejecuciones de GitHub Actions del commit enviado.

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

## Francés sencillo y destinos · 03/11/2026

Se sustituyen las frases específicas de comida y Disney por vocabulario y expresiones universales. Se conservan Básico y Ayuda, se añaden números 0–20 y decenas, cuatro hoteles con sus direcciones de reserva y nueve estaciones con direcciones de acceso y fuentes. Los nombres de estaciones flamencas se presentan como aproximación con voz francesa. Cada entrada conserva audio MP3 y pronunciación escrita. Son 92 entradas en diez pestañas. Recursos v=2.3. Se integraron previamente los cambios remotos hasta d389215.


## Gante · 04/11/2026

Guías unificadas con nombre pulsable y descripción, sin tarjetas duplicadas. Se enlazan monumentos, bares, estaciones, hotel y parkings a sus fichas con mapa interactivo. Se completan los alias de las menciones del texto y se corrige el rótulo de la fuente oficial de los lugares ajenos a Disney. Se conservan las propuestas y reservas existentes. Validación estructural y sintaxis JavaScript correctas; comprobar despliegue Pages al publicar.

## Mapas por apartado de Gante · 04/11/2026

Cada pestaña de Gante incluye un mapa interactivo con los lugares de ese apartado y acceso desde cada marcador a la ficha individual. Plan, Mapa y Tiempo reúnen la selección completa de la ciudad. Los parkings usan referencias del hotel y de la estación, no entradas exactas verificadas. Publicación autorizada expresamente por el usuario.
