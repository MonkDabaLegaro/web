@echo off
title Sistema de Desarrollo - Control de Siniestros
color 0A

REM Configurar logging
set LOG_FILE=%~dp0setup_log.txt
echo [%date% %time%] Iniciando setup del sistema >> "%LOG_FILE%"

REM Verificar permisos de escritura
echo Verificando permisos de escritura...
echo [%date% %time%] Verificando permisos de escritura >> "%LOG_FILE%"
echo test > test.tmp 2>nul
if not exist test.tmp (
    echo ERROR: No hay permisos de escritura en el directorio actual
    echo [%date% %time%] ERROR: No hay permisos de escritura >> "%LOG_FILE%"
    pause
    exit /b 1
)
del test.tmp
echo [OK] Permisos de escritura verificados
echo [%date% %time%] [OK] Permisos de escritura verificados >> "%LOG_FILE%"

echo ===============================================
echo    SISTEMA DE DESARROLLO - CONTROL DE SINIESTROS
echo ===============================================
echo.
echo Iniciando setup automatico del sistema...
echo [%date% %time%] Iniciando setup automatico del sistema >> "%LOG_FILE%"
echo.

REM Verificar si Node.js está instalado
echo Verificando Node.js...
echo [%date% %time%] Verificando Node.js >> "%LOG_FILE%"
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no está instalado o no está en el PATH
    echo [%date% %time%] ERROR: Node.js no instalado >> "%LOG_FILE%"
    echo Por favor instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %i in ('node --version') do set NODE_VERSION=%i
echo [OK] Node.js encontrado: %NODE_VERSION%
echo [%date% %time%] [OK] Node.js encontrado: %NODE_VERSION% >> "%LOG_FILE%"
echo.

REM Verificar instalación de MongoDB
echo Verificando instalación de MongoDB...
echo [%date% %time%] Verificando instalación de MongoDB >> "%LOG_FILE%"
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MongoDB no está instalado o no está en el PATH
    echo [%date% %time%] ERROR: MongoDB no instalado >> "%LOG_FILE%"
    echo Por favor instala MongoDB desde https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)
for /f "tokens=3" %i in ('mongod --version 2^>nul ^| findstr "db version"') do set MONGO_VERSION=%i
echo [OK] MongoDB instalado - Versión: %MONGO_VERSION%
echo [%date% %time%] [OK] MongoDB instalado - Versión: %MONGO_VERSION% >> "%LOG_FILE%"
echo.

REM Verificar si MongoDB está ejecutándose
echo Verificando si MongoDB está ejecutándose...
echo [%date% %time%] Verificando si MongoDB está ejecutándose >> "%LOG_FILE%"
tasklist /FI "IMAGENAME eq mongod.exe" /NH >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MongoDB no está ejecutándose
    echo [%date% %time%] ERROR: MongoDB no ejecutándose >> "%LOG_FILE%"
    echo Inicia MongoDB: Ejecuta 'net start MongoDB' o inicia el servicio manualmente
    echo ¿Deseas intentar iniciar MongoDB automáticamente? (s/n)
    set /p choice=
    if "!choice!"=="s" or "!choice!"=="S" (
        echo Intentando iniciar MongoDB...
        echo [%date% %time%] Intentando iniciar MongoDB >> "%LOG_FILE%"
        net start MongoDB >nul 2>&1
        if %errorlevel% neq 0 (
            echo ERROR: No se pudo iniciar MongoDB automáticamente
            echo [%date% %time%] ERROR: No se pudo iniciar MongoDB >> "%LOG_FILE%"
            pause
            exit /b 1
        )
        echo [OK] MongoDB iniciado automáticamente
        echo [%date% %time%] [OK] MongoDB iniciado automáticamente >> "%LOG_FILE%"
    ) else (
        pause
        exit /b 1
    )
)
echo [OK] MongoDB está ejecutándose
echo [%date% %time%] [OK] MongoDB ejecutándose >> "%LOG_FILE%"
echo.

REM Crear configuraciones necesarias
echo Creando configuraciones necesarias...
echo [%date% %time%] Creando configuraciones necesarias >> "%LOG_FILE%"
if not exist "backend\server\.env" (
    if exist "backend\server\config.env.example" (
        copy "backend\server\config.env.example" "backend\server\.env"
        echo [OK] Archivo .env del backend creado desde config.env.example
        echo [%date% %time%] [OK] .env backend creado >> "%LOG_FILE%"
    ) else (
        echo ERROR: No se encontró config.env.example para crear .env del backend
        echo [%date% %time%] ERROR: config.env.example no encontrado >> "%LOG_FILE%"
        pause
        exit /b 1
    )
) else (
    echo [OK] Archivo .env del backend ya existe
    echo [%date% %time%] [OK] .env backend ya existe >> "%LOG_FILE%"
)

if not exist "frontend\.env" (
    echo Creando archivo .env basico para frontend...
    echo VITE_API_BASE_URL=http://localhost:3001/api > "frontend\.env"
    echo [OK] Archivo .env del frontend creado
    echo [%date% %time%] [OK] .env frontend creado >> "%LOG_FILE%"
) else (
    echo [OK] Archivo .env del frontend ya existe
    echo [%date% %time%] [OK] .env frontend ya existe >> "%LOG_FILE%"
)
echo Configuraciones completadas. Presiona Enter para continuar con la instalación de dependencias...
echo [%date% %time%] Configuraciones completadas >> "%LOG_FILE%"
pause >nul
echo.

REM Instalar dependencias automáticamente
echo Instalando dependencias...

REM Backend
if not exist "backend\server\node_modules" (
    echo Instalando dependencias del backend...
    cd backend\server
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Falló la instalación de dependencias del backend
        cd ..\..
        pause
        exit /b 1
    )
    cd ..\..
    echo [OK] Dependencias del backend instaladas
) else (
    echo [OK] Dependencias del backend ya instaladas
)

REM Frontend
if not exist "frontend\node_modules" (
    echo Instalando dependencias del frontend...
    echo [%date% %time%] Instalando dependencias frontend >> "%LOG_FILE%"
    cd frontend
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Falló la instalación de dependencias del frontend
        echo [%date% %time%] ERROR: Falló instalación frontend >> "%LOG_FILE%"
        cd ..
        echo ¿Deseas continuar sin dependencias del frontend? (s/n)
        set /p choice=
        if not "!choice!"=="s" if not "!choice!"=="S" (
            pause
            exit /b 1
        )
    ) else (
        cd ..
        echo [OK] Dependencias del frontend instaladas
        echo [%date% %time%] [OK] Dependencias frontend instaladas >> "%LOG_FILE%"
    )
) else (
    echo [OK] Dependencias del frontend ya instaladas
    echo [%date% %time%] [OK] Dependencias frontend ya instaladas >> "%LOG_FILE%"
)

REM Instalar dependencias del directorio raíz
if not exist "node_modules" (
    echo Instalando dependencias del directorio raíz...
    echo [%date% %time%] Instalando dependencias raíz >> "%LOG_FILE%"
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Falló la instalación de dependencias del directorio raíz
        echo [%date% %time%] ERROR: Falló instalación raíz >> "%LOG_FILE%"
        echo ¿Deseas continuar sin ellas? (s/n)
        set /p choice=
        if not "!choice!"=="s" if not "!choice!"=="S" (
            pause
            exit /b 1
        )
    ) else (
        echo [OK] Dependencias del directorio raíz instaladas
        echo [%date% %time%] [OK] Dependencias raíz instaladas >> "%LOG_FILE%"
    )
) else (
    echo [OK] Dependencias del directorio raíz ya instaladas
    echo [%date% %time%] [OK] Dependencias raíz ya instaladas >> "%LOG_FILE%"
)
echo Instalación de dependencias completada. Presiona Enter para continuar con verificaciones...
echo [%date% %time%] Instalación dependencias completada >> "%LOG_FILE%"
pause >nul
echo.

REM Verificar puertos libres
echo Verificando puertos libres...
echo [%date% %time%] Verificando puertos libres >> "%LOG_FILE%"
netstat -ano 2>nul | findstr :3001 >nul
if %errorlevel% equ 0 (
    echo ADVERTENCIA: Puerto 3001 ya está en uso
    echo [%date% %time%] ADVERTENCIA: Puerto 3001 en uso >> "%LOG_FILE%"
    echo ¿Deseas continuar de todos modos? (s/n)
    set /p choice=
    if not "!choice!"=="s" if not "!choice!"=="S" (
        echo Operación cancelada por el usuario
        echo [%date% %time%] Operación cancelada por usuario >> "%LOG_FILE%"
        pause
        exit /b 1
    )
)
netstat -ano 2>nul | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo ADVERTENCIA: Puerto 5173 ya está en uso
    echo [%date% %time%] ADVERTENCIA: Puerto 5173 en uso >> "%LOG_FILE%"
    echo ¿Deseas continuar de todos modos? (s/n)
    set /p choice=
    if not "!choice!"=="s" if not "!choice!"=="S" (
        echo Operación cancelada por el usuario
        echo [%date% %time%] Operación cancelada por usuario >> "%LOG_FILE%"
        pause
        exit /b 1
    )
)
echo [OK] Puertos libres o usuario confirmó continuar
echo [%date% %time%] [OK] Puertos verificados >> "%LOG_FILE%"
echo.

REM Verificar conexión a base de datos (opcional, usando Node.js)
echo Verificando conexión a base de datos...
echo [%date% %time%] Verificando conexión a base de datos >> "%LOG_FILE%"
node -e "
const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/server/.env' });
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sistema_siniestros';
mongoose.connect(MONGODB_URI).then(() => {
  console.log('[OK] Conexión a MongoDB exitosa');
  return mongoose.connection.close();
}).catch(err => {
  console.error('ERROR: No se pudo conectar a MongoDB:', err.message);
  process.exit(1);
});
"
if %errorlevel% neq 0 (
    echo ERROR: Falló la verificación de conexión a base de datos
    echo [%date% %time%] ERROR: Falló conexión a base de datos >> "%LOG_FILE%"
    echo ¿Deseas continuar? (s/n)
    set /p choice=
    if not "!choice!"=="s" if not "!choice!"=="S" (
        pause
        exit /b 1
    )
) else (
    echo [OK] Conexión a base de datos verificada
    echo [%date% %time%] [OK] Conexión a base de datos verificada >> "%LOG_FILE%"
)
echo.

REM Iniciar servicios
echo Preparando para iniciar servicios...
echo [%date% %time%] Preparando inicio de servicios >> "%LOG_FILE%"
echo Presiona Enter cuando estés listo para iniciar los servicios...
pause >nul

REM Iniciar Backend en una nueva ventana
echo Iniciando Backend (Puerto 3001)...
echo [%date% %time%] Iniciando Backend >> "%LOG_FILE%"
start "Backend Server" /min cmd /k "cd backend\server && npm start"

REM Esperar un momento para que el backend inicie
echo Esperando que el backend inicie...
echo [%date% %time%] Esperando inicio backend >> "%LOG_FILE%"
timeout /t 5 /nobreak >nul

REM Inicializar base de datos con usuarios por defecto
echo Inicializando base de datos con usuarios por defecto...
echo [%date% %time%] Inicializando base de datos >> "%LOG_FILE%"
node backend/server/init-database.js
if %errorlevel% neq 0 (
    echo ERROR: Falló la inicialización de la base de datos
    echo [%date% %time%] ERROR: Falló inicialización base de datos >> "%LOG_FILE%"
    echo ¿Deseas continuar? (s/n)
    set /p choice=
    if not "!choice!"=="s" if not "!choice!"=="S" (
        pause
        exit /b 1
    )
) else (
    echo [OK] Base de datos inicializada con usuarios por defecto
    echo [%date% %time%] [OK] Base de datos inicializada >> "%LOG_FILE%"
)
echo.

REM Verificar health check de la API (opcional)
echo Verificando health check de la API...
echo [%date% %time%] Verificando health check API >> "%LOG_FILE%"
node -e "
const http = require('http');
const url = 'http://localhost:3001/api/health';
const req = http.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.message && response.message.includes('funcionando correctamente')) {
        console.log('[OK] Health check de la API exitoso');
      } else {
        console.error('ERROR: Respuesta de health check inválida');
        process.exit(1);
      }
    } catch (error) {
      console.error('ERROR: Error parseando respuesta del health check');
      process.exit(1);
    }
  });
});
req.on('error', (error) => {
  console.error('ERROR: No se pudo conectar a la API');
  process.exit(1);
});
req.setTimeout(10000, () => {
  req.destroy();
  console.error('ERROR: Timeout en health check');
  process.exit(1);
});
"
if %errorlevel% neq 0 (
    echo ADVERTENCIA: Health check de la API falló, pero continuando...
    echo [%date% %time%] ADVERTENCIA: Health check falló >> "%LOG_FILE%"
) else (
    echo [OK] API funcionando correctamente
    echo [%date% %time%] [OK] API funcionando >> "%LOG_FILE%"
)
echo.

REM Iniciar Frontend en una nueva ventana
echo Iniciando Frontend (Puerto 5173)...
echo [%date% %time%] Iniciando Frontend >> "%LOG_FILE%"
start "Frontend Dev Server" cmd /k "cd frontend && npm run dev"

echo.
echo ===============================================
echo    SERVICIOS INICIADOS EXITOSAMENTE
echo ===============================================
echo [%date% %time%] Servicios iniciados exitosamente >> "%LOG_FILE%"
echo.
echo Backend:    http://localhost:3001
echo Frontend:   http://localhost:5173
echo.
echo IMPORTANTE:
echo - No cierres esta ventana hasta que hayas terminado de usar el sistema
echo - Para cerrar el sistema, presiona Ctrl+C aqui o cierra las ventanas manualmente
echo - Revisa el archivo setup_log.txt para detalles del proceso
echo.
echo Presiona cualquier tecla para minimizar esta ventana...
echo (Los servicios seguiran ejecutándose en segundo plano)
pause >nul

echo.
echo Minimizando ventana... Los servicios siguen activos.
echo [%date% %time%] Setup completado exitosamente >> "%LOG_FILE%"
timeout /t 2 /nobreak >nul
exit