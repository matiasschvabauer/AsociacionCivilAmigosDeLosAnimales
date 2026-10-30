// ═══════════════════════════════════════════════════════════════════
// mobile-app.js — Lógica y Funcionalidades para Páginas Móviles (m_*.html)
// Asociación Civil Amigos de los Animales No Humanos - Gálvez
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initMobileApp();
});

function initMobileApp() {
    setupMobileDrawer();
    highlightActiveBottomNav();
    setupAdminMobileCompatibility();
}

// Drawer Menú Lateral
window.toggleMobileDrawer = function(forceOpen) {
    const drawer = document.getElementById('m-drawer');
    const overlay = document.getElementById('m-overlay');
    if (!drawer || !overlay) return;

    const isOpen = drawer.classList.contains('open');
    if (forceOpen === true || (!isOpen && forceOpen !== false)) {
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
};

function setupMobileDrawer() {
    const overlay = document.getElementById('m-overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            toggleMobileDrawer(false);
        });
    }

    // Cerrar drawer al hacer clic en cualquier enlace interno
    const drawerLinks = document.querySelectorAll('.m-drawer-link');
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMobileDrawer(false);
        });
    });
}

// Marcar pestaña activa en la barra de navegación inferior
function highlightActiveBottomNav() {
    const currentPath = window.location.pathname;
    const fileName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'm_index.html';

    const navItems = document.querySelectorAll('.m-bottom-nav .m-nav-item');
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && (href === fileName || href.includes(fileName))) {
            item.classList.add('active');
        } else if (!href && item.classList.contains('active')) {
            // botón de menú
            item.classList.remove('active');
        }
    });
}

// Compatibilidad con la barra de administración en móvil
function setupAdminMobileCompatibility() {
    const checkAdmin = () => {
        const topbar = document.getElementById('reserva-admin-topbar');
        const mHeader = document.querySelector('.m-header');
        if (topbar && mHeader) {
            mHeader.style.top = '42px';
        } else if (mHeader) {
            mHeader.style.top = '0px';
        }
    };
    checkAdmin();
    setTimeout(checkAdmin, 400);
}

