/* ============================================ */
/* INMOBILIA - FUNCIONES PRINCIPALES            */
/* ============================================ */

console.log("Sitio Immobilia cargado correctamente");

/* ---------- COMPARTIR EN REDES SOCIALES ---------- */
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

/* Notificación flotante temporal */
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
    setTimeout(() => notificacion.remove(), 3000);
}

/* ---------- SLIDER DE IMÁGENES ---------- */
/* Esta función se llama desde cada página de propiedad,
   recibe un array con las rutas de las imágenes */
function inicializarSlider(imagenes) {
    const imagenActiva = document.getElementById("imagen-activa");
    if (!imagenActiva || imagenes.length === 0) return;
    
    let indiceActual = 0;
    const img = document.getElementById("imagen-activa");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    
    // Elementos del modal (imagen ampliada)
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const closeModal = document.querySelector(".close-modal");
    const modalPrev = document.querySelector(".modal-prev");
    const modalNext = document.querySelector(".modal-next");
    
    // Contenedores para miniaturas y puntos indicadores
    const thumbnailsContainer = document.getElementById("thumbnailsContainer");
    const sliderDots = document.getElementById("sliderDots");
    
    // Establecer la primera imagen
    img.src = imagenes[0];
    
    /* Actualiza la imagen principal y los elementos activos */
    function actualizarImagen(index) {
        indiceActual = (index + imagenes.length) % imagenes.length;
        img.src = imagenes[indiceActual];
        actualizarMiniaturasActivas();
        actualizarDotsActivos();
    }
    
    /* Crea las miniaturas desde el array de imágenes */
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
    
    function actualizarMiniaturasActivas() {
        document.querySelectorAll('.miniatura').forEach((miniatura, index) => {
            index === indiceActual ? miniatura.classList.add('activa') : miniatura.classList.remove('activa');
        });
    }
    
    /* Crea los puntos indicadores (dots) */
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
    
    function actualizarDotsActivos() {
        document.querySelectorAll('.dot').forEach((dot, index) => {
            index === indiceActual ? dot.classList.add('activo') : dot.classList.remove('activo');
        });
    }
    
    /* Navegación con flechas */
    function imagenAnterior() {
        indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
        actualizarImagen(indiceActual);
    }
    
    function imagenSiguiente() {
        indiceActual = (indiceActual + 1) % imagenes.length;
        actualizarImagen(indiceActual);
    }
    
    /* ---------- MODAL (IMAGEN AMPLIADA) ---------- */
    function abrirModal() {
        if (!modal) return;
        modal.style.display = 'block';
        modalImage.src = imagenes[indiceActual];
        document.body.style.overflow = 'hidden'; // Evita scroll detrás del modal
    }
    
    function cerrarModal() {
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
    
    /* ---------- EVENTOS ---------- */
    if (prevBtn) prevBtn.addEventListener('click', imagenAnterior);
    if (nextBtn) nextBtn.addEventListener('click', imagenSiguiente);
    if (img) img.addEventListener('click', abrirModal);
    if (closeModal) closeModal.addEventListener('click', cerrarModal);
    if (modalPrev) modalPrev.addEventListener('click', modalImagenAnterior);
    if (modalNext) modalNext.addEventListener('click', modalImagenSiguiente);
    
    // Cerrar modal al hacer clic fuera de la imagen
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cerrarModal();
        });
    }
    
    /* Navegación con teclado (flechas y ESC) */
    document.addEventListener('keydown', (e) => {
        if (modal && modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') modalImagenAnterior();
            else if (e.key === 'ArrowRight') modalImagenSiguiente();
            else if (e.key === 'Escape') cerrarModal();
        } else {
            if (e.key === 'ArrowLeft') imagenAnterior();
            else if (e.key === 'ArrowRight') imagenSiguiente();
        }
    });
    
    /* Inicializar todo */
    crearMiniaturas();
    crearDots();
    actualizarImagen(0);
}

/* ---------- BOTONES DE CONTACTO (LLAMADA/WHATSAPP) ---------- */
/* Detecta si es móvil por tamaño de pantalla o User Agent */
function esDispositivoMovil() {
    const esPantallaPequena = window.matchMedia("(max-width: 768px)").matches;
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const esMovilUA = /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(ua);
    return esPantallaPequena || esMovilUA;
}

/* Redirige según dispositivo:
   - Móvil: abre WhatsApp (app)
   - PC: abre WhatsApp Web */
function manejarContacto(telefono, nombre) {
    const telefonoLimpio = telefono.replace(/\D/g, '');
    
    // ===== OBTENER EL TÍTULO DE LA PROPIEDAD DESDE EL HTML =====
    // Busca el elemento con clase "titulo-propiedad"
    const tituloElemento = document.querySelector('.titulo-propiedad');
    let nombrePropiedad = '';
    
    if (tituloElemento) {
        // Si existe el elemento, toma su texto
        nombrePropiedad = tituloElemento.textContent.trim();
    } else {
        // Si no, usa el nombre del archivo como respaldo
        const rutaCompleta = window.location.pathname;
        nombrePropiedad = rutaCompleta.substring(rutaCompleta.lastIndexOf('/') + 1).replace('.html', '');
    }
    // ===========================================================
    
    const mensaje = encodeURIComponent(`Hola, me interesa la propiedad "${nombrePropiedad}" en Immobilia. Mi nombre es:`);
    
    if (esDispositivoMovil()) {
        window.location.href = `https://wa.me/${telefonoLimpio}?text=${mensaje}`;
    } else {
        window.open(`https://web.whatsapp.com/send?phone=${telefonoLimpio}&text=${mensaje}`, '_blank');
    }
}

/* Asignar evento a los botones de contacto al cargar la página */
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