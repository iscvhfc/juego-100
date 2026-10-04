# memori100

Memoria de instrucciones y cambios del proyecto. Actualizar este archivo cada vez que cambien las reglas, la estructura o los datos.

## Objetivo
Aplicación tipo "100 Personas Servidoras Públicas dijeron" presentada con reveal.js 5.1.0 (incluido en `vendor/reveal`, sin CDN ni build). La portada usa la imagen de marca en `img/portada.png` y se presenta con un formato visual más grande y centrado.

## Ejecución (local o en línea)
- Local: abrir `index.html` con doble clic (funciona sin internet). Opcional: `npx serve .` o `python -m http.server`.
- En línea: subir la carpeta tal cual a cualquier hosting estático (GitHub Pages, Netlify, etc.); todas las rutas son relativas y no hay dependencias externas.
- El estado (sorteo, puntajes, orden de respuestas) se guarda en `localStorage` del navegador/dispositivo; en línea cada navegador tiene el suyo, así que la presentación se controla desde un solo equipo.

## Reglas del torneo (9 equipos, formato "el ganador sigue")
1. Se sortean 2 equipos al azar para el enfrentamiento 1 (p1).
2. Cada enfrentamiento tiene 3 preguntas. Cada pregunta muestra 3 respuestas SIN puntaje; cada equipo elige una distinta (no pueden repetir) y se destapa su puntaje. Idealmente se elige la de mayor puntaje.
3. Gana el equipo con más puntos sumados en las 3 preguntas (empate: botones de desempate). El perdedor queda eliminado.
4. El ganador enfrenta a un equipo sorteado al azar de los restantes, y así sucesivamente: 9 equipos -> 8 enfrentamientos (p1-p8, el último es la Gran final) -> 24 preguntas.
5. La puntuación se reinicia en cada enfrentamiento: el ganador comienza de 0 contra su nuevo rival (los puntos solo se acumulan en el "Marcador final", que es informativo y no decide avances).
6. Reserva: 3 preguntas extra (27 en total) al final de la presentación, para respaldo o desempate en vivo.

## Supuestos (confirmar con el usuario)
- El formato se actualizó de 7 a 9 equipos, manteniendo 3 preguntas por enfrentamiento.
- La base del torneo se amplió a 24 preguntas en juego + 3 de reserva.
- Los puntajes y preguntas son de ejemplo; reemplazarlos por encuestas reales.
- El sorteo se hace con el botón "Sortear" en cada diapositiva de enfrentamiento (Math.random, sin repetir equipos) y queda guardado.

## Estructura
- `index.html`: carga reveal.js (`vendor/reveal/dist`) y los scripts.
- `data/equipos.json`: listado de equipos para cargar dinámicamente.
- `data/preguntas.json`: `preguntasPorEnfrentamiento`, `preguntas` (24, en bloques de 3 por enfrentamiento) y `reserva` (3). Respuestas `[texto, puntos]`.
- `preguntas.js`: fallback local para que la app siga funcionando si los JSON no cargan.
- `app.js`: genera diapositivas, sorteo, puntajes y ganadores; estado en `localStorage` (clave `memori100-estado-v2`).
- `styles.css`: estilo visual.

## Uso en la presentación
- Flechas para navegar. En la diapositiva de enfrentamiento, pulsar "Sortear".
- En cada pregunta, pulsar el botón con el nombre del equipo bajo la respuesta que eligió: se destapa su puntaje. Pulsar de nuevo para quitar la elección.
- "Mostrar/ocultar todos los puntos" revela el resto (la mejor respuesta se resalta).
- El ganador avanza automáticamente; "Reiniciar torneo" (portada) borra sorteo y puntajes.
- En la diapositiva de resultado el equipo perdedor se muestra en rojo. Al final del torneo, tras el campeón, hay un "Marcador final" con los puntos acumulados de cada equipo (eliminados en rojo, campeón en dorado).
- Los botones de elegir respuesta se habilitan solo cuando los equipos ya fueron sorteados.
- El orden de las 3 respuestas de cada pregunta (y de las de reserva) se baraja al azar la primera vez y queda guardado (`orden` en el estado); "Reiniciar torneo" recarga la página y vuelve a barajar.

## Historial de cambios
- 2026-10-02: Creación inicial (8 equipos, cuartos/semis/final, 21 preguntas de 5 respuestas).
- 2026-10-02: Cambio de formato a 7 equipos con sorteo y ganador que sigue; preguntas con 3 respuestas ocultas que cada equipo elige; 18 preguntas en juego + 3 de reserva (21).
- 2026-10-02: Se verificó en navegador que reveal.js muestra solo 3 respuestas con puntos ocultos ("?") hasta que un equipo la elige; se añadió perdedor en rojo en el resultado y el marcador final de todos los equipos.
- 2026-10-02: Orden aleatorio (persistente) de las respuestas en cada pregunta para que la de mayor puntaje no quede siempre primera.
- 2026-10-02: Verificado que la puntuación se reinicia en cada enfrentamiento (`totales` solo suma las preguntas del propio enfrentamiento); se añadió como regla en la presentación y aquí.
- 2026-10-02: reveal.js 5.1.0 se copió a `vendor/reveal` (reemplaza la CDN) para ejecutar en local sin internet y en línea en hosting estático.
- 2026-10-03: Se amplió el torneo a 9 equipos y 24 preguntas en juego, manteniendo 3 de reserva para respaldo o desempate.
- 2026-10-03: Se actualizó el nombre del juego a "100 Personas Servidoras Públicas dijeron" y se incorporó la imagen de portada `img/portada.png` en la primera diapositiva.
- 2026-10-03: Se ajustó el tamaño de la imagen de portada para que ocupe un espacio visible más grande, manteniendo el diseño centrado y equilibrado.
- 2026-10-03: Se dejó la configuración lista para despliegue en GitHub Pages mediante `.github/workflows/pages.yml` y `.nojekyll`.
