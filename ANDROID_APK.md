# GrandChef Android (APK)

Este proyecto incluye un wrapper Android (Capacitor) que carga la web de GrandChef dentro de una app instalable.

## Rutas importantes

- Proyecto Android: `android/`
- APKs (debug): `apk/`

## URL que carga la app

La app Android carga la URL configurada en `capacitor.config.ts`:

- Por defecto: `http://10.0.2.2:3000` (solo emulador Android)
- Puedes sobrescribirla al sincronizar:

```powershell
$env:CAP_SERVER_URL="https://tu-dominio.com"
npm run android:sync
```

Notas:
- Para un telefono real en la misma Wi-Fi (modo dev): usa `http://TU_IP_LOCAL:3000`
- Para distribucion: usa siempre `https://...`

## Build APK (debug)

Requisitos:
- Android SDK instalado (Android Studio)

Comandos (PowerShell):

```powershell
cd c:\Users\Casa\Desktop\GrandChef

# 1) Sincroniza la URL (opcional)
$env:CAP_SERVER_URL="http://192.168.1.130:3000"
npm run android:sync

# 2) Compila el APK debug
cd android
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
.\gradlew assembleDebug
```

Salida:
- `android\app\build\outputs\apk\debug\app-debug.apk`

## Abrir en Android Studio

Abre Android Studio y selecciona la carpeta `android/` como proyecto.

Para generar un APK instalable firmado:
- `Build > Generate Signed Bundle / APK... > APK`

