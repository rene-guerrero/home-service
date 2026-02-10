# 📚 Documentación del Sistema de Administración

## 🎯 Descripción General

Sistema completo de administración con autenticación y CRUD de imágenes para el sitio **Home Service HLG**, diseñado específicamente para funcionar en **Cloudflare Pages** (hosting estático).

---

## 🚀 Características

### ✅ Sistema de Autenticación
- Login seguro con usuario y contraseña
- Contraseñas encriptadas con SHA-256
- Sesiones persistentes con tokens (24 horas de duración)
- Protección de páginas administrativas

### 📸 Gestión de Galería (CRUD Completo)
- **Crear**: Subir imágenes con título y descripción
- **Leer**: Visualizar galería completa
- **Actualizar**: Editar título y descripción de imágenes
- **Eliminar**: Borrar imágenes de la galería

### 💾 Almacenamiento
- LocalStorage del navegador (sin necesidad de base de datos)
- Imágenes almacenadas en formato Base64
- Límite de 2MB por imagen
- Formatos soportados: JPG, PNG, GIF, WebP

### 🌐 Galería Pública
- Nueva sección en la página principal
- Carga dinámica de imágenes
- Diseño responsivo con Bootstrap 5
- Efectos hover elegantes

---

## 📁 Estructura de Archivos Creados

```
/
├── admin-login.html           # Página de login
├── admin-panel.html           # Panel de administración
├── scripts/
│   ├── auth.js               # Sistema de autenticación
│   ├── storage.js            # Gestión de almacenamiento
│   ├── gallery.js            # Galería pública
│   └── admin-panel.js        # Lógica del panel admin
├── styles/
│   └── admin.css             # Estilos del sistema admin
└── index.html                # (Modificado) Incluye nueva sección galería
```

---

## 🔐 Credenciales por Defecto

```
Usuario: admin
Contraseña: admin123
```

**⚠️ IMPORTANTE**: Se recomienda cambiar la contraseña después del primer login.

---

## 📖 Guía de Uso

### Para el Administrador

#### 1. Acceder al Panel Admin
1. Ir a: `https://tu-sitio.pages.dev/admin-login.html`
2. Ingresar credenciales (admin / admin123)
3. Click en "Iniciar Sesión"

#### 2. Subir Imágenes
1. En el panel admin, hacer click en "Seleccionar Imagen" o arrastrar una imagen
2. Llenar el título (obligatorio) y descripción (opcional)
3. Click en "Agregar a Galería"
4. La imagen aparecerá inmediatamente en la galería

#### 3. Editar Imágenes
1. Localizar la imagen en la galería del panel
2. Click en botón "Editar"
3. Modificar título o descripción
4. Click en "Guardar Cambios"

#### 4. Eliminar Imágenes
1. Localizar la imagen en la galería del panel
2. Click en botón "Eliminar"
3. Confirmar la eliminación

#### 5. Cerrar Sesión
- Click en "Cerrar Sesión" en la esquina superior derecha

### Para los Visitantes

Las imágenes subidas por el admin se mostrarán automáticamente en la página principal en la sección **"Nuestra Galería"** (antes del footer).

---

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura de páginas
- **CSS3**: Estilos personalizados
- **Bootstrap 5**: Framework CSS responsivo
- **JavaScript Vanilla**: Lógica del sistema (sin frameworks)
- **LocalStorage API**: Almacenamiento persistente
- **Web Crypto API**: Encriptación SHA-256
- **FileReader API**: Conversión de imágenes a Base64

---

## 💡 Ventajas para Cloudflare Pages

✅ **Sin backend necesario**: 100% cliente, funciona en hosting estático  
✅ **Sin costos adicionales**: No requiere base de datos ni servicios externos  
✅ **Deploy inmediato**: Funciona al momento del deploy  
✅ **Sin configuración**: No necesita variables de entorno ni secrets  
✅ **Portable**: Los datos están en el navegador del admin  

---

## ⚠️ Limitaciones y Consideraciones

### Almacenamiento
- Los datos se guardan **solo en el navegador** del administrador
- Si se limpia el LocalStorage, se pierden todos los datos
- Límite típico de LocalStorage: ~5-10MB total
- Recomendado para galerías pequeñas-medianas (10-30 imágenes)

### Backup Manual
Para hacer backup de las imágenes:
1. Abrir DevTools (F12)
2. Ir a "Application" > "Local Storage"
3. Copiar el contenido de `gallery_images`
4. Guardar en un archivo de texto

Para restaurar:
1. Pegar el contenido copiado en `gallery_images`
2. Refrescar la página

### Seguridad
- Las contraseñas están hasheadas con SHA-256
- El sistema es adecuado para un solo administrador
- No hay protección contra ataques de fuerza bruta
- Recomendado para uso en entornos confiables

---

## 🎨 Personalización

### Cambiar Credenciales por Defecto

Editar `scripts/auth.js`, línea 13-17:
```javascript
const defaultUser = {
  username: 'tu-usuario',
  passwordHash: this.hashPassword('tu-contraseña'),
  createdAt: new Date().toISOString()
};
```

### Cambiar Duración de Sesión

Editar `scripts/auth.js`, línea 5:
```javascript
this.SESSION_DURATION = 48 * 60 * 60 * 1000; // 48 horas
```

### Cambiar Límite de Tamaño de Imagen

Editar `scripts/storage.js`, línea 5:
```javascript
this.MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
```

---

## 🧪 Testing

Se incluye una página de pruebas: `tmp_rovodev_test_system.html`

Permite probar:
- ✅ Carga de scripts
- ✅ Sistema de autenticación
- ✅ Sistema de almacenamiento
- ✅ Agregar imágenes de prueba
- ✅ Ver estado del LocalStorage

---

## 🔗 Accesos Rápidos

Desde la página principal:
- Footer inferior derecho: Link "Admin" (ícono de candado)

Desde el navegador:
- Login: `/admin-login.html`
- Panel: `/admin-panel.html`
- Tests: `/tmp_rovodev_test_system.html`

---

## 📞 Soporte

Para problemas o dudas sobre el sistema de administración, verificar:

1. **Consola del navegador** (F12) para errores JavaScript
2. **LocalStorage** en DevTools > Application
3. **Permisos del navegador** para almacenamiento local
4. **Límites de cuota** del LocalStorage

---

## 📝 Notas Adicionales

### Compatible con:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Todos los navegadores modernos

### No compatible con:
- ❌ Internet Explorer
- ❌ Navegadores muy antiguos sin soporte de ES6

---

**Desarrollado para Home Service HLG**  
Sistema de administración simple y efectivo para Cloudflare Pages
