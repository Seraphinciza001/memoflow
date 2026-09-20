@echo off
chcp 65001 > nul
cls
:: Force le script à se placer dans le dossier où il est enregistré
cd /d "%~dp0"

echo ============================================================
echo        AGENDA SERAPHIN - COMPILATION DE L'APK ANDROID
echo ============================================================
echo.
echo Ce script va compiler directement votre fichier APK Android
echo via Expo EAS Build (le fichier .apk sera telechargeable direct).
echo.
echo 1. Connexion a votre compte Expo (gratuit sur https://expo.dev)
echo ------------------------------------------------------------
call npx --yes eas-cli login
echo.
echo 2. Lancement du build de l'APK Android
echo ------------------------------------------------------------
echo Compilation en cours sur les serveurs securises Expo...
call npx --yes eas-cli build -p android --profile preview
echo.
echo ============================================================
echo Compilation terminee !
echo Flashez le QR code affiche ci-dessus ou ouvrez le lien pour
echo installer votre fichier .apk sur votre telephone Android.
echo ============================================================
pause