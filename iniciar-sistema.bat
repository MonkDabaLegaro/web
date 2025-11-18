@echo off
title Sistema de Desarrollo - Control de Siniestros
color 0A

echo ===============================================
echo    SISTEMA DE DESARROLLO - CONTROL DE SINIESTROS
echo ===============================================
echo.
echo Iniciando servicios del sistema...
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no está instalado o no está en el PATH
    echo Por favor instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js encontrado
echo.

REM Iniciar Backend en una nueva ventana
echo Iniciando Backend (Puerto 3001)...
start "Backend Server" /min cmd /k "cd backend\server && npm start"

REM Esperar un momento para que el backend inicie
timeout /t 3 /nobreak >nul

REM Iniciar Frontend en una nueva ventana  
echo Iniciando Frontend (Puerto 5173)...
start "Frontend Dev Server" cmd /k "cd frontend && npm run dev"

echo.
echo ===============================================
echo    SERVICIOS INICIADOS EXITOSAMENTE
echo ===============================================
echo.
echo Backend:    http://localhost:3001
echo Frontend:   http://localhost:5173
echo.
echo IMPORTANTE:
echo - No cierres esta ventana hasta que hayas terminado de usar el sistema
echo - Para cerrar el sistema, presiona Ctrl+C aqui o cierra las ventanas manualmente
echo.
echo Presiona cualquier tecla para minimizar esta ventana...
echo (Los servicios seguiran ejecutandose en segundo plano)
pause >nul

echo.
echo Minimizando ventana... Los servicios siguen activos.
timeout /t 2 /nobreak >nul
exit