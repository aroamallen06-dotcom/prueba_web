// ===========================
// DATOS DE CADA PROYECTO
// Cuando tengas capturas reales, solo cambia las rutas de "screenshots"
// (crea una carpeta img/proyectos/ y pon ahí los archivos con esos nombres)
// ===========================
const galleryData = {
    peluqueria: {
        tag: "Proyecto personal",
        title: "Peluquería Bella",
        desc: "Web con sistema de reservas online para una peluquería, pensada para reducir las llamadas y gestionar citas automáticamente.",
        screenshots: [
            "img/proyectos/peluqueria-1.jpg",
            "img/proyectos/peluqueria-2.jpg"
        ]
    },
    restaurante: {
        tag: "Proyecto personal",
        title: "Restaurante La Toscana",
        desc: "Landing page con menú digital, ubicación y un chatbot que responde dudas sobre horarios y reservas de mesa.",
        screenshots: [
            "img/proyectos/restaurante-1.jpg",
            "img/proyectos/restaurante-2.jpg"
        ]
    },
    clinica: {
        tag: "Proyecto personal",
        title: "Clínica Dental Sonrisas",
        desc: "Web corporativa con integración de Google Calendar para sincronizar las citas del equipo automáticamente.",
        screenshots: [
            "img/proyectos/clinica-1.jpg",
            "img/proyectos/clinica-2.jpg"
        ]
    }
};

// ===========================
// ELEMENTOS DEL DOM
// ===========================
const galleryCards = document.querySelectorAll(".gallery-card");
const galleryOverlay = document.getElementById("gallery-overlay");
const galleryModalClose = document.getElementById("gallery-modal-close");
const galleryModalTag = document.getElementById("gallery-modal-tag");
const galleryModalTitle = document.getElementById("gallery-modal-title");
const galleryModalDesc = document.getElementById("gallery-modal-desc");
const galleryScreenshotsContainer = document.getElementById("gallery-screenshots");

// ===========================
// ABRIR EL MODAL AL HACER CLIC EN UNA TARJETA
// ===========================
galleryCards.forEach((card) => {
    card.addEventListener("click", () => {

        const key = card.getAttribute("data-project");
        const data = galleryData[key];
        if (!data) return;

        galleryModalTag.textContent = data.tag;
        galleryModalTitle.textContent = data.title;
        galleryModalDesc.textContent = data.desc;

        // Generamos un recuadro por cada captura (real, o el aviso si aún no existe)
        galleryScreenshotsContainer.innerHTML = "";

        data.screenshots.forEach((path) => {
            const item = document.createElement("div");
            item.classList.add("screenshot-item");
            item.setAttribute("data-path", path);

            const img = document.createElement("img");
            img.src = path;
            img.alt = data.title;

            // Si la imagen no existe todavía, mostramos el aviso en vez de un icono roto
            img.addEventListener("error", () => {
                item.classList.add("missing");
            });

            item.appendChild(img);
            galleryScreenshotsContainer.appendChild(item);
        });

        galleryOverlay.classList.add("active");
    });
});

// ===========================
// CERRAR EL MODAL
// ===========================
galleryModalClose.addEventListener("click", () => {
    galleryOverlay.classList.remove("active");
});

galleryOverlay.addEventListener("click", (e) => {
    if (e.target === galleryOverlay) {
        galleryOverlay.classList.remove("active");
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        galleryOverlay.classList.remove("active");
    }
});