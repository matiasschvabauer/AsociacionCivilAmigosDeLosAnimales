/* ==========================================================================
   ASOCIACIÓN CIVIL AMIGOS DE LOS ANIMALES - FINAL FELIZ MODULE
   Adopciones exitosas y animales recuperados con gestión local de administración
   ========================================================================== */

const FINAL_FELIZ_STORAGE_KEY = 'reserva_final_feliz_items';

const DEFAULT_FINAL_FELIZ = [
    {
        id: 'ff_1',
        name: 'Lupin',
        species: 'perro',
        statusType: 'Adoptado/a con Familia Definitiva',
        date: 'Noviembre 2024',
        family: 'Familia Pereyra',
        photo: 'assets/img/Animales de la reserva real/Lupin.jpg',
        photoBefore: '',
        excerpt: 'Lupin llegó al refugio con mucho miedo y timidez. Hoy es el rey de la casa y comparte sus días jugando en un patio grande.',
        story: 'Lupin fue rescatado de la vía pública en condiciones difíciles. Con el cariño y dedicación constante de los voluntarios, recuperó su peso ideal y confianza en los humanos. En noviembre de 2024, la familia Pereyra vino a conocerlo y la conexión fue inmediata. Hoy duerme adentro, disfruta de paseos diarios y es un miembro indispensable de su nueva familia.'
    },
    {
        id: 'ff_2',
        name: 'Luna',
        species: 'perro',
        statusType: 'Adoptado/a con Familia Definitiva',
        date: 'Agosto 2024',
        family: 'Sofía y Familia',
        photo: 'assets/img/dog_luna.jpg',
        photoBefore: '',
        excerpt: 'Superó un cuadro de salud delicado y hoy corre con alegría junto a Sofía. Un gran testimonio de superación y amor.',
        story: 'Luna necesitó atención veterinaria intensiva y cuidados especiales durante varias semanas tras ser rescatada. Gracias a los aportes de la comunidad y la ayuda veterinaria en Gálvez, salió adelante con una alegría contagiosa. Sofía decidió adoptarla formalmente y darle el hogar cálido y seguro que siempre mereció.'
    },
    {
        id: 'ff_3',
        name: 'Pumba',
        species: 'perro',
        statusType: 'Recuperado/a y en Hogar Definitivo',
        date: 'Octubre 2024',
        family: 'Familia Martínez',
        photo: 'assets/img/Animales de la reserva real/Pumba1.jpg',
        photoBefore: '',
        excerpt: 'Pumba demostró una ternura inigualable. Pasó del abandono a tener su propia cucha, juguetes y cuidados de por vida.',
        story: 'Pumba fue encontrado desorientado y con bajo peso. En la asociación recibió sus vacunas, plan sanitario y mucho amor. Hoy vive en una hermosa casa donde lo miman día y noche. ¡Gracias a toda la comunidad que hace posible que más animales tengan su final feliz!'
    }
];

let finalFelizList = [];
let currentSpeciesFilter = 'all';
let currentSearchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    initFinalFeliz();
});

function initFinalFeliz() {
    loadFinalFelizData();
    setupFinalFelizFilters();
    setupFinalFelizModals();
    renderFinalFelizList();
}

function loadFinalFelizData() {
    const saved = localStorage.getItem(FINAL_FELIZ_STORAGE_KEY);
    if (saved) {
        try {
            finalFelizList = JSON.parse(saved);
        } catch (e) {
            finalFelizList = [...DEFAULT_FINAL_FELIZ];
        }
    } else {
        finalFelizList = [...DEFAULT_FINAL_FELIZ];
        saveFinalFelizData();
    }
}

function saveFinalFelizData() {
    localStorage.setItem(FINAL_FELIZ_STORAGE_KEY, JSON.stringify(finalFelizList));
}

function setupFinalFelizFilters() {
    const filterButtons = document.querySelectorAll('.ff-filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSpeciesFilter = btn.dataset.filter || 'all';
            renderFinalFelizList();
        });
    });

    const searchInput = document.getElementById('ff-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value.toLowerCase().trim();
            renderFinalFelizList();
        });
    }
}

function renderFinalFelizList() {
    const grid = document.getElementById('final-feliz-grid');
    const countEl = document.getElementById('ff-count-display');
    const addBtn = document.getElementById('add-final-feliz-btn');

    const isAdmin = typeof currentUser !== 'undefined' && currentUser && currentUser.isAdmin;

    if (addBtn) {
        addBtn.style.display = isAdmin ? 'inline-flex' : 'none';
    }

    if (!grid) return;

    let filtered = finalFelizList.filter(item => {
        const matchesSpecies = (currentSpeciesFilter === 'all') ||
            (currentSpeciesFilter === 'perro' && item.species === 'perro') ||
            (currentSpeciesFilter === 'gato' && item.species === 'gato') ||
            (currentSpeciesFilter === 'recuperado' && item.statusType && item.statusType.toLowerCase().includes('recuperad'));

        const matchesQuery = !currentSearchQuery ||
            item.name.toLowerCase().includes(currentSearchQuery) ||
            (item.family && item.family.toLowerCase().includes(currentSearchQuery)) ||
            (item.excerpt && item.excerpt.toLowerCase().includes(currentSearchQuery)) ||
            (item.story && item.story.toLowerCase().includes(currentSearchQuery));

        return matchesSpecies && matchesQuery;
    });

    if (countEl) {
        countEl.innerText = `${filtered.length} historia${filtered.length === 1 ? '' : 's'} de final feliz`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: white; border-radius: var(--radius-md); border: 1px dashed var(--border-color); box-shadow: var(--shadow-sm);">
                <i class="fas fa-heart-crack" style="font-size: 3rem; color: #8FA58A; margin-bottom: 14px;"></i>
                <h3 style="color: var(--primary); font-size: 1.3rem; margin-bottom: 8px;">No se encontraron historias con ese filtro</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 450px; margin: 0 auto 16px auto;">Probá seleccionando otra categoría o limpiando la búsqueda.</p>
                ${isAdmin ? `<button class="btn btn-secondary" onclick="openFinalFelizEditModal()"><i class="fas fa-plus"></i> Agregar la primera historia</button>` : ''}
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(item => {
        const isCat = item.species === 'gato';
        const speciesLabel = isCat ? 'Gato' : 'Perro';
        const speciesIcon = isCat ? 'fa-cat' : 'fa-dog';

        return `
            <article class="final-feliz-card" id="ff-card-${item.id}">
                <div class="ff-photo-wrapper" onclick="openFinalFelizDetailModal('${item.id}')" title="Ver historia y foto completa de ${item.name}">
                    <img src="${item.photo || 'assets/img/cropped_circle_image.png'}" 
                         alt="Final feliz de ${item.name}" 
                         onerror="this.src='assets/img/cropped_circle_image.png'">
                    
                    <div style="position: absolute; top: 12px; left: 12px; display: flex; gap: 6px; flex-wrap: wrap; z-index: 2;">
                        <span class="badge" style="background: rgba(23, 74, 74, 0.92); color: #fff; backdrop-filter: blur(4px); font-size: 0.75rem; padding: 4px 10px; border-radius: 20px; font-weight: 700;">
                            <i class="fas ${speciesIcon}"></i> ${speciesLabel}
                        </span>
                        <span class="badge" style="background: rgba(201, 101, 69, 0.94); color: #fff; backdrop-filter: blur(4px); font-size: 0.75rem; padding: 4px 10px; border-radius: 20px; font-weight: 700;">
                            <i class="fas fa-heart"></i> ¡Adoptado!
                        </span>
                    </div>

                    <span class="ff-zoom-badge"><i class="fas fa-expand"></i> Ver foto completa</span>

                    ${isAdmin ? `
                        <div style="position: absolute; top: 12px; right: 12px; display: flex; gap: 6px; z-index: 3;" onclick="event.stopPropagation()">
                            <button class="btn btn-sm" onclick="openFinalFelizEditModal('${item.id}')" title="Editar" style="background: white; color: var(--primary); width: 34px; height: 34px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: none; cursor: pointer;">
                                <i class="fas fa-pen" style="font-size: 0.85rem;"></i>
                            </button>
                            <button class="btn btn-sm" onclick="deleteFinalFeliz('${item.id}')" title="Eliminar" style="background: white; color: #dc2626; width: 34px; height: 34px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: none; cursor: pointer;">
                                <i class="fas fa-trash-alt" style="font-size: 0.85rem;"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>

                <div style="padding: 22px; display: flex; flex-direction: column; flex-grow: 1;">
                    <div style="margin-bottom: 10px;">
                        <h3 style="font-size: 1.35rem; color: var(--primary); margin-bottom: 4px; font-weight: 800;">${item.name}</h3>
                        <p style="font-size: 0.84rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px; margin: 0;">
                            <i class="fas fa-calendar-alt" style="color: var(--secondary);"></i> ${item.date || 'Adoptado recientemente'}
                            ${item.family ? `• <i class="fas fa-home" style="color: #8FA58A;"></i> ${item.family}` : ''}
                        </p>
                    </div>

                    <p style="font-size: 0.92rem; color: var(--text-main); line-height: 1.55; margin-bottom: 18px; flex-grow: 1;">
                        ${item.excerpt || (item.story ? item.story.substring(0, 130) + '...' : '')}
                    </p>

                    <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 14px; margin-top: auto;">
                        <button class="btn btn-outline btn-sm" onclick="openFinalFelizDetailModal('${item.id}')" style="width: 100%; justify-content: center; font-weight: 700;">
                            <i class="fas fa-book-open"></i> Conocer su historia completa
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function setupFinalFelizModals() {
    // 1. Ensure Edit Modal exists
    if (!document.getElementById('final-feliz-modal')) {
        const modal = document.createElement('div');
        modal.id = 'final-feliz-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container" style="max-width: 580px; max-height: 90vh; overflow-y: auto;">
                <button class="modal-close-btn" onclick="closeModal('final-feliz-modal')"><i class="fas fa-times"></i></button>
                <div style="margin-bottom: 20px;">
                    <span class="badge badge-secondary" style="margin-bottom: 6px;">Gestión de Adopciones Exitosas</span>
                    <h2 id="ff-modal-title" style="color: var(--primary); font-size: 1.45rem; margin: 0;">Agregar Final Feliz</h2>
                    <p style="color: var(--text-muted); font-size: 0.88rem; margin: 4px 0 0 0;">Publicá la historia del rescatado que ya tiene familia o se recuperó.</p>
                </div>

                <form id="final-feliz-form" onsubmit="handleFinalFelizSubmit(event)">
                    <input type="hidden" id="ff-item-id">

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                        <div>
                            <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-main);">Nombre de la Mascota *</label>
                            <input type="text" id="ff-name" required placeholder="Ej: Milo, Luna, Rocco" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.95rem;">
                        </div>
                        <div>
                            <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-main);">Especie *</label>
                            <select id="ff-species" required style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.95rem;">
                                <option value="perro">Perro / Canino</option>
                                <option value="gato">Gato / Felino</option>
                            </select>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                        <div>
                            <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-main);">Fecha de Adopción / Rescate *</label>
                            <input type="text" id="ff-date" required placeholder="Ej: Octubre 2024" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.95rem;">
                        </div>
                        <div>
                            <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-main);">Familia / Adoptante</label>
                            <input type="text" id="ff-family" placeholder="Ej: Familia Gómez, Mariana" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.95rem;">
                        </div>
                    </div>

                    <div style="margin-bottom: 14px;">
                        <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-main);">Tipo de Logro</label>
                        <select id="ff-status-type" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.95rem;">
                            <option value="Adoptado/a con Familia Definitiva">Adoptado/a con Familia Definitiva</option>
                            <option value="Recuperado/a y en Hogar Definitivo">Recuperado/a y en Hogar Definitivo</option>
                            <option value="Reencontrado/a con sus Tutores">Reencontrado/a con sus Tutores</option>
                        </select>
                    </div>

                    <!-- Photo Upload with Preview -->
                    <div style="margin-bottom: 14px; background: var(--bg-main); padding: 14px; border-radius: var(--radius-sm); border: 1px dashed var(--border-color);">
                        <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-main);">
                            <i class="fas fa-camera" style="color: var(--secondary);"></i> Foto de la Mascota Feliz
                        </label>
                        <input type="file" id="ff-photo-file" accept="image/*" onchange="handleFinalFelizPhotoSelect(event)" style="margin-bottom: 8px; font-size: 0.88rem;">
                        <input type="text" id="ff-photo-url" placeholder="O pegá la URL directa de la imagen" style="width: 100%; padding: 8px 10px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.88rem;">
                        <div id="ff-photo-preview-box" style="margin-top: 10px; display: none; text-align: center;">
                            <img id="ff-photo-preview" src="" alt="Previsualización" style="max-height: 140px; border-radius: 8px; box-shadow: var(--shadow-sm); border: 2px solid white;">
                        </div>
                    </div>

                    <div style="margin-bottom: 14px;">
                        <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-main);">Resumen Breve (para la tarjeta) *</label>
                        <input type="text" id="ff-excerpt" required placeholder="Breve frase que describe el final feliz..." style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.95rem;">
                    </div>

                    <div style="margin-bottom: 18px;">
                        <label style="display: block; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; color: var(--text-main);">Historia Completa y Testimonio *</label>
                        <textarea id="ff-story" rows="4" required placeholder="Contá cómo fue rescatado, su proceso de recuperación y cómo es su vida hoy con su familia..." style="width: 100%; padding: 10px 12px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.95rem; resize: vertical;"></textarea>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px;">
                        <button type="button" class="btn btn-outline" onclick="closeModal('final-feliz-modal')">Cancelar</button>
                        <button type="submit" class="btn btn-secondary" style="font-weight: 700;">
                            <i class="fas fa-save"></i> Guardar en Final Feliz
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // 2. Ensure Detail Reader Modal exists
    if (!document.getElementById('final-feliz-detail-modal')) {
        const detailModal = document.createElement('div');
        detailModal.id = 'final-feliz-detail-modal';
        detailModal.className = 'modal-overlay';
        detailModal.innerHTML = `
            <div class="modal-container" style="max-width: 640px; max-height: 90vh; overflow-y: auto; padding: 0;">
                <div style="position: relative; height: 300px; background: #174A4A; overflow: hidden;">
                    <img id="ff-detail-img" src="" alt="Mascota" style="width: 100%; height: 100%; object-fit: cover;">
                    <button class="modal-close-btn" onclick="closeModal('final-feliz-detail-modal')" style="position: absolute; top: 14px; right: 14px; background: rgba(0,0,0,0.5); color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                    <div style="position: absolute; bottom: 14px; left: 16px; display: flex; gap: 8px;">
                        <span id="ff-detail-species" class="badge" style="background: rgba(23, 74, 74, 0.95); color: #fff; font-size: 0.8rem; padding: 5px 12px; border-radius: 20px;"></span>
                        <span id="ff-detail-type" class="badge" style="background: rgba(201, 101, 69, 0.95); color: #fff; font-size: 0.8rem; padding: 5px 12px; border-radius: 20px;"></span>
                    </div>
                </div>

                <div style="padding: 26px;">
                    <div style="margin-bottom: 16px;">
                        <h2 id="ff-detail-name" style="font-size: 1.8rem; color: var(--primary); margin-bottom: 6px; font-weight: 800;"></h2>
                        <div style="display: flex; align-items: center; gap: 12px; font-size: 0.9rem; color: var(--text-muted); flex-wrap: wrap;">
                            <span id="ff-detail-date"><i class="fas fa-calendar-check" style="color: var(--secondary);"></i> </span>
                            <span id="ff-detail-family"><i class="fas fa-home" style="color: #8FA58A;"></i> </span>
                        </div>
                    </div>

                    <div style="background: var(--bg-main); border-left: 4px solid var(--secondary); padding: 14px 18px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; margin-bottom: 20px;">
                        <p id="ff-detail-excerpt" style="font-size: 0.96rem; font-style: italic; color: var(--text-main); line-height: 1.5; margin: 0;"></p>
                    </div>

                    <div id="ff-detail-story" style="font-size: 0.96rem; color: var(--text-main); line-height: 1.7; margin-bottom: 24px; white-space: pre-line;"></div>

                    <div style="background: #eef4f1; border-radius: var(--radius-sm); padding: 16px; display: flex; align-items: center; gap: 14px;">
                        <i class="fas fa-heart" style="font-size: 1.8rem; color: var(--secondary); flex-shrink: 0;"></i>
                        <div style="font-size: 0.85rem; color: var(--primary); line-height: 1.45;">
                            <strong>Adoptar salva vidas.</strong> Gracias a la comunidad de Gálvez y la Asociación Civil Amigos de los Animales por hacer posibles estas historias.
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(detailModal);
    }
}

function handleFinalFelizPhotoSelect(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        const preview = document.getElementById('ff-photo-preview');
        const box = document.getElementById('ff-photo-preview-box');
        if (preview && box) {
            preview.src = evt.target.result;
            box.style.display = 'block';
        }
    };
    reader.readAsDataURL(file);
}

function openFinalFelizEditModal(id = null) {
    setupFinalFelizModals();
    const modalTitle = document.getElementById('ff-modal-title');
    const form = document.getElementById('final-feliz-form');
    const previewBox = document.getElementById('ff-photo-preview-box');
    const previewImg = document.getElementById('ff-photo-preview');

    form.reset();
    if (previewBox) previewBox.style.display = 'none';

    if (id) {
        const item = finalFelizList.find(x => x.id === id);
        if (!item) return;

        modalTitle.innerText = 'Editar Final Feliz: ' + item.name;
        document.getElementById('ff-item-id').value = item.id;
        document.getElementById('ff-name').value = item.name || '';
        document.getElementById('ff-species').value = item.species || 'perro';
        document.getElementById('ff-date').value = item.date || '';
        document.getElementById('ff-family').value = item.family || '';
        document.getElementById('ff-status-type').value = item.statusType || 'Adoptado/a con Familia Definitiva';
        document.getElementById('ff-photo-url').value = item.photo && !item.photo.startsWith('data:') ? item.photo : '';
        document.getElementById('ff-excerpt').value = item.excerpt || '';
        document.getElementById('ff-story').value = item.story || '';

        if (item.photo && previewBox && previewImg) {
            previewImg.src = item.photo;
            previewBox.style.display = 'block';
        }
    } else {
        modalTitle.innerText = 'Agregar Nuevo Final Feliz';
        document.getElementById('ff-item-id').value = '';
        document.getElementById('ff-date').value = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(new Date());
    }

    openModal('final-feliz-modal');
}

function handleFinalFelizSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('ff-item-id').value;
    const name = document.getElementById('ff-name').value.trim();
    const species = document.getElementById('ff-species').value;
    const date = document.getElementById('ff-date').value.trim();
    const family = document.getElementById('ff-family').value.trim();
    const statusType = document.getElementById('ff-status-type').value;
    const photoUrl = document.getElementById('ff-photo-url').value.trim();
    const previewImg = document.getElementById('ff-photo-preview');
    const excerpt = document.getElementById('ff-excerpt').value.trim();
    const story = document.getElementById('ff-story').value.trim();

    let finalPhoto = 'assets/img/cropped_circle_image.png';
    if (previewImg && previewImg.src && previewImg.src.startsWith('data:image')) {
        finalPhoto = previewImg.src;
    } else if (photoUrl) {
        finalPhoto = photoUrl;
    } else if (id) {
        const existing = finalFelizList.find(x => x.id === id);
        if (existing && existing.photo) finalPhoto = existing.photo;
    }

    if (id) {
        const index = finalFelizList.findIndex(x => x.id === id);
        if (index !== -1) {
            finalFelizList[index] = {
                ...finalFelizList[index],
                name,
                species,
                date,
                family,
                statusType,
                photo: finalPhoto,
                excerpt,
                story
            };
            showToast(`¡Final feliz de ${name} actualizado!`, 'success');
        }
    } else {
        const newItem = {
            id: 'ff_' + Date.now(),
            name,
            species,
            date,
            family,
            statusType,
            photo: finalPhoto,
            excerpt,
            story
        };
        finalFelizList.unshift(newItem);
        showToast(`¡Final feliz de ${name} publicado con éxito!`, 'success');
    }

    saveFinalFelizData();
    renderFinalFelizList();
    closeModal('final-feliz-modal');
}

function deleteFinalFeliz(id) {
    const item = finalFelizList.find(x => x.id === id);
    if (!item) return;

    if (confirm(`¿Estás seguro/a de que querés eliminar la historia de ${item.name}? Esta acción se aplicará localmente.`)) {
        finalFelizList = finalFelizList.filter(x => x.id !== id);
        saveFinalFelizData();
        renderFinalFelizList();
        showToast(`Historia de ${item.name} eliminada.`, 'info');
    }
}

function openFinalFelizDetailModal(id) {
    const item = finalFelizList.find(x => x.id === id);
    if (!item) return;

    setupFinalFelizModals();

    const img = document.getElementById('ff-detail-img');
    const species = document.getElementById('ff-detail-species');
    const type = document.getElementById('ff-detail-type');
    const name = document.getElementById('ff-detail-name');
    const date = document.getElementById('ff-detail-date');
    const family = document.getElementById('ff-detail-family');
    const excerpt = document.getElementById('ff-detail-excerpt');
    const story = document.getElementById('ff-detail-story');

    if (img) img.src = item.photo || 'assets/img/cropped_circle_image.png';
    if (species) species.innerHTML = `<i class="fas ${item.species === 'gato' ? 'fa-cat' : 'fa-dog'}"></i> ${item.species === 'gato' ? 'Gato' : 'Perro'}`;
    if (type) type.innerHTML = `<i class="fas fa-heart"></i> ${item.statusType || 'Adoptado'}`;
    if (name) name.innerText = item.name;
    if (date) date.innerHTML = `<i class="fas fa-calendar-check" style="color: var(--secondary);"></i> ${item.date || 'Adoptado recientemente'}`;
    if (family) {
        family.innerHTML = item.family ? `<i class="fas fa-home" style="color: #8FA58A;"></i> Adoptado por: ${item.family}` : '';
        family.style.display = item.family ? 'inline-block' : 'none';
    }
    if (excerpt) excerpt.innerText = `"${item.excerpt || ''}"`;
    if (story) story.innerText = item.story || item.excerpt || 'Historia en preparación.';

    openModal('final-feliz-detail-modal');
}



/* Lightbox modal para la Galería y Collage de Final Feliz */
window.openCollageImage = function(src, caption) {
    let modal = document.getElementById('collage-lightbox-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'collage-lightbox-modal';
        modal.className = 'modal-overlay';
        modal.style.zIndex = '9999';
        modal.innerHTML = `
            <div class="modal-container" style="max-width: 820px; padding: 0; background: #0f172a; border-radius: var(--radius-md); overflow: hidden; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <button class="modal-close-btn" id="collage-lightbox-close-btn" aria-label="Cerrar imagen" onclick="closeCollageLightbox()" style="position: absolute; top: 14px; right: 14px; background: rgba(0,0,0,0.6); color: white; width: 38px; height: 38px; border-radius: 50%; border: none; cursor: pointer; z-index: 20; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: background 0.2s;">
                    <i class="fas fa-times"></i>
                </button>
                <div style="max-height: 75vh; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #000; cursor: pointer;" onclick="closeCollageLightbox()" title="Click para cerrar">
                    <img id="collage-lightbox-img" src="" style="width: 100%; height: 100%; object-fit: contain; max-height: 75vh;" alt="Collage Final Feliz" onclick="event.stopPropagation()">
                </div>
                <div style="padding: 16px 22px; background: #174A4A; color: white; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-heart" style="color: #C96545; font-size: 1.2rem;"></i>
                        <p id="collage-lightbox-caption" style="margin: 0; font-size: 0.95rem; font-weight: 700;"></p>
                    </div>
                    <span style="font-size: 0.78rem; opacity: 0.85;">Asociación Civil Amigos de los Animales</span>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Click on backdrop to close
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeCollageLightbox();
            }
        });
    }

    const imgEl = document.getElementById('collage-lightbox-img');
    const capEl = document.getElementById('collage-lightbox-caption');
    if (imgEl) imgEl.src = src;
    if (capEl) capEl.innerText = caption || 'Momento de Final Feliz';

    if (typeof openModal === 'function') {
        openModal('collage-lightbox-modal');
    } else {
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};

window.closeCollageLightbox = function() {
    const modal = document.getElementById('collage-lightbox-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = '';
    }
    document.body.style.overflow = '';
    if (typeof closeModal === 'function') {
        closeModal('collage-lightbox-modal');
    }
};

// Global escape key listener for collage modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('collage-lightbox-modal');
        if (modal && (modal.classList.contains('active') || modal.style.display === 'flex')) {
            closeCollageLightbox();
        }
    }
});
