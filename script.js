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

// ========== FUNCIONES DE FORMATO ==========
function formatearPrecio(valor) {
    if (!valor) return '';
    let numero = valor.toString().replace(/[^0-9]/g, '');
    if (numero === '') return '';
    return '$' + parseInt(numero, 10).toLocaleString('es-MX');
}

function formatearMetros(valor) {
    if (!valor) return '';
    let numero = valor.toString().replace(/[^0-9]/g, '');
    if (numero === '') return '';
    return parseInt(numero, 10).toLocaleString('es-MX') + ' m²';
}

function parseNumeroFormateado(valor) {
    if (!valor) return 0;
    return parseFloat(valor.toString().replace(/[^0-9]/g, '')) || 0;
}

// Aplicar formato a los campos de precio al perder foco
function aplicarFormatoPrecio(input) {
    if (!input) return;
    const valorNumerico = parseNumeroFormateado(input.value);
    if (valorNumerico > 0) {
        input.value = formatearPrecio(valorNumerico);
    } else {
        input.value = '';
    }
    filtrarPropiedades(); // Filtro automático
}

function aplicarFormatoMetros(input) {
    if (!input) return;
    const valorNumerico = parseNumeroFormateado(input.value);
    if (valorNumerico > 0) {
        input.value = valorNumerico.toLocaleString('es-MX') + ' m²';
    } else {
        input.value = '';
    }
    filtrarPropiedades(); // Filtro automático
}

// ========== OBTENER VALORES ÚNICOS DE LAS TARJETAS ==========
function obtenerValoresUnicos(selectorIcono) {
    const valores = new Set();
    const tarjetas = document.querySelectorAll('.grid-propiedades .card');
    
    tarjetas.forEach(tarjeta => {
        const items = tarjeta.querySelectorAll('.item');
        const item = Array.from(items).find(item => 
            item.querySelector('.icono')?.textContent === selectorIcono
        );
        if (item) {
            const span = item.querySelector('span:last-child');
            if (span) {
                const valor = parseInt(span.textContent) || 0;
                if (valor > 0) valores.add(valor);
            }
        }
    });
    
    return Array.from(valores).sort((a, b) => a - b);
}

function obtenerTiposUnicos() {
    const tipos = new Set();
    const tarjetas = document.querySelectorAll('.grid-propiedades .card');
    tarjetas.forEach(tarjeta => {
        const tipo = tarjeta.getAttribute('data-tipo');
        if (tipo) tipos.add(tipo);
    });
    return Array.from(tipos).sort();
}

// ========== ACTUALIZAR SELECTORES DINÁMICOS ==========
function actualizarSelectores() {
    // Actualizar tipos de propiedad
    const tipos = obtenerTiposUnicos();
    const selectTipo = document.getElementById('tipo-propiedad');
    if (selectTipo) {
        const valorActual = selectTipo.value;
        selectTipo.innerHTML = '<option value="">Todos</option>';
        tipos.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo;
            // Capitalizar primera letra
            option.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
            selectTipo.appendChild(option);
        });
        if (valorActual) selectTipo.value = valorActual;
    }
    
    // Actualizar habitaciones
    const habitacionesValores = obtenerValoresUnicos('🛏️');
    const selectHabs = document.getElementById('habitaciones');
    if (selectHabs) {
        const valorActual = selectHabs.value;
        selectHabs.innerHTML = '<option value="">Cualquiera</option>';
        habitacionesValores.forEach(val => {
            const option = document.createElement('option');
            option.value = val;
            option.textContent = val + (val === 1 ? ' habitación' : ' habitaciones');
            selectHabs.appendChild(option);
        });
        if (valorActual) selectHabs.value = valorActual;
    }
    
    // Actualizar niveles
    const nivelesValores = obtenerValoresUnicos('🏢');
    const selectNiveles = document.getElementById('niveles');
    if (selectNiveles) {
        const valorActual = selectNiveles.value;
        selectNiveles.innerHTML = '<option value="">Cualquiera</option>';
        nivelesValores.forEach(val => {
            const option = document.createElement('option');
            option.value = val;
            option.textContent = val + (val === 1 ? ' nivel' : ' niveles');
            selectNiveles.appendChild(option);
        });
        if (valorActual) selectNiveles.value = valorActual;
    }
}

// ========== FUNCIÓN PRINCIPAL DE FILTRADO ==========
function filtrarPropiedades() {
    // Obtener valores de los filtros
    const tipoSeleccionado = document.getElementById('tipo-propiedad')?.value || '';
    
    const precioMin = parseNumeroFormateado(document.getElementById('precio-min')?.value);
    const precioMax = parseNumeroFormateado(document.getElementById('precio-max')?.value) || Infinity;
    
    const habsRequeridas = parseInt(document.getElementById('habitaciones')?.value) || 0;
    const nivelesRequeridos = parseInt(document.getElementById('niveles')?.value) || 0;
    
    const construccionMin = parseNumeroFormateado(document.getElementById('construccion-min')?.value);
    const construccionMax = parseNumeroFormateado(document.getElementById('construccion-max')?.value) || Infinity;
    
    const tarjetas = document.querySelectorAll('.grid-propiedades .card');
    let contadorVisibles = 0;
    
    tarjetas.forEach(tarjeta => {
        let mostrar = true;
        
        // Filtrar por tipo
        const tipoPropiedad = tarjeta.getAttribute('data-tipo') || '';
        if (tipoSeleccionado && tipoPropiedad !== tipoSeleccionado) mostrar = false;
        
        // Filtrar por precio
        const precioElemento = tarjeta.querySelector('.precio');
        let precio = 0;
        if (precioElemento) {
            precio = parseNumeroFormateado(precioElemento.textContent);
        }
        if (precio < precioMin || precio > precioMax) mostrar = false;
        
        // Filtrar por habitaciones
        let habitaciones = 0;
        const habsItem = Array.from(tarjeta.querySelectorAll('.item')).find(item => 
            item.querySelector('.icono')?.textContent === '🛏️'
        );
        if (habsItem) {
            const habsSpan = habsItem.querySelector('span:last-child');
            if (habsSpan) habitaciones = parseInt(habsSpan.textContent) || 0;
        }
        if (habsRequeridas > 0 && habitaciones !== habsRequeridas) mostrar = false;
        
        // Filtrar por construcción (ícono 🏗️)
        let construccion = 0;
        const construccionItem = Array.from(tarjeta.querySelectorAll('.item')).find(item => 
            item.querySelector('.icono')?.textContent === '🏗️'
        );
        if (construccionItem) {
            const constSpan = construccionItem.querySelector('span:last-child');
            if (constSpan) construccion = parseNumeroFormateado(constSpan.textContent);
        }
        if (construccion < construccionMin || construccion > construccionMax) mostrar = false;
        
        // Filtrar por niveles (ícono 🏢)
        let niveles = 0;
        const nivelesItem = Array.from(tarjeta.querySelectorAll('.item')).find(item => 
            item.querySelector('.icono')?.textContent === '🏢'
        );
        if (nivelesItem) {
            const nivSpan = nivelesItem.querySelector('span:last-child');
            if (nivSpan) niveles = parseInt(nivSpan.textContent) || 0;
        }
        if (nivelesRequeridos > 0 && niveles !== nivelesRequeridos) mostrar = false;
        
        // Mostrar u ocultar
        tarjeta.style.display = mostrar ? 'block' : 'none';
        if (mostrar) contadorVisibles++;
    });
    
    // Mostrar mensaje si no hay resultados
    const grid = document.querySelector('.grid-propiedades');
    let mensajeNoResultados = document.getElementById('sin-resultados');
    
    if (contadorVisibles === 0) {
        if (!mensajeNoResultados) {
            mensajeNoResultados = document.createElement('div');
            mensajeNoResultados.id = 'sin-resultados';
            mensajeNoResultados.innerHTML = '<p>🔍 No hay propiedades que coincidan con los filtros seleccionados.</p>';
            grid.parentNode.insertBefore(mensajeNoResultados, grid.nextSibling);
        }
        mensajeNoResultados.style.display = 'block';
    } else {
        if (mensajeNoResultados) mensajeNoResultados.style.display = 'none';
    }
}

// ========== LIMPIAR FILTROS ==========
function limpiarFiltros() {
    const precioMin = document.getElementById('precio-min');
    const precioMax = document.getElementById('precio-max');
    const habitaciones = document.getElementById('habitaciones');
    const tipoPropiedad = document.getElementById('tipo-propiedad');
    const construccionMin = document.getElementById('construccion-min');
    const construccionMax = document.getElementById('construccion-max');
    const niveles = document.getElementById('niveles');
    
    if (precioMin) precioMin.value = '';
    if (precioMax) precioMax.value = '';
    if (habitaciones) habitaciones.value = '';
    if (tipoPropiedad) tipoPropiedad.value = '';
    if (construccionMin) construccionMin.value = '';
    if (construccionMax) construccionMax.value = '';
    if (niveles) niveles.value = '';
    
    const tarjetas = document.querySelectorAll('.grid-propiedades .card');
    tarjetas.forEach(tarjeta => tarjeta.style.display = 'block');
    
    const mensajeNoResultados = document.getElementById('sin-resultados');
    if (mensajeNoResultados) mensajeNoResultados.style.display = 'none';
}

// ========== INICIALIZAR EVENTOS ==========
function inicializarFiltros() {
    // Actualizar selectores dinámicos
    actualizarSelectores();
    
    // Asignar eventos de entrada automática
    const precioMinInput = document.getElementById('precio-min');
    const precioMaxInput = document.getElementById('precio-max');
    const construccionMinInput = document.getElementById('construccion-min');
    const construccionMaxInput = document.getElementById('construccion-max');
    const habitacionesSelect = document.getElementById('habitaciones');
    const tipoSelect = document.getElementById('tipo-propiedad');
    const nivelesSelect = document.getElementById('niveles');
    
    if (precioMinInput) {
        precioMinInput.addEventListener('blur', () => aplicarFormatoPrecio(precioMinInput));
        precioMinInput.addEventListener('input', () => {
            // Mientras escribe, solo números
            precioMinInput.value = precioMinInput.value.replace(/[^0-9]/g, '');
        });
        precioMinInput.addEventListener('keyup', filtrarPropiedades);
    }
    
    if (precioMaxInput) {
        precioMaxInput.addEventListener('blur', () => aplicarFormatoPrecio(precioMaxInput));
        precioMaxInput.addEventListener('input', () => {
            precioMaxInput.value = precioMaxInput.value.replace(/[^0-9]/g, '');
        });
        precioMaxInput.addEventListener('keyup', filtrarPropiedades);
    }
    
    if (construccionMinInput) {
        construccionMinInput.addEventListener('blur', () => aplicarFormatoMetros(construccionMinInput));
        construccionMinInput.addEventListener('input', () => {
            construccionMinInput.value = construccionMinInput.value.replace(/[^0-9]/g, '');
        });
        construccionMinInput.addEventListener('keyup', filtrarPropiedades);
    }
    
    if (construccionMaxInput) {
        construccionMaxInput.addEventListener('blur', () => aplicarFormatoMetros(construccionMaxInput));
        construccionMaxInput.addEventListener('input', () => {
            construccionMaxInput.value = construccionMaxInput.value.replace(/[^0-9]/g, '');
        });
        construccionMaxInput.addEventListener('keyup', filtrarPropiedades);
    }
    
    if (habitacionesSelect) habitacionesSelect.addEventListener('change', filtrarPropiedades);
    if (tipoSelect) tipoSelect.addEventListener('change', filtrarPropiedades);
    if (nivelesSelect) nivelesSelect.addEventListener('change', filtrarPropiedades);
    
    const btnLimpiar = document.getElementById('btn-limpiar');
    if (btnLimpiar) btnLimpiar.addEventListener('click', limpiarFiltros);
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarFiltros();
    filtrarPropiedades(); // Filtro inicial
});