# Sistema de Asistencia Vehicular
# Estructura del Sistema

# Tipos de Usuario
1. Administrador (Call Center)
- Usuario: `admin`
- Contraseña: `1234`
- Acceso: Completo al sistema
- Funciones: Registrar siniestros, consultar estados, ver reportes, gestionar casos

2. Cliente
- Usuario: `cliente` 
- Contraseña: `5678`
- Acceso: Limitado para consultar sus propios siniestros
- Funciones: Ver estado de casos, información de contacto, servicios disponibles

# Tecnologías Utilizadas

Frontend
- HTML5: Estructura semántica de las páginas
- CSS3: Estilos modernos con gradientes, animaciones y diseño responsivo
- JavaScript ES6+**: Lógica de la aplicación, validaciones y manejo de datos

Almacenamiento
- localStorage: Simula una base de datos local en el navegador
- JSON: Formato de datos para almacenar información de siniestros

Diseño
- Sistema de colores: Tema azul profesional (#2563eb como color principal)
- Tipografía: Fuentes del sistema (San Francisco, Segoe UI, Roboto)
- Iconografía: Imágenes PNG para representar estados y acciones
- Responsive: Compatible con dispositivos móviles y desktop

# Base de Datos Simulada
Estructura de Datos
El archivo `ejemplo_registro.txt` define los campos que simula una base de datos real:
```
ID_usuario|RUT|Nombre|Correo|Teléfono|Dirección|Nro_Póliza|Inicio_Cobertura|Fin_Cobertura|Tipo_Cobertura|Patente|ID_Siniestro|Fecha_Siniestro|Hora_Siniestro|Lugar_Siniestro|Descripción_Evento|Estado_Siniestro|Observaciones|Liquidador|Grúa_Patente|Chofer_Grúa|Punto_Retiro|Punto_Destino|Taller|Fecha_Ingreso_Taller|Acta_Recepción|Presupuesto_Monto|Presupuesto_Descripción|Presupuesto_Tiempo|Presupuesto_Doc|Fecha_Entrega_Estimada|Fecha_Entrega_Real|Acta_Retiro|Acta_Rechazo|Fecha_Registro
```

Campos Importantes
- RUT: Identificador único del cliente con formato chileno (12.345.678-9)
- Número de Póliza: Código que identifica la póliza de seguro
- Estado del Siniestro: 
  - `"Ingresado"`: Recién registrado en el sistema
  - `"En Evaluación"`: Liquidador asignado, evaluando daños
  - `"Finalizado"`: Proceso completado
- Liquidador: Persona especializada asignada para evaluar el siniestro
- Grúa: Servicio de grúa asignado para el traslado del vehículo
- Taller: Taller mecánico asignado para las reparaciones

## Flujo de Trabajo del Sistema
1. Proceso de Autenticación
1. Usuario accede a `login.html`
2. Ingresa credenciales (usuario/contraseña)
3. Sistema valida contra credenciales predefinidas
4. Se guarda el tipo de usuario en localStorage
5. Redirección automática:
   - **Admin** → `bienvenida.html` (Panel completo)
   - **Cliente** → `cliente.html` (Portal simplificado)

2. Registro de Siniestro (Solo Administradores)
1. Acceso desde el panel admin a `ingreso.html`
2. Completar formulario con datos obligatorios
3. **Validación automática del RUT**: Verifica formato y dígito verificador
4. **Asignación automática**: El sistema asigna liquidador, grúa y taller disponibles
5. Guardado en localStorage simulando base de datos
6. Confirmación con detalles del siniestro creado

### 3. **Consulta de Estado**
1. Ingreso de RUT y número de póliza
2. Búsqueda en la "base de datos" local (localStorage)
3. **Visualización del progreso** con barra de estados:
   - Iconos que cambian según el progreso
   - Colores que indican el estado actual
   - Información detallada de servicios asignados


### Validación de RUT Chileno
El sistema incluye validación completa del RUT:
- **Formato**: Acepta con o sin puntos y guión
- **Algoritmo**: Calcula y verifica el dígito verificador
- **Formateo**: Muestra automáticamente con puntos y guión (12.345.678-9)

### Gestión de Sesiones
- **localStorage**: Mantiene la sesión activa entre páginas
- **Verificación automática**: Cada página verifica si el usuario está autenticado
- **Redirección inteligente**: Recuerda la página solicitada antes del login
- **Logout seguro**: Limpia todos los datos de sesión

### Sistema de Iconos
- **folder.png**: Representa datos ingresados o nuevos registros
- **list.png**: Indica procesos en curso o evaluación
- **Checkmark.png**: Muestra procesos completados o exitosos

### Diseño Responsivo
- **Mobile-first**: Optimizado para dispositivos móviles
- **Breakpoints**: Adaptación automática a diferentes tamaños de pantalla
- **Grid y Flexbox**: Layouts modernos que se adaptan al contenido
- **Navegación adaptativa**: Menú que se reorganiza en pantallas pequeñas

## Arquitectura del Código

### Clases JavaScript Principales

#### `SiniestroManager`
Clase principal que gestiona todos los datos del sistema:
- **Métodos principales**:
  - `crearSiniestro()`: Registra un nuevo siniestro
  - `buscarSiniestro()`: Busca por RUT y póliza
  - `actualizarEstado()`: Cambia el estado de un siniestro
  - `getEstadisticas()`: Obtiene métricas del sistema

#Cómo Usar el Sistema

### Para Administradores
1. **Acceso**: Ir a `login.html`
2. **Login**: Usuario `admin`, contraseña `1234`
3. **Dashboard**: Acceso automático a `bienvenida.html`
4. **Funciones disponibles**:
   - Registrar nuevos siniestros
   - Consultar cualquier siniestro
   - Ver reportes y estadísticas
   - Gestionar el sistema completo

### Para Clientes
1. **Acceso**: Ir a `login.html`
2. **Login**: Usuario `cliente`, contraseña `5678`
3. **Portal**: Acceso automático a `cliente.html`
4. **Funciones disponibles**:
   - Consultar estado de sus siniestros
   - Ver información de servicios
   - Contactar soporte técnico

### Navegación del Sistema
- **Menú superior**: Navegación principal adaptativa según tipo de usuario
- **Breadcrumbs**: Indicadores visuales de la página actual
- **Botones de acción**: Accesos directos a funciones principales
- **Logout**: Disponible en todas las páginas autenticadas

## Próximos Pasos de Desarrollo

### ✅ Fase 1: Estructura Básica (Completada)
- [x] Sistema de login unificado
- [x] Páginas diferenciadas por tipo de usuario
- [x] Navegación coherente y responsiva
- [x] Diseño profesional con tema azul
- [x] Gestión de sesiones robusta

### 🔄 Fase 2: Funcionalidades Core (En Desarrollo)
- [ ] Validación completa de formularios
- [ ] Sistema de notificaciones en tiempo real
- [ ] Búsqueda avanzada de siniestros
- [ ] Exportación de reportes

### 📋 Fase 3: Funcionalidades Avanzadas (Planificada)
- Integración con APIs externas
- Sistema de notificaciones por email
- Dashboard interactivo con filtros
- Gestión de usuarios y permisos


### Sistema de Colores
- **Azul Principal**: `#2563eb` - Botones primarios, enlaces activos
- **Azul Secundario**: `#1d4ed8` - Hover states, gradientes
- **Azul Claro**: `#3b82f6`, `#60a5fa` - Elementos secundarios
- **Grises**: `#f8f9fa`, `#e5e7eb` - Fondos y bordes
- **Verde**: `#10b981` - Estados completados
- **Amarillo**: `#fbbf24` - Alertas y advertencias

### Iconografía del Sistema
- **folder.png**: 
  - Representa datos nuevos o ingresados
  - Usado en: Nuevos siniestros, documentos, registros
- **list.png**: 
  - Indica procesos en curso o listas
  - Usado en: Evaluaciones, consultas, procesos
- **Checkmark.png**: 
  - Muestra completado o éxito
  - Usado en: Finalizados, confirmaciones, éxito

### Principios de Diseño
- **Consistencia**: Mismo patrón visual en todas las páginas
- **Jerarquía**: Uso de tamaños, colores y espaciado para guiar la atención
- **Accesibilidad**: Contraste adecuado, textos legibles, navegación clara
- **Responsive**: Adaptación fluida a diferentes dispositivos


### Autenticación
- **Credenciales hardcodeadas**: Para propósitos de demostración
- **Sesiones locales**: Usando localStorage del navegador
- **Verificación por página**: Cada página verifica autenticación
- **Logout seguro**: Limpieza completa de datos de sesión