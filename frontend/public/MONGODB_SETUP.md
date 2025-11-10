## Instalación y Configuración

### 1. Instalar MongoDB

#### Windows:
- Descargar MongoDB Community Server desde: https://www.mongodb.com/try/download/community
- Instalar siguiendo el asistente
- MongoDB se ejecutará automáticamente como servicio

### 2. Configurar el Backend

1. **Navegar al directorio del servidor:**
```bash
cd server
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
# Copiar archivo de ejemplo
cp config.env.example .env

# Editar el archivo .env con tus configuraciones
```

**Contenido del archivo `.env`:**
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/sistema_siniestros

# JWT Secret (cambiar por una clave segura)
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui

# Server Configuration
PORT=3001

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 3. Iniciar el Servidor Backend

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:3001`

### 4. Crear Usuarios por Defecto

Una vez que el servidor esté ejecutándose, puedes crear los usuarios por defecto:

```bash
# Hacer una petición POST a la API
curl -X POST http://localhost:3001/api/auth/create-default-users
```

O usar un cliente REST como Postman:
- **URL:** `POST http://localhost:3001/api/auth/create-default-users`
- **Headers:** `Content-Type: application/json`

### 5. Configurar el Frontend

1. **Instalar dependencias del frontend:**
```bash
# En el directorio raíz del proyecto
npm install
```

2. **Iniciar el frontend:**
```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## Credenciales por Defecto

Una vez creados los usuarios por defecto, puedes usar:

- **Administrador:** `admin` / `1234`
- **Cliente:** `cliente` / `5678`

## Estructura de la Base de Datos

### Colección: `siniestros`
```javascript
{
  _id: ObjectId,
  rut: String,
  nombreCliente: String,
  numeroPoliza: String,
  patente: String,
  marca: String,
  modelo: String,
  tipoDanio: String,
  tipoVehiculo: String,
  email: String,
  telefono: String,
  tipoSeguro: String,
  fechaRegistro: Date,
  fechaActualizacion: Date,
  estado: String,
  liquidador: String,
  grua: String,
  taller: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Colección: `users`
```javascript
{
  _id: ObjectId,
  username: String,
  password: String (hasheada),
  userType: String,
  email: String,
  nombre: String,
  activo: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/verify` - Verificar token
- `POST /api/auth/create-default-users` - Crear usuarios por defecto

### Siniestros
- `GET /api/siniestros` - Obtener todos los siniestros
- `POST /api/siniestros` - Crear siniestro (solo admin)
- `GET /api/siniestros/buscar` - Buscar siniestros
- `GET /api/siniestros/:id` - Obtener siniestro por ID
- `PATCH /api/siniestros/:id/estado` - Actualizar estado (solo admin)
- `GET /api/siniestros/estadisticas` - Obtener estadísticas
- `GET /api/siniestros/recientes` - Obtener siniestros recientes

## Solución de Problemas

### Error de Conexión a MongoDB
```bash
# Verificar que MongoDB esté ejecutándose
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS
```

### Error de Puerto en Uso
```bash
# Cambiar puerto en el archivo .env
PORT=3002
```

### Error de CORS
Verificar que `FRONTEND_URL` en el archivo `.env` coincida con la URL del frontend.

## Comandos Útiles

```bash
# Ver logs del servidor
npm run dev

# Verificar conexión a MongoDB
mongo --eval "db.adminCommand('ismaster')"

# Limpiar base de datos (cuidado!)
mongo sistema_siniestros --eval "db.dropDatabase()"
```

## Próximos Pasos

1. Configurar MongoDB Atlas para producción
2. Implementar backup automático
3. Agregar más validaciones
4. Implementar logs de auditoría
5. Configurar SSL/HTTPS
