# Agenda Séraphin - Projet React Native Android (APK)

Ce dossier contient l'application React Native complète avec notifications en arrière-plan et réveil d'alarmes lorsque l'application est fermée.

## 📱 Compilation de l'APK Android (EAS Build)

### 1. Prérequis
Installez l'outil de build officiel Expo :
```bash
npm install -g eas-cli
```

### 2. Se connecter à son compte Expo (gratuit)
```bash
eas login
```

### 3. Lancer la compilation de l'APK
Placez-vous dans ce dossier :
```bash
cd react-native-agenda
eas build -p android --profile preview
```

Expo va compiler l'APK sur le cloud et vous fournir :
- Un lien de téléchargement direct du fichier `.apk`
- Un QR code à flasher avec votre téléphone Android pour l'installer directement.

---

## 🛠️ Compilation locale avec Android Studio

Si vous préférez compiler directement sur votre ordinateur avec le SDK Android :
```bash
npx expo run:android --variant release
```
Le fichier `.apk` sera généré dans `android/app/build/outputs/apk/release/app-release.apk`.

---

## 🔔 Fonctionnalités natives incluses
- **Exact Alarms & Background Tasks** (`expo-task-manager` + `expo-notifications`) : Les alertes sonnent même quand l'application est fermée ou le téléphone en veille.
- **Support Mode Sombre & Mode Clair** avec contraste optimisé (les champs de formulaire s'adaptent et ne restent pas blancs).
- **Pied de page "Powered by Séraphin"** sur l'écran d'accueil.
- **Stockage hors-ligne persistant** (`@react-native-async-storage/async-storage`).
