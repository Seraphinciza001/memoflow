@echo off
setlocal EnableDelayedExpansion
echo ========================================================
echo MemoFlow 2.0.0 Local APK Builder
echo ========================================================

set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "ANDROID_HOME=C:\Android"
set "ANDROID_SDK_ROOT=C:\Android"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%"

echo Checking Java version...
java -version
if %ERRORLEVEL% NEQ 0 (
    echo Java failed to run.
    exit /b %ERRORLEVEL%
)

echo Android SDK set to %ANDROID_HOME%

cd /d "%~dp0android"
echo Current directory: %CD%

echo Starting Gradle assembleRelease...
call gradlew.bat assembleRelease --no-daemon --stacktrace

set "BUILD_STATUS=%ERRORLEVEL%"
if %BUILD_STATUS% EQU 0 (
    echo ========================================================
    echo BUILD SUCCESSFUL!
    echo ========================================================
    if exist "app\build\outputs\apk\release\app-release.apk" (
        copy /Y "app\build\outputs\apk\release\app-release.apk" "C:\Users\SERAPHIN\Downloads\agenda (1)\MemoFlow-2.0.0.apk"
        echo Output APK copied to: C:\Users\SERAPHIN\Downloads\agenda (1)\MemoFlow-2.0.0.apk
    )
) else (
    echo ========================================================
    echo BUILD FAILED with code %BUILD_STATUS%
    echo ========================================================
)

exit /b %BUILD_STATUS%
