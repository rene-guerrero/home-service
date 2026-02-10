// Lógica del panel de administración
let selectedFiles = [];
let editModal = null;
let changePasswordModal = null;

document.addEventListener('DOMContentLoaded', function() {
  // Verificar autenticación
  if (!authSystem.isAuthenticated()) {
    window.location.href = 'admin-login.html';
    return;
  }

  // Inicializar
  initializePage();
  loadGallery();
  updateStats();

  // Event listeners
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  document.getElementById('uploadForm').addEventListener('submit', handleUpload);
  document.getElementById('uploadArea').addEventListener('click', () => document.getElementById('imageFile').click());
  document.getElementById('imageFile').addEventListener('change', handleFileSelect);
  document.getElementById('removeAllImages').addEventListener('click', removeAllImages);
  document.getElementById('refreshGallery').addEventListener('click', loadGallery);
  document.getElementById('saveEditBtn').addEventListener('click', handleSaveEdit);
  document.getElementById('savePasswordBtn').addEventListener('click', handleChangePassword);
  
  // Password visibility toggles
  document.getElementById('toggleCurrentPassword').addEventListener('click', () => togglePasswordVisibility('currentPassword', 'toggleCurrentPassword'));
  document.getElementById('toggleNewPassword').addEventListener('click', () => togglePasswordVisibility('newPassword', 'toggleNewPassword'));
  document.getElementById('toggleConfirmPassword').addEventListener('click', () => togglePasswordVisibility('confirmPassword', 'toggleConfirmPassword'));
  
  // Password strength checker
  document.getElementById('newPassword').addEventListener('input', checkPasswordStrength);
  
  // Password match checker
  document.getElementById('confirmPassword').addEventListener('input', checkPasswordMatch);

  // Drag and drop solo en upload area
  const uploadArea = document.getElementById('uploadArea');
  
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.add('drag-over');
  });

  uploadArea.addEventListener('dragleave', (e) => {
    e.stopPropagation();
    uploadArea.classList.remove('drag-over');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect({ target: { files } });
    }
  });

  // Prevenir drag & drop en toda la página excepto en uploadArea
  document.addEventListener('dragover', (e) => {
    if (!uploadArea.contains(e.target) && !uploadArea.classList.contains('d-none')) {
      e.preventDefault();
      e.dataTransfer.effectAllowed = 'none';
      e.dataTransfer.dropEffect = 'none';
    }
  });

  document.addEventListener('drop', (e) => {
    if (!uploadArea.contains(e.target)) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  // Inicializar modals
  editModal = new bootstrap.Modal(document.getElementById('editModal'));
  changePasswordModal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
});

// Toggle password visibility
function togglePasswordVisibility(inputId, buttonId) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);
  const icon = button.querySelector('i');
  
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('bi-eye-fill');
    icon.classList.add('bi-eye-slash-fill');
  } else {
    input.type = 'password';
    icon.classList.remove('bi-eye-slash-fill');
    icon.classList.add('bi-eye-fill');
  }
}

// Check password strength
function checkPasswordStrength() {
  const password = document.getElementById('newPassword').value;
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  const strengthContainer = document.getElementById('passwordStrength');
  
  if (password.length === 0) {
    strengthContainer.classList.add('d-none');
    return;
  }
  
  strengthContainer.classList.remove('d-none');
  
  let strength = 0;
  let feedback = [];
  
  // Length check
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  
  // Character variety
  if (/[a-z]/.test(password)) strength += 20;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
  
  // Set color and text
  strengthBar.style.width = strength + '%';
  
  if (strength < 40) {
    strengthBar.className = 'progress-bar bg-danger';
    strengthText.textContent = 'Débil';
    strengthText.className = 'text-danger';
  } else if (strength < 70) {
    strengthBar.className = 'progress-bar bg-warning';
    strengthText.textContent = 'Media';
    strengthText.className = 'text-warning';
  } else {
    strengthBar.className = 'progress-bar bg-success';
    strengthText.textContent = 'Fuerte';
    strengthText.className = 'text-success';
  }
}

// Check if passwords match
function checkPasswordMatch() {
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const errorDiv = document.getElementById('passwordMatchError');
  
  if (confirmPassword.length === 0) {
    errorDiv.classList.add('d-none');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    errorDiv.classList.remove('d-none');
  } else {
    errorDiv.classList.add('d-none');
  }
}

// Handle change password
async function handleChangePassword() {
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  // Validations
  if (!currentPassword || !newPassword || !confirmPassword) {
    showAlert('Por favor completa todos los campos', 'danger');
    return;
  }
  
  if (newPassword.length < 8) {
    showAlert('La nueva contraseña debe tener al menos 8 caracteres', 'danger');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    showAlert('Las contraseñas no coinciden', 'danger');
    return;
  }
  
  if (currentPassword === newPassword) {
    showAlert('La nueva contraseña debe ser diferente a la actual', 'danger');
    return;
  }
  
  // Show loading
  const saveBtn = document.getElementById('savePasswordBtn');
  const originalText = saveBtn.innerHTML;
  saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Cambiando...';
  saveBtn.disabled = true;
  
  try {
    const session = authSystem.getSession();
    const result = await authSystem.changePassword(session.username, currentPassword, newPassword);
    
    if (result.success) {
      showAlert('¡Contraseña actualizada correctamente!', 'success');
      changePasswordModal.hide();
      
      // Limpiar formulario
      document.getElementById('changePasswordForm').reset();
      document.getElementById('passwordStrength').classList.add('d-none');
      document.getElementById('passwordMatchError').classList.add('d-none');
      
      // Mostrar mensaje de confirmación
      setTimeout(() => {
        showAlert('Por seguridad, cierra sesión y vuelve a iniciar con tu nueva contraseña', 'info');
      }, 1000);
    } else {
      showAlert(result.message, 'danger');
    }
  } catch (error) {
    showAlert('Error al cambiar contraseña: ' + error.message, 'danger');
  } finally {
    saveBtn.innerHTML = originalText;
    saveBtn.disabled = false;
  }
}

function initializePage() {
  const session = authSystem.getSession();
  document.getElementById('welcomeMessage').textContent = `Bienvenido, ${session.username}`;
}

function handleLogout() {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    authSystem.logout();
    window.location.href = 'admin-login.html';
  }
}

function handleFileSelect(e) {
  const files = Array.from(e.target.files);
  
  if (files.length === 0) return;

  // Validar cantidad máxima
  if (files.length > 5) {
    showAlert('Máximo 5 imágenes a la vez.', 'warning');
    files.splice(5);
  }

  // Validar cada archivo
  const validFiles = [];
  for (const file of files) {
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      showAlert(`"${file.name}" no es una imagen válida.`, 'warning');
      continue;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showAlert(`"${file.name}" es demasiado grande. Máximo 5MB.`, 'warning');
      continue;
    }

    validFiles.push(file);
  }

  if (validFiles.length === 0) {
    return;
  }

  selectedFiles = validFiles;
  displayPreviews();
}

function displayPreviews() {
  const previewContainer = document.getElementById('imagePreviewContainer');
  const singlePreview = document.getElementById('singlePreview');
  const multiplePreview = document.getElementById('multiplePreview');
  const imageList = document.getElementById('imageList');
  
  const count = selectedFiles.length;
  
  if (count === 1) {
    // Una sola imagen - mostrar preview
    const file = selectedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('singlePreviewImage').src = e.target.result;
      singlePreview.classList.remove('d-none');
      multiplePreview.classList.add('d-none');
    };
    reader.readAsDataURL(file);
  } else {
    // Múltiples imágenes - mostrar lista
    singlePreview.classList.add('d-none');
    multiplePreview.classList.remove('d-none');
    
    document.getElementById('multipleCount').textContent = count;
    
    imageList.innerHTML = selectedFiles.map((file, index) => `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <i class="bi bi-image text-primary me-2"></i>
          <span>${file.name}</span>
          <small class="text-muted ms-2">(${formatFileSize(file.size)})</small>
        </div>
        <button type="button" class="btn btn-sm btn-danger" onclick="removeFile(${index})">
          <i class="bi bi-x"></i>
        </button>
      </li>
    `).join('');
  }

  previewContainer.classList.remove('d-none');
  document.getElementById('uploadArea').classList.add('d-none');
  document.getElementById('uploadBtn').disabled = false;
  
  // Actualizar texto del botón
  document.getElementById('uploadBtn').innerHTML = `<i class="bi bi-plus-circle me-1"></i>Subir ${count} imagen${count > 1 ? 'es' : ''} a la Galería`;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function removeFile(index) {
  selectedFiles.splice(index, 1);
  
  if (selectedFiles.length === 0) {
    removeAllImages();
  } else {
    // Actualizar el input de archivos para reflejar el cambio
    // Crear un nuevo FileList con los archivos restantes
    const dt = new DataTransfer();
    selectedFiles.forEach(file => dt.items.add(file));
    document.getElementById('imageFile').files = dt.files;
    
    // Volver a mostrar las previews
    displayPreviews();
  }
}

function removeAllImages() {
  selectedFiles = [];
  document.getElementById('imageFile').value = '';
  document.getElementById('imagePreviewContainer').classList.add('d-none');
  document.getElementById('uploadArea').classList.remove('d-none');
  document.getElementById('uploadBtn').disabled = true;
  document.getElementById('uploadBtn').innerHTML = '<i class="bi bi-plus-circle me-1"></i>Agregar a Galería';
}

async function handleUpload(e) {
  e.preventDefault();

  if (selectedFiles.length === 0) {
    showAlert('Por favor selecciona al menos una imagen.', 'danger');
    return;
  }

  const title = document.getElementById('imageTitle').value.trim();
  const description = document.getElementById('imageDescription').value.trim();

  // Usar valores por defecto si están vacíos
  const defaultTitle = title || 'Imagen sin título';
  const defaultDescription = description || '';

  // Mostrar loading
  const uploadBtn = document.getElementById('uploadBtn');
  const originalText = uploadBtn.innerHTML;
  uploadBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Subiendo...';
  uploadBtn.disabled = true;

  try {
    let successCount = 0;
    let errorCount = 0;

    // Subir cada imagen
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Si hay múltiples imágenes, añadir número al título
      const imageTitle = selectedFiles.length > 1 
        ? `${defaultTitle} (${i + 1}/${selectedFiles.length})` 
        : defaultTitle;

      uploadBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Subiendo ${i + 1}/${selectedFiles.length}...`;

      const result = await galleryStorage.addImage(file, imageTitle, defaultDescription);

      if (result.success) {
        successCount++;
      } else {
        errorCount++;
        console.error(`Error al subir ${file.name}:`, result.message);
      }
    }

    // Mostrar resultado
    if (successCount > 0 && errorCount === 0) {
      showAlert(`¡${successCount} imagen${successCount > 1 ? 'es' : ''} agregada${successCount > 1 ? 's' : ''} exitosamente!`, 'success');
    } else if (successCount > 0 && errorCount > 0) {
      showAlert(`${successCount} imagen${successCount > 1 ? 'es' : ''} subida${successCount > 1 ? 's' : ''}, ${errorCount} fallida${errorCount > 1 ? 's' : ''}.`, 'warning');
    } else {
      showAlert('Error al subir las imágenes.', 'danger');
    }

    // Limpiar formulario
    document.getElementById('uploadForm').reset();
    removeAllImages();
    
    // Recargar galería
    loadGallery();
    updateStats();

  } catch (error) {
    showAlert('Error al subir las imágenes: ' + error.message, 'danger');
  } finally {
    uploadBtn.innerHTML = originalText;
    uploadBtn.disabled = false;
  }
}

async function loadGallery() {
  const galleryContainer = document.getElementById('galleryAdmin');
  const emptyMessage = document.getElementById('emptyGallery');

  // Mostrar loading
  galleryContainer.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div><p class="mt-2">Cargando galería...</p></div>';
  galleryContainer.classList.remove('d-none');
  emptyMessage.classList.add('d-none');

  const images = await galleryStorage.getImages();

  if (images.length === 0) {
    galleryContainer.classList.add('d-none');
    emptyMessage.classList.remove('d-none');
    return;
  }

  galleryContainer.classList.remove('d-none');
  emptyMessage.classList.add('d-none');

  galleryContainer.innerHTML = images.map(image => `
    <div class="gallery-card" data-id="${image.id}">
      <img src="${image.url}" alt="${escapeHtml(image.title)}" class="gallery-card-image">
      <div class="gallery-card-body">
        <h6 class="gallery-card-title">${escapeHtml(image.title)}</h6>
        <p class="gallery-card-description">${escapeHtml(image.description || 'Sin descripción')}</p>
        <div class="text-muted small mb-2">
          <i class="bi bi-calendar me-1"></i>${formatDate(image.created_at)}
        </div>
        <div class="gallery-card-actions">
          <button class="btn btn-sm btn-edit" onclick="editImage('${image.id}')">
            <i class="bi bi-pencil me-1"></i>Editar
          </button>
          <button class="btn btn-sm btn-delete" onclick="deleteImage('${image.id}')">
            <i class="bi bi-trash me-1"></i>Eliminar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

async function updateStats() {
  const stats = await galleryStorage.getStorageStats();
  const images = await galleryStorage.getImages();
  
  document.getElementById('imageCount').textContent = stats.count;
  document.getElementById('storageUsed').textContent = stats.totalSizeFormatted;
  
  if (images.length > 0) {
    const lastImage = images[0]; // Ya viene ordenado por created_at DESC
    document.getElementById('lastUpdate').textContent = formatDate(lastImage.created_at);
  } else {
    document.getElementById('lastUpdate').textContent = '-';
  }
}

async function editImage(id) {
  const image = await galleryStorage.getImageById(id);
  
  if (!image) {
    showAlert('Imagen no encontrada.', 'danger');
    return;
  }

  document.getElementById('editImageId').value = id;
  document.getElementById('editImagePreview').src = image.url;
  document.getElementById('editImageTitle').value = image.title;
  document.getElementById('editImageDescription').value = image.description || '';

  editModal.show();
}

async function handleSaveEdit() {
  const id = document.getElementById('editImageId').value;
  const title = document.getElementById('editImageTitle').value.trim();
  const description = document.getElementById('editImageDescription').value.trim();

  if (!title) {
    showAlert('El título es obligatorio.', 'danger');
    return;
  }

  const saveBtn = document.getElementById('saveEditBtn');
  const originalText = saveBtn.innerHTML;
  saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';
  saveBtn.disabled = true;

  const result = await galleryStorage.updateImage(id, { title, description });

  saveBtn.innerHTML = originalText;
  saveBtn.disabled = false;

  if (result.success) {
    showAlert('¡Imagen actualizada exitosamente!', 'success');
    editModal.hide();
    loadGallery();
    updateStats();
  } else {
    showAlert(result.message, 'danger');
  }
}

async function deleteImage(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
    return;
  }

  const result = await galleryStorage.deleteImage(id);

  if (result.success) {
    showAlert('Imagen eliminada correctamente.', 'success');
    loadGallery();
    updateStats();
  } else {
    showAlert(result.message, 'danger');
  }
}

function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-float`;
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
