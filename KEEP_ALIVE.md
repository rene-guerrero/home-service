# 🔄 Sistema Keep-Alive para Supabase

Este repositorio incluye un GitHub Action que mantiene activo tu proyecto de Supabase automáticamente.

---

## 🎯 ¿Por qué es necesario?

Supabase pausa proyectos gratuitos después de **1 semana de inactividad**. Este workflow previene eso haciendo ping cada 6 días.

---

## ⚙️ Configuración

### El workflow ya está configurado:

**Archivo:** `.github/workflows/keep-supabase-active.yml`

**Programación:** Cada 6 días a las 3:00 AM UTC

**Acciones:**
1. Hace una consulta a la tabla `images`
2. Lista los buckets de Storage
3. Mantiene el proyecto activo

---

## ✅ Verificar que funciona

### Opción 1: Ejecutar Manualmente (Recomendado para probar)

1. Ve a tu repositorio en GitHub
2. Click en **Actions** (pestaña superior)
3. En el menú lateral, click en **"Keep Supabase Active"**
4. Click en **"Run workflow"** (botón derecho)
5. Click en el botón verde **"Run workflow"**
6. Espera ~30 segundos
7. Verás un círculo verde ✅ si funcionó

### Opción 2: Esperar a la Ejecución Automática

El workflow se ejecutará automáticamente cada 6 días. Puedes ver el historial en:
- GitHub → Tu repo → Actions → Keep Supabase Active

---

## 📊 Monitoreo

### Ver logs de ejecuciones:

1. GitHub → Actions → Keep Supabase Active
2. Click en cualquier ejecución
3. Click en "ping-supabase"
4. Verás los logs detallados

**Ejemplo de log exitoso:**
```
✅ Ping exitoso! Código HTTP: 200
📊 Respuesta: [{"count":5}]
✅ Storage activo! Código HTTP: 200
🎉 Mantenimiento completado
```

---

## 🔐 Seguridad

- Usa el `anon key` público (seguro para cliente)
- Solo hace lecturas (no puede modificar datos)
- No expone credenciales privadas

---

## ⏰ Programación

**Cron expression:** `0 3 */6 * *`

Significa:
- `0` = Minuto 0
- `3` = Hora 3 AM UTC
- `*/6` = Cada 6 días
- `*` = Cualquier mes
- `*` = Cualquier día de la semana

### Conversión a tu zona horaria:

**3:00 AM UTC es:**
- 11:00 PM (día anterior) en Hora del Este (EST/EDT)
- 8:00 PM (día anterior) en Hora del Pacífico (PST/PDT)
- 4:00 AM en Europa Central (CET/CEST)

---

## 🛠️ Personalizar

### Cambiar la frecuencia:

Edita `.github/workflows/keep-supabase-active.yml`:

```yaml
# Cada 5 días:
- cron: '0 3 */5 * *'

# Cada 3 días:
- cron: '0 3 */3 * *'

# Cada semana (lunes a las 3 AM):
- cron: '0 3 * * 1'
```

### Cambiar la hora:

```yaml
# A las 12:00 PM UTC:
- cron: '0 12 */6 * *'

# A las 6:00 AM UTC:
- cron: '0 6 */6 * *'
```

---

## 🐛 Solución de Problemas

### El workflow no se ejecuta

**Causa:** GitHub Actions requiere que el repo tenga actividad reciente

**Solución:**
1. Haz un commit cualquiera
2. Espera 24 horas
3. Ejecuta manualmente desde Actions

### Error 401 Unauthorized

**Causa:** API key expirada o incorrecta

**Solución:**
1. Ve a Supabase Dashboard → Settings → API
2. Copia el nuevo `anon key`
3. Actualiza el workflow

### Error 404 Not Found

**Causa:** URL de Supabase incorrecta

**Solución:**
Verifica que la URL sea: `https://hewtiscwxdvodggrmigo.supabase.co`

---

## 💡 Alternativas

Si prefieres no usar GitHub Actions:

### 1. UptimeRobot (Gratis)
- Web: https://uptimerobot.com
- Crea monitor HTTP cada 5 minutos
- URL: Tu sitio de Cloudflare Pages

### 2. Cron-job.org (Gratis)
- Web: https://cron-job.org
- Configura URL de tu sitio
- Frecuencia: Cada 6 días

### 3. Cloudflare Workers (Gratis pero requiere tarjeta)
- Cron Trigger cada semana
- Hace fetch a Supabase

---

## 📈 Ventajas de GitHub Actions

- ✅ Totalmente gratis
- ✅ No requiere servicios externos
- ✅ Todo en un solo lugar (tu repo)
- ✅ Logs detallados
- ✅ Fácil de modificar

---

## ⚠️ Notas Importantes

1. **GitHub Actions requiere que el repositorio sea público o tengas GitHub Pro**
   - Repos públicos: Gratis ilimitado
   - Repos privados: 2000 minutos/mes gratis

2. **Este workflow usa ~1 minuto/mes**
   - Muy por debajo del límite

3. **Si el proyecto se pausa de todos modos:**
   - No hay problema, puedes reactivarlo en 1 click
   - No pierdes datos
   - Tarda ~30 segundos en volver

---

## ✅ Checklist de Configuración

- [ ] Archivo `.github/workflows/keep-supabase-active.yml` creado
- [ ] Commit y push al repositorio
- [ ] Ejecutado manualmente para probar (GitHub Actions)
- [ ] Verificado que funcionó (círculo verde ✅)
- [ ] Configurado para ejecutarse cada 6 días

---

**Tu proyecto de Supabase ahora se mantendrá activo automáticamente.** 🎉

No tendrás que preocuparte por la pausa de inactividad.
