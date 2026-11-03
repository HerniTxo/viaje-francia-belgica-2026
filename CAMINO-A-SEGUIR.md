# Próximos pasos · viaje del 8 al 15 de noviembre de 2026

La web se mantiene en GitHub Pages, en el repositorio existente y con su misma dirección. El día 8 es el primer día del itinerario. La recogida del coche del día 7 es un dato previo, dentro de Bilbao.

## Estructura acordada

- **Torcy–París:** viaje y llegada del 8, dos rutas nocturnas alternativas completas, alojamiento y planos del transporte.
- **Disney:** planes separados del 9 y del 10, transporte y mapas de ambos parques.
- **Gante:** llegada del 11, estancia, paseo y distribución del día 12.
- **Brujas y Bruselas:** cada ciudad en su página, como posibles excursiones en tren el 12.
- **Nantes:** llegada y paseo del 13; Máquinas de la Isla el 14.
- **Burdeos:** llegada y paseo nocturno del 14.
- **Saint-Émilion:** visita matinal del 15 y salida hacia Bilbao.
- **Bilbao:** regreso del 15 y datos del alquiler.

Cada lugar contiene únicamente su información. Las pestañas muestran un bloque de consulta cada vez; los detalles secundarios se despliegan a petición. Se han retirado el gran encabezado decorativo, el presupuesto interactivo, la lista personal de preparación y las secciones generales duplicadas.

## Qué cerrar primero

1. **Horarios de Disney y regreso RER:** comprobar el 9 y el 10 en la app oficial. La base 09:30–21:00 sigue provisional; encajar funciones y último servicio de regreso. Los recorridos son propuestas.
2. **Día 12:** decidir el reparto entre Gante, Brujas y Bruselas. Después elegir estaciones, trenes y billetes. No hay un itinerario local añadido a las dos excursiones porque todavía no se ha trabajado.
3. **Nantes:** elegir las actividades concretas de las Máquinas y verificar entradas/horario del 14. Resolver parking con reserva y acceso del hotel en zona peatonal. Coordinar check-out a las 11:00 y equipaje.
4. **Burdeos:** elegir parking y concretar el paseo nocturno y su conexión con el hotel.
5. **Regreso del 15:** fijar visita y aparcamiento de Saint-Émilion, salida y margen para devolver Avis a las 20:00 en Bilbao Intermodal.
6. **Carretera:** completar descansos y repostajes de los cuatro trayectos que aún no los tienen, empezando por Gante–Nantes. La ruta A Bilbao–Torcy sigue elegida; sus paradas son propuestas.

## Cómo seguir alimentando la web

1. Consultar el itinerario maestro y las memorias del lugar en Drive. Las instrucciones actuales del viajero prevalecen sobre documentos anteriores.
2. Añadir el sitio, recorrido, plano u horario a la página correspondiente en `docs/data/trip.json`. Mantener la diferencia entre confirmado, propuesta y pendiente.
3. Incorporar mapas útiles como archivos locales y enlazar las fuentes oficiales. Conservar atribuciones. Evitar documentos originales de reservas, entradas, QR, números de reserva y datos personales en este repositorio público.
4. Comprobar enlaces internos, archivos y fechas con `node scripts/validate.mjs`, y revisar la pantalla móvil si cambia la interfaz.
5. Publicar únicamente cuando se pida y comprobar el despliegue de GitHub Pages. No hay sincronización automática con Drive.

## Material revisado el 3 de noviembre

Itinerario maestro; memoria global; memorias de París–Torcy, Disney, Gante, Nantes, Burdeos y coche; carpetas de cada lugar y Disney; CSV de gasolineras; web 1.2 existente y sus recorridos. Se han recuperado los dos mapas de Disney y su PDF. Los originales privados permanecen en Drive.

La memoria antigua de París contenía un esquema con metro 6. La web lo sustituye por enlaces a los planos oficiales de RER A, M1 y bus 30: RATP confirma cierre total de M6 el 8 de noviembre. El paseo B se divide en dos enlaces a pie para conservar todas sus paradas en Google Maps móvil.
