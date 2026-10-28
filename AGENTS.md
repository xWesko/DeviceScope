# DeviceScope — Instrucciones de desarrollo para agentes

## 1. Objetivo

Desarrollar desde cero **DeviceScope**, una aplicación móvil de diagnóstico e identificación de dispositivos, utilizando **React Native CLI**, compatible con **Android e iOS**.

El objetivo principal es instalar la aplicación en un equipo (especialmente un kiosco Android) y consultar sus características para entender qué tipo de equipo es, qué sistema operativo utiliza y si Android se encuentra actualmente en un modo de bloqueo de tareas compatible con kioscos.

La aplicación debe funcionar también en teléfonos y tablets Android, iPhone y iPad. No requiere cuentas, servidor, base de datos ni conexión a internet para realizar el diagnóstico básico.

## 2. Forma de trabajo del agente

- Trabajar directamente en el proyecto, sin delegar tareas a otros agentes o subagentes.
- El proyecto parte del boilerplate existente (React Native CLI 0.84, JavaScript, alias `@/` → `src/`, `ThemeProvider`, `SafeScreen`, `ErrorBoundary`, i18next). Conservar esa base y su estilo; la app tiene **una sola pantalla** (`src/screens/Diagnostics`).
- **Solo JavaScript**: no añadir archivos TypeScript ni comprobación de tipos.
- Usar **yarn** como gestor de paquetes (no generar `package-lock.json`).
- Priorizar una primera versión **completamente funcional**; después mejorar la presentación visual.
- Escribir código simple, explícito, legible y mantenible. Evitar sobreingeniería, abstracciones prematuras, patrones innecesarios y dependencias sin justificación.
- Respetar las estructuras y configuraciones estándar de React Native; no crear soluciones propias para tareas ya resueltas por el framework.
- Mantener el proyecto compatible con el toolchain y versiones estables vigentes que sean mutuamente compatibles, verificando la documentación antes de instalar paquetes.
- No agregar backend, APIs remotas, analítica, telemetría, inicio de sesión, servicios en la nube ni almacenamiento de datos personales.
- **No hay pruebas**: no generar pruebas unitarias ni reinstalar Jest/Testing Library. Sí realizar verificaciones manuales y comprobaciones de compilación cuando el entorno lo permita.
- No simular que una característica fue detectada: si el sistema no permite leerla, mostrar claramente **No disponible** o **Desconocido**.
- Documentar las decisiones técnicas relevantes y limitaciones reales.

## 3. Stack tecnológico

- React Native CLI (sin Expo, por la necesidad potencial de código nativo Android).
- Android: Kotlin para cualquier módulo nativo indispensable.
- iOS: utilizar APIs y módulos ya disponibles, sin agregar código nativo salvo necesidad justificada.
- `react-native-device-info` como opción preferida para consultar datos de dispositivo y sistema, validando que sea compatible con la versión de React Native elegida.
- APIs integradas de React Native (`Platform`, `useWindowDimensions`, `PixelRatio`, `Appearance`, etc.) cuando correspondan.
- Estilos con `StyleSheet` y componentes nativos. No instalar una biblioteca UI pesada solo para este MVP.

Referencias:
- https://reactnative.dev/docs/getting-started
- https://reactnative.dev/docs/usewindowdimensions
- https://github.com/react-native-device-info/react-native-device-info
- https://developer.android.com/work/dpc/dedicated-devices/lock-task-mode

## 4. Alcance funcional — MVP

### 4.1. Clasificación del dispositivo

Mostrar tres conceptos **independientes**:

1. **Plataforma**: `android` / `ios`.
2. **Tipo de dispositivo**: `phone` / `tablet` / `tv` / `desktop` / `other` / `unknown` (según la información disponible).
3. **Estado kiosco de Android**: `locked` / `pinned` / `none` / `unavailable` / `unknown`.

La interfaz podrá mostrar nombres amigables en español: `Teléfono Android`, `Tablet Android`, `iPhone`, `iPad`, etc. Sin embargo, no debe confundir la plataforma ni el tipo de equipo con un modo de operación.

**Regla esencial:** no clasificar automáticamente como "kiosco" un dispositivo solo porque su pantalla sea grande, tenga Android, esté en modo horizontal, sea de un fabricante específico o no tenga botones visibles.

### 4.2. Información general

Obtener y presentar, cuando la API y plataforma lo permitan:

- Plataforma: Android o iOS.
- Tipo de equipo: teléfono, tablet u otro.
- Fabricante y marca.
- Modelo comercial, si está disponible.
- Identificador técnico de modelo o dispositivo (no identificador personal).
- Nombre visible del dispositivo, solo si puede consultarse sin permisos invasivos.
- Versión del sistema operativo.
- Versión del SDK/API de Android, cuando corresponda.
- Arquitecturas de CPU soportadas, si están disponibles.
- Indicador de simulador/emulador.

### 4.3. Pantalla

- Ancho y alto de la ventana de la aplicación, en unidades lógicas (`dp` en Android o puntos en iOS).
- Resolución física de la ventana calculada a partir de la densidad, cuando proceda, indicando claramente que **no necesariamente corresponde a la resolución completa del panel**.
- Escala de densidad (`PixelRatio`).
- Escala de fuente.
- Orientación actual (vertical u horizontal, calculada de las dimensiones observadas).
- Actualización dinámica al rotar o redimensionar la aplicación.

No usar el tamaño de pantalla como única fuente para distinguir teléfono y tablet. Preferir la clasificación del sistema o biblioteca y dejar constancia de casos ambiguos.

### 4.4. Recursos y estado

Consultar únicamente valores disponibles con APIs públicas y permisos razonables:

- Capacidad total de almacenamiento y espacio libre, cuando sea posible.
- Memoria total reportada, cuando sea posible.
- Nivel de batería y estado de carga, cuando estén disponibles.
- Estado de conectividad general si puede obtenerse sin permisos innecesarios; dejar esta sección opcional para el MVP.

Mostrar unidades legibles (`GB`, `MB`, `%`) y distinguir correctamente capacidad total de memoria disponible, si se reportan ambas. No presentar estimaciones como mediciones exactas.

### 4.5. Información de la propia aplicación

- Nombre: DeviceScope.
- Versión de la aplicación.
- Número de compilación.
- Identificador del paquete / bundle ID.
- Plataforma de ejecución.

### 4.6. Detección del modo kiosco Android

Crear un **módulo nativo Android pequeño en Kotlin** si las bibliotecas existentes no proporcionan la información necesaria de manera confiable.

Se implementa como módulo nativo clásico (`ReactContextBaseJavaModule`), que en la New Architecture funciona mediante la capa de interoperabilidad y no requiere especificaciones de Codegen en TypeScript/Flow. El módulo deberá exponer la consulta del estado actual de bloqueo de tareas a través de `ActivityManager.getLockTaskModeState()` en las versiones de Android que lo soporten.

Interpretar los valores:

| Estado Android | Valor de dominio | Presentación |
|---|---|---|
| `LOCK_TASK_MODE_LOCKED` | `locked` | Modo Lock Task activo |
| `LOCK_TASK_MODE_PINNED` | `pinned` | Pantalla fijada (Screen Pinning) |
| `LOCK_TASK_MODE_NONE` | `none` | Sin bloqueo de tareas activo |
| iOS (en Android, minSdk 24 ≥ API 23, por lo que siempre existe) | `unavailable` | No disponible |
| Error de consulta | `unknown` | No se pudo determinar |

**Advertencias obligatorias:**

- `locked` es evidencia de que Android está actualmente en Lock Task Mode, pero no demuestra que el hardware sea un kiosco dedicado.
- `pinned` no equivale a un modo kiosco empresarial administrado.
- `none` **no significa** que el equipo no sea un kiosco: puede ser hardware dedicado, un launcher propio, una solución MDM diferente o un equipo configurado fuera de Lock Task Mode.
- No activar ni desactivar el modo kiosco. Esta app es de **diagnóstico de solo lectura**.
- No solicitar privilegios de Device Owner, Accessibility, administración de dispositivo ni permisos peligrosos para cumplir este objetivo.
- iOS no debe mostrar un estado kiosco Android ficticio: usar `unavailable`.

**Nota sobre arquitectura nativa:** integrar el módulo Kotlin mediante el mecanismo soportado por la versión elegida de React Native; no deshabilitar la New Architecture ni modificar indiscriminadamente archivos Gradle para conseguirlo.

### 4.7. Actualización y copia de información

- Botón **Actualizar información** para volver a consultar las propiedades dinámicas y el estado kiosco.
- Acción **Copiar diagnóstico** en formato de texto legible y estructurado.
- **Compartir diagnóstico** usa la API `Share` incluida en React Native. Copiar requiere `@react-native-clipboard/clipboard`, porque `Clipboard` ya no forma parte del núcleo.
- Excluir de cualquier reporte números de serie, IMEI, identificadores publicitarios, tokens, MAC, identificadores persistentes únicos y datos personales.
- Incluir fecha y hora de generación del diagnóstico, obtenidas localmente al generar el reporte.

## 5. Pantalla principal y UX

Diseñar una sola pantalla de diagnóstico, clara y adaptable a teléfono, tablet y pantalla de kiosco.

### Encabezado

- Título: **DeviceScope**.
- Subtítulo: **Diagnóstico del dispositivo**.
- Estado de carga o última actualización.

### Tarjeta de resumen

Mostrar de manera prominente:

- Nombre amigable del equipo (por ejemplo, `Tablet Android`).
- Marca y modelo.
- Sistema operativo y versión.
- Etiqueta de tipo (`Teléfono`, `Tablet`, `Otro`, `Desconocido`).
- Indicador separado de Lock Task (`Activo`, `Pantalla fijada`, `Inactivo`, `No disponible`).

### Secciones

1. **Dispositivo**.
2. **Sistema operativo**.
3. **Pantalla**.
4. **Hardware y recursos**.
5. **Estado de kiosco (Android)**.
6. **Aplicación**.

### Acciones

- `Actualizar información`.
- `Copiar diagnóstico`.

### Diseño visual

- Estética profesional y minimalista de herramienta técnica.
- Jerarquía de tipografía clara, fondo limpio, tarjetas discretas y bordes sutiles.
- Evitar gradientes llamativos, animaciones innecesarias y diseño genérico recargado.
- En teléfono: contenido en una columna y desplazamiento vertical.
- En tablets y kioscos: aprovechar el espacio disponible mediante una distribución de dos columnas cuando sea apropiado.
- Compatibilidad con orientación vertical y horizontal, áreas seguras, tamaños de fuente y tema claro/oscuro si no complica el MVP.
- Todos los datos y estados visibles deben tener etiquetas comprensibles en español.
- Para datos inexistentes, usar `No disponible` sin renderizar `undefined`, `null`, `NaN` o cadenas vacías.
- Considerar botones y tipografía utilizables en pantallas táctiles de kiosco.

## 6. Organización de código

```text
src/
  App.js                              # ThemeProvider + navegación
  navigation/Application.js           # Stack con una sola pantalla
  screens/Diagnostics/Diagnostics.js  # Única pantalla
  components/molecules/               # SummaryCard, InfoSection, InfoRow, DefaultError
  components/organisms/ErrorBoundary/
  components/templates/SafeScreen/
  hooks/useDeviceDiagnostics.js
  services/deviceDiagnostics.js       # Recolección con react-native-device-info
  services/kioskStatus.js             # Puente al módulo nativo KioskStatus
  utils/formatters.js
  utils/report.js                     # Secciones etiquetadas + reporte de texto
  theme/                              # Tema del boilerplate (sigue el modo claro/oscuro del sistema)
  translations/es-ES.json             # Único idioma
android/app/src/main/java/com/devicescope/
  KioskStatusModule.kt
  KioskStatusPackage.kt
```

No generar carpetas, servicios ni componentes vacíos "por si acaso".

## 7. Modelo de datos

El objeto que devuelve `collectDiagnostics()` (JS, sin tipos estáticos) contiene como mínimo:

- `platform`: `'android' | 'ios'`
- `deviceType`: `'phone' | 'tablet' | 'tv' | 'desktop' | 'other' | 'unknown'` (mapeado desde `DeviceInfo.getDeviceType()`: `Handset→phone`, `Tablet→tablet`, `Tv→tv`, `Desktop→desktop`, `GamingConsole→other`)
- `kioskState`: `'locked' | 'pinned' | 'none' | 'unavailable' | 'unknown'`
- `manufacturer`, `brand`, `model`, `deviceId`, `osVersion`, `androidApiLevel`, `isEmulator`… con `null` cuando no estén disponibles.
- `collectedAt`: fecha ISO.

**No guardar un único booleano `isKiosk` como resultado principal.** Si se necesita un booleano derivado, nombrarlo `isLockTaskActive` y documentar su significado exacto.

Funciones de `react-native-device-info` que **no deben usarse**: `getUniqueId`, `getAndroidId`, `getSerialNumber`, `getMacAddress`, `getInstanceId`, `getIpAddress`, `getDeviceToken`, `getCarrier`. `getDeviceId()` sí está permitido (es el identificador de modelo, por ejemplo `iPhone15,2`).

## 8. Lógica y tratamiento de errores

- Centralizar la recolección de datos en un servicio claro.
- Separar lectura de datos, normalización y renderizado.
- Ejecutar consultas asíncronas de manera que el error de un campo no impida mostrar los demás.
- Manejar permisos denegados, propiedades no soportadas y fallos del módulo nativo sin cierres inesperados.
- Evitar consultas costosas en cada render.
- Actualizar los datos que cambien (como dimensiones) cuando corresponda y ofrecer actualización manual para el resto.
- No introducir valores de demostración en la interfaz como si fueran reales.
- No inferir atributos protegidos o inaccesibles a partir de heurísticas no verificadas.

## 9. Fuera de alcance en esta primera versión

- Backend, cuentas de usuario o inicio de sesión.
- Base de datos y sincronización con la nube.
- Administración remota de equipos.
- Activación o configuración de un kiosco.
- Políticas MDM / Device Owner.
- Root, jailbreak o bypass de restricciones de Android/iOS.
- GPS o rastreo de ubicación.
- Recolección de IMEI, números de serie, MAC o identificadores persistentes.
- Integración con plataformas de publicidad o analítica.
- Pruebas unitarias automatizadas y pipeline CI/CD.
- Detección de Acceso Guiado en iOS (`UIAccessibility.isGuidedAccessEnabled`); posible mejora futura.

## 10. Orden de implementación

### Fase 1 — Proyecto base

1. Revisar el directorio actual.
2. Crear o normalizar el proyecto React Native CLI.
3. Verificar configuraciones mínimas de Android e iOS.
4. Instalar solo dependencias necesarias y compatibles.

### Fase 2 — Diagnóstico general

1. Crear los tipos de datos.
2. Implementar el servicio para obtener plataforma, tipo, fabricante, modelo y SO.
3. Implementar lectura de dimensiones y densidad.
4. Implementar recursos de hardware compatibles.
5. Gestionar errores por campo.

### Fase 3 — Detección de modo kiosco

1. Implementar la consulta nativa de Lock Task Mode en Kotlin.
2. Exponer una función tipada a React Native.
3. Normalizar sus estados.
4. Tratar iOS y versiones Android no soportadas como `unavailable`.
5. Validar que `none` no se interprete como "no es kiosco".

### Fase 4 — Interfaz

1. Construir pantalla de resumen y secciones.
2. Adaptar a teléfono, tablet y kiosco horizontal.
3. Añadir actualización manual.
4. Añadir generación y copia del reporte.
5. Revisar manejo de campos no disponibles.

### Fase 5 — Verificación y documentación

1. Comprobar compilación Android/iOS si los SDK están disponibles.
2. Probar en emulador Android y simulador iOS, indicando que estas pruebas **no sustituyen** a un dispositivo físico.
3. Si hay equipos físicos disponibles, comprobar teléfono Android, tablet Android, kiosco Android, iPhone y iPad.
4. Para kiosco, verificar los estados reales `locked`, `pinned` y `none` solamente si se cuenta con dispositivos/configuraciones que permitan reproducirlos.
5. Documentar comandos de ejecución, permisos, limitaciones, resultados reales y cualquier escenario no probado.

## 11. Criterios de aceptación

- La aplicación abre sin registro ni internet.
- Detecta correctamente Android o iOS.
- Obtiene tipo de dispositivo usando la API disponible, sin clasificar kioscos por tamaño de pantalla.
- Muestra información técnica real y bien etiquetada.
- Las dimensiones reaccionan a cambios de orientación/ventana.
- En Android, consulta y presenta correctamente el estado Lock Task cuando la API está disponible.
- Distingue Lock Task de Screen Pinning.
- En iOS no presenta un falso modo kiosco.
- `No disponible` es una salida válida cuando no puede accederse a un dato.
- Se puede actualizar y copiar el diagnóstico sin incluir identificadores sensibles.
- La interfaz se utiliza correctamente en teléfono y tablet, en vertical u horizontal.
- No requiere cuentas, permisos invasivos, servidor ni base de datos.
- El código es legible y la documentación explica cómo compilar y ejecutar el proyecto.

## 12. Entregables del agente

1. Código fuente completo de DeviceScope para Android e iOS.
2. Módulo nativo Android para el estado Lock Task, si es necesario.
3. `README.md` con requisitos de instalación, comandos de compilación y ejecución, y características disponibles por plataforma.
4. Resumen final que incluya: funcionalidades implementadas, dependencias agregadas, verificaciones ejecutadas, limitaciones y pendientes reales.

## 13. Instrucción final

Implementa **DeviceScope** siguiendo este documento. Comienza por la funcionalidad técnica y su confiabilidad; después construye una interfaz sencilla y profesional. No solicites decisiones menores que puedas resolver con criterios razonables. Si alguna API no está disponible o una función depende del fabricante del kiosco, documenta la limitación y **no inventes** un resultado. Evita añadir funcionalidades ajenas al objetivo de diagnóstico.
