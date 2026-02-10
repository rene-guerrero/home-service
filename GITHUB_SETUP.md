# 🔧 Configuración de GitHub para Almacenamiento de Imágenes

Esta guía te ayudará a configurar GitHub como sistema de almacenamiento para las imágenes de tu galería.

---

## 📋 ¿Cómo Funciona?

1. **Subes imágenes** desde el panel de administración
2. Las imágenes se guardan en la carpeta `/pictures/` de tu repositorio de GitHub
3. Se actualiza automáticamente el archivo `data/gallery.json` con la metadata
4. GitHub hace commit automático de los cambios
5. Cloudflare Pages detecta el cambio y **redespliega el sitio** (1-2 minutos)
6. Las imágenes aparecen en la galería pública

---

## 🚀 Paso 1: Crear Personal Access Token de GitHub

### 1.1 Ir a GitHub Settings

1. Ve a https://github.com/settings/tokens/new
2. O navega: **GitHub** → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token**

### 1.2 Configurar el Token

- **Note**: `Home Service Gallery Admin` (o el nombre que prefieras)
- **Expiration**: `No expiration` o `90 days` (recomendado renovar cada 90 días)
- **Select scopes**: ✅ **repo** (marcar todo el grupo repo)
  - ✅ repo:status
  - ✅ repo_deployment
  - ✅ public_repo
  - ✅ repo:invite
  - ✅ security_events

### 1.3 Generar y Copiar

1. Click en **Generate token**
2. **¡IMPORTANTE!** Copia el token inmediatamente (empieza con `ghp_...`)
3. Guárdalo en un lugar seguro (solo se muestra una vez)

---

## ⚙️ Paso 2: Configurar en el Panel Admin

### 2.1 Abrir el Panel

1. Ve a tu sitio: `https://tu-sitio.pages.dev/admin-login.html`
2. Login con: `admin` / `admin123`

### 2.2 Configurar GitHub

Verás una alerta amarilla que dice **"Configuración de GitHub Requerida"**.

1. Click en **"Configurar Ahora"**
2. Completa el formulario:

**Usuario/Organización:**
```
tu-usuario-github
```
(Tu nombre de usuario de GitHub, ejemplo: `juanperez`)

**Repositorio:**
```
nombre-del-repo
```
(El nombre de tu repositorio, ejemplo: `home-service`)

**Personal Access Token:**
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
(El token que copiaste en el Paso 1)

**Branch:**
```
main
```
(Por defecto es `main`, cámbialo solo si usas otro branch)

3. Click en **"Guardar Configuración"**

---

## 📸 Paso 3: Subir tu Primera Imagen

1. En el panel admin, ve a **"Subir Nueva Imagen"**
2. Arrastra una imagen o haz click para seleccionar
3. Completa:
   - **Título**: "Mi primera imagen"
   - **Descripción**: "Descripción de prueba"
4. Click en **"Agregar a Galería"**

### ¿Qué Sucede?

1. La imagen se sube a GitHub en `/pictures/`
2. Se actualiza `data/gallery.json`
3. Se hace commit automático
4. **Espera 1-2 minutos** para que Cloudflare Pages redespliege
5. Recarga la página principal y verás la imagen en la galería

---

## 🔍 Verificar en GitHub

1. Ve a tu repositorio en GitHub
2. Navega a la carpeta **`pictures/`**
3. Deberías ver tu imagen (ej: `abc123xyz.jpg`)
4. Ve al archivo **`data/gallery.json`**
5. Deberías ver la metadata de tu imagen

---

## ⚠️ Consideraciones Importantes

### Límites de GitHub

- **Tamaño máximo de archivo**: 100MB (nuestra app limita a 5MB)
- **Repositorio gratuito**: 1GB de almacenamiento
- **Para ~200 imágenes de 500KB**: ~100MB (muy por debajo del límite)

### Tiempo de Despliegue

- Cloudflare Pages detecta cambios en GitHub automáticamente
- El redespliegue toma **1-2 minutos**
- No verás las imágenes inmediatamente, ten paciencia

### Seguridad del Token

- Tu token se guarda **localmente en tu navegador** (LocalStorage)
- Nunca se comparte ni se sube a GitHub
- Solo tú tienes acceso en el navegador donde hiciste login
- Si cambias de navegador, deberás configurar nuevamente

---

## 🔐 Seguridad Avanzada (Opcional)

### Renovar Token Periódicamente

Es buena práctica renovar el token cada 90 días:

1. Crear nuevo token en GitHub
2. Ir al panel admin → Configuración
3. Actualizar el token

### Usar Fine-grained Tokens (Beta)

GitHub ofrece tokens más específicos:

1. Ve a https://github.com/settings/tokens?type=beta
2. Click en **Generate new token**
3. **Repository access**: Solo tu repositorio específico
4. **Permissions**: 
   - Repository permissions → Contents: Read and write
5. Generar y usar este token

---

## 🐛 Solución de Problemas

### Error: "401 Unauthorized" al subir imagen

**Causa**: Token inválido o sin permisos

**Solución**:
1. Verifica que copiaste el token completo
2. Verifica que marcaste el scope **repo**
3. Genera un nuevo token si es necesario

### Error: "404 Not Found"

**Causa**: Repositorio o usuario incorrecto

**Solución**:
1. Verifica el nombre de usuario (es case-sensitive)
2. Verifica el nombre del repositorio (es case-sensitive)
3. Ejemplo correcto: `JuanPerez` / `home-service`

### Las imágenes no aparecen en la galería pública

**Causa**: Cloudflare Pages aún no ha redesplegado

**Solución**:
1. Espera 1-2 minutos
2. Ve a Cloudflare Dashboard → Pages → Tu proyecto → Deployments
3. Verifica que hay un nuevo deployment en progreso
4. Espera a que termine y recarga la página

### Error: "422 Unprocessable Entity"

**Causa**: El archivo ya existe o problema con el branch

**Solución**:
1. Verifica que el branch sea correcto (`main` o `master`)
2. Si el error persiste, elimina manualmente la imagen de GitHub y vuelve a intentar

---

## 📊 Monitoreo

### Ver Commits en GitHub

1. Ve a tu repositorio
2. Click en **Commits**
3. Verás commits como: "Add image: Mi primera imagen"

### Ver Deploys en Cloudflare

1. Dashboard → Pages → Tu proyecto
2. Tab **Deployments**
3. Cada push a GitHub activa un nuevo deployment

---

## 💡 Tips

### Nombres de Archivo

- Se generan automáticamente con IDs únicos
- Ejemplo: `ltx9k2abc.jpg`
- No hay conflictos de nombres

### Formato Recomendado

- **JPG**: Para fotografías (menor tamaño)
- **PNG**: Para imágenes con transparencia
- **WebP**: Mejor compresión (navegadores modernos)

### Optimizar Imágenes Antes de Subir

Para mejor rendimiento, optimiza tus imágenes:
- Usa herramientas como TinyPNG, Squoosh, etc.
- Tamaño recomendado: 1920px de ancho máximo
- Peso recomendado: 200-500KB por imagen

---

## 🔄 Workflow Completo

```
1. Admin sube imagen en el panel
          ↓
2. JavaScript envía imagen a GitHub API
          ↓
3. GitHub guarda imagen en /pictures/
          ↓
4. GitHub actualiza data/gallery.json
          ↓
5. GitHub hace commit automático
          ↓
6. Cloudflare Pages detecta cambio
          ↓
7. Cloudflare redespliega sitio (1-2 min)
          ↓
8. Nueva imagen visible en galería pública
```

---

## ✅ Checklist de Configuración

- [ ] Token de GitHub creado con scope `repo`
- [ ] Token copiado y guardado en lugar seguro
- [ ] Panel admin abierto y logueado
- [ ] Configuración de GitHub completada en el panel
- [ ] Primera imagen subida de prueba
- [ ] Esperado 1-2 minutos para redespliegue
- [ ] Imagen verificada en `/pictures/` en GitHub
- [ ] Imagen visible en la página principal

---

## 🎓 Recursos Adicionales

- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)

---

**¡Listo! Tu galería ahora usa GitHub como almacenamiento.** 🎉

**Ventajas:**
- ✅ 100% gratis, sin tarjeta de crédito
- ✅ 1GB de almacenamiento (suficiente para cientos de imágenes)
- ✅ Control total de tus datos
- ✅ Versionado incluido (historial de cambios)
- ✅ Backup automático en GitHub
