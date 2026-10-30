// ═══════════════════════════════════════════════════════════════════
// mobile-detect.js — Detección de Dispositivo y Enrutamiento Móvil
// Asociación Civil Amigos de los Animales No Humanos - Gálvez
// ═══════════════════════════════════════════════════════════════════

(function() {
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    var currentPath = window.location.pathname;
    var fileName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

    // Si entra desde celular a página normal de escritorio -> Redirigir a versión m_*
    if (isMobile && !fileName.startsWith('m_')) {
        var mobileFile = 'm_' + fileName;
        window.location.replace(mobileFile + window.location.search + window.location.hash);
    } 
    // Si entra desde PC de escritorio a una página m_* -> Redirigir a versión normal
    else if (!isMobile && window.innerWidth > 1024 && fileName.startsWith('m_')) {
        var desktopFile = fileName.substring(2);
        window.location.replace(desktopFile + window.location.search + window.location.hash);
    }
})();

