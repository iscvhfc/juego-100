(() => {
  const fallbackConfig = window.CONFIG || {
    equipos: ['Equipo 1', 'Equipo 2', 'Equipo 3', 'Equipo 4', 'Equipo 5', 'Equipo 6', 'Equipo 7', 'Equipo 8', 'Equipo 9'],
    preguntasPorEnfrentamiento: 3,
    preguntas: [],
    reserva: []
  };

  async function cargarConfig() {
    try {
      const [equiposRes, preguntasRes] = await Promise.all([
        fetch('data/equipos.json', { cache: 'no-store' }),
        fetch('data/preguntas.json', { cache: 'no-store' })
      ]);

      if (!equiposRes.ok || !preguntasRes.ok) {
        throw new Error('No se pudieron cargar los JSON');
      }

      const equiposData = await equiposRes.json();
      const preguntasData = await preguntasRes.json();

      const config = {
        equipos: Array.isArray(equiposData.equipos) ? equiposData.equipos : fallbackConfig.equipos,
        preguntasPorEnfrentamiento: Number(preguntasData.preguntasPorEnfrentamiento || fallbackConfig.preguntasPorEnfrentamiento || 3),
        preguntas: Array.isArray(preguntasData.preguntas) ? preguntasData.preguntas : fallbackConfig.preguntas,
        reserva: Array.isArray(preguntasData.reserva) ? preguntasData.reserva : fallbackConfig.reserva
      };

      window.CONFIG = config;
      return config;
    } catch (error) {
      console.warn('Usando configuración local por fallback porque no se pudieron cargar los JSON.', error);
      window.CONFIG = fallbackConfig;
      return fallbackConfig;
    }
  }

  async function iniciar() {
    const { equipos, preguntas, preguntasPorEnfrentamiento: N } = await cargarConfig();
    const KEY = 'memori100-estado-v2';
    const TOTAL = equipos.length - 1;

    // Cada ganador enfrenta al siguiente equipo sorteado: p1 = sorteo 0 vs 1, pK = ganador de p(K-1) vs sorteo K.
    const partidos = Array.from({ length: TOTAL }, (_, k) => ({
      id: `p${k + 1}`,
      k,
      titulo: `Enfrentamiento ${k + 1}`,
      a: k === 0 ? { sorteo: 0 } : { ganador: `p${k}` },
      b: { sorteo: k + 1 },
      preguntas: preguntas.slice(k * N, (k + 1) * N)
    }));
    const porId = Object.fromEntries(partidos.map((m) => [m.id, m]));

    const vacio = () => ({ q: {}, tb: {}, sorteo: [], orden: {} });
    let estado = cargar();

    function cargar() {
      try {
        return { ...vacio(), ...JSON.parse(localStorage.getItem(KEY)) };
      } catch {
        return vacio();
      }
    }
    const guardar = () => localStorage.setItem(KEY, JSON.stringify(estado));

    // Orden de visualización de las respuestas (aleatorio y fijo por pregunta); los índices originales no cambian.
    function ordenDe(id, n) {
      if (!estado.orden[id]) {
        const o = Array.from({ length: n }, (_, i) => i);
        for (let i = n - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [o[i], o[j]] = [o[j], o[i]];
        }
        estado.orden[id] = o;
        guardar();
      }
      return estado.orden[id];
    }
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // --- Lógica de torneo ---
    function totales(m) {
      const t = { a: 0, b: 0, pendientes: 0 };
      m.preguntas.forEach((p, i) => {
        const r = estado.q[`${m.id}-${i}`] || {};
        ['a', 'b'].forEach((l) => {
          if (r[l] === undefined) t.pendientes++;
          else t[l] += p.respuestas[r[l]][1];
        });
      });
      t.completo = t.pendientes === 0;
      return t;
    }

    function sortear(k) {
      while (estado.sorteo.length < k + 2) {
        const restantes = equipos.map((_, i) => i).filter((i) => !estado.sorteo.includes(i));
        estado.sorteo.push(restantes[Math.floor(Math.random() * restantes.length)]);
      }
    }

    function ladoGanador(m) {
      const t = totales(m);
      if (!t.completo) return null;
      if (t.a !== t.b) return t.a > t.b ? 'a' : 'b';
      return estado.tb[m.id] || null;
    }

    function equipoIdx(ref) {
      if (ref.sorteo !== undefined) return estado.sorteo[ref.sorteo];
      const origen = porId[ref.ganador];
      const l = ladoGanador(origen);
      return l ? equipoIdx(origen[l]) : undefined;
    }

    function nombreEquipo(ref) {
      const i = equipoIdx(ref);
      if (i !== undefined) return equipos[i];
      return ref.sorteo !== undefined ? 'Por sortear' : 'Por definir';
    }

    function marcadorGeneral() {
      const pts = equipos.map(() => 0);
      const wins = equipos.map(() => 0);
      const fuera = new Set();
      partidos.forEach((m) => {
        const t = totales(m);
        ['a', 'b'].forEach((l) => {
          const i = equipoIdx(m[l]);
          if (i !== undefined) pts[i] += t[l];
        });
        const g = ladoGanador(m);
        if (g) {
          const ganadorIdx = equipoIdx(m[g]);
          if (ganadorIdx !== undefined) wins[ganadorIdx] += 1;
          fuera.add(equipoIdx(m[g === 'a' ? 'b' : 'a']));
        }
      });
      const resumen = equipos
        .map((nombre, i) => ({ nombre, pts: pts[i], wins: wins[i], fuera: fuera.has(i), campeon: false }))
        .sort((x, y) => y.pts - x.pts || y.wins - x.wins);
      // Campeón solo si el líder tiene puntaje mayor a cero (con 0 no cuenta).
      if (resumen.length && resumen[0].pts > 0) resumen[0].campeon = true;
      return resumen;
    }

    const lado = (m, l) => `<span data-name="${m.id}:${l}"></span>`;

    function slideTitulo() {
      return `<section class="portada">
        <img src="img/portada.png" alt="100 Personas Servidoras Públicas dijeron" class="cover-image">
        <!-- Portada 
        <h1>100 Personas Servidoras Públicas dijeron</h1>
        -->
        <h3>Torneo de ${equipos.length} equipos</h3>
        <p class="ayuda">Flechas para navegar · F pantalla completa</p>
        <button class="mini" data-reset>Reiniciar torneo</button>
      </section>`;
    }

    function slideReglas() {
      return `<section>
        <h2>Reglas</h2>
        <ul class="reglas">
          <li>Se sortean 2 equipos para el primer enfrentamiento.</li>
          <li>Cada pregunta muestra ${preguntas[0].respuestas.length} respuestas sin puntaje: cada equipo elige una distinta.</li>
          <li>Se destapan los puntos; conviene elegir la de mayor puntaje.</li>
          <li>Tras ${N} preguntas, pasa el equipo con más puntos del enfrentamiento y enfrenta a un nuevo rival sorteado.</li>
          <li>La puntuación se reinicia en cada enfrentamiento: el ganador comienza de 0.</li>
          <li>El campeón del torneo es el equipo con mayor puntaje total acumulado; si hay empate, se define por más victorias en enfrentamientos.</li>
        </ul>
      </section>`;
    }

    function slideEquipos() {
      return `<section>
        <h2>Equipos participantes</h2>
        <ol class="reglas">${equipos.map((e) => `<li>${esc(e)}</li>`).join('')}</ol>
      </section>`;
    }

    function slideLlave() {
      return `<section><h2>Orden del torneo</h2>${partidos.map((m) => `<p class="linea"><b>${esc(m.titulo)}:</b> ${lado(m, 'a')} <small>vs</small> ${lado(m, 'b')}</p>`).join('')}</section>`;
    }

    function slideVersus(m) {
      return `<section class="versus" data-versus="${m.k}">
        <h3>${esc(m.titulo)}</h3>
        <div class="duelo"><div class="equipo">${lado(m, 'a')}</div><div class="vs">VS</div><div class="equipo">${lado(m, 'b')}</div></div>
        <p><button data-sortear="${m.k}">Sortear ${m.k === 0 ? 'equipos' : 'rival'}</button></p>
      </section>`;
    }

    function slidePregunta(m, p, i) {
      const id = `${m.id}-${i}`;
      const opciones = ordenDe(id, p.respuestas.length).map((k) => {
        const [texto, pts] = p.respuestas[k];
        return `<div class="opcion" data-k="${k}" data-pts="${pts}">` +
          `<div class="texto">${esc(texto)}</div>` +
          `<div class="puntos"><span class="valor">${pts}</span><span class="oculto">?</span></div>` +
          `<div class="quien"></div>` +
          `<div class="elige"><button data-pick="a:${k}">${lado(m, 'a')}</button><button data-pick="b:${k}">${lado(m, 'b')}</button></div>` +
          `</div>`;
      }).join('');
      return `<section class="pregunta" data-qid="${id}" data-match="${m.id}">
        <p class="etiqueta">${esc(m.titulo)} · Pregunta ${i + 1} de ${m.preguntas.length}</p>
        <h3 class="enunciado">${esc(p.pregunta)}</h3>
        <div class="opciones">${opciones}</div>
        <p><button class="mini" data-showall>Mostrar/ocultar todos los puntos</button></p>
        <p class="marcador">${lado(m, 'a')}: <b data-total="${m.id}:a"></b> · ${lado(m, 'b')}: <b data-total="${m.id}:b"></b></p>
      </section>`;
    }

    function slideResultado(m) {
      return `<section class="resultado" data-result="${m.id}">
        <h3>Resultado · ${esc(m.titulo)}</h3>
        <div class="duelo">
          <div class="equipo">${lado(m, 'a')}<div class="total" data-total="${m.id}:a"></div></div>
          <div class="vs">VS</div>
          <div class="equipo">${lado(m, 'b')}<div class="total" data-total="${m.id}:b"></div></div>
        </div>
        <p class="veredicto"></p>
        <div class="desempate" hidden>
          <span>Desempate:</span>
          <button data-tb="a">Gana ${lado(m, 'a')}</button>
          <button data-tb="b">Gana ${lado(m, 'b')}</button>
        </div>
      </section>`;
    }

    function slideCampeon() {
      return `<section class="campeon">
        <h2>Campeón del torneo</h2>
        <p class="ayuda">Ganador por puntaje total acumulado</p>
        <div class="equipo grande ganador" data-campeon></div>
      </section>`;
    }

    function slideMarcador() {
      return `<section data-slide="marcador"><h2>Marcador final acumulado</h2><div class="tabla" data-marcador></div><p class="ayuda">Rojo: equipo eliminado · ordenado por puntaje total</p></section>`;
    }

    function slideReserva(p, i, total) {
      const opciones = ordenDe(`r${i}`, p.respuestas.length).map((k) => {
        const [texto, pts] = p.respuestas[k];
        return `<div class="opcion" data-k="${k}" data-pts="${pts}"><div class="texto">${esc(texto)}</div>` +
          `<div class="puntos"><span class="valor">${pts}</span><span class="oculto">?</span></div></div>`;
      }).join('');
      return `<section class="pregunta reserva">
        <p class="etiqueta">Reserva · Pregunta ${i + 1} de ${total}</p>
        <h3 class="enunciado">${esc(p.pregunta)}</h3>
        <div class="opciones">${opciones}</div>
        <p class="ayuda">Clic en una respuesta para destapar su puntaje.</p>
      </section>`;
    }

    function construir() {
      const reserva = window.CONFIG.reserva || [];
      const html = [slideTitulo(), slideReglas(), slideEquipos(), slideLlave()];
      partidos.forEach((m) => {
        html.push(slideVersus(m));
        m.preguntas.forEach((p, i) => html.push(slidePregunta(m, p, i)));
        html.push(slideResultado(m));
      });
      html.push(slideCampeon(), slideMarcador());
      if (reserva.length) {
        html.push(`<section><h2>Preguntas de reserva</h2><p class="ayuda">Respaldo o desempate</p></section>`);
        reserva.forEach((p, i) => html.push(slideReserva(p, i, reserva.length)));
      }
      document.querySelector('.slides').innerHTML = html.join('');
    }

    function refrescar() {
      document.querySelectorAll('[data-name]').forEach((el) => {
        const [id, l] = el.dataset.name.split(':');
        el.textContent = nombreEquipo(porId[id][l]);
      });
      document.querySelectorAll('[data-total]').forEach((el) => {
        const [id, l] = el.dataset.total.split(':');
        el.textContent = totales(porId[id])[l];
      });
      document.querySelectorAll('section.versus').forEach((s) => {
        s.querySelector('[data-sortear]').hidden = estado.sorteo.length >= Number(s.dataset.versus) + 2;
      });
      document.querySelectorAll('section.pregunta[data-match]').forEach((s) => {
        const m = porId[s.dataset.match];
        const r = estado.q[s.dataset.qid] || {};
        const todas = s.classList.contains('todas');
        const opciones = [...s.querySelectorAll('.opcion')];
        const mejor = Math.max(...opciones.map((o) => Number(o.dataset.pts)));
        opciones.forEach((o) => {
          const k = Number(o.dataset.k);
          const eligieron = ['a', 'b'].filter((l) => r[l] === k);
          const visible = todas || eligieron.length > 0;
          o.classList.toggle('revelada', visible);
          o.classList.toggle('mejor', visible && Number(o.dataset.pts) === mejor);
          o.querySelector('.quien').textContent = eligieron.map((l) => nombreEquipo(m[l])).join(' y ');
          ['a', 'b'].forEach((l) => {
            const b = o.querySelector(`[data-pick="${l}:${k}"]`);
            b.classList.toggle('activo', r[l] === k);
            b.disabled = r[l === 'a' ? 'b' : 'a'] === k || equipoIdx(m[l]) === undefined;
          });
        });
      });
      document.querySelectorAll('section.resultado').forEach((s) => {
        const m = porId[s.dataset.result];
        const t = totales(m);
        const g = ladoGanador(m);
        const veredicto = s.querySelector('.veredicto');
        s.querySelector('.desempate').hidden = !(t.completo && t.a === t.b);
        s.querySelectorAll('.equipo').forEach((el, i) => {
          el.classList.toggle('ganador', g === ['a', 'b'][i]);
          el.classList.toggle('perdedor', !!g && g !== ['a', 'b'][i]);
        });
        if (g) veredicto.textContent = `Avanza: ${nombreEquipo(m[g])}`;
        else if (t.completo) veredicto.textContent = 'Empate: elige quién gana el desempate';
        else veredicto.textContent = `Faltan ${t.pendientes} elección(es) por registrar`;
      });
      const resumenFinal = marcadorGeneral();
      const campeon = resumenFinal.find((e) => e.campeon);
      document.querySelectorAll('[data-campeon]').forEach((el) => {
        el.textContent = campeon ? campeon.nombre : 'Por definir';
      });
      // La lámina de campeón se oculta de la presentación mientras nadie tenga
      // puntaje mayor a cero; reaparece en cuanto hay un campeón.
      const slideCampeon = document.querySelector('section.campeon');
      const slideMarcadorFinal = document.querySelector('section[data-slide="marcador"]');
      if (slideCampeon && slideMarcadorFinal) {
        if (!campeon && slideCampeon.isConnected) {
          slideCampeon.remove();
          Reveal.sync();
        } else if (campeon && !slideCampeon.isConnected) {
          slideMarcadorFinal.before(slideCampeon);
          Reveal.sync();
        }
      }
      document.querySelectorAll('[data-marcador]').forEach((el) => {
        el.innerHTML = resumenFinal.map((e) =>
          `<div class="fila${e.campeon ? ' campeon' : e.fuera ? ' perdedor' : ''}"><span>${esc(e.nombre)}</span><b>${e.pts}</b></div>`).join('');
      });
    }

    document.addEventListener('click', (e) => {
      const t = e.target;
      const pick = t.closest('[data-pick]');
      if (pick) {
        const [l, k] = pick.dataset.pick.split(':');
        const id = pick.closest('section').dataset.qid;
        const r = (estado.q[id] = estado.q[id] || {});
        if (r[l] === Number(k)) delete r[l];
        else r[l] = Number(k);
        guardar(); return refrescar();
      }
      if (t.closest('[data-showall]')) {
        t.closest('section').classList.toggle('todas');
        return refrescar();
      }
      const sorteo = t.closest('[data-sortear]');
      if (sorteo) {
        sortear(Number(sorteo.dataset.sortear));
        guardar(); return refrescar();
      }
      const reserva = t.closest('.reserva .opcion');
      if (reserva) return reserva.classList.toggle('revelada');

      const tb = t.closest('[data-tb]');
      if (tb) {
        estado.tb[tb.closest('section').dataset.result] = tb.dataset.tb;
        guardar(); return refrescar();
      }
      if (t.closest('[data-reset]') && confirm('¿Reiniciar el torneo (sorteo y puntajes)?')) {
        estado = vacio();
        guardar();
        location.reload();
      }
    });

    construir();
    Reveal.initialize({ width: 1280, height: 720, hash: true, transition: 'slide', slideNumber: 'c/t', controls: true, progress: true });
    Reveal.on('slidechanged', refrescar);
    refrescar();
  }

  iniciar();
})();
