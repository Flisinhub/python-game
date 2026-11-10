import { AutocompleteItem, CodexEntry, Mission } from '../types/game';

export interface RankTier {
  title: string;
  minXp: number;
  badgeCode: string;
  perkDescription: string;
}

export const RANK_TIERS: RankTier[] = [
  {
    title: 'Analista Python Nivel I',
    minXp: 0,
    badgeCode: 'PY-01',
    perkDescription: 'Fundamentos de salida estándar (print), variables y tipos primitivos.'
  },
  {
    title: 'Desarrollador de Lógica Nivel II',
    minXp: 250,
    badgeCode: 'PY-02',
    perkDescription: 'Operadores aritméticos, manipulación de cadenas y estructuras condicionales.'
  },
  {
    title: 'Ingeniero de Automatización Nivel III',
    minXp: 600,
    badgeCode: 'PY-03',
    perkDescription: 'Dominio de ciclos iterativos con for, range() y bucles condicionales while.'
  },
  {
    title: 'Arquitecto de Datos Nivel IV',
    minXp: 1100,
    badgeCode: 'PY-04',
    perkDescription: 'Procesamiento de colecciones (listas) y funciones nativas de agregación.'
  },
  {
    title: 'Ingeniero Principal Python Nivel V',
    minXp: 1700,
    badgeCode: 'PY-05',
    perkDescription: 'Diseño modular con funciones def, parámetros y retorno de valores.'
  }
];

export const CODEX_ENTRIES: CodexEntry[] = [
  {
    id: 'codex-print',
    sector: 1,
    title: 'Salida Estándar con print()',
    syntax: 'print("Hola Mundo")\nprint(240)',
    summary:
      'La función integrada print() envía texto, números o el contenido de cualquier variable a la consola de salida estándar (stdout). Los textos siempre van entre comillas dobles o simples.',
    example: 'print("Iniciando servidor")\nprint(2026)'
  },
  {
    id: 'codex-vars',
    sector: 1,
    title: 'Variables y Asignación (=)',
    syntax: 'puerto = 8080\nprint(puerto)',
    summary:
      'Una variable almacena un valor en memoria usando el signo igual (=). En Python no necesitas declarar el tipo antes; el intérprete detecta automáticamente si es un número (int/float) o texto (str).',
    example: 'puerto = 8080\nestado = "Conectado"\nprint(puerto)\nprint(estado)'
  },
  {
    id: 'codex-arith',
    sector: 1,
    title: 'Operaciones Matemáticas',
    syntax: 'resultado = a + b\nmitad = resultado // 2',
    summary:
      'Puedes sumar (+), restar (-), multiplicar (*), dividir (/) o hacer división entera sin decimales (//) directamente entre números y variables.',
    example: 'precio = 120\nimpuesto = 30\nfinal = precio + impuesto\nprint(final)'
  },
  {
    id: 'codex-strings',
    sector: 1,
    title: 'Textos (Strings) y Concatenación',
    syntax: 'completo = parte1 + "-" + parte2',
    summary:
      'Cuando usas el operador + entre dos cadenas de texto (strings), Python las une en un solo texto continuo. Esto se denomina concatenación.',
    example: 'prefijo = "SRV"\ncodigo = "01"\nservidor = prefijo + "-" + codigo\nprint(servidor)'
  },
  {
    id: 'codex-ifelse',
    sector: 2,
    title: 'Condicionales (if / else)',
    syntax: 'if valor > 50:\n    modo = "Alto"\nelse:\n    modo = "Bajo"',
    summary:
      'Evalúa si una condición es verdadera. Recuerda terminar la línea del if y del else con dos puntos (:) e indentar el código interno con 4 espacios.',
    example: 'edad = 22\nif edad >= 18:\n    acceso = "Permitido"\nelse:\n    acceso = "Denegado"\nprint(acceso)'
  },
  {
    id: 'codex-elif',
    sector: 2,
    title: 'Condiciones Múltiples (elif)',
    syntax: 'if nota >= 90:\n    rango = "A"\nelif nota >= 70:\n    rango = "B"\nelse:\n    rango = "C"',
    summary:
      'Cuando necesitas comprobar más de dos casos posibles, usa elif entre el if inicial y el else final. Python ejecutará solo la primera rama que se cumpla.',
    example: 'carga = 75\nif carga >= 90:\n    nivel = "Critico"\nelif carga >= 60:\n    nivel = "Alto"\nelse:\n    nivel = "Normal"'
  },
  {
    id: 'codex-for',
    sector: 3,
    title: 'Bucle for y range()',
    syntax: 'acumulado = 0\nfor n in range(1, 4):\n    acumulado = acumulado + n',
    summary:
      'El bucle for recorre una secuencia de valores. range(1, 5) genera los números desde el 1 hasta el 4 (el límite superior 5 no se incluye).',
    example: 'acumulado = 0\nfor numero in range(1, 4):\n    acumulado = acumulado + numero\nprint(acumulado)'
  },
  {
    id: 'codex-while',
    sector: 3,
    title: 'Bucle Condicional while',
    syntax: 'while contador < 30:\n    contador = contador + 10',
    summary:
      'Repite un bloque de código mientras la condición sea verdadera. Es indispensable modificar la variable dentro del bucle para que la condición llegue a cumplirse y termine.',
    example: 'contador = 0\nwhile contador < 30:\n    contador = contador + 10\nprint(contador)'
  },
  {
    id: 'codex-lists',
    sector: 4,
    title: 'Listas y Funciones Nativas (sum, len, max)',
    syntax: 'ventas = [100, 200, 300]\nsuma_total = sum(ventas)\nelementos = len(ventas)',
    summary:
      'Las listas agrupan varios valores entre corchetes []. Python incluye funciones reales muy potentes: sum(lista) suma todos sus números, len(lista) cuenta cuántos elementos hay y max(lista) obtiene el mayor.',
    example: 'ventas = [100, 200, 300]\npromedio = sum(ventas) // len(ventas)\nprint(promedio)'
  },
  {
    id: 'codex-def',
    sector: 5,
    title: 'Funciones con def y return',
    syntax: 'def triplicar(valor):\n    return valor * 3',
    summary:
      'Con def creas tus propias funciones reutilizables. Reciben datos entre paréntesis (parámetros) y devuelven el resultado calculado mediante la instrucción return.',
    example: 'def area_rectangulo(ancho, alto):\n    return ancho * alto\n\nresultado = area_rectangulo(5, 4)\nprint(resultado)'
  }
];

export const BASE_PYTHON_AUTOCOMPLETE: AutocompleteItem[] = [
  {
    label: 'print',
    insertText: 'print()',
    category: 'funcion',
    signature: 'print(valor)',
    description: 'Muestra un texto, número o variable en la consola de salida.'
  },
  {
    label: 'if',
    insertText: 'if :\n    ',
    category: 'palabra_clave',
    signature: 'if <condición>:',
    description: 'Ejecuta el bloque indentado si la condición se cumple.'
  },
  {
    label: 'elif',
    insertText: 'elif :\n    ',
    category: 'palabra_clave',
    signature: 'elif <condición>:',
    description: 'Evalúa otra condición si el if anterior fue falso.'
  },
  {
    label: 'else',
    insertText: 'else:\n    ',
    category: 'palabra_clave',
    signature: 'else:',
    description: 'Se ejecuta cuando ninguna condición anterior se cumplió.'
  },
  {
    label: 'for',
    insertText: 'for i in range():\n    ',
    category: 'palabra_clave',
    signature: 'for variable in secuencia:',
    description: 'Recorre cada elemento de un rango o de una lista.'
  },
  {
    label: 'while',
    insertText: 'while :\n    ',
    category: 'palabra_clave',
    signature: 'while <condición>:',
    description: 'Repite el bloque mientras la condición sea verdadera.'
  },
  {
    label: 'def',
    insertText: 'def ():',
    category: 'palabra_clave',
    signature: 'def nombre(parametros):',
    description: 'Define una función en Python.'
  },
  {
    label: 'return',
    insertText: 'return ',
    category: 'palabra_clave',
    signature: 'return <valor>',
    description: 'Devuelve el resultado calculado por una función.'
  },
  {
    label: 'range',
    insertText: 'range()',
    category: 'funcion',
    signature: 'range(inicio, fin)',
    description: 'Genera una secuencia de números enteros.'
  },
  {
    label: 'sum',
    insertText: 'sum()',
    category: 'funcion',
    signature: 'sum(lista)',
    description: 'Suma todos los números contenidos en una lista.'
  },
  {
    label: 'len',
    insertText: 'len()',
    category: 'funcion',
    signature: 'len(lista)',
    description: 'Devuelve la cantidad de elementos de una lista o texto.'
  },
  {
    label: 'max',
    insertText: 'max()',
    category: 'funcion',
    signature: 'max(lista)',
    description: 'Devuelve el valor más alto de una lista.'
  },
  {
    label: 'min',
    insertText: 'min()',
    category: 'funcion',
    signature: 'min(lista)',
    description: 'Devuelve el valor más bajo de una lista.'
  }
];

export const MISSIONS: Mission[] = [
  // =========================================================================
  // NIVEL 1: FUNCIÓN PRINT()
  // =========================================================================
  {
    id: 1,
    sectorId: 1,
    sectorName: 'Módulo 01 · Primeros Pasos y Variables',
    codeName: 'PY-101',
    title: 'Tu Primera Instrucción: print()',
    conceptTag: 'Función print() y Textos',
    difficulty: 'Básico',
    xpReward: 100,
    parCycles: 2,
    parLines: 1,
    briefing:
      'En Python, la función print() se utiliza para mostrar información en la consola. Para mostrar un texto (llamado string), debes colocarlo dentro de los paréntesis y encerrado entre comillas.',
    theoryTitle: 'Mostrar Mensajes en Consola con print()',
    theoryImage: '/src/assets/images/level_01_print_1794329978405.jpg',
    theoryImageCaption: 'Flujo de salida estándar: print("...") proyecta cadenas de texto hacia la consola.',
    theoryContent: [
      'Python destaca por su sintaxis limpia: no necesita punto y coma al final de cada línea.',
      'La función integrada print() recibe entre paréntesis el dato que deseas mostrar en pantalla.',
      'Cuando escribes un texto literal, rodéalo siempre con comillas dobles ("...") o simples (\'...\'). Si no pones comillas, Python pensará que estás intentando buscar el nombre de una variable y dará un error de sintaxis.'
    ],
    theoryExample: 'print("Hola Python")\nprint("Servidor en línea")',
    objectives: [
      'Usa la función print() para mostrar en consola el mensaje exacto: Sistema activo'
    ],
    starterCode: `# Nivel 01: Mostrar texto en consola
# Escribe tu código debajo de esta línea:
`,
    solutionCode: `print("Sistema activo")`,
    validationChecks: [
      {
        id: 'check-1',
        description: 'La consola imprime exactamente "Sistema activo"',
        type: 'STDOUT_EXACT',
        expectedValue: 'Sistema activo'
      }
    ],
    hints: [
      {
        tier: 1,
        title: 'Estructura de la llamada a función',
        content: 'Escribe el nombre de la función en minúsculas seguido de paréntesis: print(...).'
      },
      {
        tier: 2,
        title: 'Uso obligatorio de comillas para texto',
        content: 'Dentro de los paréntesis, el texto de dos palabras debe ir entre comillas dobles para que Python lo reconozca como una cadena de caracteres (string).'
      },
      {
        tier: 3,
        title: 'Verificación de mayúsculas',
        content: 'Comprueba que la primera letra sea mayúscula y el resto minúsculas: "Sistema activo" dentro de print().'
      }
    ],
    codexUnlockId: 'codex-print'
  },

  // =========================================================================
  // NIVEL 2: CREACIÓN Y LECTURA DE VARIABLES
  // =========================================================================
  {
    id: 2,
    sectorId: 1,
    sectorName: 'Módulo 01 · Primeros Pasos y Variables',
    codeName: 'PY-102',
    title: 'Guardar Datos en una Variable',
    conceptTag: 'Variables y Asignación (=)',
    difficulty: 'Básico',
    xpReward: 120,
    parCycles: 3,
    parLines: 2,
    briefing:
      'Las variables nos permiten guardar números o textos en la memoria del programa para usarlos más adelante. En este nivel crearás una variable numérica llamada energia con valor 100 y mostrarás su contenido con print().',
    theoryTitle: 'Cómo Funcionan las Variables en Python',
    theoryImage: '/src/assets/images/level_02_variables_1794329977740.jpg',
    theoryImageCaption: 'Almacenamiento en RAM: el operador = guarda un valor dentro de un contenedor con nombre.',
    theoryContent: [
      'Para crear una variable en Python, escribe su nombre, el signo igual (=) y el valor que quieres guardar.',
      'Los números enteros se escriben directamente sin comillas (si pusieras comillas sería texto en vez de un número).',
      'Al pasar el nombre de una variable dentro de print(), tampoco lleva comillas para que Python imprima el valor guardado en ella.'
    ],
    theoryExample: 'usuarios = 50\nprint(usuarios)',
    objectives: [
      'Crea una variable llamada energia y asígnale el número entero 100.',
      'En la siguiente línea, muestra el valor de la variable energia usando print().'
    ],
    starterCode: `# Nivel 02: Crear y mostrar una variable
# Escribe tu código aquí:
`,
    solutionCode: `energia = 100
print(energia)`,
    validationChecks: [
      {
        id: 'check-var-energia',
        description: 'Existe la variable energia con el valor numérico 100',
        type: 'VAR_EQUALS',
        targetName: 'energia',
        expectedValue: 100
      },
      {
        id: 'check-stdout-100',
        description: 'Se muestra el valor 100 en la consola mediante print()',
        type: 'STDOUT_EXACT',
        expectedValue: '100'
      }
    ],
    hints: [
      {
        tier: 1,
        title: 'Cómo asignar un valor numérico',
        content: 'Usa el operador = para guardar el número 100 (sin comillas) en el identificador energia.'
      },
      {
        tier: 2,
        title: 'Cómo imprimir una variable',
        content: 'En la segunda línea, pasa el nombre de tu variable dentro de los paréntesis de print() sin usar comillas.'
      },
      {
        tier: 3,
        title: 'Estructura en 2 líneas',
        content: 'Línea 1: nombre de la variable = 100. Línea 2: llamada a print con el nombre de esa variable.'
      }
    ],
    codexUnlockId: 'codex-vars'
  },

  // =========================================================================
  // NIVEL 3: OPERACIONES MATEMÁTICAS ENTRE VARIABLES
  // =========================================================================
  {
    id: 3,
    sectorId: 1,
    sectorName: 'Módulo 01 · Primeros Pasos y Variables',
    codeName: 'PY-103',
    title: 'Cálculos Aritméticos entre Variables',
    conceptTag: 'Suma y Multiplicación (+, *)',
    difficulty: 'Básico',
    xpReward: 150,
    parCycles: 5,
    parLines: 4,
    briefing:
      'El código inicial ya define dos variables: base = 50 y bono = 25. Tu objetivo es crear una tercera variable llamada total que almacene la suma de ambas, y luego mostrar total en la consola.',
    theoryTitle: 'Operadores Matemáticos en Python',
    theoryImage: '/src/assets/images/level_03_arithmetic_1794329979626.jpg',
    theoryImageCaption: 'Fusión aritmética: Python evalúa las variables de entrada y deposita el cálculo en una nueva variable.',
    theoryContent: [
      'Puedes operar directamente utilizando los nombres de las variables igual que en una fórmula algebraica.',
      'Python consulta el valor actual de cada variable, realiza la operación matemática y guarda el resultado en la nueva variable a la izquierda del signo =.',
      'Los operadores principales son: + (suma), - (resta), * (multiplicación), / (división decimal) y // (división entera).'
    ],
    theoryExample: 'ingreso = 200\ngasto = 45\nsaldo = ingreso - gasto\nprint(saldo)',
    objectives: [
      'Conserva las variables iniciales base = 50 y bono = 25.',
      'Crea una variable llamada total que sume las variables base y bono.',
      'Muestra el valor de total en la consola usando print().'
    ],
    starterCode: `# Nivel 03: Operaciones con variables
base = 50
bono = 25

# Calcula la suma en la variable total y muéstrala en pantalla:
`,
    solutionCode: `base = 50
bono = 25
total = base + bono
print(total)`,
    validationChecks: [
      {
        id: 'check-var-base',
        description: 'Las variables iniciales base (50) y bono (25) se mantienen',
        type: 'VAR_EQUALS',
        targetName: 'base',
        expectedValue: 50
      },
      {
        id: 'check-var-total',
        description: 'La variable total almacena el resultado 75',
        type: 'VAR_EQUALS',
        targetName: 'total',
        expectedValue: 75
      },
      {
        id: 'check-stdout-75',
        description: 'La consola imprime el resultado 75',
        type: 'STDOUT_EXACT',
        expectedValue: '75'
      }
    ],
    hints: [
      {
        tier: 1,
        title: 'Sumar usando los nombres de las variables',
        content: 'En vez de sumar números fijos, suma los identificadores base y bono con el operador +.'
      },
      {
        tier: 2,
        title: 'Guardar en la variable pedida',
        content: 'Asigna esa suma a una variable llamada exactamente total.'
      },
      {
        tier: 3,
        title: 'Mostrar en consola',
        content: 'Termina tu script pasando la variable total dentro de print().'
      }
    ],
    codexUnlockId: 'codex-arith'
  },

  // =========================================================================
  // NIVEL 4: CONCATENACIÓN DE TEXTOS (STRINGS)
  // =========================================================================
  {
    id: 4,
    sectorId: 1,
    sectorName: 'Módulo 01 · Primeros Pasos y Variables',
    codeName: 'PY-104',
    title: 'Unir Textos (Concatenación de Strings)',
    conceptTag: 'Cadenas de Texto (+)',
    difficulty: 'Básico',
    xpReward: 160,
    parCycles: 5,
    parLines: 4,
    briefing:
      'En Python el operador + también permite unir textos. Tienes las variables nombre = "Ana" y rol = "Admin". Crea una variable llamada credencial que una ambas con un guion "-" en medio (para formar "Ana-Admin") e imprímela.',
    theoryTitle: 'Manipulación y Unión de Cadenas (Strings)',
    theoryImage: '/src/assets/images/level_04_strings_1794329980802.jpg',
    theoryImageCaption: 'Concatenación de cadenas: el operador + enlaza bloques de texto e inserta separadores.',
    theoryContent: [
      'Un dato de tipo str (string) representa una secuencia de caracteres de texto.',
      'Cuando aplicas el operador + entre cadenas de texto, Python las concatena (las une una tras otra sin añadir espacios automáticos).',
      'Si necesitas un carácter separador en medio (como un espacio o un guion), debes unirlo también entre comillas: parte1 + "-" + parte2.'
    ],
    theoryExample: 'departamento = "IT"\nsede = "Madrid"\nclave = departamento + "-" + sede\nprint(clave)',
    objectives: [
      'Conserva las variables nombre = "Ana" y rol = "Admin".',
      'Crea la variable credencial uniendo nombre, un guion "-" y rol.',
      'Imprime la variable credencial en la consola (debe mostrar Ana-Admin).'
    ],
    starterCode: `# Nivel 04: Concatenación de textos
nombre = "Ana"
rol = "Admin"

# Crea la variable credencial e imprímela:
`,
    solutionCode: `nombre = "Ana"
rol = "Admin"
credencial = nombre + "-" + rol
print(credencial)`,
    validationChecks: [
      {
        id: 'check-credencial-var',
        description: 'La variable credencial contiene el texto "Ana-Admin"',
        type: 'VAR_EQUALS',
        targetName: 'credencial',
        expectedValue: 'Ana-Admin'
      },
      {
        id: 'check-credencial-print',
        description: 'La consola muestra "Ana-Admin"',
        type: 'STDOUT_EXACT',
        expectedValue: 'Ana-Admin'
      }
    ],
    hints: [
      {
        tier: 1,
        title: 'Concatenar tres elementos',
        content: 'Necesitas unir tres cadenas con dos signos +: la variable nombre, el texto literal del guion y la variable rol.'
      },
      {
        tier: 2,
        title: 'El guion debe ir entre comillas',
        content: 'Como el guion no es una variable sino un carácter de texto, escríbelo como "-" entre los dos signos +.'
      },
      {
        tier: 3,
        title: 'Impresión final',
        content: 'Guarda la unión en credencial y llama a print() con esa variable en la última línea.'
      }
    ],
    codexUnlockId: 'codex-strings'
  },

  // =========================================================================
  // NIVEL 5: CONDICIONALES IF / ELSE
  // =========================================================================
  {
    id: 5,
    sectorId: 2,
    sectorName: 'Módulo 02 · Toma de Decisiones (Condicionales)',
    codeName: 'PY-201',
    title: 'Decisiones Lógicas con if y else',
    conceptTag: 'Condicional if / else',
    difficulty: 'Básico',
    xpReward: 200,
    parCycles: 6,
    parLines: 6,
    briefing:
      'Los programas toman decisiones evaluando condiciones. Dada temperatura = 85, completa el condicional: si supera 70 asigna estado = "Alerta"; en caso contrario (else) asigna estado = "Normal". Al final imprime la variable estado.',
    theoryTitle: 'Estructura Condicional if / else e Indentación',
    theoryImage: '/src/assets/images/level_05_ifelse_1794329982182.jpg',
    theoryImageCaption: 'Bifurcación lógica: el sensor evalúa la condición y desvía el flujo hacia la rama verdadera (if) o alternativa (else).',
    theoryContent: [
      'En Python, if evalúa una condición lógica (como temperatura > 70). Si se cumple, ejecuta las líneas indentadas (con 4 espacios a la izquierda) debajo del if.',
      'Si la condición es falsa, ejecuta las líneas indentadas debajo del bloque else:.',
      'Tanto la línea del if como la del else deben terminar obligatoriamente con dos puntos (:).'
    ],
    theoryExample: 'bateria = 15\nif bateria < 20:\n    aviso = "Baja"\nelse:\n    aviso = "Correcta"\nprint(aviso)',
    objectives: [
      'Mantén la condición if temperatura > 70: que asigna estado = "Alerta".',
      'Añade la rama else: que asigne estado = "Normal".',
      'Fuera del condicional (sin sangría), imprime la variable estado con print().'
    ],
    starterCode: `# Nivel 05: Condicional if / else
temperatura = 85

if temperatura > 70:
    estado = "Alerta"
# Completa el bloque else y muestra el estado en consola:
`,
    solutionCode: `temperatura = 85
if temperatura > 70:
    estado = "Alerta"
else:
    estado = "Normal"
print(estado)`,
    validationChecks: [
      {
        id: 'check-estado-var',
        description: 'La variable estado toma el valor "Alerta"',
        type: 'VAR_EQUALS',
        targetName: 'estado',
        expectedValue: 'Alerta'
      },
      {
        id: 'check-estado-print',
        description: 'La consola imprime "Alerta"',
        type: 'STDOUT_EXACT',
        expectedValue: 'Alerta'
      }
    ],
    hints: [
      {
        tier: 1,
        title: 'Posición de la cláusula else:',
        content: 'La palabra else: se escribe pegada al margen izquierdo (sin espacios antes), alineada verticalmente con el if.'
      },
      {
        tier: 2,
        title: 'Sangría dentro del else',
        content: 'Debajo de else:, pulsa Tab (4 espacios) y asigna el texto "Normal" a la variable estado.'
      },
      {
        tier: 3,
        title: 'Imprimir el resultado final',
        content: 'En la última línea, pegada al margen izquierdo, usa print() para mostrar el contenido de estado.'
      }
    ],
    codexUnlockId: 'codex-ifelse'
  },

  // =========================================================================
  // NIVEL 6: CONDICIONAL MÚLTIPLE ELIF
  // =========================================================================
  {
    id: 6,
    sectorId: 2,
    sectorName: 'Módulo 02 · Toma de Decisiones (Condicionales)',
    codeName: 'PY-202',
    title: 'Clasificación por Tramos con elif',
    conceptTag: 'Encadenamiento if / elif / else',
    difficulty: 'Intermedio',
    xpReward: 240,
    parCycles: 7,
    parLines: 8,
    briefing:
      'Cuando existen más de dos opciones posibles utilizamos elif. Con puntuacion = 75, clasifica la variable nivel: si es >= 90 corresponde "Oro"; si es >= 60 (con elif) corresponde "Plata"; y en cualquier otro caso (else) corresponde "Bronce". Imprime nivel.',
    theoryTitle: 'Múltiples Condiciones con elif',
    theoryImage: '/src/assets/images/level_06_elif_1794329983325.jpg',
    theoryImageCaption: 'Clasificación en cascada: if / elif / else evalúa cada umbral en orden hasta encontrar su canal correspondiente.',
    theoryContent: [
      'La palabra clave elif significa "si no, comprueba esta otra condición".',
      'Python evalúa las ramas en orden descendente y ejecuta únicamente la primera que sea verdadera.',
      'El operador >= comprueba si el valor de la izquierda es mayor o igual al de la derecha.'
    ],
    theoryExample: 'velocidad = 80\nif velocidad > 120:\n    multa = "Grave"\nelif velocidad > 90:\n    multa = "Leve"\nelse:\n    multa = "Ninguna"\nprint(multa)',
    objectives: [
      'Conserva la primera rama if puntuacion >= 90: con nivel = "Oro".',
      'Añade una rama elif que compruebe si puntuacion >= 60 y asigne nivel = "Plata".',
      'Añade la rama else final asignando nivel = "Bronce", e imprime la variable nivel.'
    ],
    starterCode: `# Nivel 06: Clasificación con if / elif / else
puntuacion = 75

if puntuacion >= 90:
    nivel = "Oro"
# Completa las ramas elif, else e imprime la variable nivel:
`,
    solutionCode: `puntuacion = 75
if puntuacion >= 90:
    nivel = "Oro"
elif puntuacion >= 60:
    nivel = "Plata"
else:
    nivel = "Bronce"
print(nivel)`,
    validationChecks: [
      {
        id: 'check-nivel-plata',
        description: 'La variable nivel se evalúa como "Plata" para puntuacion = 75',
        type: 'VAR_EQUALS',
        targetName: 'nivel',
        expectedValue: 'Plata'
      },
      {
        id: 'check-print-plata',
        description: 'La consola imprime "Plata"',
        type: 'STDOUT_EXACT',
        expectedValue: 'Plata'
      }
    ],
    hints: [
      {
        tier: 1,
        title: 'Cómo escribir la condición intermedia',
        content: 'Alineado con el if, escribe elif seguido de la comparación de puntuacion mayor o igual a 60 y termina con dos puntos (:).'
      },
      {
        tier: 2,
        title: 'Asignaciones en cada bloque',
        content: 'Dentro del bloque elif (indentado 4 espacios) asigna "Plata" a nivel, y dentro del bloque else asigna "Bronce" a nivel.'
      },
      {
        tier: 3,
        title: 'Salida final',
        content: 'Asegúrate de llamar a print() pasando la variable nivel en la última línea sin sangría.'
      }
    ],
    codexUnlockId: 'codex-elif'
  },

  // =========================================================================
  // NIVEL 7: BUCLE FOR Y RANGE()
  // =========================================================================
  {
    id: 7,
    sectorId: 3,
    sectorName: 'Módulo 03 · Bucles y Repetición',
    codeName: 'PY-301',
    title: 'Suma Acumulada con Bucle for',
    conceptTag: 'Bucle for y range()',
    difficulty: 'Intermedio',
    xpReward: 280,
    parCycles: 12,
    parLines: 4,
    briefing:
      'Para repetir una operación sobre una secuencia de números usamos el bucle for. Partiendo de suma = 0, recorre los números del 1 al 4 con for i in range(1, 5): sumando i a la variable suma en cada vuelta. Al finalizar, imprime suma.',
    theoryTitle: 'Iteración con for ... in range()',
    theoryImage: '/src/assets/images/level_07_for_loop_1794329989092.jpg',
    theoryImageCaption: 'Ciclo iterativo for: recorre cada valor generado por range() e inyecta su energía en el acumulador central.',
    theoryContent: [
      'La función range(1, 5) entrega los números enteros comenzando en 1 y deteniéndose antes del 5 (es decir: 1, 2, 3 y 4).',
      'En cada vuelta del bucle, la variable i toma el siguiente número de esa serie.',
      'Para acumular valores en una variable, le sumamos el nuevo valor a lo que ya tenía guardado.'
    ],
    theoryExample: 'acumulado = 0\nfor n in range(1, 4):\n    acumulado = acumulado + n\nprint(acumulado)',
    objectives: [
      'Mantén la variable inicial suma = 0.',
      'Dentro del bucle for i in range(1, 5):, actualiza suma sumándole el valor de i.',
      'Fuera del bucle (sin sangría), muestra el valor final de suma con print().'
    ],
    starterCode: `# Nivel 07: Bucle for y acumulador
suma = 0
for i in range(1, 5):
    # Acumula aquí el valor de i dentro de suma
    
# Muestra el resultado final fuera del bucle:
`,
    solutionCode: `suma = 0
for i in range(1, 5):
    suma = suma + i
print(suma)`,
    validationChecks: [
      {
        id: 'check-suma-10',
        description: 'La variable suma acumula el valor 10 (1 + 2 + 3 + 4)',
        type: 'VAR_EQUALS',
        targetName: 'suma',
        expectedValue: 10
      },
      {
        id: 'check-print-10',
        description: 'La consola imprime el resultado 10',
        type: 'STDOUT_EXACT',
        expectedValue: '10'
      }
    ],
    hints: [
      {
        tier: 1,
        title: 'Cómo actualizar un acumulador',
        content: 'Dentro del bucle for (con 4 espacios de sangría), iguala la variable suma a su valor actual más la variable de iteración i.'
      },
      {
        tier: 2,
        title: 'Cuidado con la sangría del print()',
        content: 'Si pones print() con sangría dentro del bucle, se imprimirá 4 veces. Ponlo sin sangría al final para imprimir solo el total 10.'
      },
      {
        tier: 3,
        title: 'Resumen de pasos',
        content: 'Dentro del for actualiza la variable suma con + i, y en la última línea al margen izquierdo imprime suma.'
      }
    ],
    codexUnlockId: 'codex-for'
  },

  // =========================================================================
  // NIVEL 8: BUCLE CONDICIONAL WHILE
  // =========================================================================
  {
    id: 8,
    sectorId: 3,
    sectorName: 'Módulo 03 · Bucles y Repetición',
    codeName: 'PY-302',
    title: 'Carga Progresiva con Bucle while',
    conceptTag: 'Bucle while',
    difficulty: 'Intermedio',
    xpReward: 300,
    parCycles: 10,
    parLines: 4,
    briefing:
      'El bucle while repite su bloque de instrucciones mientras la condición sea verdadera. Partiendo de bateria = 20, incrementa la variable bateria sumándole 40 dentro del bucle while bateria < 100:. Al salir, imprime bateria.',
    theoryTitle: 'Repetición Condicional con while',
    theoryImage: '/src/assets/images/level_08_while_loop_1794329986520.jpg',
    theoryImageCaption: 'Carga controlada por condición: while repite el ciclo hasta alcanzar la barrera límite de 100.',
    theoryContent: [
      'Antes de cada repetición, Python comprueba si la condición del while se cumple.',
      'Con bateria empezando en 20, al sumar 40 pasa a 60, y en la siguiente vuelta pasa a 100.',
      'Como 100 ya no es menor que 100, el bucle termina y continúa con el resto del programa.'
    ],
    theoryExample: 'contador = 10\nwhile contador < 50:\n    contador = contador + 20\nprint(contador)',
    objectives: [
      'Comienza con la variable bateria = 20.',
      'Dentro del bucle while bateria < 100:, incrementa bateria en 40 unidades por ciclo.',
      'Fuera del bucle, imprime el valor final de bateria (100).'
    ],
    starterCode: `# Nivel 08: Bucle while
bateria = 20
while bateria < 100:
    # Incrementa el valor de bateria en 40 en cada vuelta
    
# Imprime el valor final de bateria:
`,
    solutionCode: `bateria = 20
while bateria < 100:
    bateria = bateria + 40
print(bateria)`,
    validationChecks: [
      {
        id: 'check-bateria-100',
        description: 'La variable bateria alcanza exactamente 100 tras el bucle while',
        type: 'VAR_EQUALS',
        targetName: 'bateria',
        expectedValue: 100
      },
      {
        id: 'check-print-bateria',
        description: 'La consola imprime 100',
        type: 'STDOUT_EXACT',
        expectedValue: '100'
      }
    ],
    hints: [
      {
        tier: 1,
        title: 'Evitar bucles infinitos',
        content: 'Para que el bucle avance, dentro del while debes reasignar a bateria su valor actual más 40.'
      },
      {
        tier: 2,
        title: 'Sangría del cuerpo del while',
        content: 'Recuerda que la línea que suma 40 debe tener 4 espacios de sangría debajo de while bateria < 100:.'
      },
      {
        tier: 3,
        title: 'Mostrar el resultado',
        content: 'Una vez fuera del bloque while (sin sangría), llama a print() con la variable bateria.'
      }
    ],
    codexUnlockId: 'codex-while'
  },

  // =========================================================================
  // NIVEL 9: LISTAS Y FUNCIONES INTEGRADAS (SUM, LEN)
  // =========================================================================
  {
    id: 9,
    sectorId: 4,
    sectorName: 'Módulo 04 · Estructuras de Datos (Listas)',
    codeName: 'PY-401',
    title: 'Análisis de Listas con sum() y len()',
    conceptTag: 'Listas, sum() y len()',
    difficulty: 'Avanzado',
    xpReward: 350,
    parCycles: 6,
    parLines: 5,
    briefing:
      'Una lista almacena varios elementos entre corchetes: precios = [10, 20, 30, 40]. Ya tienes calculado total = sum(precios). Obtén el número de elementos en una variable llamada cantidad usando len(), calcula promedio = total // cantidad e imprime promedio.',
    theoryTitle: 'Colecciones (Listas) y Funciones de Agregación',
    theoryImage: '/src/assets/images/level_09_lists_1794329987244.jpg',
    theoryImageCaption: 'Vector de datos indexado: sum() agrega todos los elementos de la lista y len() mide su longitud.',
    theoryContent: [
      'Una lista agrupa múltiples valores bajo un solo nombre: precios = [10, 20, 30, 40].',
      'La función nativa sum(lista) devuelve la suma de todos sus números (100).',
      'La función nativa len(lista) devuelve cuántos elementos tiene la lista (4). Al dividir ambos con // obtenemos el promedio entero.'
    ],
    theoryExample: 'notas = [70, 80, 90]\nsuma_notas = sum(notas)\nnum_notas = len(notas)\nmedia = suma_notas // num_notas\nprint(media)',
    objectives: [
      'Conserva precios = [10, 20, 30, 40] y total = sum(precios).',
      'Crea la variable cantidad usando la función len() sobre la lista precios.',
      'Calcula la variable promedio dividiendo total entre cantidad con // e imprime promedio.'
    ],
    starterCode: `# Nivel 09: Procesamiento de listas en Python
precios = [10, 20, 30, 40]
total = sum(precios)

# Calcula cantidad, luego promedio e imprímelo:
`,
    solutionCode: `precios = [10, 20, 30, 40]
total = sum(precios)
cantidad = len(precios)
promedio = total // cantidad
print(promedio)`,
    validationChecks: [
      {
        id: 'check-total-100',
        description: 'La variable total vale 100',
        type: 'VAR_EQUALS',
        targetName: 'total',
        expectedValue: 100
      },
      {
        id: 'check-cantidad-4',
        description: 'La variable cantidad vale 4 usando len()',
        type: 'VAR_EQUALS',
        targetName: 'cantidad',
        expectedValue: 4
      },
      {
        id: 'check-promedio-25',
        description: 'La consola imprime el promedio 25',
        type: 'STDOUT_EXACT',
        expectedValue: '25'
      }
    ],
    hints: [
      {
        tier: 1,
        title: 'Contar elementos con len()',
        content: 'Pasa la lista precios como argumento a la función len() y guarda ese valor en la variable cantidad.'
      },
      {
        tier: 2,
        title: 'División entera //',
        content: 'Crea la variable promedio dividiendo total entre cantidad mediante el operador //.'
      },
      {
        tier: 3,
        title: 'Imprimir el promedio',
        content: 'En la última línea muestra la variable promedio con print().'
      }
    ],
    codexUnlockId: 'codex-lists'
  },

  // =========================================================================
  // NIVEL 10: FUNCIONES PERSONALIZADAS (DEF Y RETURN)
  // =========================================================================
  {
    id: 10,
    sectorId: 5,
    sectorName: 'Módulo 05 · Funciones Modulares (def y return)',
    codeName: 'PY-501',
    title: 'Crear e Invocar una Función con def y return',
    conceptTag: 'Funciones def y return',
    difficulty: 'Avanzado',
    xpReward: 500,
    parCycles: 6,
    parLines: 4,
    briefing:
      'En el nivel final trabajarás con funciones propias en Python. La función def calcular_doble(numero): ya devuelve numero * 2. Invócala pasándole el número 15, guarda el valor devuelto en la variable resultado y muéstralo con print().',
    theoryTitle: 'Funciones Personalizadas con Parámetros y return',
    theoryImage: '/src/assets/images/level_10_functions_1794329989045.jpg',
    theoryImageCaption: 'Módulo funcional def: recibe un parámetro de entrada, lo transforma y entrega el resultado con return.',
    theoryContent: [
      'Una función definida con def empaqueta una operación para que puedas reutilizarla con distintos argumentos.',
      'La instrucción return entrega el valor calculado al lugar donde llamaste a la función.',
      'Para usarla, escribe el nombre de la función seguido del valor entre paréntesis y asígnalo a una variable.'
    ],
    theoryExample: 'def triplicar(valor):\n    return valor * 3\n\nmis_datos = triplicar(10)\nprint(mis_datos)',
    objectives: [
      'Conserva la definición de la función calcular_doble(numero).',
      'Fuera de la función (sin sangría), llama a calcular_doble con el argumento 15 y guárdalo en la variable resultado.',
      'Muestra el contenido de resultado en consola usando print().'
    ],
    starterCode: `# Nivel 10: Crear e invocar una función en Python
def calcular_doble(numero):
    return numero * 2

# Llama a la función con el valor 15, guárdalo en resultado e imprímelo:
`,
    solutionCode: `def calcular_doble(numero):
    return numero * 2

resultado = calcular_doble(15)
print(resultado)`,
    validationChecks: [
      {
        id: 'check-res-30',
        description: 'La variable resultado almacena 30',
        type: 'VAR_EQUALS',
        targetName: 'resultado',
        expectedValue: 30
      },
      {
        id: 'check-func-test',
        description: 'Prueba unitaria: calcular_doble(7) retorna 14 correctamente',
        type: 'FUNC_CALL',
        targetName: 'calcular_doble',
        funcArgs: [7],
        expectedValue: 14
      },
      {
        id: 'check-print-30',
        description: 'La consola imprime 30',
        type: 'STDOUT_EXACT',
        expectedValue: '30'
      }
    ],
    hints: [
      {
        tier: 1,
        title: 'Cómo invocar una función',
        content: 'Escribe el nombre de la función seguido de paréntesis con el número 15 dentro, sin sangría al inicio de la línea.'
      },
      {
        tier: 2,
        title: 'Capturar el valor retornado',
        content: 'Guarda esa llamada en una variable llamada resultado usando el signo =.'
      },
      {
        tier: 3,
        title: 'Mostrar en pantalla',
        content: 'En la última línea, pasa la variable resultado dentro de print().'
      }
    ],
    codexUnlockId: 'codex-def'
  }
];
