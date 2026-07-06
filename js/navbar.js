// Buscamos el botón hamburguesa
const menuToggle = document.getElementById("menu-toggle");

// Buscamos el menú
const navLinks = document.getElementById("nav-links");

// Cuando hagamos clic...
menuToggle.addEventListener("click", () => {

    // Añadimos o quitamos la clase "active"
    navLinks.classList.toggle("active");

    // Cambiamos el icono
    if (navLinks.classList.contains("active")) {
        menuToggle.textContent = "✕";
    } else {
        menuToggle.textContent = "☰";
    }

});