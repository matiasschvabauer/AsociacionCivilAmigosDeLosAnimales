/* ==========================================================================
   ASOCIACIÓN CIVIL AMIGOS DE LOS ANIMALES - HISTORIAS MODULE
   Relatos de rescates, superación y comunidad con gestión local de administración
   ========================================================================== */

const HISTORIAS_STORAGE_KEY = 'reserva_historias_items';

const DEFAULT_HISTORIAS = [
    {
        id: 'hist_1',
        title: 'El rescate de Wilson en los caminos rurales de Gálvez',
        category: 'Rescate Urgente',
        protagonist: 'Wilson',
        date: 'Septiembre 2024',
        author: 'Equipo de Rescate Asociación Civil',
        photo: 'assets/img/Animales de la reserva real/Wilson1.jpg',
        excerpt: 'Wilson fue encontrado desorientado y debilitado en la zona rural. Hoy está totalmente recuperado y esperando a su familia ideal.',
        story: `Una tarde lluviosa de septiembre recibimos el llamado de un vecino alertando sobre un perro que no podía levantarse a la vera de un camino rural en las afueras de Gálvez.\n\nEl equipo de voluntarios se trasladó rápidamente al lugar y encontró a Wilson: un animal noble, asustado y con claros signos de desnutrición. Lo trasladamos de urgencia para su primera atención veterinaria, donde se le realizaron análisis, hidratación y plan de curaciones.\n\nCon semanas de paciencia, cuidados y una alimentación adecuada, Wilson demostró una fortaleza conmovedora. Hoy corre contento, mueve la cola con alegría ante cada visitante del refugio y representa el espíritu de perseverancia que nos impulsa a seguir trabajando día a día.`
    },
    {
        id: 'hist_2',
        title: 'La recuperación de Leopoldo: Cuando la comunidad no se rinde',
        category: 'Superación y Salud',
        protagonist: 'Leopoldo',
        date: 'Octubre 2024',
        author: 'Voluntarios Gálvez',
        photo: 'assets/img/Animales de la reserva real/Leopoldo1.jpg',
        excerpt: 'Leopoldo requirió curaciones complejas y cuidados diarios. Su mirada cambió por completo gracias a la dedicación recibida.',
        story: `El caso de Leopoldo nos marcó profundamente a todos los integrantes de la asociación. Llegó con heridas complejas que demandaban limpieza dos veces al día y vendajes especiales.\n\nGracias a la colaboración de vecinos que donaron insumos médicos y a la constancia de los voluntarios que nunca faltaron a sus turnos de curaciones, las heridas comenzaron a cicatrizar. Poco a poco volvió a mover su cola y a esperar con ansias su comida favorita.\n\nHistorias como la de Leopoldo nos recuerdan que cada vida vale la pena y que la empatía ciudadana es el motor indispensable para transformar la realidad de los animales no humanos.`
    },
    {
        id: 'hist_3',
        title: 'Jornadas comunitarias: La castración masiva salva vidas',
        category: 'Castración y Prevención',
        protagonist: 'Comunidad de Gálvez',
        date: 'Julio 2024',
        author: 'Asociación Civil Amigos de los Animales',
        photo: 'assets/img/Portada inicio.png',
        excerpt: 'Nuestra labor diaria no solo es rescatar, sino prevenir la superpoblación y el abandono mediante castraciones y concientización.',
        story: `La castración masiva, temprana y sistemática es el único método ético y eficaz para terminar con la sobrepoblación y el sufrimiento en las calles.\n\nDurante este último año hemos articulado esfuerzos para asistir a familias con dificultades para trasladar a sus animales, promoviendo turnos de castración y vacunación antirrábica en distintos barrios de nuestra ciudad.\n\nDetrás de cada intervención hay voluntarios que gestionan turnos, transportan animales y contienen a los vecinos. Cada castración evita miles de nacimientos no planificados y futuros abandonos.`
    }
];

let historiasList = [];
let currentCategoryFilter = 'all';
let currentSearchQuery = '';
let currentSortOrder = 'newest';

document.addEventListener('DOMContentLoaded', () => {
    initHistorias();
});

function initHistorias() {
    loadHistoriasData();
    setupHistoriasFilters();
    setupHistoriasModals();
    renderHistoriasList();
}

function loadHistoriasData() {
    const saved = localStorage.getItem(HISTORIAS_STORAGE_KEY);
    if (saved) {
        try {
            historiasList = JSON.parse(saved);
        } catch (e) {
            historiasList = [...DEFAULT_HISTORIAS];
        }
    } else {
        historiasList = [...DEFAULT_HISTORIAS];
        saveHistoriasData();
    }
}

function saveHistoriasData() {
    localStorage.setItem(HISTORIAS_STORAGE_KEY, JSON.stringify(historiasList));
}

function setupHistoriasFilters() {
    const filterButtons = document.querySelectorAll('.hist-filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategoryFilter = btn.dataset.filter || 'all';
            renderHistoriasList();
        });
    });

    const searchInput = document.getElementById('hist-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value.toLowerCase().trim();
            renderHistoriasList();
        });
    }

    const sortSelect = document.getElementById('hist-sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSortOrder = e.target.value;
            renderHistoriasList();
        });
    }
}

function renderHistoriasList() {
    const grid = document.getElementById('historias-grid');
    const countEl = document.getElementById('hist-count-display');
    const addBtn = document.getElementById('add-historia-btn');

    const isAdmin = typeof currentUser !== 'undefined' && currentUser && currentUser.isAdmin;

    if (addBtn) {
        addBtn.style.display = isAdmin ? 'inline-flex' : 'none';
    }

    if (!grid) return;

    let filtered = historiasList.filter(item => {
        const matchesCategory = (currentCategoryFilter === 'all') ||
            (currentCategoryFilter === 'rescate' && item.category && item.category.toLowerCase().includes('rescate')) ||
            (currentCategoryFilter === 'superacion' && item.category && item.category.toLowerCase().includes('superaci')) ||
            (currentCategoryFilter === 'castracion' && item.category && item.category.toLowerCase().includes('castra')) ||
            (currentCategoryFilter === 'comunidad' && item.category && item.category.toLowerCase().includes('comunidad'));

        const matchesQuery = !currentSearchQuery ||
            item.title.toLowerCase().includes(currentSearchQuery) ||
            (item.protagonist && item.protagonist.toLowerCase().includes(currentSearchQuery)) ||
            (item.excerpt && item.excerpt.toLowerCase().includes(currentSearchQuery)) ||
            (item.story && item.story.toLowerCase().includes(currentSearchQuery));

        return matchesCategory && matchesQuery;
    });

    if (countEl) {
        countEl.innerText = `${filtered.length} historia${filtered.length === 1 ? '' : 's'} publicada${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: white; border-radius: var(--radius-md); border: 1px dashed var(--border-color); box-shadow: var(--shadow-sm);">
                <i class="fas fa-book-open" style="font-size: 3rem; color: #8FA58A; margin-bottom: 14px;"></i>
                <h3 style="color: var(--primary); font-size: 1.3rem; margin-bottom: 8px;">No se encontraron historias</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 450px; margin: 0 auto 16px auto;">Probá seleccionando otra categoría o cambiando las palabras de búsqueda.</p>
                ${isAdmin ? `<button class="btn btn-secondary" onclick="openHistoriaEditModal()"><i class="fas fa-plus"></i> Publicar la primera historia</button>` : ''}
            </div>
        `;
        return;
    }

    // Sorting: newest vs oldest
    let displayList = [...filtered];
    if (currentSortOrder === 'oldest') {
        displayList.reverse();
    }

    const cardsHTML = [];
    for (let i = 0; i < displayList.length; i++) {
        const item = displayList[i];
        const isOdd = (i % 2 !== 0);

        cardsHTML.push(`
            <article class="historia-row-card ${isOdd ? 'reverse' : ''}" id="hist-card-${item.id}">
                <div class="historia-row-media" onclick="openHistoriaDetailModal('${item.id}')" title="Leer historia completa">
                    <img src="${item.photo || 'assets/img/cropped_circle_image.png'}" 
                         alt="${item.title}" 
                         onerror="this.src='assets/img/cropped_circle_image.png'">
                    
                    <div style="position: absolute; top: 14px; left: 14px; display: flex; gap: 6px; flex-wrap: wrap; z-index: 2;">
                        <span class="badge" style="background: rgba(23, 74, 74, 0.94); color: #fff; backdrop-filter: blur(4px); font-size: 0.76rem; padding: 5px 12px; border-radius: 20px; font-weight: 700;">
                            <i class="fas fa-tag"></i> ${item.category || 'Historia'}
                        </span>
                        ${item.protagonist ? `
                            <span class="badge" style="background: rgba(201, 101, 69, 0.94); color: #fff; backdrop-filter: blur(4px); font-size: 0.76rem; padding: 5px 12px; border-radius: 20px; font-weight: 700;">
                                <i class="fas fa-paw"></i> ${item.protagonist}
                            </span>
                        ` : ''}
                    </div>

                    ${isAdmin ? `
                        <div style="position: absolute; top: 14px; right: 14px; display: flex; gap: 6px; z-index: 3;" onclick="event.stopPropagation()">
                            <button class="btn btn-sm" onclick="openHistoriaEditModal('${item.id}')" title="Editar" style="background: white; color: var(--primary); width: 34px; height: 34px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: none; cursor: pointer;">
                                <i class="fas fa-pen" style="font-size: 0.85rem;"></i>
                            </button>
                            <button class="btn btn-sm" onclick="deleteHistoria('${item.id}')" title="Eliminar" style="background: white; color: #dc2626; width: 34px; height: 34px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: none; cursor: pointer;">
                                <i class="fas fa-trash-alt" style="font-size: 0.85rem;"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>

                <div class="historia-row-body">
                    <div class="historia-row-meta">
                        <span><i class="fas fa-calendar-alt" style="color: var(--secondary);"></i> ${item.date || 'Reciente'}</span>
                        ${item.author ? `• <span><i class="fas fa-user-edit" style="color: #8FA58A;"></i> ${item.author}</span>` : ''}
                    </div>
                    <h3 class="historia-row-title">${item.title}</h3>
                    <p class="historia-row-excerpt">
                        ${item.excerpt || (item.story ? item.story.substring(0, 160) + '...' : '')}
                    </p>
                    <div>
                        <button class="btn btn-outline btn-sm" onclick="openHistoriaDetailModal('${item.id}')" style="font-weight: 700;">
                            <i class="fas fa-book-open"></i> Leer historia completa
                        </button>
                    </div>
                </div>
            </article>
        `);

        // Caminito de patitas entre historias consecutivas con zig-zag pronunciado
        if (i < displayList.length - 1) {
            cardsHTML.push(`
                <div class="paw-path-divider">
                    <div class="paw-track" aria-hidden="true">
                        <span class="paw-step dog-paw step-1" title="Huella canina"><i class="fas fa-paw"></i></span>
                        <span class="paw-step cat-paw step-2" title="Huella felina"><svg class="cat-paw-svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="display: block;">
    <ellipse cx="6" cy="8.5" rx="1.8" ry="2.5" transform="rotate(-25 6 8.5)"/>
    <ellipse cx="9.8" cy="5.8" rx="1.8" ry="2.6" transform="rotate(-8 9.8 5.8)"/>
    <ellipse cx="14.2" cy="5.8" rx="1.8" ry="2.6" transform="rotate(8 14.2 5.8)"/>
    <ellipse cx="18" cy="8.5" rx="1.8" ry="2.5" transform="rotate(25 18 8.5)"/>
    <path d="M12 11 C9 11, 6.8 13.5, 7.2 16.5 C7.5 19, 9.5 20.5, 12 20.5 C14.5 20.5, 16.5 19, 16.8 16.5 C17.2 13.5, 15 11, 12 11 Z"/>
</svg></span>
                        <span class="paw-step dog-paw step-3" title="Huella canina"><i class="fas fa-paw"></i></span>
                        <span class="paw-step cat-paw step-4" title="Huella felina"><svg class="cat-paw-svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="display: block;">
    <ellipse cx="6" cy="8.5" rx="1.8" ry="2.5" transform="rotate(-25 6 8.5)"/>
    <ellipse cx="9.8" cy="5.8" rx="1.8" ry="2.6" transform="rotate(-8 9.8 5.8)"/>
    <ellipse cx="14.2" cy="5.8" rx="1.8" ry="2.6" transform="rotate(8 14.2 5.8)"/>
    <ellipse cx="18" cy="8.5" rx="1.8" ry="2.5" transform="rotate(25 18 8.5)"/>
    <path d="M12 11 C9 11, 6.8 13.5, 7.2 16.5 C7.5 19, 9.5 20.5, 12 20.5 C14.5 20.5, 16.5 19, 16.8 16.5 C17.2 13.5, 15 11, 12 11 Z"/>
</svg></span>
                        <span class="paw-step dog-paw step-5" title="Huella canina"><i class="fas fa-paw"></i></span>
                    </div>
                </div>
            `);
        }
    }

    grid.innerHTML = cardsHTML.join('');
}

function setupHistoriasModals() {
    // 1. Ensure Edit Modal exists
    if (!document.getElementById('historia-edit-modal')) {
        const modal = document.createElement('div');
        modal.id = 'historia-edit-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container" style="max-width: 620px; max-height: 90vh; overflow-y: auto;">
                <button class="modal-close-btn" onclick="closeModal('historia-edit-modal')"><i class="fas fa-times"></i></button>
                <div style="margin-bottom: 20px;">
                    <span class="badge badge-secondary" style="margin-bottom: 6px;">Gestión de Publicaciones</span>
                    <h2 id="hist-modal-title" style="color: var(--primary); font-size: 1.45rem; margin: 0;">Publicar Nueva Historia</h2>
                    <p style="color: var(--text-muted); font-size: 0.88rem; margin: 4px 0 0 0;">Relatá un rescate, proceso de recuperación o logro comunitario.</p>
                </div>

                <form id="historia-form" onsubmit="handleHistoriaSubmit(event)">
                    <input type="hidden" id="hist-item-id">

                    <div style="margin-bottom: 14px;">
                        <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-main);">Título de la Historia *</label>
                        <input type="text" id="hist-title" required placeholder="Ej: El emotivo rescate de Wilson..." style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.95rem;">
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                        <div>
                            <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-main);">Categoría *</label>
                            <select id="hist-category" required style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.95rem;">
                                <option value="Rescate Urgente">Rescate Urgente</option>
                                <option value="Superación y Salud">Superación y Salud</option>
                                <option value="Castración y Prevención">Castración y Prevención</option>
                                <option value="Comunidad & Voluntariado">Comunidad & Voluntariado</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-main);">Protagonista / Mascota</label>
                            <input type="text" id="hist-protagonist" placeholder="Ej: Toby, Michi Oliver, Barrio Este" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.95rem;">
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                        <div>
                            <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-main);">Fecha *</label>
                            <input type="text" id="hist-date" required placeholder="Ej: Octubre 2024" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.95rem;">
                        </div>
                        <div>
                            <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-main);">Autor / Redactado por</label>
                            <input type="text" id="hist-author" placeholder="Ej: Equipo Voluntario Gálvez" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.95rem;">
                        </div>
                    </div>

                    <!-- Photo Upload with Preview -->
                    <div style="margin-bottom: 14px; background: var(--bg-main); padding: 14px; border-radius: var(--radius-sm); border: 1px dashed var(--border-color);">
                        <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-main);">
                            <i class="fas fa-camera" style="color: var(--secondary);"></i> Foto de Portada
                        </label>
                        <input type="file" id="hist-photo-file" accept="image/*" onchange="handleHistoriaPhotoSelect(event)" style="margin-bottom: 8px; font-size: 0.88rem;">
                        <input type="text" id="hist-photo-url" placeholder="O pegá la URL directa de la imagen" style="width: 100%; padding: 8px 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.88rem;">
                        <div id="hist-photo-preview-box" style="margin-top: 10px; display: none; text-align: center;">
                            <img id="hist-photo-preview" src="" alt="Previsualización" style="max-height: 140px; border-radius: 8px; box-shadow: var(--shadow-sm); border: 2px solid white;">
                        </div>
                    </div>

                    <div style="margin-bottom: 14px;">
                        <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-main);">Resumen Breve (para la tarjeta) *</label>
                        <input type="text" id="hist-excerpt" required placeholder="Breve introducción para la vista previa..." style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.95rem;">
                    </div>

                    <div style="margin-bottom: 18px;">
                        <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-main);">Relato Completo de la Historia *</label>
                        <textarea id="hist-story" rows="5" required placeholder="Escribí los párrafos completos del rescate, la superación y el trabajo solidario..." style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.95rem; resize: vertical;"></textarea>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px;">
                        <button type="button" class="btn btn-outline" onclick="closeModal('historia-edit-modal')">Cancelar</button>
                        <button type="submit" class="btn btn-secondary" style="font-weight: 700;">
                            <i class="fas fa-save"></i> Guardar Historia
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // 2. Ensure Detail Reader Modal exists
    if (!document.getElementById('historia-detail-modal')) {
        const detailModal = document.createElement('div');
        detailModal.id = 'historia-detail-modal';
        detailModal.className = 'modal-overlay';
        detailModal.innerHTML = `
            <div class="modal-container" style="max-width: 680px; max-height: 90vh; overflow-y: auto; padding: 0;">
                <div style="position: relative; height: 320px; background: #174A4A; overflow: hidden;">
                    <img id="hist-detail-img" src="" alt="Portada" style="width: 100%; height: 100%; object-fit: cover;">
                    <button class="modal-close-btn" onclick="closeModal('historia-detail-modal')" style="position: absolute; top: 14px; right: 14px; background: rgba(0,0,0,0.5); color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                    <div style="position: absolute; bottom: 14px; left: 16px; display: flex; gap: 8px;">
                        <span id="hist-detail-category" class="badge" style="background: rgba(23, 74, 74, 0.95); color: #fff; font-size: 0.8rem; padding: 5px 12px; border-radius: 20px;"></span>
                        <span id="hist-detail-protagonist" class="badge" style="background: rgba(201, 101, 69, 0.95); color: #fff; font-size: 0.8rem; padding: 5px 12px; border-radius: 20px;"></span>
                    </div>
                </div>

                <div style="padding: 26px;">
                    <div style="margin-bottom: 16px;">
                        <h2 id="hist-detail-title" style="font-size: 1.7rem; color: var(--primary); margin-bottom: 8px; font-weight: 800; line-height: 1.3;"></h2>
                        <div style="display: flex; align-items: center; gap: 12px; font-size: 0.88rem; color: var(--text-muted); flex-wrap: wrap;">
                            <span id="hist-detail-date"><i class="fas fa-calendar-alt" style="color: var(--secondary);"></i> </span>
                            <span id="hist-detail-author"><i class="fas fa-user-edit" style="color: #8FA58A;"></i> </span>
                        </div>
                    </div>

                    <div style="background: var(--bg-main); border-left: 4px solid var(--secondary); padding: 14px 18px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; margin-bottom: 20px;">
                        <p id="hist-detail-excerpt" style="font-size: 0.96rem; font-style: italic; color: var(--text-main); line-height: 1.5; margin: 0;"></p>
                    </div>

                    <div id="hist-detail-story" style="font-size: 0.98rem; color: var(--text-main); line-height: 1.75; margin-bottom: 24px; white-space: pre-line;"></div>

                    <div style="background: #eef4f1; border-radius: var(--radius-sm); padding: 16px; display: flex; align-items: center; gap: 14px;">
                        <i class="fas fa-book-open" style="font-size: 1.8rem; color: var(--primary); flex-shrink: 0;"></i>
                        <div style="font-size: 0.85rem; color: var(--primary); line-height: 1.45;">
                            <strong>Cada rescate cuenta una historia.</strong> Sumate colaborando como voluntario, dando tránsito o aportando a la Asociación Civil Amigos de los Animales.
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(detailModal);
    }
}

function handleHistoriaPhotoSelect(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        const preview = document.getElementById('hist-photo-preview');
        const box = document.getElementById('hist-photo-preview-box');
        if (preview && box) {
            preview.src = evt.target.result;
            box.style.display = 'block';
        }
    };
    reader.readAsDataURL(file);
}

function openHistoriaEditModal(id = null) {
    setupHistoriasModals();
    const modalTitle = document.getElementById('hist-modal-title');
    const form = document.getElementById('historia-form');
    const previewBox = document.getElementById('hist-photo-preview-box');
    const previewImg = document.getElementById('hist-photo-preview');

    form.reset();
    if (previewBox) previewBox.style.display = 'none';

    if (id) {
        const item = historiasList.find(x => x.id === id);
        if (!item) return;

        modalTitle.innerText = 'Editar Historia: ' + item.title;
        document.getElementById('hist-item-id').value = item.id;
        document.getElementById('hist-title').value = item.title || '';
        document.getElementById('hist-category').value = item.category || 'Rescate Urgente';
        document.getElementById('hist-protagonist').value = item.protagonist || '';
        document.getElementById('hist-date').value = item.date || '';
        document.getElementById('hist-author').value = item.author || '';
        document.getElementById('hist-photo-url').value = item.photo && !item.photo.startsWith('data:') ? item.photo : '';
        document.getElementById('hist-excerpt').value = item.excerpt || '';
        document.getElementById('hist-story').value = item.story || '';

        if (item.photo && previewBox && previewImg) {
            previewImg.src = item.photo;
            previewBox.style.display = 'block';
        }
    } else {
        modalTitle.innerText = 'Publicar Nueva Historia';
        document.getElementById('hist-item-id').value = '';
        document.getElementById('hist-date').value = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(new Date());
        document.getElementById('hist-author').value = 'Equipo Voluntario Gálvez';
    }

    openModal('historia-edit-modal');
}

function handleHistoriaSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('hist-item-id').value;
    const title = document.getElementById('hist-title').value.trim();
    const category = document.getElementById('hist-category').value;
    const protagonist = document.getElementById('hist-protagonist').value.trim();
    const date = document.getElementById('hist-date').value.trim();
    const author = document.getElementById('hist-author').value.trim();
    const photoUrl = document.getElementById('hist-photo-url').value.trim();
    const previewImg = document.getElementById('hist-photo-preview');
    const excerpt = document.getElementById('hist-excerpt').value.trim();
    const story = document.getElementById('hist-story').value.trim();

    let finalPhoto = 'assets/img/cropped_circle_image.png';
    if (previewImg && previewImg.src && previewImg.src.startsWith('data:image')) {
        finalPhoto = previewImg.src;
    } else if (photoUrl) {
        finalPhoto = photoUrl;
    } else if (id) {
        const existing = historiasList.find(x => x.id === id);
        if (existing && existing.photo) finalPhoto = existing.photo;
    }

    if (id) {
        const index = historiasList.findIndex(x => x.id === id);
        if (index !== -1) {
            historiasList[index] = {
                ...historiasList[index],
                title,
                category,
                protagonist,
                date,
                author,
                photo: finalPhoto,
                excerpt,
                story
            };
            showToast(`¡Historia "${title}" actualizada!`, 'success');
        }
    } else {
        const newItem = {
            id: 'hist_' + Date.now(),
            title,
            category,
            protagonist,
            date,
            author,
            photo: finalPhoto,
            excerpt,
            story
        };
        historiasList.unshift(newItem);
        showToast(`¡Historia "${title}" publicada con éxito!`, 'success');
    }

    saveHistoriasData();
    renderHistoriasList();
    closeModal('historia-edit-modal');
}

function deleteHistoria(id) {
    const item = historiasList.find(x => x.id === id);
    if (!item) return;

    if (confirm(`¿Estás seguro/a de que querés eliminar la historia "${item.title}"? Esta acción se aplicará localmente.`)) {
        historiasList = historiasList.filter(x => x.id !== id);
        saveHistoriasData();
        renderHistoriasList();
        showToast(`Historia eliminada.`, 'info');
    }
}

function openHistoriaDetailModal(id) {
    const item = historiasList.find(x => x.id === id);
    if (!item) return;

    setupHistoriasModals();

    const img = document.getElementById('hist-detail-img');
    const category = document.getElementById('hist-detail-category');
    const protagonist = document.getElementById('hist-detail-protagonist');
    const title = document.getElementById('hist-detail-title');
    const date = document.getElementById('hist-detail-date');
    const author = document.getElementById('hist-detail-author');
    const excerpt = document.getElementById('hist-detail-excerpt');
    const story = document.getElementById('hist-detail-story');

    if (img) img.src = item.photo || 'assets/img/cropped_circle_image.png';
    if (category) category.innerHTML = `<i class="fas fa-tag"></i> ${item.category || 'Historia'}`;
    if (protagonist) {
        protagonist.innerHTML = item.protagonist ? `<i class="fas fa-paw"></i> ${item.protagonist}` : '';
        protagonist.style.display = item.protagonist ? 'inline-block' : 'none';
    }
    if (title) title.innerText = item.title;
    if (date) date.innerHTML = `<i class="fas fa-calendar-alt" style="color: var(--secondary);"></i> ${item.date || 'Reciente'}`;
    if (author) {
        author.innerHTML = item.author ? `<i class="fas fa-user-edit" style="color: #8FA58A;"></i> ${item.author}` : '';
        author.style.display = item.author ? 'inline-block' : 'none';
    }
    if (excerpt) excerpt.innerText = `"${item.excerpt || ''}"`;
    if (story) story.innerText = item.story || item.excerpt || 'Relato en preparación.';

    openModal('historia-detail-modal');
}

