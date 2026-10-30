/* ==========================================================================
   RESERVA CANINA GÁLVEZ - ADOPCIONES CATALOG & FIRESTORE LOGIC
   ========================================================================== */

function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}
window.escapeHTML = escapeHTML;

const INITIAL_DOGS = [
    {
        id: "dog_1",
        name: "Leopoldo",
        species: "perro",
        genderSymbol: "♂",
        genderType: "macho",
        age: "Adulto (3 años)",
        size: "Mediano / Grande",
        status: "Urgente",
        image: "assets/img/Animales de la reserva real/Leopoldo1.jpg",
        images: [
            "assets/img/Animales de la reserva real/Leopoldo1.jpg",
            "assets/img/Animales de la reserva real/Leopoldo2.jpg",
            "assets/img/Animales de la reserva real/Leopoldo3.jpg",
            "assets/img/Animales de la reserva real/Leopoldo4.jpg",
            "assets/img/Animales de la reserva real/Leopoldo5.jpg"
        ],
        description: "Leopoldo es un perro noble, cariñoso y de mirada extremadamente tierna. Le encanta salir a pasear y acompañar.",
        health: "Vacunado, Castrado y Desparasitado",
        story: "Rescatado por los voluntarios en Gálvez. Tras recuperarse con la Asociación, demostró ser un compañero de vida ejemplar que sueña con una familia amorosa."
    },
    {
        id: "dog_2",
        name: "Lupin",
        species: "perro",
        genderSymbol: "♂",
        genderType: "macho",
        age: "Joven (1.5 años)",
        size: "Mediano",
        status: "Disponible",
        image: "assets/img/Animales de la reserva real/Lupin.jpg",
        images: [
            "assets/img/Animales de la reserva real/Lupin.jpg"
        ],
        description: "Lupin es súper sociable, curioso y juguetón. Se lleva excelente con otros animales.",
        health: "Vacunado, Castrado y Desparasitado",
        story: "Fue encontrado buscando refugio en un barrio de Gálvez. Hoy está sano, fuerte y ansioso por formar parte de un hogar definitivo."
    },
    {
        id: "dog_3",
        name: "Pumba",
        species: "perro",
        genderSymbol: "♂",
        genderType: "macho",
        age: "Adulto (4 años)",
        size: "Pequeño / Mediano",
        status: "Disponible",
        image: "assets/img/Animales de la reserva real/Pumba1.jpg",
        images: [
            "assets/img/Animales de la reserva real/Pumba1.jpg",
            "assets/img/Animales de la reserva real/Pumba2.jpg",
            "assets/img/Animales de la reserva real/Pumba3.jpg"
        ],
        description: "Pumba es pura simpatía, ternura y buen carácter. De tamaño práctico y muy dulce.",
        health: "Vacunado, Castrado, Controles al día",
        story: "Rescatado hace un tiempo, Pumba es de los mimados del refugio por su andar compasivo y su mirada dulce."
    },
    {
        id: "dog_4",
        name: "Wilson",
        species: "perro",
        genderSymbol: "♂",
        genderType: "macho",
        age: "Adulto (5 años)",
        size: "Grande",
        status: "Disponible",
        image: "assets/img/Animales de la reserva real/Wilson1.jpg",
        images: [
            "assets/img/Animales de la reserva real/Wilson1.jpg",
            "assets/img/Animales de la reserva real/Wilson2.jpg"
        ],
        description: "Wilson es un gigante bonachón, guardián leal y de temple sereno.",
        health: "Vacunado, Castrado y Desparasitado",
        story: "Wilson fue rescatado tras pasar necesidades en la vía pública. Se recuperó maravillosamente y busca su familia definitiva."
    },
    {
        id: "cat_1",
        name: "Oliver",
        species: "gato",
        genderSymbol: "♂",
        genderType: "macho",
        age: "Joven (1 año)",
        size: "Pequeño",
        status: "Disponible",
        image: "assets/img/cropped_circle_image.png",
        images: [
            "assets/img/cropped_circle_image.png"
        ],
        description: "Oliver es un gatito ronroneador, dócil y muy cariñoso. Acostumbrado a usar piedritas sanitarias y convivir en espacios interiores.",
        health: "Vacunado, Castrado y Desparasitado",
        story: "Rescatado en Gálvez a través de la red de protección felina. Busca una familia con hogar seguro (ventanas y patios protegidos)."
    },
    {
        id: "cat_2",
        name: "Mía",
        species: "gato",
        genderSymbol: "♀",
        genderType: "hembra",
        age: "Adulta (2 años)",
        size: "Pequeño",
        status: "Disponible",
        image: "assets/img/cropped_circle_image.png",
        images: [
            "assets/img/cropped_circle_image.png"
        ],
        description: "Mía es dulce, tranquila y adora los mimos. Ideal para departamento o casa tranquila.",
        health: "Castrada, Vacunada y Desparasitada",
        story: "Recuperada en tránsito por voluntarias de Gálvez. Lista para brindar amor incondicional a quien le dé una oportunidad."
    }
];

let allDogsList = [];

document.addEventListener('DOMContentLoaded', () => {
    initAdoptions();
});

function initAdoptions() {
    setupAdoptionsListener();
    initDogFilters();
}

function setupAdoptionsListener() {
    const grid = document.getElementById('dogs-grid');
    if (grid) {
        if (typeof getLogoLoaderHTML === 'function') {
            grid.innerHTML = getLogoLoaderHTML('Cargando rescatados en adopción...');
        } else if (typeof getPawLoaderHTML === 'function') {
            grid.innerHTML = getPawLoaderHTML('Cargando rescatados en adopción...');
        }
    }

    if (typeof firebase !== 'undefined' && isFirebaseConfigured && db) {
        db.collection('adoptions').onSnapshot((snapshot) => {
            const list = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                const inferredSpecies = data.species || (String(doc.id).toLowerCase().startsWith('cat') ? 'gato' : 'perro');
                list.push({
                    id: doc.id,
                    ...data,
                    species: inferredSpecies.toLowerCase(),
                    images: (data.images && data.images.length > 0) ? data.images : [data.image || 'assets/img/cropped_circle_image.png']
                });
            });

            // Ensure our default rescue cats/dogs are merged if not present in Firestore
            const presentIds = new Set(list.map(d => String(d.id)));
            INITIAL_DOGS.forEach(initPet => {
                if (!presentIds.has(String(initPet.id))) {
                    list.push(initPet);
                }
            });

            allDogsList = list;
            renderDogsCatalog(allDogsList);
        }, (err) => {
            console.warn("Firestore adoptions error. Usando catálogo local:", err);
            allDogsList = getLocalDogs();
            renderDogsCatalog(allDogsList);
        });
    } else {
        setTimeout(() => {
            if (typeof firebase !== 'undefined' && isFirebaseConfigured && db) {
                setupAdoptionsListener();
            } else {
                allDogsList = getLocalDogs();
                renderDogsCatalog(allDogsList);
            }
        }, 300);
    }
}

function seedInitialDogs() {
    if (typeof firebase !== 'undefined' && isFirebaseConfigured && db) {
        const batch = db.batch();
        INITIAL_DOGS.forEach(dog => {
            const ref = db.collection('adoptions').doc(dog.id);
            batch.set(ref, dog);
        });
        batch.commit().catch(e => console.warn("Seed dogs error:", e));
    }
    allDogsList = INITIAL_DOGS;
    saveLocalDogs(INITIAL_DOGS);
    renderDogsCatalog(INITIAL_DOGS);
}

function getLocalDogs() {
    const saved = localStorage.getItem('reserva_adoptions_dogs');
    if (!saved) return INITIAL_DOGS;
    try {
        const list = JSON.parse(saved);
        return (list && list.length > 0) ? list : INITIAL_DOGS;
    } catch(e) { return INITIAL_DOGS; }
}

function saveLocalDogs(dogs) {
    localStorage.setItem('reserva_adoptions_dogs', JSON.stringify(dogs));
    if (!isFirebaseConfigured) {
        renderDogsCatalog(dogs);
    }
}

function renderDogsCatalog(dogs) {
    const grid = document.getElementById('dogs-grid');
    const adminHeaderBtnContainer = document.getElementById('admin-adoptions-header-actions');

    if (adminHeaderBtnContainer) {
        if (currentUser && currentUser.isAdmin) {
            adminHeaderBtnContainer.innerHTML = `
                <button class="btn btn-primary" onclick="openDogEditModal()" style="background: #2e7d32; border-color: #2e7d32;">
                    <i class="fas fa-plus-circle"></i> + Agregar Mascota en Adopción
                </button>
            `;
        } else {
            adminHeaderBtnContainer.innerHTML = '';
        }
    }

    if (!grid) return;

    if (dogs.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px;">
                <div style="width: 80px; height: 55px; margin: 0 auto 15px auto; opacity: 0.5;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 486 326" style="width: 100%; height: 100%; fill: var(--primary);">
                        <path d="M 257 1 L 254 2 L 252 4 L 251 6 L 250 8 L 246 17 L 240 33 L 232 48 L 229 55 L 227 60 L 227 66 L 231 70 L 237 70 L 241 66 L 243 61 L 245 57 L 247 50 L 255 32 L 256 30 L 259 27 L 262 30 L 264 35 L 269 43 L 270 47 L 280 66 L 282 68 L 284 69 L 381 69 L 383 68 L 385 66 L 387 62 L 390 56 L 395 43 L 401 32 L 404 30 L 405 32 L 406 34 L 411 46 L 412 51 L 415 56 L 418 65 L 419 69 L 420 76 L 420 106 L 419 140 L 416 143 L 413 144 L 408 145 L 389 149 L 382 151 L 375 153 L 372 154 L 370 155 L 367 158 L 367 160 L 368 162 L 371 163 L 374 163 L 383 160 L 390 158 L 409 154 L 413 152 L 417 153 L 417 160 L 416 166 L 414 168 L 412 169 L 394 169 L 381 170 L 374 171 L 371 172 L 369 173 L 368 175 L 368 178 L 369 180 L 374 181 L 382 179 L 394 178 L 407 177 L 411 177 L 413 179 L 412 182 L 411 185 L 408 192 L 407 194 L 406 196 L 404 199 L 402 202 L 399 206 L 393 212 L 387 217 L 384 219 L 380 221 L 374 224 L 369 226 L 365 227 L 357 229 L 351 230 L 341 231 L 329 231 L 312 230 L 304 229 L 298 228 L 293 227 L 284 224 L 277 221 L 272 218 L 269 216 L 265 213 L 256 204 L 253 200 L 251 197 L 249 194 L 248 192 L 247 190 L 245 185 L 241 173 L 240 166 L 239 163 L 237 158 L 231 146 L 229 143 L 226 139 L 223 135 L 212 124 L 208 121 L 204 118 L 199 115 L 194 112 L 192 111 L 190 110 L 185 108 L 176 105 L 172 104 L 168 103 L 161 102 L 142 102 L 135 103 L 130 104 L 126 105 L 119 107 L 114 109 L 102 115 L 97 118 L 93 121 L 89 124 L 79 134 L 75 139 L 73 142 L 71 145 L 66 154 L 64 159 L 61 169 L 60 171 L 55 176 L 41 189 L 31 200 L 22 212 L 20 215 L 18 218 L 15 223 L 12 228 L 10 232 L 7 238 L 3 250 L 2 255 L 1 263 L 1 268 L 2 277 L 3 280 L 4 283 L 5 285 L 6 287 L 8 290 L 16 298 L 19 300 L 21 301 L 23 302 L 28 304 L 32 305 L 38 306 L 54 306 L 61 313 L 64 315 L 72 319 L 75 320 L 80 321 L 88 322 L 188 322 L 191 319 L 191 312 L 188 309 L 186 308 L 174 308 L 93 309 L 85 308 L 81 307 L 78 306 L 70 302 L 62 294 L 60 291 L 59 289 L 58 287 L 57 284 L 56 280 L 55 274 L 56 268 L 57 264 L 60 258 L 66 250 L 67 248 L 68 246 L 69 243 L 70 239 L 71 223 L 71 192 L 72 184 L 73 178 L 74 173 L 75 170 L 76 167 L 78 162 L 81 156 L 87 147 L 102 132 L 105 130 L 110 127 L 118 123 L 123 121 L 126 120 L 133 118 L 138 117 L 147 116 L 156 116 L 165 117 L 170 118 L 174 119 L 177 120 L 182 122 L 186 125 L 188 125 L 190 126 L 199 132 L 204 136 L 210 142 L 215 148 L 218 152 L 221 157 L 222 159 L 223 161 L 225 166 L 228 179 L 232 191 L 238 203 L 244 212 L 255 223 L 259 226 L 262 228 L 265 230 L 279 237 L 288 240 L 292 241 L 296 242 L 302 243 L 310 244 L 326 245 L 348 245 L 356 244 L 361 243 L 365 242 L 375 239 L 380 237 L 384 235 L 390 232 L 393 230 L 396 228 L 401 224 L 411 214 L 414 210 L 416 207 L 418 204 L 420 200 L 423 194 L 427 179 L 429 177 L 431 176 L 434 176 L 457 177 L 465 178 L 469 179 L 477 182 L 483 181 L 484 179 L 484 177 L 483 175 L 481 173 L 478 172 L 474 171 L 470 170 L 464 169 L 452 168 L 432 168 L 430 166 L 430 162 L 431 154 L 432 150 L 434 148 L 438 147 L 445 146 L 455 145 L 473 146 L 479 146 L 481 145 L 482 143 L 482 140 L 479 137 L 474 136 L 453 136 L 445 137 L 439 138 L 438 139 L 433 138 L 433 112 L 435 96 L 434 74 L 433 68 L 432 63 L 431 59 L 430 56 L 427 48 L 420 30 L 414 15 L 411 8 L 410 6 L 406 2 L 400 2 L 397 5 L 394 11 L 390 20 L 383 34 L 378 47 L 375 53 L 372 55 L 315 55 L 304 54 L 296 55 L 293 55 L 291 54 L 289 52 L 285 45 L 277 30 L 265 5 L 262 2 L 260 1 Z M 57 198 L 57 203 L 56 237 L 55 240 L 54 242 L 48 250 L 45 256 L 44 259 L 43 262 L 42 266 L 42 282 L 44 287 L 43 291 L 38 291 L 34 290 L 29 288 L 26 286 L 20 280 L 19 278 L 18 276 L 17 273 L 16 266 L 17 259 L 20 248 L 21 245 L 27 233 L 30 228 L 32 225 L 41 213 L 46 208 L 50 202 L 53 200 Z" fill-rule="evenodd" />
                    </svg>
                </div>
                <h3>No se encontraron animales con esos filtros</h3>
                <p style="color: var(--text-muted);">Prueba cambiando las opciones de búsqueda o categoría.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = dogs.map(dog => {
        const isAdmin = currentUser && currentUser.isAdmin;
        const mainImage = dog.image || (dog.images && dog.images[0]) || 'assets/img/cropped_circle_image.png';
        const photoCount = dog.images ? dog.images.length : 1;
        const isCat = (dog.species || '').toLowerCase() === 'gato';

        return `
            <div class="dog-card">
                <div class="dog-card-img-wrapper">
                    <img src="${mainImage}" alt="${escapeHTML(dog.name)}" class="dog-card-img">
                    <span class="badge ${dog.status === 'Urgente' ? 'badge-urgent' : 'badge-primary'} dog-status-tag">
                        ${escapeHTML(dog.status || 'Disponible')}
                    </span>
                    <span class="badge" style="position: absolute; top: 12px; left: 12px; background: rgba(23,74,74,0.85); color: #fff; font-size: 0.72rem;">
                        <i class="fas ${isCat ? 'fa-cat' : 'fa-dog'}"></i> ${isCat ? 'Gato' : 'Perro'}
                    </span>
                    ${photoCount > 1 ? `
                        <span class="badge badge-secondary" style="position: absolute; bottom: 12px; left: 12px; background: rgba(0,0,0,0.65); color: #fff; border: none; font-size: 0.75rem;">
                            <i class="fas fa-camera"></i> ${photoCount} fotos
                        </span>
                    ` : ''}
                    ${isAdmin ? `
                        <div style="position: absolute; top: 12px; right: 12px; display: flex; gap: 6px;">
                            <button onclick="openDogEditModal('${dog.id}')" class="btn btn-sm btn-light" style="padding: 4px 8px; font-size: 0.78rem; background: rgba(255,255,255,0.9);" title="Editar">
                                <i class="fas fa-edit" style="color: #2e7d32;"></i>
                            </button>
                            <button onclick="deleteDog('${dog.id}')" class="btn btn-sm btn-light" style="padding: 4px 8px; font-size: 0.78rem; background: rgba(255,255,255,0.9);" title="Eliminar">
                                <i class="fas fa-trash-alt" style="color: #c62828;"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
                <div class="dog-card-body">
                    <div class="dog-card-header">
                        <h3 class="dog-name">${escapeHTML(dog.name)}</h3>
                        <span class="dog-gender-symbol"><b>${dog.genderSymbol || '♂'}</b></span>
                    </div>
                    <div class="dog-tags">
                        <span class="dog-tag-item"><i class="fas fa-ruler-vertical"></i> ${escapeHTML(dog.size)}</span>
                        <span class="dog-tag-item"><i class="fas fa-birthday-cake"></i> ${escapeHTML(dog.age)}</span>
                    </div>
                    <p class="dog-description">${escapeHTML(dog.description)}</p>
                    <button class="btn btn-primary btn-sm" onclick="openDogDetailModal('${dog.id}')" style="width: 100%;">
                        <i class="fas fa-heart"></i> Conocer a ${escapeHTML(dog.name)}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function initDogFilters() {
    const speciesFilter = document.getElementById('filter-species');
    const sizeFilter = document.getElementById('filter-size');
    const ageFilter = document.getElementById('filter-age');
    const genderFilter = document.getElementById('filter-gender');

    const applyFilters = () => {
        const speciesVal = speciesFilter ? speciesFilter.value : 'all';
        const sizeVal = sizeFilter ? sizeFilter.value : 'all';
        const ageVal = ageFilter ? ageFilter.value : 'all';
        const genderVal = genderFilter ? genderFilter.value : 'all';

        const filtered = allDogsList.filter(dog => {
            const dogSpecies = (dog.species || 'perro').toLowerCase();
            const matchesSpecies = speciesVal === 'all' || dogSpecies === speciesVal.toLowerCase();
            const matchesSize = sizeVal === 'all' || (dog.size && dog.size.toLowerCase().includes(sizeVal.toLowerCase()));
            const matchesAge = ageVal === 'all' || (dog.age && dog.age.toLowerCase().includes(ageVal.toLowerCase()));
            const matchesGender = genderVal === 'all' || dog.genderType === genderVal;
            return matchesSpecies && matchesSize && matchesAge && matchesGender;
        });

        renderDogsCatalog(filtered);
    };

    if (speciesFilter) speciesFilter.addEventListener('change', applyFilters);
    if (sizeFilter) sizeFilter.addEventListener('change', applyFilters);
    if (ageFilter) ageFilter.addEventListener('change', applyFilters);
    if (genderFilter) genderFilter.addEventListener('change', applyFilters);
}

function openDogDetailModal(id) {
    const dog = allDogsList.find(d => String(d.id) === String(id));
    if (!dog) return;

    const modalBody = document.getElementById('dog-modal-content');
    if (!modalBody) return;

    const imagesList = dog.images && dog.images.length > 0 ? dog.images : [dog.image || 'assets/img/cropped_circle_image.png'];

    modalBody.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
            <div>
                <img id="modal-main-dog-img" src="${imagesList[0]}" alt="${escapeHTML(dog.name)}" style="width: 100%; height: 280px; object-fit: cover; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                ${imagesList.length > 1 ? `
                    <div style="display: flex; gap: 10px; margin-top: 12px; overflow-x: auto; padding-bottom: 5px;">
                        ${imagesList.map((imgSrc, idx) => `
                            <img src="${imgSrc}" alt="${escapeHTML(dog.name)} foto ${idx + 1}" 
                                onclick="changeModalDogImage('${imgSrc}')" 
                                class="modal-thumb-img" 
                                style="width: 65px; height: 65px; object-fit: cover; border-radius: var(--radius-sm); cursor: pointer; border: 2px solid ${idx === 0 ? 'var(--primary)' : 'var(--border-color)'}; flex-shrink: 0;">
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h2>${escapeHTML(dog.name)}</h2>
                    <span class="dog-gender-symbol"><b>${dog.genderSymbol || '♂'}</b></span>
                </div>
                <p style="color: var(--text-muted); margin-bottom: 15px;"><strong>Tamaño:</strong> ${escapeHTML(dog.size)} | <strong>Edad:</strong> ${escapeHTML(dog.age)}</p>
                <h4 style="margin-bottom: 6px; color: var(--primary);"><i class="fas fa-heartbeat"></i> Estado de Salud:</h4>
                <p style="margin-bottom: 15px;">${escapeHTML(dog.health || 'Vacunado/a, castrado/a y desparasitado/a')}</p>
                <h4 style="margin-bottom: 6px; color: var(--primary);"><i class="fas fa-book-open"></i> Su Historia:</h4>
                <p style="margin-bottom: 20px; color: var(--text-muted);">${escapeHTML(dog.story || dog.description)}</p>
                <button class="btn btn-secondary" onclick="sendAdoptionRequest('${escapeHTML(dog.name)}')" style="width: 100%;">
                    <i class="fab fa-whatsapp"></i> Solicitar Adopción de ${escapeHTML(dog.name)} vía WhatsApp
                </button>
            </div>
        </div>
    `;

    openModal('dog-detail-modal');
}

function changeModalDogImage(src) {
    const mainImg = document.getElementById('modal-main-dog-img');
    if (mainImg) mainImg.src = src;

    document.querySelectorAll('.modal-thumb-img').forEach(thumb => {
        if (thumb.getAttribute('src') === src) {
            thumb.style.borderColor = 'var(--primary)';
        } else {
            thumb.style.borderColor = 'var(--border-color)';
        }
    });
}

function sendAdoptionRequest(dogName) {
    const message = encodeURIComponent(`¡Hola! Quisiera recibir información y hacer la postulación para adoptar a ${dogName} de la Asociación Civil Amigos de los Animales No Humanos.`);
    const whatsappNum = "5493404000000"; 
    window.open(`https://wa.me/${whatsappNum}?text=${message}`, '_blank');
}

// Admin Modal: Create / Edit Dog
function openDogEditModal(dogId = null) {
    if (!currentUser || !currentUser.isAdmin) {
        showToast('Acceso denegado. Solo administradores pueden agregar mascotas.', 'error');
        return;
    }

    const modalTitle = document.getElementById('dog-edit-modal-title');
    const inputId = document.getElementById('dog-edit-id');
    const inputName = document.getElementById('dog-edit-name');
    const inputAge = document.getElementById('dog-edit-age');
    const selectSize = document.getElementById('dog-edit-size');
    const selectGender = document.getElementById('dog-edit-gender');
    const selectStatus = document.getElementById('dog-edit-status');
    const inputHealth = document.getElementById('dog-edit-health');
    const inputStory = document.getElementById('dog-edit-story');
    const inputDesc = document.getElementById('dog-edit-desc');
    const inputImgUrl = document.getElementById('dog-edit-image-url');

    const selectSpecies = document.getElementById('dog-edit-species');

    if (dogId) {
        const dog = allDogsList.find(d => String(d.id) === String(dogId));
        if (dog) {
            if (modalTitle) modalTitle.innerText = `Editar Ficha de ${dog.name}`;
            if (inputId) inputId.value = dog.id;
            if (inputName) inputName.value = dog.name || '';
            if (selectSpecies) selectSpecies.value = (dog.species || (String(dog.id).startsWith('cat') ? 'gato' : 'perro')).toLowerCase();
            if (inputAge) inputAge.value = dog.age || '';
            if (selectSize) selectSize.value = dog.size || 'Mediano';
            if (selectGender) selectGender.value = dog.genderType || 'macho';
            if (selectStatus) selectStatus.value = dog.status || 'Disponible';
            if (inputHealth) inputHealth.value = dog.health || '';
            if (inputStory) inputStory.value = dog.story || '';
            if (inputDesc) inputDesc.value = dog.description || '';
            if (inputImgUrl) inputImgUrl.value = dog.image || '';
        }
    } else {
        if (modalTitle) modalTitle.innerText = "Agregar Nueva Mascota en Adopción";
        if (inputId) inputId.value = "";
        if (inputName) inputName.value = "";
        if (selectSpecies) selectSpecies.value = "perro";
        if (inputAge) inputAge.value = "";
        if (inputHealth) inputHealth.value = "Vacunado/a, castrado/a y desparasitado/a";
        if (inputStory) inputStory.value = "";
        if (inputDesc) inputDesc.value = "";
        if (inputImgUrl) inputImgUrl.value = "";
    }

    openModal('dog-edit-modal');
}

async function handleDogFormSubmit(event) {
    event.preventDefault();
    if (!currentUser || !currentUser.isAdmin) return;

    const dogId = document.getElementById('dog-edit-id').value;
    const name = document.getElementById('dog-edit-name').value.trim();
    const species = (document.getElementById('dog-edit-species') ? document.getElementById('dog-edit-species').value : 'perro').toLowerCase();
    const age = document.getElementById('dog-edit-age').value.trim();
    const size = document.getElementById('dog-edit-size').value;
    const genderType = document.getElementById('dog-edit-gender').value;
    const status = document.getElementById('dog-edit-status').value;
    const health = document.getElementById('dog-edit-health').value.trim();
    const story = document.getElementById('dog-edit-story').value.trim();
    const description = document.getElementById('dog-edit-desc').value.trim();
    let imageUrl = document.getElementById('dog-edit-image-url').value.trim();

    const fileInput = document.getElementById('dog-edit-file-input');
    const file = fileInput && fileInput.files ? fileInput.files[0] : null;

    if (file) {
        // Read file locally as Data URL for instant local preview and persistent local storage
        const localDataUrl = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
        });
        if (localDataUrl) {
            imageUrl = localDataUrl;
        }

        if (window.showUploadProgress) {
            window.showUploadProgress('Procesando Foto', `Cargando foto de ${name}...`, 40);
        }

        try {
            const cloudName = (typeof CLOUDINARY_CONFIG !== 'undefined' && CLOUDINARY_CONFIG.cloudName) ? CLOUDINARY_CONFIG.cloudName : 'doissrwhj';
            const uploadPreset = (typeof CLOUDINARY_CONFIG !== 'undefined' && CLOUDINARY_CONFIG.uploadPreset) ? CLOUDINARY_CONFIG.uploadPreset : 'reserva_preset';

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);

            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data && data.secure_url) {
                imageUrl = data.secure_url;
            }
        } catch(err) {
            console.warn("Cloudinary fallback a imagen local:", err);
            // We keep the localDataUrl so it never blocks local testing!
        }
    } else {
        if (window.showUploadProgress) {
            window.showUploadProgress('Guardando Ficha', 'Guardando cambios de la mascota...', 60);
        }
    }

    const existingDog = allDogsList.find(d => String(d.id) === String(dogId));
    let imagesList = (existingDog && existingDog.images) ? [...existingDog.images] : [];
    if (imageUrl) {
        if (!imagesList.includes(imageUrl)) {
            imagesList.unshift(imageUrl);
        }
    }
    if (imagesList.length === 0) {
        imagesList = ['assets/img/cropped_circle_image.png'];
    }

    const dogData = {
        id: dogId || (species === 'gato' ? 'cat_' : 'dog_') + Date.now(),
        name,
        species,
        age,
        size,
        genderType,
        genderSymbol: genderType === 'macho' ? '♂' : '♀',
        status,
        health,
        story,
        description,
        image: imageUrl || imagesList[0],
        images: imagesList
    };

    // Always update local list immediately so admin can see and test right away
    const idx = allDogsList.findIndex(d => String(d.id) === String(dogData.id));
    if (idx > -1) {
        allDogsList[idx] = dogData;
    } else {
        allDogsList.unshift(dogData);
    }
    saveLocalDogs(allDogsList);

    if (typeof firebase !== 'undefined' && isFirebaseConfigured && db) {
        db.collection('adoptions').doc(dogData.id).set(dogData).then(() => {
            if (window.showUploadProgress) {
                window.showUploadProgress('Finalizado', '¡Mascota guardada con éxito en la nube!', 100);
                setTimeout(window.hideUploadProgress, 500);
            }
            closeModal('dog-edit-modal');
            renderDogsCatalog(allDogsList);
            showToast(`¡Ficha de ${dogData.name} guardada con éxito!`, 'success');
        }).catch(err => {
            if (window.hideUploadProgress) window.hideUploadProgress();
            console.warn("Error Firestore, guardado localmente:", err);
            closeModal('dog-edit-modal');
            renderDogsCatalog(allDogsList);
            showToast(`¡Ficha de ${dogData.name} guardada localmente!`, 'success');
        });
    } else {
        if (window.showUploadProgress) {
            window.showUploadProgress('Finalizado', '¡Mascota guardada localmente!', 100);
            setTimeout(window.hideUploadProgress, 500);
        }
        closeModal('dog-edit-modal');
        renderDogsCatalog(allDogsList);
        showToast(`¡Ficha de ${dogData.name} guardada localmente!`, 'success');
    }
}

function deleteDog(dogId) {
    if (!currentUser || !currentUser.isAdmin) return;
    if (!confirm('¿Estás seguro/a de eliminar esta mascota del catálogo de adopciones?')) return;

    allDogsList = allDogsList.filter(d => String(d.id) !== String(dogId));
    saveLocalDogs(allDogsList);
    renderDogsCatalog(allDogsList);

    if (typeof firebase !== 'undefined' && isFirebaseConfigured && db) {
        db.collection('adoptions').doc(String(dogId)).delete().then(() => {
            showToast('Mascota eliminada del catálogo.', 'info');
        }).catch(err => {
            console.warn("Error eliminando en Firestore:", err);
            showToast('Mascota eliminada localmente.', 'info');
        });
    } else {
        showToast('Mascota eliminada localmente.', 'info');
    }
}
