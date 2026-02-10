# 🔐 Cómo Cambiar la Contraseña de Admin

## 🎯 Credenciales Iniciales

**Por defecto, el sistema viene con:**
- Usuario: `admin`
- Contraseña: `admin123`

⚠️ **IMPORTANTE:** Debes cambiar la contraseña inmediatamente después del primer despliegue en producción.

---

## 📝 Métodos para Cambiar la Contraseña

### Método 1: Desde la Consola del Navegador (Recomendado)

1. **Accede a tu sitio en producción:**
   ```
   https://tu-sitio.pages.dev/admin-login.html
   ```

2. **Inicia sesión con las credenciales por defecto:**
   - Usuario: `admin`
   - Contraseña: `admin123`

3. **Abre DevTools:**
   - Presiona `F12` (Windows/Linux) o `Cmd+Option+I` (Mac)
   - Ve a la pestaña **Console**

4. **Ejecuta este comando:**
   ```javascript
   await authSystem.changePassword('admin', 'admin123', 'TuNuevaContraseñaSegura123!');
   ```
   
   Reemplaza `'TuNuevaContraseñaSegura123!'` con tu contraseña deseada.

5. **Verás un mensaje de confirmación:**
   ```
   {success: true, message: "Contraseña actualizada correctamente"}
   ```

6. **Cierra sesión y vuelve a iniciar con la nueva contraseña**

---

### Método 2: Editar directamente el LocalStorage

**⚠️ Avanzado - Solo si el Método 1 no funciona**

1. **Accede a tu sitio y abre DevTools** (`F12`)

2. **Ve a la pestaña Application** (o Aplicación)

3. **En el menú lateral, expande Local Storage**

4. **Haz clic en tu dominio** (ej: `https://tu-sitio.pages.dev`)

5. **Busca la key `admin_users`**

6. **Genera el hash de tu nueva contraseña:**
   
   En la consola del navegador, ejecuta:
   ```javascript
   async function hashPassword(password) {
     const msgBuffer = new TextEncoder().encode(password);
     const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
     const hashArray = Array.from(new Uint8Array(hashBuffer));
     return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
   }
   
   // Reemplaza 'MiNuevaContraseña' con tu contraseña deseada
   const hash = await hashPassword('MiNuevaContraseña');
   console.log(hash);
   ```

7. **Copia el hash generado**

8. **Edita el valor de `admin_users`:**
   ```json
   [
     {
       "username": "admin",
       "passwordHash": "TU_HASH_AQUI",
       "createdAt": "2024-01-01T00:00:00.000Z"
     }
   ]
   ```

9. **Guarda y cierra sesión**

10. **Inicia sesión con la nueva contraseña**

---

### Método 3: Cambiar Antes del Primer Despliegue

**Si aún no has desplegado:**

1. **Edita el archivo `scripts/auth.js`**

2. **Busca la línea ~17-22:**
   ```javascript
   async initializeDefaultUser() {
     const users = this.getUsers();
     if (!users || users.length === 0) {
       const passwordHash = await this.hashPassword('admin123');
   ```

3. **Cambia `'admin123'` por tu contraseña:**
   ```javascript
   const passwordHash = await this.hashPassword('TuContraseñaSegura');
   ```

4. **Guarda y haz commit:**
   ```bash
   git add scripts/auth.js
   git commit -m "Change default admin password"
   git push
   ```

5. **Despliega en Cloudflare Pages**

6. **Ahora el admin inicial tendrá tu contraseña personalizada**

---

## 🔒 Recomendaciones de Seguridad

### Contraseña Fuerte

Tu contraseña debe tener:
- ✅ Mínimo 12 caracteres
- ✅ Letras mayúsculas y minúsculas
- ✅ Números
- ✅ Caracteres especiales (!@#$%^&*)

**Ejemplos de contraseñas fuertes:**
- `HomeService2024!Secure`
- `Galeria#Admin$2024`
- `MyS3cur3P@ssw0rd!`

### Mejores Prácticas

1. **Nunca compartas la contraseña** por correo o mensajes sin cifrar
2. **No uses la misma contraseña** que usas en otros sitios
3. **Cámbiala periódicamente** (cada 3-6 meses)
4. **Usa un gestor de contraseñas** (LastPass, 1Password, Bitwarden)
5. **No escribas la contraseña** en documentos sin cifrar

---

## 🧪 Verificar que Cambió

1. **Cierra la sesión actual**
2. **Intenta iniciar sesión con la contraseña antigua** (debería fallar)
3. **Inicia sesión con la nueva contraseña** (debería funcionar)

---

## 🐛 Solución de Problemas

### "No puedo cambiar la contraseña"

**Causa:** No tienes sesión activa

**Solución:**
1. Inicia sesión primero con `admin` / `admin123`
2. Luego ejecuta el comando de cambio de contraseña

### "Olvidé la nueva contraseña"

**Solución:**

Si olvidaste tu contraseña:

1. **Opción A - Desde DevTools:**
   - Abre DevTools (`F12`)
   - Application → Local Storage → Tu dominio
   - Elimina la key `admin_users`
   - Recarga la página
   - Se recreará el usuario con contraseña por defecto: `admin123`

2. **Opción B - Desde Console:**
   ```javascript
   localStorage.removeItem('admin_users');
   location.reload();
   ```

### "Error al cambiar la contraseña"

**Solución:**
1. Verifica que la contraseña actual sea correcta
2. Verifica que estés usando comillas correctamente
3. Intenta cerrar sesión y volver a iniciar

---

## 📊 Múltiples Usuarios (Avanzado)

El sistema actualmente soporta un solo usuario. Si necesitas múltiples administradores:

1. **Edita `admin_users` en LocalStorage**
2. **Agrega más usuarios manualmente:**
   ```json
   [
     {
       "username": "admin",
       "passwordHash": "hash_de_admin",
       "createdAt": "2024-01-01T00:00:00.000Z"
     },
     {
       "username": "admin2",
       "passwordHash": "hash_de_admin2",
       "createdAt": "2024-01-01T00:00:00.000Z"
     }
   ]
   ```

3. **Genera el hash con el script del Método 2**

---

## ✅ Checklist de Seguridad

Después de desplegar en producción:

- [ ] Inicié sesión con credenciales por defecto
- [ ] Cambié la contraseña a una fuerte
- [ ] Verifiqué que la nueva contraseña funciona
- [ ] Guardé la contraseña en un gestor seguro
- [ ] Cerré todas las sesiones de prueba
- [ ] Probé login desde navegador incógnito

---

**¡Tu panel admin ahora está seguro!** 🔒

Si tienes más dudas sobre seguridad, consulta la documentación de autenticación en `ADMIN_SYSTEM_DOCS.md`.
