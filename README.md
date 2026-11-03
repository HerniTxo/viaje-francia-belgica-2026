# Francia y Bélgica · guía del viaje

**Web:** https://hernitxo.github.io/viaje-francia-belgica-2026/

Guía sencilla para consultar desde el móvil, del **8 al 15 de noviembre de 2026**. Menú lateral y páginas por lugar: **Torcy–París, Disney, Gante, Brujas, Bruselas, Nantes, Burdeos, Saint-Émilion y Bilbao**. Cada página muestra una sección cada vez mediante pestañas.

Los planes conservan la diferencia entre confirmado, propuesta y pendiente. Los mapas de Disney recuperados de Drive están disponibles en imagen ampliable y PDF. Los transportes de París se enlazan por tramos, con estaciones y regreso. Google Maps se carga únicamente al abrir la pestaña del mapa del lugar.

## Seguir el proyecto

El menú incluye **Francés útil**, con 92 palabras, números, frases breves y destinos en diez categorías, traducción y pronunciación aproximada. El audio son 46 MP3 franceses incluidos en la web y cargados solo al tocar Escuchar; no requiere voces instaladas ni claves adicionales. Las frases están en bloques `phrases` de `docs/data/trip.json` (`fr`, `es`, `phonetic`, `audio`). Para cambiar una frase, regenerar su audio con `scripts/generate-french-audio.py` (dependencia de autoría opcional: edge-tts); el validador verifica que el nombre del MP3 coincide con el texto francés. La página lleva `utility: true` para aparecer bajo Práctico y no entre los destinos.

[CAMINO-A-SEGUIR.md](CAMINO-A-SEGUIR.md) recoge estructura, prioridades del viaje y mantenimiento. No hay sincronización automática con Drive.

- `docs/data/trip.json`: contenido público editable por página y pestaña, rutas y lugares.
- `docs/index.html`, `docs/styles.css`, `docs/app.js`: interfaz estática, sin instalación ni compilación.
- `docs/maps-config.js`: configuración pública del mapa, con la clave de navegador ya existente. Mantener sus restricciones en Google Cloud.
- `docs/assets/planos/`: mapas de Disney con las atribuciones originales, optimizados para consultar en móvil; PDF completo para descarga.
- `scripts/validate.mjs`: comprueba días, enlaces internos, rutas, archivos, coordenadas y datos privados.
- `.github/workflows/validar-web.yml`: ejecuta la validación con cada cambio de la web.

## Ver y comprobar

Desde la carpeta del repositorio:

```text
python -m http.server 4173 --bind 127.0.0.1 --directory docs
node --check docs/app.js
node --check docs/maps-config.js
node scripts/validate.mjs
```

Abrir `http://127.0.0.1:4173`. El mapa integrado puede no mostrarse en localhost si la clave solo admite el dominio publicado; los enlaces de navegación siguen disponibles.

## Publicación

GitHub Pages sirve **`main`, carpeta `/docs`**, con la URL existente. Publicar cuando se solicite y comprobar las ejecuciones de validación y Pages del commit enviado. Las rutas `#/lugar/pestaña` se pueden compartir; los enlaces antiguos con `?dia=2026-11-DD` llevan al lugar de ese día.

El repositorio es público: no incluir entradas originales, QR, localizadores, reservas, datos personales ni enlaces a archivos privados de Drive. Las direcciones y teléfonos de hoteles son datos comerciales. Los importes de reservas no implican pago comprobado.
