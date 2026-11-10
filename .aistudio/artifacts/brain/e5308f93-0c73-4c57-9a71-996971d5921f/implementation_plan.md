# Plan de Implementación: Python Quest · Protocolo Nexus

## 1. Visión General y Enfoque de Diseño
Transformaremos la aplicación adoptando fielmente el **diseño visual, paleta de colores espacial/índigo, disposición de 3 columnas y mecánicas de gamificación** de la versión de referencia, combinándolo con:
- **Narrativa adulta de ingeniería y ciencia ficción técnica (*Estación Orbital Nexus-9*)**: El jugador actúa como ingeniero de sistemas reactivando los módulos críticos de una estación orbital automatizada mediante scripts reales de Python 3.
- **Cero spoilers de solución**: Sin botones que inserten la respuesta ni carguen la solución hecha; toda la interacción se centra en escribir código real, ejecutarlo y recibir un análisis explicativo si hay fallos.

---

## 2. Diseño Visual y Estructura de Pantalla (Estilo Grok)
- **Paleta cromática y atmósfera**:
  - Fondos profundos (`#0b1020`, `#121a33`) con gradientes radiales sutiles en violeta (`#2a1f6b`) y cian oscuro (`#0e4a5c`).
  - Tarjetas estructuradas (`#182244`, `#1e2a52`) con bordes definidos (`#2b3a6b`), acentos en violeta (`#7c5cff`), cian (`#22d3ee`), oro (`#fbbf24`), verde éxito (`#22c55e`) y rojo diagnóstico (`#f43f5e`).
- **Cabecera Superior de Progreso**:
  - Emblema del juego, rango actual del jugador (7 rangos desde *Cadete de Sistemas* hasta *Arquitecto Principal de Python*) y barra animada de experiencia (`XP`).
  - Indicadores de **Créditos (`🪙`)**, **Estrellas (`⭐ X/75`)**, botón del **Modal de Logros (`🏆 Logros`)** y botón de **Reinicio de progreso (`↺ Reiniciar`)**.
- **Layout de 3 Columnas a Pantalla Completa**:
  1. **Columna Izquierda — Mapa de Mundos y Niveles (`270px`)**:
     - Lista navegable de los **5 Mundos** con barra de progreso global.
     - Cada nivel muestra su estado (bloqueado `🔒`, número de nivel o completado `✓`), título y sus **3 estrellas (`★★★`)** basadas en: *+1 por completar*, *+1 sin usar pistas* y *+1 al primer intento*.
  2. **Columna Central — Manual de Lección y Misión (`1fr`)**:
     - Etiqueta de mundo, indicador de nivel, título y bloque de **contexto narrativo adulto** (`.story`).
     - Sección **`📘 Concepto Técnico`** con explicaciones claras y directas en español y bloque de **`Ejemplo`** con código Python ilustrativo (distinto al ejercicio para no revelar la solución).
     - Bloque destacado en dorado **`🎯 Misión`** con los requisitos exactos del desafío, píldoras de recompensa (`+XP`, `+🪙`, `★★★`) y sistema de **`💡 Pista progresiva`** desplegable bajo demanda.
  3. **Columna Derecha — Editor Python + Consola + Diagnóstico (`1.3fr`)**:
     - Cabecera con estado en vivo del motor **Pyodide (Python 3.11 en WebAssembly)** (`Cargando Python…` / `Python 3.11 listo`).
     - **Editor con numeración de líneas, resaltado de línea con error y autocompletado contextual**: sugiere palabras clave de Python (`print`, `range`, `len`, `def`, `return`, `elif`, etc.) y variables declaradas por el jugador sin regalar nunca la solución del nivel.
     - **Barra de acciones limpia**:
       - `✔ Analizar y Comprobar Misión` (`Ctrl+Shift+Enter`): ejecuta el código contra la batería de pruebas dinámicas, verifica la lógica y, si hay cualquier error de sintaxis o de lógica, muestra el diagnóstico detallado con la explicación de cómo corregirlo.
       - `▶ Ejecutar prueba` (`Ctrl+Enter`): ejecuta el script y muestra su salida en la consola sin penalizar el contador de intentos de la misión.
       - `💡 Pista`: revela una pista conceptual.
       - `⟲ Código inicial`: restaura la plantilla base del nivel.
       - `Siguiente nivel ➜`: aparece al superar la misión.
     - **Consola de Salida (`stdout`)** y **Panel Único de Diagnóstico y Revisión**.

---

## 3. Campaña Ampliada: 25 Niveles en 5 Mundos (con Niveles Intermedios)
Ampliaremos los 17 niveles originales a **25 niveles progresivos** (5 por cada mundo) añadiendo escalones intermedios para afianzar cada concepto antes de pasar al siguiente:

1. **Mundo 1 · Terminal de Enlace (Fundamentos y Variables)**
   - **Nivel 1**: `print()` básico — Transmisión de señal de encendido.
   - **Nivel 2**: Variables de texto y numéricas — Registro de identificador y sector.
   - **Nivel 3**: Operaciones aritméticas (`+`, `-`, `*`) — Cálculo de reservas de energía.
   - **Nivel 4**: *Nivel intermedio* — Reasignación y actualización de variables (`/=`, `+=`, promedios).
   - **Nivel 5**: Textos dinámicos con `f-strings` — Generación de reporte de telemetría formateado.

2. **Mundo 2 · Compuertas de Control (Condicionales y Lógica Booleana)**
   - **Nivel 6**: Condicional `if` simple — Alerta por caída de presión.
   - **Nivel 7**: Condicional doble `if / else` — Conmutación de reactor principal vs. auxiliar.
   - **Nivel 8**: *Nivel intermedio* — Operadores de comparación (`==`, `!=`, `>=`, `<=`) con validación de código de seguridad.
   - **Nivel 9**: Condicional múltiple `if / elif / else` — Clasificación térmica de núcleos.
   - **Nivel 10**: Operadores lógicos combinados (`and`, `or`, `not`) — Autorización de acoplamiento orbital.

3. **Mundo 3 · Motores de Iteración (Bucles y Listas)**
   - **Nivel 11**: Bucle `for` con `range()` — Secuencia de ignición numerada.
   - **Nivel 12**: *Nivel intermedio* — Acumulador numérico en bucle `for` — Suma de potencia de paneles solares.
   - **Nivel 13**: Creación e indexación de listas (`[]`, `len()`, índices) — Inventario de módulos activos.
   - **Nivel 14**: Recorrido de listas con `for` + filtro `if` — Detección de sensores con lecturas críticas.
   - **Nivel 15**: Bucle `while` — Despresurización controlada por etapas hasta alcanzar el umbral seguro.

4. **Mundo 4 · Laboratorio Modular (Funciones y Estructuras de Datos)**
   - **Nivel 16**: Definición de funciones con `def` y `return` — Duplicador de flujo energético.
   - **Nivel 17**: *Nivel intermedio* — Funciones con múltiples parámetros — Cálculo de consumo por distancia y masa.
   - **Nivel 18**: Funciones con lógica condicional interna — Clasificador de prioridad de paquetes de red.
   - **Nivel 19**: Diccionarios (`dict`) — Consulta y modificación de configuración de un servidor.
   - **Nivel 20**: *Nivel intermedio* — Función que recorre una lista de diccionarios — Auditoría de nodos activos.

5. **Mundo 5 · Núcleo Algorítmico (Misiones de Lógica Aplicada)**
   - **Nivel 21**: Filtrado y transformación —Suma selectiva de lecturas pares válidas en una secuencia.
   - **Nivel 22**: Protocolo de diagnóstico múltiple (estilo *FizzBuzz* técnico con divisibilidad entre 3 y 5).
   - **Nivel 23**: Algoritmo de búsqueda de máximo (`maximo(lista)`) implementado con bucle y condicionales (sin usar `max()`).
   - **Nivel 24**: Analizador de frecuencias — Conteo de vocales/símbolos clave dentro de una cadena de transmisión.
   - **Nivel 25**: Misión Final del Núcleo — Función verificadora de simetría de claves (palíndromos e inversión de cadenas).

---

## 4. Motor Pyodide Real + Analizador Inteligente de Errores en Español
- **Ejecución Real en Web Worker (Pyodide v0.26.4)**:
  - Ejecuta Python 3 real en un hilo aislado con límite de seguridad de 6 segundos para detener bucles infinitos (`while True:`) y reiniciar el worker automáticamente.
  - Incluye el arnés de pruebas (`harness`) con análisis de árbol sintáctico (`ast`) para verificar que el jugador utiliza las estructuras pedidas (por ejemplo, que realmente use un bucle `for` o defina una función `def`) y pruebas anti-trampa (`ejecutar_con`) que cambian los valores de las variables para comprobar que la lógica funciona en cualquier caso.
- **Diagnóstico Unificado con Explicación de Cómo Corregir el Fallo**:
  - Cuando el código tiene un error de sintaxis, ejecución o validación de misión:
    1. Se resalta en rojo la línea exacta en el editor.
    2. En un **único cuadro de diagnóstico claro**, se muestra:
       - **Qué falló**: Traducción clara del error de Python (`SyntaxError`, `NameError`, `IndentationError`, `TypeError`, `ZeroDivisionError`, `IndexError`, `KeyError`, o fallo de prueba de la misión).
       - **Por qué ocurrió en tu código**: Detección específica de errores frecuentes (por ejemplo, escribir `print(Hola Mundo)` sin comillas, olvidar los dos puntos `:` al final de `if`/`for`/`def`, usar `=` en vez de `==` dentro de un `if`, olvidar `return` en una función o imprimir un texto ligeramente distinto al pedido).
       - **Cómo solucionarlo**: Indicación práctica de qué corregir en esa línea (sin escribirle la solución completa del nivel).

---

## 5. Sistema de Recompensas, Logros y Efectos
- **Sistema de 3 Estrellas por Nivel**, **Monedas (`🪙`)**, **7 Rangos de Ingeniería** y **Rachas de niveles superados a la primera (`🔥`)**.
- **16 Logros Desbloqueables** con notificaciones emergentes (*toasts*) y ventana modal de trofeos (*Primer Script*, *A la primera*, *Sin ruedas de apoyo*, *Racha Imparable*, *Dominio de Condicionales*, *Maestro de Bucles*, *Arquitecto Modular*, *Coleccionista de Estrellas*, *Leyenda de Nexus-9*, etc.).
- **Modal de Victoria con Animación de Estrellas y Confeti en Canvas** al superar cada misión.
