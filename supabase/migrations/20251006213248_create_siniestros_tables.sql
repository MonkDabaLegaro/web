/*
  # Sistema de Siniestros - Tablas Principales

  1. Tablas Creadas
    - `siniestros`: Almacena todos los siniestros vehiculares
      - `id` (uuid, primary key): Identificador único
      - `rut` (text): RUT del asegurado
      - `numero_poliza` (text): Número de póliza
      - `tipo_seguro` (text): Tipo de seguro (Automotriz, Colisión, Robo)
      - `vehiculo` (text): Información del vehículo
      - `descripcion` (text): Descripción del siniestro
      - `estado` (text): Estado actual (Ingresado, En Evaluación, Finalizado, Activo)
      - `liquidador` (text): Nombre del liquidador asignado
      - `grua` (text): Grúa asignada
      - `taller` (text): Taller asignado
      - `fecha_registro` (timestamptz): Fecha de registro
      - `fecha_actualizacion` (timestamptz): Fecha de última actualización
      - `created_at` (timestamptz): Marca temporal de creación

  2. Seguridad
    - Se habilita RLS en la tabla `siniestros`
    - Políticas para usuarios autenticados:
      - Leer todos los siniestros
      - Crear nuevos siniestros
      - Actualizar siniestros existentes
*/

-- Crear tabla de siniestros
CREATE TABLE IF NOT EXISTS siniestros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rut text NOT NULL,
  numero_poliza text NOT NULL,
  tipo_seguro text NOT NULL,
  vehiculo text NOT NULL,
  descripcion text DEFAULT '',
  estado text DEFAULT 'Ingresado',
  liquidador text NOT NULL,
  grua text NOT NULL,
  taller text NOT NULL,
  fecha_registro timestamptz DEFAULT now(),
  fecha_actualizacion timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE siniestros ENABLE ROW LEVEL SECURITY;

-- Política para lectura (todos los usuarios autenticados pueden leer)
CREATE POLICY "Usuarios pueden leer siniestros"
  ON siniestros
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para inserción
CREATE POLICY "Usuarios pueden crear siniestros"
  ON siniestros
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para actualización
CREATE POLICY "Usuarios pueden actualizar siniestros"
  ON siniestros
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_siniestros_rut ON siniestros(rut);
CREATE INDEX IF NOT EXISTS idx_siniestros_poliza ON siniestros(numero_poliza);
CREATE INDEX IF NOT EXISTS idx_siniestros_estado ON siniestros(estado);
CREATE INDEX IF NOT EXISTS idx_siniestros_fecha ON siniestros(fecha_registro DESC);