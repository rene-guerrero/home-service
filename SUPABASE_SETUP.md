# 🔧 Configuración de Supabase

Guía paso a paso para configurar Supabase Storage y Base de Datos.

---

## 📦 Paso 1: Crear Storage Bucket

### 1.1 Ir a Storage
1. En el Dashboard de Supabase: https://supabase.com/dashboard/project/hewtiscwxdvodggrmigo
2. Click en **Storage** en el menú lateral
3. Click en **Create a new bucket**

### 1.2 Configurar el Bucket
- **Name**: `gallery`
- **Public bucket**: ✅ **Activar** (importante!)
- **File size limit**: `5 MB`
- **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`

### 1.3 Crear el Bucket
- Click en **Create bucket**

---

## 🗄️ Paso 2: Crear Tabla de Imágenes

### 2.1 Ir a SQL Editor
1. En el menú lateral, click en **SQL Editor**
2. Click en **New query**

### 2.2 Ejecutar este SQL

Copia y pega este código:

```sql
-- Crear tabla de imágenes
CREATE TABLE images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  url TEXT NOT NULL,
  size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índice para búsquedas más rápidas
CREATE INDEX idx_images_created_at ON images(created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer (galería pública)
CREATE POLICY "Public read access"
  ON images
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Política: Solo usuarios autenticados pueden insertar
CREATE POLICY "Authenticated insert access"
  ON images
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden actualizar
CREATE POLICY "Authenticated update access"
  ON images
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden eliminar
CREATE POLICY "Authenticated delete access"
  ON images
  FOR DELETE
  TO anon
  USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE TRIGGER update_images_updated_at
  BEFORE UPDATE ON images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE images IS 'Almacena metadata de las imágenes de la galería';
COMMENT ON COLUMN images.id IS 'ID único de la imagen (UUID)';
COMMENT ON COLUMN images.title IS 'Título de la imagen';
COMMENT ON COLUMN images.description IS 'Descripción opcional';
COMMENT ON COLUMN images.filename IS 'Nombre del archivo';
COMMENT ON COLUMN images.file_path IS 'Path del archivo en Storage';
COMMENT ON COLUMN images.url IS 'URL pública de la imagen';
COMMENT ON COLUMN images.size IS 'Tamaño del archivo en bytes';
COMMENT ON COLUMN images.mime_type IS 'Tipo MIME del archivo';
```

### 2.3 Ejecutar
- Click en **Run** (o presiona `Ctrl+Enter`)
- Deberías ver: `Success. No rows returned`

---

## 🔐 Paso 3: Configurar Storage Policies

### 3.1 Ir a Storage Policies
1. Click en **Storage** en el menú lateral
2. Click en el bucket **gallery**
3. Click en la pestaña **Policies**

### 3.2 Crear Política de Lectura Pública

Click en **New policy** → **For full customization** → Crea esta política:

**Policy name**: `Public read access`

**Allowed operation**: `SELECT`

**Target roles**: `anon, authenticated`

**USING expression**:
```sql
true
```

Click **Review** → **Save policy**

### 3.3 Crear Política de Inserción

Click en **New policy** → Crea esta política:

**Policy name**: `Public insert access`

**Allowed operation**: `INSERT`

**Target roles**: `anon`

**WITH CHECK expression**:
```sql
true
```

Click **Review** → **Save policy**

### 3.4 Crear Política de Eliminación

Click en **New policy** → Crea esta política:

**Policy name**: `Public delete access`

**Allowed operation**: `DELETE`

**Target roles**: `anon`

**USING expression**:
```sql
true
```

Click **Review** → **Save policy**

---

## ✅ Verificar Configuración

### Verificar Bucket
1. **Storage** → Deberías ver el bucket `gallery`
2. Debería decir **Public** al lado

### Verificar Tabla
1. **Table Editor** → Deberías ver la tabla `images`
2. Debería tener las columnas: id, title, description, filename, etc.

### Verificar Policies
1. **Storage** → `gallery` → **Policies** → Deberías ver 3 políticas
2. **Authentication** → **Policies** → Tabla `images` → Deberías ver 4 políticas

---

## 🎉 ¡Listo!

Tu Supabase está configurado correctamente. Ahora puedes:
- Subir imágenes instantáneamente
- Almacenar cualquier tipo de archivo
- Base de datos PostgreSQL lista para usar

---

## 🐛 Solución de Problemas

### Error: "new row violates row-level security policy"

**Solución**: Verifica que las políticas RLS estén creadas correctamente.

### Error: "permission denied for table images"

**Solución**: Asegúrate de haber habilitado RLS y creado las políticas.

### El bucket no es público

**Solución**: 
1. Storage → gallery → Settings
2. Activa **Public bucket**
3. Guarda

---

**Continúa con la implementación después de completar estos pasos.**
