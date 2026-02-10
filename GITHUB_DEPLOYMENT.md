# 🚀 Guía de Despliegue con GitHub Storage

Guía completa para desplegar tu sitio en Cloudflare Pages usando GitHub como almacenamiento de imágenes.

---

## 📋 Requisitos

- ✅ Cuenta de GitHub (gratis)
- ✅ Cuenta de Cloudflare (gratis)
- ✅ Repositorio con tu código
- ❌ **NO se requiere tarjeta de crédito**

---

## 🎯 Resumen del Sistema

**Almacenamiento:** GitHub (repositorio)
**Hosting:** Cloudflare Pages
**Admin:** LocalStorage (autenticación)
**Costo:** $0 USD

### ¿Cómo funciona?

1. Admin sube imagen desde el panel
2. Imagen se guarda en `/pictures/` via GitHub API
3. `data/gallery.json` se actualiza automáticamente
4. GitHub hace commit
5. Cloudflare Pages detecta el cambio y redespliega
6. Imagen visible en la galería pública (1-2 min después)

---

## 🔧 Paso 1: Preparar el Repositorio

### 1.1 Crear/Actualizar Repositorio

Si aún no has subido el código:

```bash
git add .
git commit -m "Sistema admin con GitHub storage"
git push origin main
```

### 1.2 Verificar Estructura

Tu repositorio debe tener:

```
/
├── index.html
├── admin-login.html
├── admin-panel.html
├── data/
│   └── gallery.json
├── pictures/
│   ├── 001.jpg
│   ├── 002.jpg
│   └── ... (imágenes existentes)
├── scripts/
│   ├── auth.js
│   ├── storage-github.js
│   ├── gallery-github.js
│   └── admin-panel.js
└── styles/
    └── admin.css
```

---

## 🎫 Paso 2: Crear Personal Access Token

### 2.1 Generar Token

1. Ve a https://github.com/settings/tokens/new
2. Configuración:
   - **Note**: `Gallery Admin Token`
   - **Expiration**: `No expiration` o `90 days`
   - **Scopes**: ✅ **repo** (todo el grupo)
3. Click **Generate token**
4. **¡Copia el token!** (empieza con `ghp_...`)

### 2.2 Guardar Token

Guarda el token en un lugar seguro. Lo necesitarás para configurar el panel admin.

---

## ☁️ Paso 3: Desplegar en Cloudflare Pages

### 3.1 Conectar Repositorio

1. Ve a https://dash.cloudflare.com
2. Click en **Pages** en el menú lateral
3. Click en **Create a project**
4. Click en **Connect to Git**
5. Autoriza Cloudflare a acceder a GitHub
6. Selecciona tu repositorio

### 3.2 Configurar Build

**Project name:** `home-service` (o el que prefieras)

**Production branch:** `main`

**Build settings:**
- Framework preset: `None`
- Build command: *(dejar vacío)*
- Build output directory: `/`

### 3.3 Deploy

1. Click en **Save and Deploy**
2. Espera 1-2 minutos
3. Tu sitio estará en: `https://home-service.pages.dev`

---

## ⚙️ Paso 4: Configurar GitHub en el Admin

### 4.1 Abrir Panel Admin

1. Ve a: `https://tu-sitio.pages.dev/admin-login.html`
2. Login: `admin` / `admin123`

### 4.2 Configurar GitHub

Verás un alerta amarilla: **"Configuración de GitHub Requerida"**

1. Click en **"Configurar Ahora"**
2. Completa el formulario:

```
Usuario/Organización: tu-usuario-github
Repositorio: nombre-del-repo
Personal Access Token: ghp_xxxxxxxxxxxx (el que copiaste)
Branch: main
```

3. Click en **"Guardar Configuración"**

---

## 🧪 Paso 5: Probar el Sistema

### 5.1 Subir Imagen de Prueba

1. En el panel admin, sube una imagen
2. Título: "Prueba de galería"
3. Descripción: "Imagen de prueba"
4. Click en **"Agregar a Galería"**

### 5.2 Verificar en GitHub

1. Ve a tu repositorio en GitHub
2. Navega a `/pictures/`
3. Deberías ver tu nueva imagen
4. Ve a `/data/gallery.json`
5. Deberías ver la metadata

### 5.3 Esperar Redespliegue

1. Ve a Cloudflare Dashboard → Pages → Tu proyecto
2. Tab **Deployments**
3. Verás un nuevo deployment en progreso
4. Espera 1-2 minutos

### 5.4 Verificar Galería Pública

1. Ve a: `https://tu-sitio.pages.dev/`
2. Desplázate a la sección **"Nuestra Galería"**
3. Tu imagen debería aparecer

---

## 🔐 Paso 6: Seguridad

### 6.1 Cambiar Contraseña de Admin

Una vez en producción, cambia la contraseña:

1. Abre DevTools (F12) > Console
2. Ejecuta:

```javascript
await authSystem.changePassword('admin', 'admin123', 'TuNuevaContraseñaSegura123!');
```

3. Cierra sesión y vuelve a iniciar con la nueva contraseña

### 6.2 Renovar Token Periódicamente

Recomendado cada 90 días:

1. Crear nuevo token en GitHub
2. Panel admin → Configuración → Actualizar token

---

## 📊 Límites y Capacidad

### GitHub (Gratis)

- ✅ **Almacenamiento**: 1GB
- ✅ **Tamaño de archivo**: 100MB (nuestra app limita a 5MB)
- ✅ **Commits**: Ilimitados
- ✅ **API calls**: 5000/hora

### Cloudflare Pages (Gratis)

- ✅ **Ancho de banda**: Ilimitado
- ✅ **Builds**: 500/mes
- ✅ **Sitios**: Ilimitados
- ✅ **Custom domains**: Ilimitados

### Capacidad Estimada

Con estos límites gratuitos puedes tener:
- **~200 imágenes** de 500KB = 100MB
- **~400 imágenes** de 250KB = 100MB
- **~1000 imágenes** de 100KB = 100MB

Muy por debajo del límite de 1GB.

---

## 🔄 Workflow de Actualización

### Subir Nueva Imagen

```
Panel Admin → Subir imagen → GitHub guarda → Cloudflare redespliega → Imagen visible
                                  ↓
                            ~30 segundos
                                  ↓
                           1-2 minutos total
```

### Editar Imagen

```
Panel Admin → Editar título/desc → Actualiza gallery.json → Cloudflare redespliega
                                          ↓
                                   1-2 minutos
```

### Eliminar Imagen

```
Panel Admin → Eliminar → GitHub borra archivo → Cloudflare redespliega
                               ↓
                         1-2 minutos
```

---

## 🐛 Solución de Problemas

### "401 Unauthorized"

**Problema**: Token inválido

**Solución**:
- Verifica que copiaste el token completo
- Verifica que tiene scope `repo`
- Genera nuevo token si es necesario

### "404 Not Found"

**Problema**: Repositorio no encontrado

**Solución**:
- Verifica usuario (case-sensitive)
- Verifica nombre del repo (case-sensitive)
- Ejemplo: `JuanPerez/home-service`

### Imagen no aparece en galería

**Problema**: Cloudflare aún no redesplegó

**Solución**:
- Espera 1-2 minutos
- Verifica deployment en Cloudflare Dashboard
- Recarga la página con Ctrl+F5

### Error "422 Unprocessable Entity"

**Problema**: Branch incorrecto o archivo ya existe

**Solución**:
- Verifica que el branch es `main` o `master`
- Si persiste, elimina manualmente y reintenta

---

## 💡 Tips Pro

### Optimizar Imágenes

Antes de subir:
1. Redimensiona a max 1920px de ancho
2. Comprime con TinyPNG o Squoosh
3. Usa JPG para fotos, PNG para gráficos

### Acelerar Deployment

- Cloudflare Pages cachea agresivamente
- Primera carga puede ser lenta
- Subsecuentes son instantáneas

### Backup Automático

Todo está en GitHub:
- Historial completo de commits
- Puedes revertir cambios
- Clone el repo = backup completo

---

## 📝 Checklist Completo

### Antes del Deploy

- [ ] Código commiteado en GitHub
- [ ] Personal Access Token creado
- [ ] Token guardado en lugar seguro

### Durante el Deploy

- [ ] Sitio desplegado en Cloudflare Pages
- [ ] URL de producción anotada
- [ ] Panel admin accesible

### Configuración Inicial

- [ ] GitHub configurado en panel admin
- [ ] Imagen de prueba subida
- [ ] Deployment verificado en Cloudflare
- [ ] Imagen visible en galería pública

### Post-Deploy

- [ ] Contraseña de admin cambiada
- [ ] Token renovación programada (90 días)
- [ ] Backups verificados

---

## 🎓 Recursos

- [GITHUB_SETUP.md](GITHUB_SETUP.md) - Configuración detallada
- [ADMIN_SYSTEM_DOCS.md](ADMIN_SYSTEM_DOCS.md) - Docs del sistema
- [GitHub API](https://docs.github.com/en/rest)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)

---

## ✅ Ventajas de Esta Solución

1. **100% Gratis**
   - No requiere tarjeta de crédito
   - Sin costos ocultos
   - Límites generosos

2. **Simple y Confiable**
   - Solo GitHub + Cloudflare
   - No hay backends complejos
   - Todo estático

3. **Control Total**
   - Tus datos en tu repo
   - Versionado incluido
   - Fácil de auditar

4. **Escalable**
   - 1GB de almacenamiento
   - Suficiente para cientos de imágenes
   - Fácil de migrar si creces

---

**¡Tu sitio está listo para producción!** 🎉

Cualquier duda, revisa la documentación o abre un issue en GitHub.
