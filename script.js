console.log("Sitio Immobilia cargado correctamente");

// ========== FUNCIONES DE COMPARTIR ==========
function compartirFacebook() {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
}

function compartirWhatsApp() {
    const url = window.location.href;
    const mensaje = encodeURIComponent(`Mira esta propiedad en Immobilia: ${url}`);
    window.open(`https://wa.me/?text=${mensaje}`, '_blank');
}

function copiarLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        mostrarNotificacion('✓ Link copiado al portapapeles');
    }).catch(() => {
        alert('Link copiado');
    });
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #1f2c3a;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 2000;
        animation: fadeIn 0.3s;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notificacion);
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// ========== FUNCIONES DEL SLIDER ==========
function inicializarSlider(imagenes) {
    const imagenActiva = document.getElementById("imagen-activa");
    if (!imagenActiva || imagenes.length === 0) return;
    
    let indiceActual = 0;
    const img = document.getElementById("imagen-activa");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    
    // Elementos del modal
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const closeModal = document.querySelector(".close-modal");
    const modalPrev = document.querySelector(".modal-prev");
    const modalNext = document.querySelector(".modal-next");
    
    // Contenedores para miniaturas y dots
    const thumbnailsContainer = document.getElementById("thumbnailsContainer");
    const sliderDots = document.getElementById("sliderDots");
    
    // Establecer la primera imagen
    img.src = imagenes[0];
    
    // Función para actualizar la imagen principal
    function actualizarImagen(index) {
        indiceActual = (index + imagenes.length) % imagenes.length;
        img.src = imagenes[indiceActual];
        actualizarMiniaturasActivas();
        actualizarDotsActivos();
    }
    
    // Función para crear miniaturas
    function crearMiniaturas() {
        if (!thumbnailsContainer) return;
        thumbnailsContainer.innerHTML = '';
        imagenes.forEach((imagen, index) => {
            const miniatura = document.createElement('img');
            miniatura.src = imagen;
            miniatura.alt = `Miniatura ${index + 1}`;
            miniatura.classList.add('miniatura');
            if (index === indiceActual) miniatura.classList.add('activa');
            miniatura.addEventListener('click', () => actualizarImagen(index));
            thumbnailsContainer.appendChild(miniatura);
        });
    }
    
    // Función para actualizar miniatura activa
    function actualizarMiniaturasActivas() {
        const miniaturas = document.querySelectorAll('.miniatura');
        miniaturas.forEach((miniatura, index) => {
            if (index === indiceActual) {
                miniatura.classList.add('activa');
            } else {
                miniatura.classList.remove('activa');
            }
        });
    }
    
    // Función para crear dots (indicadores)
    function crearDots() {
        if (!sliderDots) return;
        sliderDots.innerHTML = '';
        imagenes.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === indiceActual) dot.classList.add('activo');
            dot.addEventListener('click', () => actualizarImagen(index));
            sliderDots.appendChild(dot);
        });
    }
    
    // Función para actualizar dots activos
    function actualizarDotsActivos() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === indiceActual) {
                dot.classList.add('activo');
            } else {
                dot.classList.remove('activo');
            }
        });
    }
    
    // Función para imagen anterior
    function imagenAnterior() {
        indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
        actualizarImagen(indiceActual);
    }
    
    // Función para siguiente imagen
    function imagenSiguiente() {
        indiceActual = (indiceActual + 1) % imagenes.length;
        actualizarImagen(indiceActual);
    }
    
    // ========== FUNCIONES DEL MODAL ==========
    function abrirModal() {
        if (!modal) return;
        modal.style.display = 'block';
        modalImage.src = imagenes[indiceActual];
        document.body.style.overflow = 'hidden';
    }
    
    function cerrarModal() {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function modalImagenAnterior() {
        indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
        modalImage.src = imagenes[indiceActual];
        actualizarImagen(indiceActual);
    }
    
    function modalImagenSiguiente() {
        indiceActual = (indiceActual + 1) % imagenes.length;
        modalImage.src = imagenes[indiceActual];
        actualizarImagen(indiceActual);
    }
    
    // ========== EVENT LISTENERS ==========
    if (prevBtn) prevBtn.addEventListener('click', imagenAnterior);
    if (nextBtn) nextBtn.addEventListener('click', imagenSiguiente);
    if (img) img.addEventListener('click', abrirModal);
    if (closeModal) closeModal.addEventListener('click', cerrarModal);
    if (modalPrev) modalPrev.addEventListener('click', modalImagenAnterior);
    if (modalNext) modalNext.addEventListener('click', modalImagenSiguiente);
    
    // Cerrar modal al hacer click fuera de la imagen
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModal();
            }
        });
    }
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (modal && modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                modalImagenAnterior();
            } else if (e.key === 'ArrowRight') {
                modalImagenSiguiente();
            } else if (e.key === 'Escape') {
                cerrarModal();
            }
        } else {
            if (e.key === 'ArrowLeft') {
                imagenAnterior();
            } else if (e.key === 'ArrowRight') {
                imagenSiguiente();
            }
        }
    });
    
    // Inicializar slider
    function initSlider() {
        crearMiniaturas();
        crearDots();
        actualizarImagen(0);
    }
    
    initSlider();
}

// ========== DETECCIÓN DE DISPOSITIVO Y REDIRECCIÓN ==========
function esDispositivoMovil() {
    // Detectar si es móvil o tablet por User Agent
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(ua);
}

function manejarContacto(telefono, nombre) {
    // Eliminar cualquier carácter no numérico
    const telefonoLimpio = telefono.replace(/\D/g, '');
    
    if (esDispositivoMovil()) {
        // En celular: abrir marcador telefónico
        window.location.href = `tel:+${telefonoLimpio}`;
    } else {
        // En PC: abrir WhatsApp Web
        const mensaje = encodeURIComponent(`Hola, me interesa la propiedad. Mi nombre es:`);
        window.open(`https://web.whatsapp.com/send?phone=${telefonoLimpio}&text=${mensaje}`, '_blank');
    }
}

// Asignar eventos a los botones de contacto
document.addEventListener('DOMContentLoaded', function() {
    const botonesContacto = document.querySelectorAll('.btn-telefono-horizontal');
    
    botonesContacto.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            const telefono = this.getAttribute('data-telefono');
            const nombre = this.getAttribute('data-nombre');
            manejarContacto(telefono, nombre);
        });
    });
});