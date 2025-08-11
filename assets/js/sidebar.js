// Sidebar standardization and navigation functionality

// Function to generate sidebar HTML with proper navigation paths
function generateSidebar(currentPage = '') {
    // Determine if we're in a subdirectory
    const isInSubdirectory = window.location.pathname.includes('/pages/');
    const baseHref = isInSubdirectory ? '../' : '';
    
    return `
        <div class="sidebar d-none d-lg-block" style="width: 250px; min-height: 100vh;">
            <div class="d-flex align-items-center p-3 border-bottom">
                <img src="${baseHref}assets/images/logo.png" alt="Logo" class="me-2" style="height: 80px; width: auto;">
                <h5 class="mb-0">Diario de Emociones</h5>
            </div>
            
            <a href="${baseHref}index.html" class="sidebar-item text-decoration-none ${currentPage === 'index' ? 'active' : ''}">
                <i class="fas fa-home"></i> Inicio
            </a>
            <a href="${baseHref}pages/registro.html" class="sidebar-item text-decoration-none ${currentPage === 'registro' ? 'active' : ''}">
                <i class="fas fa-pen"></i> Registro
            </a>
            <a href="${baseHref}pages/dashboard.html" class="sidebar-item text-decoration-none ${currentPage === 'dashboard' ? 'active' : ''}">
                <i class="fas fa-chart-line"></i> Dashboard
            </a>
            <a href="${baseHref}pages/guias.html" class="sidebar-item text-decoration-none ${currentPage === 'guias' ? 'active' : ''}">
                <i class="fas fa-book"></i> Guías
            </a>
            <a href="${baseHref}pages/herramientas.html" class="sidebar-item text-decoration-none ${currentPage === 'herramientas' ? 'active' : ''}">
                <i class="fas fa-tools"></i> Herramientas
            </a>
            <a href="${baseHref}pages/ayuda.html" class="sidebar-item text-decoration-none ${currentPage === 'ayuda' ? 'active' : ''}">
                <i class="fas fa-hands-helping"></i> Ayuda
            </a>
        </div>
    `;
}

// Function to generate mobile navigation
function generateMobileNav(currentPage = '') {
    const isInSubdirectory = window.location.pathname.includes('/pages/');
    const baseHref = isInSubdirectory ? '../' : '';
    
    return `
        <nav class="navbar navbar-expand-lg d-lg-none">
            <div class="container-fluid">
                <a class="navbar-brand" href="${baseHref}index.html"><img src="${baseHref}assets/images/logo.png" alt="Logo" style="height: 24px; width: auto; margin-right: 8px;"> Diario de Emociones</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item"><a class="nav-link ${currentPage === 'index' ? 'active' : ''}" href="${baseHref}index.html">Inicio</a></li>
                        <li class="nav-item"><a class="nav-link ${currentPage === 'registro' ? 'active' : ''}" href="${baseHref}pages/registro.html">Registro</a></li>
                        <li class="nav-item"><a class="nav-link ${currentPage === 'dashboard' ? 'active' : ''}" href="${baseHref}pages/dashboard.html">Dashboard</a></li>
                        <li class="nav-item"><a class="nav-link ${currentPage === 'guias' ? 'active' : ''}" href="${baseHref}pages/guias.html">Guías</a></li>
                        <li class="nav-item"><a class="nav-link ${currentPage === 'herramientas' ? 'active' : ''}" href="${baseHref}pages/herramientas.html">Herramientas</a></li>
                        <li class="nav-item"><a class="nav-link ${currentPage === 'ayuda' ? 'active' : ''}" href="${baseHref}pages/ayuda.html">Ayuda</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    `;
}

// Function to initialize standardized sidebar
function initializeSidebar(currentPage) {
    const sidebarContainer = document.querySelector('.d-flex');
    if (sidebarContainer) {
        // Replace existing sidebar
        const existingSidebar = sidebarContainer.querySelector('.sidebar');
        if (existingSidebar) {
            existingSidebar.outerHTML = generateSidebar(currentPage);
        }
        
        // Replace existing mobile nav
        const existingMobileNav = document.querySelector('nav.navbar');
        if (existingMobileNav) {
            existingMobileNav.outerHTML = generateMobileNav(currentPage);
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateSidebar, generateMobileNav, initializeSidebar };
}