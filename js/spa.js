// ===========================
// NAVEGACIÓN TIPO SPA (mostrar/ocultar secciones)
// ===========================

// Enlaces del menú que tienen una sección asociada
const navLinkItems = document.querySelectorAll(".nav-links a[data-target]");

// Todas las secciones tipo "página"
const pageSections = document.querySelectorAll(".page-section");

// ===========================
// FUNCIÓN REUTILIZABLE: muestra una sección y oculta las demás
// La usan tanto el menú como las tarjetas de servicio (ej. la demo del chatbot)
// ===========================
function showSection(target) {

    pageSections.forEach((section) => {
        section.classList.remove("active");
        if (section.id === target) {
            section.classList.add("active");
        }
    });

    // Marcamos el enlace del menú como activo, si existe uno con ese data-target
    navLinkItems.forEach((l) => {
        l.classList.toggle("active", l.getAttribute("data-target") === target);
    });

    // Subimos al principio de la página
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Si el menú móvil está abierto, lo cerramos
    if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        menuToggle.textContent = "☰";
    }
}

// Hacemos que otros archivos JS (como services.js) puedan usar esta función
window.showSection = showSection;

navLinkItems.forEach((link) => {

    link.addEventListener("click", (e) => {
        e.preventDefault(); // evita que el "#" salte de sitio
        const target = link.getAttribute("data-target");
        showSection(target);
    });

});