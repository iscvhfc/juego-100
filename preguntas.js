// Configuración editable. Cada respuesta es [texto, puntos]; cada pregunta muestra 3 respuestas.
// Cada enfrentamiento usa 3 preguntas consecutivas: 7 equipos -> 6 enfrentamientos -> 18 preguntas.
window.CONFIG = {
  equipos: ['Equipo 1', 'Equipo 2', 'Equipo 3', 'Equipo 4', 'Equipo 5', 'Equipo 6', 'Equipo 7', 'Equipo 8', 'Equipo 9'],
  preguntasPorEnfrentamiento: 3,
  preguntas: [
    { pregunta: 'Algo que se lleva a una fiesta de cumpleaños', respuestas: [['Pastel', 35], ['Globos', 18], ['Dulces', 8]] },
    { pregunta: 'Una comida típica mexicana', respuestas: [['Tacos', 38], ['Pozole', 18], ['Enchiladas', 10]] },
    { pregunta: 'Algo que se pierde muy seguido', respuestas: [['Las llaves', 34], ['La cartera', 18], ['El paraguas', 8]] },

    { pregunta: 'Un lugar donde se hacen filas largas', respuestas: [['Banco', 32], ['Supermercado', 20], ['Tortillería', 10]] },
    { pregunta: 'Una razón para llegar tarde al trabajo', respuestas: [['Tráfico', 40], ['Lluvia', 14], ['Descompostura del auto', 8]] },
    { pregunta: 'Algo que se hace en Día de Muertos', respuestas: [['Poner ofrenda', 36], ['Poner cempasúchil', 18], ['Escribir calaveritas', 8]] },

    { pregunta: 'Una fruta que se vende con chile en la calle', respuestas: [['Mango', 36], ['Pepino', 18], ['Piña', 8]] },
    { pregunta: 'Un deporte que se ve en televisión', respuestas: [['Futbol', 52], ['Béisbol', 12], ['Lucha libre', 8]] },
    { pregunta: 'Algo que se hace antes de dormir', respuestas: [['Lavarse los dientes', 34], ['Ver televisión', 20], ['Revisar el celular', 10]] },

    { pregunta: 'Un oficio que se necesita en casa', respuestas: [['Plomero', 34], ['Albañil', 18], ['Pintor', 8]] },
    { pregunta: 'Algo que se hace en la playa', respuestas: [['Nadar', 36], ['Hacer castillos de arena', 16], ['Caminar', 10]] },
    { pregunta: 'Algo que se hereda de los abuelos', respuestas: [['Recetas de cocina', 30], ['Refranes', 18], ['El apellido', 10]] },

    { pregunta: 'Un programa mexicano de comedia', respuestas: [['El Chavo del 8', 40], ['La Familia P. Luche', 16], ['Vecinos', 8]] },
    { pregunta: 'Algo que se regala en Navidad', respuestas: [['Ropa', 28], ['Perfume', 18], ['Libros', 12]] },
    { pregunta: 'Un animal que se tiene de mascota', respuestas: [['Perro', 48], ['Pez', 10], ['Perico', 5]] },

    { pregunta: 'Algo que se encuentra en una cocina', respuestas: [['Estufa', 30], ['Licuadora', 18], ['Microondas', 10]] },
    { pregunta: 'Una razón para ir al doctor', respuestas: [['Gripa', 32], ['Dolor de cabeza', 14], ['Fractura', 10]] },
    { pregunta: 'Algo que ocurre en una boda', respuestas: [['Baile', 30], ['Cortan el pastel', 16], ['Lloran los papás', 10]] },

    { pregunta: 'Un lugar que te gustaría visitar en vacaciones', respuestas: [['Playa', 26], ['Ciudad grande', 18], ['Montañas', 12]] },
    { pregunta: 'Algo que siempre llevas en tu mochila', respuestas: [['Celular', 32], ['Cuaderno', 18], ['Botella de agua', 12]] },
    { pregunta: 'Un gesto típico de saludo entre amigos', respuestas: [['Abrazarse', 30], ['Darse la mano', 20], ['Beso en la mejilla', 12]] },

    { pregunta: 'Una cosa que se hace en un fin de semana', respuestas: [['Dormir', 24], ['Salir con amigos', 20], ['Comer fuera', 14]] },
    { pregunta: 'Un tipo de música que suena en una fiesta', respuestas: [['Cumbia', 30], ['Rock', 18], ['Reggaetón', 14]] },
    { pregunta: 'Algo que se ve en un mercado', respuestas: [['Frutas', 28], ['Flores', 18], ['Vendedores', 10]] }
  ],
  // Preguntas de reserva (3 extra al final): se muestran como respaldo o desempate.
  reserva: [
    { pregunta: 'Algo que no puede faltar en una posada', respuestas: [['Piñata', 34], ['Villancicos', 18], ['Colación', 8]] },
    { pregunta: 'Algo que te pone nervioso', respuestas: [['Un examen', 30], ['Entrevista de trabajo', 22], ['Viajar en avión', 8]] },
    { pregunta: 'Algo que se ve en la plaza de un pueblo', respuestas: [['Kiosco', 28], ['Vendedores', 18], ['Bancas', 12]] }
  ]
};
