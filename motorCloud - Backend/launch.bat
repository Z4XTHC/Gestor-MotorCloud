@echo off
title Motor Cloud

:start
echo.
echo ================================================
echo   Motor Cloud - Sistema de Gestion de Taller
echo ================================================
echo   Iniciando...
echo.

:: Buscar el .jar en la misma carpeta que este script
set JAR_FILE=%~dp0motorCloud.jar

if not exist "%JAR_FILE%" (
    echo ERROR: No se encontro motorCloud.jar en esta carpeta.
    echo Asegurese de que el archivo .jar este en la misma carpeta que este script.
    pause
    exit /b 1
)

:: Ejecutar Spring Boot
java -jar "%JAR_FILE%"

:: Si el proceso termina con codigo 0 (actualización), reiniciar
if %ERRORLEVEL% == 0 (
    echo.
    echo Reiniciando despues de actualizacion...
    timeout /t 3 /nobreak > nul
    goto start
)

:: Si termina con otro codigo, fue un error
echo.
echo El sistema se detuvo (codigo: %ERRORLEVEL%).
echo Presione cualquier tecla para reiniciar, o cierre esta ventana para salir.
pause > nul
goto start
