// Lógica del panel de administración
let selectedFile = null;
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
  document.getElementById('removeImage').addEventListener('click', removeSelectedImage);
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

  // Drag and drop
  const uploadArea = document.getElementById('uploadArea');
  
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect({ target: { files } });
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
  const file = e.target.files[0];
  
  if (!file) return;

  // Validar tipo
  if (!file.type.startsWith('image/')) {
    showAlert('Por favor selecciona una imagen válida.', 'danger');
    return;
  }

  // Validar tamaño
  if (file.size > 2 * 1024 * 1024) {
    showAlert('La imagen es demasiado grande. Máximo 2MB.', 'danger');
    return;
  }

  selectedFile = file;

  // Mostrar preview
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('imagePreview').src = e.target.result;
    document.getElementById('imagePreviewContainer').classList.remove('d-none');
    document.getElementById('uploadArea').classList.add('d-none');
    document.getElementById('uploadBtn').disabled = false;
  };
  reader.readAsDataURL(file);
}

function removeSelectedImage() {
  selectedFile = null;
  document.getElementById('imageFile').value = '';
  document.getElementById('imagePreviewContainer').classList.add('d-none');
  document.getElementById('uploadArea').classList.remove('d-none');
  document.getElementById('uploadBtn').disabled = true;
}

async function handleUpload(e) {
  e.preventDefault();

  if (!selectedFile) {
    showAlert('Por favor selecciona una imagen.', 'danger');
    return;
  }

  const title = document.getElementById('imageTitle').value.trim();
  const description = document.getElementById('imageDescription').value.trim();

  if (!title) {
    showAlert('Por favor ingresa un título.', 'danger');
    return;
  }

  // Mostrar loading
  const uploadBtn = document.getElementById('uploadBtn');
  const originalText = uploadBtn.innerHTML;
  uploadBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Subiendo...';
  uploadBtn.disabled = true;

  try {
    const result = await galleryStorage.addImage(selectedFile, title, description);

    if (result.success) {
      showAlert('¡Imagen agregada exitosamente!', 'success');
      
      // Limpiar formulario
      document.getElementById('uploadForm').reset();
      removeSelectedImage();
      
      // Recargar galería
      loadGallery();
      updateStats();
    } else {
      showAlert(result.message, 'danger');
    }
  } catch (error) {
    showAlert('Error al subir la imagen: ' + error.message, 'danger');
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
