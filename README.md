# Sistema de Control de Siniestros

Sistema web completo para la gestión y control de siniestros, desarrollado con React (frontend) y Node.js/Express (backend), utilizando MongoDB como base de datos.

## 🚀 Inicio Rápido

### Descarga e Instalación Automática

1. **Descarga el proyecto:**
   ```bash
   git clone <url-del-repositorio>
   cd sistema-siniestros
   ```

2. **Ejecuta el script de inicio automático:**
   ```bash
   node start-system.js
   ```

   Este script automáticamente:
   - Verifica todos los prerrequisitos
   - Instala dependencias faltantes
   - Inicia MongoDB (si no está ejecutándose)
   - Inicia el backend en http://localhost:3001
   - Inicia el frontend en http://localhost:5173

## 📋 Requisitos Previos

Antes de ejecutar el sistema, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior): https://nodejs.org
- **MongoDB** (Community Edition): https://www.mongodb.com/try/download/community

### Instalación de MongoDB

#### Windows:
- Descarga e instala MongoDB Community Edition
- El servicio se inicia automáticamente

#### macOS:
```bash
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt-get install mongodb
sudo systemctl start mongod
```

## 🔧 Configuración Manual (Opcional)

Si prefieres configurar manualmente:

1. **Configurar variables de entorno:**
   ```bash
   # Backend
   cp backend/server/config.env.example backend/server/.env

   # Frontend
   cp frontend/.env.example frontend/.env
   ```

2. **Instalar dependencias:**
   ```bash
   # Backend
   cd backend/server
   npm install

   # Frontend
   cd ../../frontend
   npm install
   ```

3. **Iniciar servicios:**
   ```bash
   # Terminal 1 - Backend
   cd backend/server
   npm start

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## 👥 Usuarios por Defecto

El sistema incluye usuarios de prueba:

- **Administrador:**
  - Usuario: `admin`
  - Contraseña: `Admin2024!`

- **Cliente:**
  - Usuario: `cliente`
  - Contraseña: `Cliente2024!`

## 🌐 Acceso al Sistema

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Documentación API:** http://localhost:3001/api/health

## 🛠️ Solución de Problemas

### Error "failed to fetch"

Este error generalmente indica problemas de conectividad entre frontend y backend:

1. **Verificar que ambos servicios estén ejecutándose:**
   - Backend: http://localhost:3001/api/health
   - Frontend: http://localhost:5173

2. **Verificar configuración de CORS:**
   - Asegúrate de que `FRONTEND_URL=http://localhost:5173` esté en `backend/server/.env`

3. **Verificar variables de entorno del frontend:**
   - `VITE_API_BASE_URL=http://localhost:3001/api` debe estar en `frontend/.env`

4. **Reiniciar servicios:**
   ```bash
   # Detener procesos
   Ctrl+C en las terminales

   # Reiniciar
   node start-system.js
   ```

### MongoDB no se conecta

1. **Verificar que MongoDB esté ejecutándose:**
   ```bash
   # Windows
   net start MongoDB

   # macOS
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

2. **Verificar URI de conexión en `backend/server/.env`:**
   ```
   MONGODB_URI=mongodb://localhost:27017/sistema_siniestros
   ```

### Puertos ocupados

Si los puertos 3001 o 5173 están ocupados:

1. **Cambiar puertos en configuración:**
   - Backend: Modificar `PORT` en `backend/server/.env`
   - Frontend: Modificar `VITE_API_BASE_URL` en `frontend/.env`

2. **Buscar procesos usando los puertos:**
   ```bash
   # Windows
   netstat -ano | findstr :3001

   # Linux/macOS
   lsof -i :3001
   ```

## 📁 Estructura del Proyecto

```
sistema-siniestros/
├── start-system.js          # Script de inicio automático
├── config-verification.js   # Verificación de configuración
├── backend/
│   └── server/
│       ├── server.js        # Servidor Express
│       ├── .env            # Variables de entorno backend
│       └── models/         # Modelos MongoDB
├── frontend/
│   ├── src/
│   │   ├── services/       # Servicios API
│   │   └── components/     # Componentes React
│   └── .env               # Variables de entorno frontend
└── README.md
```

## 🔒 Seguridad

- Autenticación JWT
- Contraseñas hasheadas con bcrypt
- Validación de entrada
- Configuración CORS

## 📞 Soporte

Para soporte técnico o reportar issues, por favor contacta al equipo de desarrollo.