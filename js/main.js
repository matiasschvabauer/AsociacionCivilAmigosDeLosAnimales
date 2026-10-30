/* ==========================================================================
   RESERVA CANINA GÁLVEZ - MAIN JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Asegurar eliminación de cualquier preferencia previa de tema oscuro
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('reserva_theme');
    
    initMobileNav();
    initActiveNav();
    initToastContainer();
    initRefugioCarousel();
    initHomeSingleScreenCarousel();
    initContactForm();
    initVetsMap();
});

/* Mobile Menu Navigation */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (toggleBtn && mobileNav) {
        toggleBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.className = mobileNav.classList.contains('active') 
                    ? 'fas fa-times' 
                    : 'fas fa-bars';
            }
        });
    }
}

/* Active Nav Highlighting */
function initActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* Modal Helpers */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
window.openModal = openModal;
window.closeModal = closeModal;

}

/* Copy to Clipboard */
function copyToClipboard(text, label = 'Texto') {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`¡${label}
window.copyToClipboard = copyToClipboard;
 copiado al portapapeles!`, 'success');
        }).catch(err => {
            fallbackCopyTextToClipboard(text, label);
        });
    } else {
        fallbackCopyTextToClipboard(text, label);
    }
}

function fallbackCopyTextToClipboard(text, label) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast(`¡${label} copiado al portapapeles!`, 'success');
    } catch (err) {
        showToast(`Error al copiar ${label}`, 'error');
    }
    document.body.removeChild(textArea);
}

/* Toast Notifications System */
function initToastContainer() {
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

function showToast(message, type = 'info') {
    initToastContainer();
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}
window.showToast = showToast;
`;
    
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-exclamation-triangle';
    if (type === 'warning') iconClass = 'fa-exclamation-circle';

    toast.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

/* Automatic Refugio Carousel (NoNameFound photos) */
let currentRefugioIndex = 0;
let refugioInterval = null;

function initRefugioCarousel() {
    const slides = document.querySelectorAll('.refugio-slide');
    const dotsContainer = document.getElementById('refugio-carousel-dots');
    
    if (!slides || slides.length === 0) return;

    if (dotsContainer) {
        dotsContainer.innerHTML = Array.from(slides).map((_, idx) => `
            <span class="refugio-dot ${idx === 0 ? 'active' : ''}" onclick="goToRefugioSlide(${idx})" style="width: 10px; height: 10px; border-radius: 50%; background: ${idx === 0 ? '#ffffff' : 'rgba(255,255,255,0.5)'}; cursor: pointer; transition: all 0.3s ease;"></span>
        `).join('');
    }

    startRefugioAutoPlay();
}

function showRefugioSlide(index) {
    const slides = document.querySelectorAll('.refugio-slide');
    const dots = document.querySelectorAll('.refugio-dot');
    
    if (!slides || slides.length === 0) return;

    if (index >= slides.length) currentRefugioIndex = 0;
    else if (index < 0) currentRefugioIndex = slides.length - 1;
    else currentRefugioIndex = index;

    slides.forEach((slide, idx) => {
        slide.style.opacity = idx === currentRefugioIndex ? '1' : '0';
        slide.classList.toggle('active', idx === currentRefugioIndex);
    });

    dots.forEach((dot, idx) => {
        dot.style.background = idx === currentRefugioIndex ? '#ffffff' : 'rgba(255,255,255,0.5)';
        dot.style.transform = idx === currentRefugioIndex ? 'scale(1.2)' : 'scale(1)';
    });
}

function nextRefugioSlide() {
    showRefugioSlide(currentRefugioIndex + 1);
    restartRefugioAutoPlay();
}

function prevRefugioSlide() {
    showRefugioSlide(currentRefugioIndex - 1);
    restartRefugioAutoPlay();
}

function goToRefugioSlide(index) {
    showRefugioSlide(index);
    restartRefugioAutoPlay();
}

function startRefugioAutoPlay() {
    if (refugioInterval) clearInterval(refugioInterval);
    refugioInterval = setInterval(() => {
        showRefugioSlide(currentRefugioIndex + 1);
    }, 3500);
}

function restartRefugioAutoPlay() {
    startRefugioAutoPlay();
}

/* Global HTML Escape Helper */
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
window.escapeHTML = escapeHTML;

/* Animated Logo Symbol Line-Drawing Loader Helper */
function getLogoLoaderHTML(loadingText = "Cargando datos desde la nube...") {
    return `
        <div class="logo-loader-box">
            <div class="logo-loader-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 486 326" class="logo-loader-svg" aria-label="Cargando">
                    <path class="logo-loader-path" d="M 257 1 L 254 2 L 252 4 L 251 6 L 250 8 L 246 17 L 240 33 L 232 48 L 229 55 L 227 60 L 227 66 L 231 70 L 237 70 L 241 66 L 243 61 L 245 57 L 247 50 L 255 32 L 256 30 L 259 27 L 262 30 L 264 35 L 269 43 L 270 47 L 280 66 L 282 68 L 284 69 L 381 69 L 383 68 L 385 66 L 387 62 L 390 56 L 395 43 L 401 32 L 404 30 L 405 32 L 406 34 L 411 46 L 412 51 L 415 56 L 418 65 L 419 69 L 420 76 L 420 106 L 419 140 L 416 143 L 413 144 L 408 145 L 389 149 L 382 151 L 375 153 L 372 154 L 370 155 L 367 158 L 367 160 L 368 162 L 371 163 L 374 163 L 383 160 L 390 158 L 409 154 L 413 152 L 417 153 L 417 160 L 416 166 L 414 168 L 412 169 L 394 169 L 381 170 L 374 171 L 371 172 L 369 173 L 368 175 L 368 178 L 369 180 L 374 181 L 382 179 L 394 178 L 407 177 L 411 177 L 413 179 L 412 182 L 411 185 L 408 192 L 407 194 L 406 196 L 404 199 L 402 202 L 399 206 L 393 212 L 387 217 L 384 219 L 380 221 L 374 224 L 369 226 L 365 227 L 357 229 L 351 230 L 341 231 L 329 231 L 312 230 L 304 229 L 298 228 L 293 227 L 284 224 L 277 221 L 272 218 L 269 216 L 265 213 L 256 204 L 253 200 L 251 197 L 249 194 L 248 192 L 247 190 L 245 185 L 241 173 L 240 166 L 239 163 L 237 158 L 231 146 L 229 143 L 226 139 L 223 135 L 212 124 L 208 121 L 204 118 L 199 115 L 194 112 L 192 111 L 190 110 L 185 108 L 176 105 L 172 104 L 168 103 L 161 102 L 142 102 L 135 103 L 130 104 L 126 105 L 119 107 L 114 109 L 102 115 L 97 118 L 93 121 L 89 124 L 79 134 L 75 139 L 73 142 L 71 145 L 66 154 L 64 159 L 61 169 L 60 171 L 55 176 L 41 189 L 31 200 L 22 212 L 20 215 L 18 218 L 15 223 L 12 228 L 10 232 L 7 238 L 3 250 L 2 255 L 1 263 L 1 268 L 2 277 L 3 280 L 4 283 L 5 285 L 6 287 L 8 290 L 16 298 L 19 300 L 21 301 L 23 302 L 28 304 L 32 305 L 38 306 L 54 306 L 61 313 L 64 315 L 72 319 L 75 320 L 80 321 L 88 322 L 188 322 L 191 319 L 191 312 L 188 309 L 186 308 L 174 308 L 93 309 L 85 308 L 81 307 L 78 306 L 70 302 L 62 294 L 60 291 L 59 289 L 58 287 L 57 284 L 56 280 L 55 274 L 56 268 L 57 264 L 60 258 L 66 250 L 67 248 L 68 246 L 69 243 L 70 239 L 71 223 L 71 192 L 72 184 L 73 178 L 74 173 L 75 170 L 76 167 L 78 162 L 81 156 L 87 147 L 102 132 L 105 130 L 110 127 L 118 123 L 123 121 L 126 120 L 133 118 L 138 117 L 147 116 L 156 116 L 165 117 L 170 118 L 174 119 L 177 120 L 182 122 L 186 125 L 188 125 L 190 126 L 199 132 L 204 136 L 210 142 L 215 148 L 218 152 L 221 157 L 222 159 L 223 161 L 225 166 L 228 179 L 232 191 L 238 203 L 244 212 L 255 223 L 259 226 L 262 228 L 265 230 L 279 237 L 288 240 L 292 241 L 296 242 L 302 243 L 310 244 L 326 245 L 348 245 L 356 244 L 361 243 L 365 242 L 375 239 L 380 237 L 384 235 L 390 232 L 393 230 L 396 228 L 401 224 L 411 214 L 414 210 L 416 207 L 418 204 L 420 200 L 423 194 L 427 179 L 429 177 L 431 176 L 434 176 L 457 177 L 465 178 L 469 179 L 477 182 L 483 181 L 484 179 L 484 177 L 483 175 L 481 173 L 478 172 L 474 171 L 470 170 L 464 169 L 452 168 L 432 168 L 430 166 L 430 162 L 431 154 L 432 150 L 434 148 L 438 147 L 445 146 L 455 145 L 473 146 L 479 146 L 481 145 L 482 143 L 482 140 L 479 137 L 474 136 L 453 136 L 445 137 L 439 138 L 438 139 L 433 138 L 433 112 L 435 96 L 434 74 L 433 68 L 432 63 L 431 59 L 430 56 L 427 48 L 420 30 L 414 15 L 411 8 L 410 6 L 406 2 L 400 2 L 397 5 L 394 11 L 390 20 L 383 34 L 378 47 L 375 53 L 372 55 L 315 55 L 304 54 L 296 55 L 293 55 L 291 54 L 289 52 L 285 45 L 277 30 L 265 5 L 262 2 L 260 1 Z M 57 198 L 57 203 L 56 237 L 55 240 L 54 242 L 48 250 L 45 256 L 44 259 L 43 262 L 42 266 L 42 282 L 44 287 L 43 291 L 38 291 L 34 290 L 29 288 L 26 286 L 20 280 L 19 278 L 18 276 L 17 273 L 16 266 L 17 259 L 20 248 L 21 245 L 27 233 L 30 228 L 32 225 L 41 213 L 46 208 L 50 202 L 53 200 Z" fill="currentColor" fill-rule="evenodd" />
                    <path class="logo-loader-detail" d="M 148 228 L 144 229 L 141 231 L 139 234 L 138 237 L 138 240 L 139 243 L 140 245 L 141 247 L 145 254 L 147 256 L 147 257 L 148 258 L 150 259 L 152 260 L 159 260 L 161 259 L 164 256 L 168 249 L 172 241 L 172 237 L 171 234 L 169 232 L 169 231 L 168 230 L 166 229 L 161 228 Z" fill="currentColor" />
                    <path class="logo-loader-detail" d="M 190 200 L 188 201 L 185 204 L 184 206 L 184 211 L 185 213 L 188 216 L 190 217 L 195 217 L 197 216 L 200 213 L 201 211 L 201 206 L 200 204 L 197 201 L 195 200 Z" fill="currentColor" />
                    <path class="logo-loader-detail" d="M 115 200 L 113 201 L 110 204 L 109 206 L 109 211 L 110 213 L 113 216 L 116 217 L 120 217 L 122 216 L 125 213 L 126 211 L 126 206 L 125 204 L 122 201 L 120 200 Z" fill="currentColor" />
                    <path class="logo-loader-detail" d="M 321 149 L 319 150 L 317 151 L 316 152 L 315 154 L 314 156 L 314 162 L 315 165 L 320 174 L 322 177 L 324 179 L 326 180 L 328 181 L 333 181 L 335 180 L 340 175 L 343 170 L 347 162 L 347 156 L 346 154 L 344 151 L 342 150 L 340 149 Z" fill="currentColor" />
                    <path class="logo-loader-detail" d="M 364 121 L 360 125 L 360 133 L 363 136 L 365 137 L 370 137 L 374 135 L 374 134 L 376 132 L 376 126 L 374 124 L 374 123 L 373 122 L 371 121 Z" fill="currentColor" />
                    <path class="logo-loader-detail" d="M 289 121 L 285 125 L 284 129 L 285 133 L 288 136 L 290 137 L 296 137 L 298 136 L 300 134 L 301 132 L 301 126 L 300 124 L 297 121 Z" fill="currentColor" />
                </svg>
            </div>
            <div class="logo-loader-text">
                ${loadingText}
                <span class="logo-loader-dots"><span>.</span><span>.</span><span>.</span></span>
            </div>
        </div>
    `;
}
window.getLogoLoaderHTML = getLogoLoaderHTML;
window.getPawLoaderHTML = getLogoLoaderHTML;

/* ==========================================================================
   HOME SINGLE-SCREEN CAROUSEL LOGIC
   - Automatic movement every 10 seconds.
   - User touch / click stops auto-movement for 30 seconds if idle.
   ========================================================================== */
function initHomeSingleScreenCarousel() {
    const slides = document.querySelectorAll('.home-carousel-wrapper .carousel-slide');
    if (!slides || slides.length === 0) return;

    const prevBtn = document.getElementById('home-carousel-prev');
    const nextBtn = document.getElementById('home-carousel-next');
    const indicatorTabs = document.querySelectorAll('.carousel-indicator-tab');
    const progressFill = document.getElementById('carousel-progress-fill');
    const statusText = document.getElementById('carousel-timer-status-text');

    let currentSlide = 0;
    const totalSlides = slides.length;
    const AUTO_DELAY_MS = 10000;    // 10 segundos
    const USER_PAUSE_MS = 30000;    // 30 segundos

    let autoTimer = null;
    let pauseTimer = null;
    let progressTimer = null;
    let progressStartTime = null;
    let isUserPaused = false;

    function updateProgress(ratio) {
        if (progressFill) {
            const pct = Math.min(Math.max(ratio * 100, 0), 100);
            progressFill.style.width = `${pct}%`;
        }
    }

    function showSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;

        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        indicatorTabs.forEach((tab, i) => {
            if (i === currentSlide) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    function startAutoCycle() {
        stopAutoCycle();
        isUserPaused = false;
        if (statusText) {
            statusText.textContent = `Auto 10s • ${currentSlide + 1}/${totalSlides}`;
        }

        progressStartTime = Date.now();
        updateProgress(0);

        progressTimer = setInterval(() => {
            const elapsed = Date.now() - progressStartTime;
            const ratio = elapsed / AUTO_DELAY_MS;
            updateProgress(ratio);
        }, 80);

        autoTimer = setTimeout(() => {
            showSlide(currentSlide + 1);
            startAutoCycle();
        }, AUTO_DELAY_MS);
    }

    function stopAutoCycle() {
        if (autoTimer) {
            clearTimeout(autoTimer);
            autoTimer = null;
        }
        if (progressTimer) {
            clearInterval(progressTimer);
            progressTimer = null;
        }
        updateProgress(0);
    }

    function handleUserInteraction(nextIndex) {
        // Detiene el movimiento automático por 30 segundos
        stopAutoCycle();
        isUserPaused = true;
        showSlide(nextIndex);

        if (statusText) {
            statusText.textContent = `Pausado (30s) • ${currentSlide + 1}/${totalSlides}`;
        }
        updateProgress(1);

        if (pauseTimer) {
            clearTimeout(pauseTimer);
        }

        pauseTimer = setTimeout(() => {
            isUserPaused = false;
            startAutoCycle();
        }, USER_PAUSE_MS);
    }

    // Attach controls
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleUserInteraction(currentSlide - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleUserInteraction(currentSlide + 1);
        });
    }

    indicatorTabs.forEach((tab, idx) => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            handleUserInteraction(idx);
        });
    });

    // Touch swipe handling
    let touchStartX = 0;
    let touchEndX = 0;
    const carouselContainer = document.querySelector('.carousel-slides-container');

    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) {
                    // Swipe left -> Next
                    handleUserInteraction(currentSlide + 1);
                } else {
                    // Swipe right -> Prev
                    handleUserInteraction(currentSlide - 1);
                }
            }
        }, { passive: true });
    }

    // Initialize first slide and start auto-cycle
    showSlide(0);
    startAutoCycle();
}

/* ==========================================================================
   GLOBAL PDF VIEWER MODAL
   ========================================================================== */
function openPdfViewer(pdfUrl, title = 'Documento Oficial') {
    let modal = document.getElementById('global-pdf-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'global-pdf-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="pdf-modal-container">
                <div class="pdf-modal-header">
                    <h3 id="pdf-modal-title" style="margin: 0; font-size: 1.15rem; color: #fff; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-file-pdf"></i> <span>Documento</span>
                    </h3>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <a id="pdf-modal-download-btn" href="#" download class="btn btn-sm btn-secondary" style="padding: 6px 12px; font-size: 0.82rem;">
                            <i class="fas fa-download"></i> Descargar
                        </a>
                        <button class="modal-close-btn" style="position: static; color: #fff; font-size: 1.3rem;" onclick="closeModal('global-pdf-modal')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="pdf-modal-body">
                    <iframe id="pdf-modal-iframe" src="" title="Visualizador de PDF"></iframe>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    document.getElementById('pdf-modal-title').querySelector('span').innerText = title;
    document.getElementById('pdf-modal-download-btn').href = pdfUrl;
    document.getElementById('pdf-modal-iframe').src = pdfUrl;

    openModal('global-pdf-modal');
}



/* ==========================================================================
   CONTACT FORM LOGIC (INFORMACIÓN / CONTACTO)
   - Opciones: General, Donar, Adoptar un 4 patas, Ser voluntario, Dar tránsito
   - Obligatorios: Nombre y Apellido, Celular, Mail, Nota
   - Pre-armado dinámico de nota por defecto
   ========================================================================== */
const CONTACT_DEFAULT_NOTES = {
    'General': 'Hola, me pongo en contacto con la Asociación Civil Amigos de los Animales No Humanos para realizar la siguiente consulta general: ',
    'Donar': 'Hola, me gustaría recibir información sobre las formas de donar y aportar a la Asociación Civil (donación económica, insumos veterinarios, cartón, aluminio o feria solidaria).',
    'Adoptar un 4 patas': '¡Hola! Me comunico porque tengo mucho interés en adoptar un animalito rescatado de 4 patas (perro o gato). Quisiera conocer los requisitos y el procedimiento de adopción responsable.',
    'Ser voluntario': '¡Hola! Quisiera sumarme como voluntario/a a la Asociación Civil para colaborar en las actividades, eventos, rescates y el cuidado de los animales.',
    'Dar transito': '¡Hola! Deseo ofrecer mi hogar como lugar de tránsito provisorio para albergar y cuidar con amor a un animal rescatado hasta que consiga su familia definitiva.'
};

function initContactForm() {
    const form = document.getElementById('association-contact-form');
    if (!form) return;
    const noteTextarea = document.getElementById('contact-note');
    if (noteTextarea && !noteTextarea.value.trim()) {
        handleContactSubjectChange();
    }
}

function handleContactSubjectChange() {
    const subjectSelect = document.getElementById('contact-subject');
    const noteTextarea = document.getElementById('contact-note');
    if (!subjectSelect || !noteTextarea) return;

    const val = subjectSelect.value;
    const defaultNote = CONTACT_DEFAULT_NOTES[val] || '';
    noteTextarea.value = defaultNote;
}
window.handleContactSubjectChange = handleContactSubjectChange;

function getContactFormData() {
    const subjectEl = document.getElementById('contact-subject');
    const nameEl = document.getElementById('contact-fullname');
    const phoneEl = document.getElementById('contact-phone');
    const emailEl = document.getElementById('contact-email');
    const noteEl = document.getElementById('contact-note');

    if (!subjectEl || !nameEl || !phoneEl || !emailEl || !noteEl) return null;

    const subject = subjectEl.value.trim();
    const name = nameEl.value.trim();
    const phone = phoneEl.value.trim();
    const email = emailEl.value.trim();
    const note = noteEl.value.trim();

    if (!name || !phone || !email || !note) {
        if (typeof showToast === 'function') {
            showToast('Por favor completá todos los campos obligatorios (Nombre, Celular, Mail y Nota).', 'error');
        }
        return null;
    }

    return { subject, name, phone, email, note };
}

function handleContactFormSubmit(event) {
    if (event) event.preventDefault();
    const data = getContactFormData();
    if (!data) return;

    const message = `¡Hola Asociación Civil Amigos de los Animales No Humanos!%0A%0A` +
        `📌 *Motivo:* ${encodeURIComponent(data.subject)}%0A` +
        `👤 *Nombre y Apellido:* ${encodeURIComponent(data.name)}%0A` +
        `📱 *Celular:* ${encodeURIComponent(data.phone)}%0A` +
        `✉️ *Mail:* ${encodeURIComponent(data.email)}%0A%0A` +
        `📝 *Nota / Consulta:*%0A${encodeURIComponent(data.note)}`;

    // Save inquiry locally
    try {
        const saved = JSON.parse(localStorage.getItem('reserva_contact_inquiries') || '[]');
        saved.unshift({ ...data, date: new Date().toISOString() });
        localStorage.setItem('reserva_contact_inquiries', JSON.stringify(saved));
    } catch(e) {}

    // Open WhatsApp
    const whatsappNum = "5493404000000";
    window.open(`https://wa.me/${whatsappNum}?text=${message}`, '_blank');

    if (typeof showToast === 'function') {
        showToast('¡Mensaje preparado! Te redirigimos a WhatsApp para enviarlo a la Asociación.', 'success');
    }
}
window.handleContactFormSubmit = handleContactFormSubmit;

function sendContactByEmail() {
    const data = getContactFormData();
    if (!data) return;

    const emailSubject = encodeURIComponent(`Consulta Web [${data.subject}]: ${data.name}`);
    const emailBody = encodeURIComponent(
        `Asociación Civil Amigos de los Animales No Humanos - Gálvez\n\n` +
        `Motivo: ${data.subject}\n` +
        `Nombre y Apellido: ${data.name}\n` +
        `Celular: ${data.phone}\n` +
        `Mail de contacto: ${data.email}\n\n` +
        `Nota / Mensaje:\n${data.note}\n`
    );

    window.location.href = `mailto:reservacaninagalvez@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    if (typeof showToast === 'function') {
        showToast('Abriendo tu cliente de correo electrónico...', 'info');
    }
}
window.sendContactByEmail = sendContactByEmail;


/* Directorio de veterinarios: copia el número y permite llamar directamente */
function callVet(event, tel, display, name) {
    if (typeof copyToClipboard === 'function') {
        copyToClipboard(display, 'Teléfono de ' + (name || 'Veterinaria'));
    }
    return true;
}
window.callVet = callVet;

/* ==========================================================================
   DIRECTORIO Y MAPA DE VETERINARIAS EN GÁLVEZ
   ========================================================================== */
const VETS_DATA = [
    {
        name: "Axis Clínica Veterinaria",
        address: "Av. 20 de Junio 511, Gálvez, Santa Fe",
        phone: "3404 40-8188",
        phoneClean: "+543404408188",
        lat: -32.0343715,
        lng: -61.2157699
    },
    {
        name: "Kümelen - Clínica de Animales",
        address: "Silvio Arcas 298, Gálvez, Santa Fe",
        phone: "03404 51-7740",
        phoneClean: "+543404517740",
        lat: -32.0371828,
        lng: -61.2162172
    },
    {
        name: "Veterinaria La Estrella",
        address: "Echeverría 204, Gálvez, Santa Fe",
        phone: "03404 40-9679",
        phoneClean: "+543404409679",
        lat: -32.0377853,
        lng: -61.2217952
    },
    {
        name: "Agro Veterinaria Traggiay",
        address: "Belgrano 894, Gálvez, Santa Fe",
        phone: "03404 51-7822",
        phoneClean: "+543404517822",
        lat: -32.0301182,
        lng: -61.2170163
    },
    {
        name: "Veterinaria Czerweny",
        address: "Dorrego 366, Gálvez, Santa Fe",
        phone: "03404 63-2786",
        phoneClean: "+543404632786",
        lat: -32.0304927,
        lng: -61.2166084
    },
    {
        name: "Agroveterinaria Fornari",
        address: "Belgrano 502, Gálvez, Santa Fe",
        phone: "03404 48-1107",
        phoneClean: "+543404481107",
        lat: -32.0328425,
        lng: -61.2220227
    },
    {
        name: "Corazón Animal",
        address: "Santiago de Liniers 1400, Gálvez, Santa Fe",
        phone: "03404 51-7890",
        phoneClean: "+543404517890",
        lat: -32.0179735,
        lng: -61.2221595
    },
    {
        name: "Panambi Veterinaria",
        address: "20 de Junio 803, Gálvez, Santa Fe",
        phone: "03404 59-7860",
        phoneClean: "+543404597860",
        lat: -32.0309301,
        lng: -61.2155373
    },
    {
        name: "Puppies Shop",
        address: "Bartolomé Mitre 1287, Gálvez, Santa Fe",
        phone: "3404 539090",
        phoneClean: "+543404539090",
        lat: -32.0340354,
        lng: -61.2261401
    }
];

function initVetsMap() {
    const mapContainer = document.getElementById('vets-map');
    if (!mapContainer) return;
    if (typeof L === 'undefined') return;

    // Centered on Galvez, Santa Fe
    const map = L.map('vets-map', {
        center: [-32.0305, -61.2195],
        zoom: 14,
        scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const customIcon = L.divIcon({
        className: 'custom-vet-div-icon',
        html: '<div class="vet-marker-pin" title="Veterinaria"><i class="fas fa-user-doctor"></i></div>',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        tooltipAnchor: [0, -20],
        popupAnchor: [0, -18]
    });

    const bounds = L.latLngBounds();

    VETS_DATA.forEach(vet => {
        const marker = L.marker([vet.lat, vet.lng], { icon: customIcon }).addTo(map);
        bounds.extend([vet.lat, vet.lng]);

        // Tooltip hover: indica inmediatamente cuál es
        marker.bindTooltip(`
            <div style="font-weight:700; font-size:0.9rem; color:#fff;">${vet.name}</div>
            <div style="font-size:0.78rem; opacity:0.9; margin-top:2px; color:#e0ece0;"><i class="fas fa-map-marker-alt"></i> ${vet.address}</div>
            <div style="font-size:0.78rem; opacity:0.9; color:#f0f7f0;"><i class="fas fa-phone"></i> ${vet.phone}</div>
        `, {
            direction: 'top',
            className: 'vet-map-tooltip',
            opacity: 0.98,
            offset: [0, -18]
        });

        // Popup clic
        marker.bindPopup(`
            <div style="padding: 6px; font-family: inherit;">
                <h4 style="margin: 0 0 6px 0; color: #174A4A; font-size: 1.05rem; display: flex; align-items: center; gap: 6px;">
                    <i class="fas fa-user-doctor" style="color: #C96545;"></i> ${vet.name}
                </h4>
                <p style="margin: 0 0 6px 0; font-size: 0.85rem; color: #444;">
                    <i class="fas fa-map-marker-alt" style="color: #C96545;"></i> ${vet.address}
                </p>
                <p style="margin: 0 0 10px 0; font-size: 0.85rem; color: #444;">
                    <i class="fas fa-phone" style="color: #174A4A;"></i> Tel: <strong>${vet.phone}</strong>
                </p>
                <a href="tel:${vet.phoneClean}" onclick="return callVet(event, '${vet.phoneClean}', '${vet.phone}', '${vet.name}')" 
                   style="display: inline-flex; align-items: center; gap: 6px; background: #174A4A; color: white; padding: 7px 14px; border-radius: 6px; font-size: 0.82rem; text-decoration: none; font-weight: 600;">
                    <i class="fas fa-phone"></i> Llamar ahora
                </a>
            </div>
        `);
    });

    if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [35, 35] });
    }
}
window.initVetsMap = initVetsMap;
