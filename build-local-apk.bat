@echo off
setlocal
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "ANDROID_HOME=C:\Android"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "%~dp0android"
echo ============================================================
echo      COMPILATION LOCALE DE L'APK ANDROID (VERSION 2.0.0)
echo ============================================================
echo JAVA_HOME: %JAVA_HOME%
echo ANDROID_HOME: %ANDROID_HOME%
echo.
call gradlew.bat assembleRelease --no-daemon
echo.
echo ============================================================
if exist "app\build\outputs\apk\release\app-release.apk" (
    echo [SUCCES] L'APK a ete genere avec succes !
    echo Fichier : app\build\outputs\apk\release\app-release.apk
) else (
    echo [ATTENTION] La compilation n'a pas produit app-release.apk
)
echo ============================================================
