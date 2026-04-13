// ========================================
// MAPA DE HABITACIONES - BACKROOMS
// ========================================
// Cada habitación define sus conexiones a otras habitaciones
// Las imágenes se cargan desde /public/images/rooms/
// ========================================

export const roomsMap = {
  'inicio': {
    id: 'inicio',
    name: 'Pasillo',
    image: '/images/rooms/pasillo-1.png',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'pasillo-2',
      right: 'pasillo-18-inf',
      left: 'pasillo-27',
      backward: null
    },
    items: []
  },

  'pasillo-2': {
    id: 'pasillo-2',
    name: 'Pasillo',
    image: '/images/rooms/pasillo-2.png',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: null,
      right: 'pasillo-13',
      left: 'pasillo-3',
      backward: 'inicio'
    },
    items: []
  },

  //BLOQUE IZQUIERDO SUPERIOR

  'pasillo-3': {
    id: 'pasillo-3',
    name: 'Pasillo',
    image: '/images/rooms/bloqIzqSup/0.png',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: null,
      right: 'pasillo-4',
      left: null,
      backward: 'pasillo-2'
    },
    items: []
  },

  'pasillo-4': {
    id: 'pasillo-4',
    name: 'Pasillo',
    image: '/images/rooms/bloqIzqSup/1.png',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'puerta-laboratorio-cerrado',
      right: 'pasillo-7',
      left: null,
      backward: 'pasillo-3'
    },
    items: []
  },

  'puerta-laboratorio-cerrado': {
    id: 'puerta-laboratorio-cerrado',
    name: 'Puerta de laboratorio',
    image: '/images/rooms/bloqIzqSup/Up1.png',
    description: 'Una pesada puerta de seguridad industrial bloquea el final del pasillo, rayas azules diagonales en la parte inferior y un panel numérico a la derecha.',
    connections: {
      forward: 'panel-numerico',
      right: null,
      left: null,
      backward: 'pasillo-4'
    },
    items: []
  },

  'puerta-laboratorio-abierta': {
    id: 'puerta-laboratorio-abierta',
    name: 'Laboratorio — Entrada',
    image: '/images/rooms/bloqIzqSup/puerta-laboratorio-abierta.jpg',
    description: '¿Qué rayos?',
    connections: {
      forward: '__ending__',
      right: null,
      left: null,
      backward: null
    },
    items: []
  },

  'panel-numerico': {
    id: 'panel-numerico',
    name: 'Panel numérico',
    image: '/images/rooms/bloqIzqSup/Up2.png',
    description: '',
    connections: {
      forward: null,
      right: null,
      left: null,
      backward: 'puerta-laboratorio-cerrado'
    },
    items: [],
    // Panel numérico - requiere código para avanzar
    keypad: {
      code: '1758',
      unlocks: 'forward',
      opensTo: 'puerta-laboratorio-abierta',
      hint: 'Teclea el código de acceso...'
    }
  },

  'pasillo-7': {
    id: 'pasillo-7',
    name: 'Pasillo',
    image: '/images/rooms/bloqIzqSup/R1.png',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'pasillo-8',
      right: null,
      left: null,
      backward: 'pasillo-4'
    },
    items: []
  },

  'pasillo-8': {
    id: 'pasillo-8',
    name: 'Pasillo',
    image: '/images/rooms/bloqIzqSup/R-Up1.png',
    description: 'La habitación está casi completamente a oscuras. Solo un fluorescente parpadea débilmente en el techo. El zumbido es más fuerte aquí.',
    connections: {
      forward: 'pasillo-9',
      right: null,
      left: null,
      backward: 'pasillo-7'
    },
    items: []
  },

  'pasillo-9': {
    id: 'pasillo-9',
    name: 'Pasillo',
    image: '/images/rooms/bloqIzqSup/R-Up2.png',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'pasillo-10',
      right: null,
      left: null,
      backward: 'pasillo-8'
    },
    items: []
  },

  'pasillo-10': {
    id: 'pasillo-10',
    name: 'Pasillo',
    image: '/images/rooms/bloqIzqSup/R-Up3.png',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'pasillo-11',
      right: null,
      left: null,
      backward: 'pasillo-9'
    },
    items: []
  },

  'pasillo-11': {
    id: 'pasillo-11',
    name: 'Pasillo',
    image: '/images/rooms/bloqIzqSup/R-Up4.png',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'pasillo-12',
      right: 'trampilla-1',
      left: null,
      backward: 'pasillo-10'
    },
    items: []
  },

  'pasillo-12': {
    id: 'pasillo-12',
    name: 'Pasillo',
    image: '/images/rooms/bloqIzqSup/R-Up5.png',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'habitacion-miku',
      right: null,
      left: null,
      backward: 'pasillo-11'
    },
    items: []
  },

  'habitacion-miku': {
    id: 'habitacion-miku',
    name: 'Habitación',
    image: '/images/rooms/bloqIzqSup/habitacion-miku.png',
    description: 'El suelo está lleno de objetos que no deberían estar ahí: una pelota de fútbol incrustada en el piso, una mesa de madera saliendo directamente de la pared. Todo parece glitcheado, como si la habitación se estuviera desmoronando... \n\n¿Qué es eso en el fondo?',
    connections: {
      forward: 'habitacion-miku-2',
      right: null,
      left: null,
      backward: 'pasillo-11'
    },
    items: []
  },

  'habitacion-miku-2': {
    id: 'habitacion-miku-2',
    name: 'Habitación',
    image: '/images/rooms/bloqIzqSup/habitacion-miku-2.png',
    description: 'El suelo está lleno de objetos que no deberían estar ahí: una pelota de fútbol incrustada en el piso, una mesa de madera saliendo directamente de la pared. Todo parece glitcheado, como si la habitación se estuviera desmoronando... \n\n¿Qué es eso en el fondo?',
    connections: {
      forward: 'miku',
      right: null,
      left: null,
      backward: 'habitacion-miku'
    },
    items: []
  },

  'miku': {
    id: 'miku',
    name: 'miku',
    image: '/images/rooms/bloqIzqSup/miku.jpg',
    description: 'Miku parece contenta de verte, parece que no le importa quedarse ahi.',
    connections: {
      forward: null,
      right: null,
      left: null,
      backward: 'habitacion-miku-2'
    },
    items: [],
    // NPC en esta habitación
    npc: {
      name: 'Miku',
      icon: '🎤',
      colors: {
        primary: '#06b6d4', // cyan
        secondary: '#06b6d4' // cyan
      },
      image: '/images/npcs/miku.png', // Opcional: imagen del NPC
      // Diálogo de introducción (siempre se muestra primero)
      dialogueIntro: [
        'Oh... hola.',
        '¿Sabes dónde estoy?',
        'Soy Miku, mucho gusto.',
        'Estaba dando un concierto y me caí un momento... y ahora estoy atrapada en este lugar.'
      ],
      // Diálogo cuando NO tiene el item (pide ayuda)
      dialogue: [
        '¿Puedes ayudarme a encontrar mi micrófono?',
        'Un oso amarillo me asustó y lo solté por ahí...',
        'Si me ayudas, te daré un papel medio curioso que encontré antes de que se atravesara por las paredes.'
      ],
      // Diálogo cuando SÍ tiene el item (recompensa)
      dialogueWithItem: [
        '¡Oh! ¡Mi micrófono! ¡Lo encontraste!',
        'Muchas gracias... no sé cómo agradecértelo.',
        'Toma, como prometí, aquí tienes este papel.',
        'Lo encontré tirado en una esquina... tiene algo escrito.',
        '¡Espero que te sirva de algo!'
      ],
      // Item requerido para el diálogo alternativo
      requiredItem: 'Microfono',
      // Recompensa al completar la quest
      reward: {
        id: 201,
        icon: '📜',
        name: 'Nota de Miku',
        description: 'Una nota con un mensaje: "Segundo lugar Azul"',
        quantity: 1
      }
    }
  },

  'trampilla-1': {
    id: 'trampilla-1',
    name: 'pasillo',
    image: '/images/rooms/bloqIzqSup/trampilla-1.png',
    description: 'Observas el hueco con atención. Cuanto más lo miras, más sientes que el hueco te devuelve la mirada… \n\n¿Por qué no te lanzas?',
    connections: {
      forward: 'trampilla-salida-1',
      right: 'pasillo-11',
      left: 'pasillo-12',
      backward: 'pasillo-11'
    },
    items: []
  },

  'trampilla-salida-1': {
    id: 'trampilla-salida-1',
    name: 'pasillo',
    image: '/images/rooms/bloqIzqSup/trampilla-salida-1.jpg',
    description: 'Tal parece que no puedes volver... pero si continuar hacia adelante, quizás encuentres algo nuevo.',
    connections: {
      forward: 'pasillo-16',
      right: null,
      left: null,
      backward: null
    },
    items: []
  },

  // ========================================
  //BLOQUE DERECHO SUPERIOR
  // ========================================

  'pasillo-13': {
    id: 'pasillo-13',
    name: 'Pasillo',
    image: '/images/rooms/bloqDerSup/1.jpg',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'pasillo-14',
      right: null,
      left: null,
      backward: 'pasillo-2'
    },
    items: []
  },
  
  'pasillo-14': {
    id: 'pasillo-14',
    name: 'Pasillo',
    image: '/images/rooms/bloqDerSup/2.jpg',
    description: 'La oscuridad se cierne sobre ti, el zumbido se vuelve ensordecedor. \n\nSientes que algo te observa desde la oscuridad.',
    connections: {
      forward: 'pasillo-15',
      right: null,
      left: null,
      backward: 'pasillo-13'
    },
    items: []
  },

  'pasillo-15': {
    id: 'pasillo-15',
    name: 'Pasillo',
    image: '/images/rooms/bloqDerSup/3.jpg',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'pasillo-16',
      right: null,
      left: null,
      backward: 'pasillo-14'
    },
    items: []
  },

  'pasillo-16': {
    id: 'pasillo-16',
    name: 'Pasillo',
    image: '/images/rooms/bloqDerSup/4.jpg',
    description: 'Ves un traje de osito de peluche amarillo con sombrero de copa yace tirado entre manchas en la pared \n\n¿Porque no lo ves mas de cerca?',
    connections: {
      forward: 'golden-freddy',
      right: 'pasillo-17',
      left: null,
      backward: 'pasillo-15'
    },
    items: []
  },

  'golden-freddy': {
    id: 'golden-freddy',
    name: 'Golden Freddy',
    image: '/images/rooms/bloqDerSup/golden-freddy.jpg',
    description: 'Escuchas un llanto de un niño muy bajo, es como si viniera de ese traje de oso... \n\nHay un papel debajo de su mano.',
    connections: {
      forward: null,
      right: null,
      left: null,
      backward: 'pasillo-16'
    },
    items: [
      { id: 101, icon: '📄', name: 'Hoja ensangrentada', description: 'Rojo primer lugar', quantity: 1 }
    ]
  },

  'pasillo-17': {
    id: 'pasillo-17',
    name: 'Pasillo',
    image: '/images/rooms/bloqDerSup/R1.jpg',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'pasillo-18',
      right: null,
      left: null,
      backward: 'pasillo-16'
    },
    items: []
  },

  'pasillo-18': {
    id: 'pasillo-18',
    name: 'Pasillo',
    image: '/images/rooms/bloqDerSup/R2.jpg',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'trampilla-2',
      right: null,
      left: null,
      backward: 'pasillo-17'
    },
    items: []
  },

  'trampilla-2': {
    id: 'trampilla-2',
    name: 'pasillo',
    image: '/images/rooms/bloqDerSup/trampilla-2.jpg',
    description: 'Observas el hueco con atención. Cuanto más lo miras, más sientes que el hueco te devuelve la mirada… \n\n¿Por qué no te lanzas?',
    connections: {
      forward: 'trampilla-salida-2',
      right: null,
      left: null,
      backward: 'pasillo-18'
    },
    items: []
  },

  'trampilla-salida-2': {
    id: 'trampilla-salida-2',
    name: 'Teatro',
    image: '/images/rooms/bloqDerSup/trampilla-salida-2.jpg',
    description: 'Tal parece que no puedes volver... pero si continuar hacia adelante, quizás encuentres algo nuevo.',
    connections: {
      forward: 'pasillo-20',
      right: null,
      left: null,
      backward: null
    },
    items: []
  },

  // ========================================
  //BLOQUE DERECHO INFERIOR
  // ========================================

  'pasillo-18-inf': {
    id: 'pasillo-18-inf',
    name: 'Pasillo',
    image: '/images/rooms/bloqDerInf/1.jpg',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'pasillo-24',
      right: null,
      left: 'pasillo-19',
      backward: 'inicio'
    },
    items: []
  },

  'pasillo-19': {
    id: 'pasillo-19',
    name: 'pasillo',
    image: '/images/rooms/bloqDerInf/L-1.jpg',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'pasillo-20',
      right: null,
      left: null,
      backward: 'pasillo-18-inf'
    },
    items: []
  },

  'pasillo-20': {
    id: 'pasillo-20',
    name: 'Teatro',
    image: '/images/rooms/bloqDerInf/L-2.jpg',
    description: 'Aun que no lo paresca, este lugar es un teatro abandonado.',
    connections: {
      forward: null,
      right: 'pasillo-21',
      left: 'pasillo-22',
      backward: 'pasillo-19'
    },
    items: []
  },

  'pasillo-21': {
    id: 'pasillo-21',
    name: 'Teatro',
    image: '/images/rooms/bloqDerInf/L-R-1.jpg',
    description: 'Aun que no lo paresca, este lugar es un teatro abandonado.',
    connections: {
      forward: null,
      right: null,
      left: null,
      backward: 'pasillo-20'
    },
    items: []
  },

  'pasillo-22': {
    id: 'pasillo-22',
    name: 'Teatro',
    image: '/images/rooms/bloqDerInf/L-L-1.jpg',
    description: 'Tal parece que hay una payasa en este teatro.',
    connections: {
      forward: 'pasillo-23',
      right: null,
      left: null,
      backward: 'pasillo-20'
    },
    items: []
  },

  'pasillo-23': {
    id: 'pasillo-23',
    name: 'pomni',
    image: '/images/rooms/bloqDerInf/pomni.jpg',
    description: '',
    connections: {
      forward: null,
      right: null,
      left: null,
      backward: 'pasillo-20'
    },
    items: [],
    // NPC Pomni
    npc: {
      name: 'Pomni',
      icon: '🧸',
      colors: {
        primary: '#ef4444', // rojo
        secondary: '#3b82f6' // azul
      },
      // Diálogo de introducción
      dialogueIntro: [
        '¿¡DONDE RAYOS ESTOY!?',
        'ESTABA CONDUCIENDO CON UNOS SERES EXTRAÑOS Y TERMINÉ AQUÍ',
        '¿¡ESTO ES OBRA DE CAINE!?',
        'NECESITO CALMARME!'
      ],
      // Diálogo cuando NO tiene el item (necesita calmarse)
      dialogue: [
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHH'
      ],
      // Diálogo cuando SÍ tiene el item (le das el peluche)
      dialogueWithItem: [
        '*Le das el peluche*',
        'Oh..., ese peluche se parece a mi',
        'Je... sí tengo cara chistosa',
        'Gracias, me calmé un poco. Me llamo Pomni, un gusto.',
        'Por ayudarme te doy esta hoja extraña...',
        'Intentaré buscar la salida, ya estoy acostumbrada...'
      ],
      // Item requerido
      requiredItem: 'Peluche',
      // Recompensa
      reward: {
        id: 202,
        icon: '📜',
        name: 'Nota de Pomni',
        description: 'Verde Cuarto lugar',
        quantity: 1
      }
    }
  },

  'pasillo-24': {
    id: 'pasillo-24',
    name: 'pasillo',
    image: '/images/rooms/bloqDerInf/U-1.jpg',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'pasillo-25',
      right: null,
      left: null,
      backward: 'pasillo-18-inf'
    },
    items: []
  },

  'pasillo-25': {
    id: 'pasillo-25',
    name: 'pasillo',
    image: '/images/rooms/bloqDerInf/U-2.jpg',
    description: 'Puedes saltar ahi abajo, pero no parece que puedas volver...',
    connections: {
      forward: 'pasillo-16',
      right: 'pasillo-26',
      left: 'pasillo-24',
      backward: null
    },
    items: []
  },

  'pasillo-26': {
    id: 'pasillo-26',
    name: 'pasillo',
    image: '/images/rooms/bloqDerInf/U-L-1.jpg',
    description: '¿Encontraste un micrófono flotando en el aire?\n\nTómalo, quizá pertenezca a alguna vocaloid.',
    connections: {
      forward: null,
      right: null,
      left: null,
      backward: 'pasillo-25'
    },
    items: [
      { id: 102, icon: '🎤', name: 'Microfono', description: 'Un micrófono rosa con detalles brillantes. Parece pertenecer a alguien especial.', quantity: 1 }
    ]
  },

  // ========================================
  //BLOQUE IZQUIERDO INFERIOR
  // ========================================

  'pasillo-27': {
    id: 'pasillo-27',
    name: 'pasillo',
    image: '/images/rooms/bloqIzqInf/1.jpg',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'pasillo-28',
      right: null,
      left: null,
      backward: 'inicio'
    },
    items: []
  },

  'pasillo-28': {
    id: 'pasillo-28',
    name: 'pasillo',
    image: '/images/rooms/bloqIzqInf/2.jpg',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'pasillo-29',
      right: 'pasillo-30',
      left: 'pasillo-31',
      backward: 'pasillo-27'
    },
    items: []
  },

  'pasillo-29': {
    id: 'pasillo-29',
    name: 'pasillo',
    image: '/images/rooms/bloqIzqInf/3.jpg',
    description: 'Un carro destruido. \n\n\Hay una hoja de un informe.',
    connections: {
      forward: null,
      right: 'pasillo-30',
      left: null,
      backward: 'pasillo-28'
    },
    items: [
      { id: 101, icon: '📄', name: 'Informe de ruptura', description: 'No se sabe porque sucedio esta ruptura pero las backrooms llegaron a universos paralelos arrastrando anomalias de otras dimensiones.', quantity: 1 }
    ]
  },

  'pasillo-30': {
    id: 'pasillo-30',
    name: 'pasillo',
    image: '/images/rooms/bloqIzqInf/4R.jpg',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: null,
      right: null,
      left: null,
      backward: 'pasillo-28'
    },
    items: []
  },

  'pasillo-31': {
    id: 'pasillo-31',
    name: 'pasillo',
    image: '/images/rooms/bloqIzqInf/4L.jpg',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'pasillo-32',
      right: null,
      left: null,
      backward: 'pasillo-28'
    },
    items: []
  },

  'pasillo-32': {
    id: 'pasillo-32',
    name: 'pasillo',
    image: '/images/rooms/bloqIzqInf/5L.jpg',
    description: 'Un infinito pasillo de paredes amarillas y luces fluorescentes parpadeantes. El zumbido constante te perfora los oídos.',
    connections: {
      forward: 'pasillo-33',
      right: null,
      left: null,
      backward: 'pasillo-31'
    },
    items: []
  },

  'pasillo-33': {
    id: 'pasillo-33',
    name: 'pasillo',
    image: '/images/rooms/bloqIzqInf/6L.jpg',
    description: 'Un pequeño peluche con forma de bufón, da conformidad. \n\nEl peluche es gracioso, seguro le gustara a alguien.',
    connections: {
      forward: null,
      right: null,
      left: null,
      backward: 'pasillo-31'
    },
    items: [
      { id: 103, icon: '🧸', name: 'Peluche', description: 'Un pequeño peluche con forma de bufón. Tiene una expresión graciosa y ojos grandes.', quantity: 1 }
    ]
  },

}

// Helper para obtener habitación por ID
export function getRoomById(id) {
  return roomsMap[id] || null
}
