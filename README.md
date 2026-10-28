# DeviceScope

Aplicación React Native (Android e iOS) de una sola pantalla que muestra un diagnóstico de solo lectura del dispositivo: tipo de equipo, sistema operativo, pantalla, recursos y, en Android, el estado de Lock Task Mode (kiosco). No necesita cuentas, servidor ni internet.

## Requisitos

- Node ≥ 22.11 y yarn 1.x
- Android: JDK 17 y Android SDK (minSdk 24, compileSdk 35)
- iOS: Xcode y CocoaPods

## Ejecutar

```sh
yarn install
cd ios && pod install && cd ..   # solo iOS

yarn start       # Metro
yarn android     # o: yarn ios
```

## Qué muestra

| Sección | Android | iOS |
|---|---|---|
| Dispositivo (fabricante, marca, modelo, identificador de modelo, emulador) | ✓ | ✓ |
| Sistema operativo (versión, nivel de API, arquitecturas de CPU) | ✓ | ✓ (sin nivel de API) |
| Pantalla (ventana, densidad, escala de fuente, orientación; se actualiza al rotar) | ✓ | ✓ |
| Recursos (almacenamiento, RAM, batería) | ✓ | ✓ |
| Estado Lock Task (`locked` / `pinned` / `none`) | ✓ | `No disponible` |

Acciones: **Actualizar información**, **Copiar diagnóstico** y **Compartir**. El reporte copiado no incluye el nombre del dispositivo, que puede contener datos personales, ni ningún identificador único (serie, IMEI, MAC, ID publicitario).

## Estado kiosco (Android)

`android/app/src/main/java/com/devicescope/KioskStatusModule.kt` consulta `ActivityManager.getLockTaskModeState()` en modo solo lectura y sin permisos especiales.

- `locked`: Android está en Lock Task Mode. Esto no demuestra que el hardware sea un kiosco dedicado.
- `pinned`: la pantalla fue fijada por el usuario. No equivale a un kiosco administrado.
- `none`: no hay Lock Task activo. **No** significa que el equipo no sea un kiosco: puede usar un launcher propio o un MDM.

El estado se vuelve a consultar al pulsar *Actualizar* y cada vez que la app vuelve a primer plano.

## Limitaciones conocidas

- En iOS 16 y posteriores, el nombre del dispositivo es genérico ("iPhone") salvo que se tenga un entitlement especial.
- Los píxeles de la ventana se calculan como tamaño lógico × densidad, y no siempre corresponden a la resolución del panel.
- En emuladores y simuladores, la batería y algunos datos de hardware son simulados.
- Las pruebas en emulador no sustituyen a un dispositivo físico ni a un kiosco real.
