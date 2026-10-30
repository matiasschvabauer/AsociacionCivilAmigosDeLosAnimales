/* ==========================================================================
   RESERVA CANINA GÁLVEZ - AUTHENTICATION & PROFILE MODULE (GLOBAL GOOGLE AUTH)
   ========================================================================== */

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    ensureAuthModalsExist();
    initAuth();
});

function ensureAuthModalsExist() {
    // Inject or update #login-modal on the page
    let loginOverlay = document.getElementById('login-modal');
    if (!loginOverlay) {
        loginOverlay = document.createElement('div');
        loginOverlay.className = 'modal-overlay';
        loginOverlay.id = 'login-modal';
        document.body.appendChild(loginOverlay);
    }
    loginOverlay.innerHTML = `
        <div class="modal-container" style="max-width: 490px;">
            <button class="modal-close-btn" onclick="closeModal('login-modal')"><i class="fas fa-times"></i></button>
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="assets/img/cropped_circle_image.png" alt="Logo Asociación Civil" class="logo-img-circle" style="width:68px; height:68px; margin: 0 auto 12px auto;">
                <h2 style="color: var(--primary); font-size: 1.4rem; margin-bottom: 6px;">Acceso y Administración</h2>
                <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.4; margin: 0;">Podés ingresar con rol de Administrador para pruebas o iniciar sesión con Google.</p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 18px;">
                <button class="btn btn-secondary" onclick="loginAsTemporaryAdmin()" style="width: 100%; padding: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 0.98rem; background: #C96545; color: white; border: none; cursor: pointer; border-radius: var(--radius-sm); box-shadow: var(--shadow-sm);">
                    <i class="fas fa-crown" style="color: #ffd166;"></i> Ingresar como Administrador (Modo Pruebas)
                </button>
                <p style="font-size: 0.8rem; color: var(--text-muted); text-align: center; margin: -4px 0 6px 0;">
                    <i class="fas fa-bolt" style="color: #C96545;"></i> Acceso instantáneo para agregar mascotas en Adopta, metas en Refugio, subir fotos y moderar localmente.
                </p>

                <div style="display: flex; align-items: center; gap: 10px; margin: 4px 0;">
                    <span style="flex: 1; height: 1px; background: var(--border-color);"></span>
                    <span style="font-size: 0.76rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">O verificación comunitaria</span>
                    <span style="flex: 1; height: 1px; background: var(--border-color);"></span>
                </div>

                <button class="btn" onclick="loginWithGoogle()" style="width: 100%; background: #ffffff; color: #444; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); padding: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 0.92rem; border-radius: var(--radius-sm);">
                    <i class="fab fa-google" style="color: #ea4335; font-size: 1.15rem;"></i> Iniciar Sesión con Google (Gmail)
                </button>
            </div>

            <div style="background: var(--primary-light); color: var(--primary); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 0.82rem; text-align: center; line-height: 1.4;">
                <i class="fas fa-shield-alt"></i> La administración te permite dar de alta rescatados, metas del refugio y gestionar la comunidad.
            </div>
        </div>
    `;

    // Inject #profile-modal if missing on the page
    if (!document.getElementById('profile-modal')) {
        const profileOverlay = document.createElement('div');
        profileOverlay.className = 'modal-overlay';
        profileOverlay.id = 'profile-modal';
        profileOverlay.innerHTML = `
            <div class="modal-container" style="max-width: 520px;">
                <button class="modal-close-btn" onclick="closeModal('profile-modal')"><i class="fas fa-times"></i></button>
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; margin: 0 auto 12px auto; border: 3px solid var(--primary);">
                        <img id="profile-avatar-img" src="" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <h2>Mi Perfil en la Asociación</h2>
                    <p id="profile-email-text" style="color: var(--text-muted); font-size: 0.88rem;"></p>
                </div>

                <form onsubmit="saveProfileSettings(event)">
                    <div class="form-group">
                        <label class="form-label">Nombre o Apodo Público:</label>
                        <input type="text" id="profile-display-name" class="form-control" placeholder="Ej: María Fernández" required minlength="2" maxlength="50">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Teléfono de contacto por defecto (Opcional):</label>
                        <input type="tel" id="profile-phone-input" class="form-control" placeholder="Ej: 3404-556677">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        <i class="fas fa-save"></i> Guardar Cambios del Perfil
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(profileOverlay);
    }
}

function initAuth() {
    checkAuthState();
    if (typeof firebase !== 'undefined' && isFirebaseConfigured && auth) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                const customProfile = getCustomProfile(user.uid);
                const isAdmin = typeof isAdminEmail === 'function' ? isAdminEmail(user.email) : false;
                currentUser = {
                    uid: user.uid,
                    name: customProfile.displayName || user.displayName || 'Vecino/a de Gálvez',
                    originalName: user.displayName || 'Usuario Google',
                    email: user.email || '',
                    photo: user.photoURL || '',
                    phone: customProfile.phone || '',
                    provider: 'Google',
                    isAdmin: isAdmin,
                    role: isAdmin ? 'Administrador Reserva' : 'Vecino Verificado'
                };
                localStorage.setItem('reserva_user_profile', JSON.stringify(currentUser));
            } else {
                // If there is an active temporary admin session, preserve it!
                if (currentUser && (currentUser.provider === 'Admin Momentáneo' || currentUser.isAdmin)) {
                    updateAuthUI();
                    notifyPageModules();
                    return;
                }
                currentUser = null;
                localStorage.removeItem('reserva_user_profile');
            }
            updateAuthUI();
            notifyPageModules();
        });
    } else {
        updateAuthUI();
        notifyPageModules();
    }
}

function checkAuthState() {
    const savedUser = localStorage.getItem('reserva_user_profile');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
        } catch(e) {
            currentUser = null;
        }
    }
}

function getCustomProfile(uid) {
    const saved = localStorage.getItem(`reserva_profile_${uid}`);
    if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
    }
    return {};
}

function saveCustomProfile(uid, profileData) {
    localStorage.setItem(`reserva_profile_${uid}`, JSON.stringify(profileData));
}

function notifyPageModules() {
    if (typeof initAdminTopbar === 'function') initAdminTopbar();
    if (typeof renderDogsCatalog === 'function' && typeof allDogsList !== 'undefined') renderDogsCatalog(allDogsList);
    if (typeof renderRefugioNeeds === 'function' && typeof refugioNeedsList !== 'undefined') renderRefugioNeeds(refugioNeedsList);
    if (typeof renderRefugioGoals === 'function' && typeof refugioGoalsList !== 'undefined') renderRefugioGoals(refugioGoalsList);
    if (typeof renderForum === 'function' && typeof getLocalForumThreads === 'function') renderForum(getLocalForumThreads());
    if (typeof renderFinalFelizList === 'function') renderFinalFelizList();
    if (typeof renderHistoriasList === 'function') renderHistoriasList();
}

/* Acceso de Administrador Momentáneo para Pruebas Locales */
function loginAsTemporaryAdmin() {
    currentUser = {
        uid: 'admin_momentaneo_' + Date.now(),
        name: 'Administrador (Modo Pruebas)',
        originalName: 'Administrador (Modo Pruebas)',
        email: 'admin.pruebas@asociacion.local',
        photo: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
        phone: '3404-000000',
        provider: 'Admin Momentáneo',
        isAdmin: true,
        role: 'Administrador Reserva'
    };
    localStorage.setItem('reserva_user_profile', JSON.stringify(currentUser));
    updateAuthUI();
    closeModal('login-modal');
    if (typeof initAdminTopbar === 'function') {
        initAdminTopbar();
    }
    notifyPageModules();
    if (typeof showToast === 'function') {
        showToast('¡Acceso concedido como Administrador Momentáneo!', 'success');
    }
}

function openAdminAccessModal() {
    openModal('login-modal');
}

/* Google (Gmail) Login */
function loginWithGoogle() {
    if (typeof firebase !== 'undefined' && isFirebaseConfigured && auth) {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).then((result) => {
            const user = result.user;
            const customProfile = getCustomProfile(user.uid);
            const isAdmin = typeof isAdminEmail === 'function' ? isAdminEmail(user.email) : false;
            currentUser = {
                uid: user.uid,
                name: customProfile.displayName || user.displayName || 'Vecino/a de Gálvez',
                originalName: user.displayName || 'Usuario Google',
                email: user.email || '',
                photo: user.photoURL || '',
                phone: customProfile.phone || '',
                provider: 'Google',
                isAdmin: isAdmin,
                role: isAdmin ? 'Administrador Reserva' : 'Vecino Verificado'
            };
            localStorage.setItem('reserva_user_profile', JSON.stringify(currentUser));
            updateAuthUI();
            closeModal('login-modal');
            notifyPageModules();
            showToast(`¡Bienvenido/a ${currentUser.name}!`, 'success');
        }).catch((error) => {
            showToast(`Error al iniciar sesión con Google: ${error.message}`, 'error');
        });
    } else {
        currentUser = {
            uid: 'google_user_demo_' + Date.now(),
            name: 'Administrador Demo',
            originalName: 'Administrador Demo',
            email: 'matiasschvbauer@gmail.com',
            photo: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
            phone: '3404-556677',
            provider: 'Google Demo',
            isAdmin: true,
            role: 'Administrador Reserva'
        };
        localStorage.setItem('reserva_user_profile', JSON.stringify(currentUser));
        updateAuthUI();
        closeModal('login-modal');
        notifyPageModules();
        showToast('¡Sesión de Administrador iniciada!', 'success');
    }
}

function logout() {
    if (typeof firebase !== 'undefined' && isFirebaseConfigured && auth) {
        auth.signOut();
    }
    currentUser = null;
    localStorage.removeItem('reserva_user_profile');
    const topbar = document.getElementById('reserva-admin-topbar');
    if (topbar) topbar.remove();
    document.body.classList.remove('has-admin-topbar');
    updateAuthUI();
    notifyPageModules();
    showToast('Sesión cerrada correctamente.', 'info');
}

/* User Profile Management Modal */
function openProfileModal() {
    if (!currentUser) {
        openModal('login-modal');
        return;
    }

    const nameInput = document.getElementById('profile-display-name');
    const emailEl = document.getElementById('profile-email-text');
    const phoneInput = document.getElementById('profile-phone-input');
    const avatarImg = document.getElementById('profile-avatar-img');

    if (nameInput) nameInput.value = currentUser.name || '';
    if (emailEl) emailEl.innerText = `Google (Gmail) • ${currentUser.email || 'Cuenta Verificada'} ${currentUser.isAdmin ? '👑 ADMIN' : ''}`;
    if (phoneInput) phoneInput.value = currentUser.phone || '';
    if (avatarImg) {
        if (currentUser.photo) {
            avatarImg.src = currentUser.photo;
            avatarImg.style.display = 'block';
        } else {
            avatarImg.style.display = 'none';
        }
    }

    openModal('profile-modal');
}

function saveProfileSettings(event) {
    if (event) event.preventDefault();
    if (!currentUser) return;

    const newDisplayName = document.getElementById('profile-display-name').value.trim();
    const newPhone = document.getElementById('profile-phone-input').value.trim();

    if (!newDisplayName) {
        showToast('Por favor ingresa tu nombre visible.', 'error');
        return;
    }

    currentUser.name = newDisplayName;
    currentUser.phone = newPhone;

    localStorage.setItem('reserva_user_profile', JSON.stringify(currentUser));
    saveCustomProfile(currentUser.uid, { displayName: newDisplayName, phone: newPhone });

    updateAuthUI();
    closeModal('profile-modal');
    notifyPageModules();
    showToast('¡Perfil actualizado con éxito!', 'success');
}

function updateAuthUI() {
    const authStatusContainers = document.querySelectorAll('.auth-status-container');
    
    authStatusContainers.forEach(container => {
        if (currentUser) {
            container.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="avatar" onclick="openProfileModal()" style="width:34px; height:34px; cursor:pointer;" title="Configurar Mi Perfil">
                        ${currentUser.photo ? `<img src="${currentUser.photo}" style="width:100%; height:100%; border-radius:50%;">` : currentUser.name.charAt(0)}
                    </div>
                    <span onclick="openProfileModal()" style="font-weight:600; font-size:0.86rem; cursor:pointer; max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color: var(--text-main);" title="Configurar Mi Perfil">
                        ${currentUser.name} ${currentUser.isAdmin ? '<i class="fas fa-crown" style="color:#e9c46a;"></i>' : ''}
                    </span>
                    <button class="btn btn-sm btn-outline" onclick="logout()" title="Cerrar Sesión" style="padding:4px 8px; font-size:0.78rem; color:#c62828;">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <button class="btn btn-primary btn-sm" onclick="openModal('login-modal')" style="font-size:0.85rem; padding: 7px 14px;">
                    <i class="fab fa-google"></i> Acceso Usuario / Comunidad
                </button>
            `;
        }
    });

    const footerAdminSlots = document.querySelectorAll('.footer-admin-slot');
    footerAdminSlots.forEach(slot => {
        if (currentUser && currentUser.isAdmin) {
            slot.innerHTML = `
                <span style="display: inline-flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #8FA58A;">
                    <i class="fas fa-user-shield"></i> Admin: ${currentUser.name}
                    <a href="#" onclick="logout(); return false;" style="color: #e57373; margin-left: 6px; text-decoration: underline;">(Salir)</a>
                </span>
            `;
        } else {
            slot.innerHTML = `
                <a href="#" onclick="openModal('login-modal'); return false;" class="footer-admin-link" style="color: #8FA58A; font-size: 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
                    <i class="fas fa-lock"></i> Acceso Exclusivo Administración
                </a>
            `;
        }
    });
}

