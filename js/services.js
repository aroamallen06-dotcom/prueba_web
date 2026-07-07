// ===========================
// DATOS DE CADA SERVICIO
// Edita aquí el contenido de cada ficha
// ===========================
const servicesData = {
    chatbot: {
        icon: "fa-solid fa-robot",
        title: "Chatbots",
        desc: "Automatiza la atención al cliente con un chatbot inteligente disponible las 24 horas, integrado con WhatsApp, web o Instagram.",
        features: [
            "Respuestas automáticas 24/7",
            "Integración con WhatsApp / Web",
            "Conexión con tu calendario o CRM",
            "Entrenado con la información de tu negocio"
        ]
    },
    reservas: {
        icon: "fa-solid fa-calendar-check",
        title: "Sistema de Reservas",
        desc: "Un sistema de reservas online para que tus clientes puedan agendar citas o mesas sin necesidad de llamar.",
        features: [
            "Calendario en tiempo real",
            "Recordatorios automáticos",
            "Panel de gestión para el negocio",
            "Pagos y señales online (opcional)"
        ]
    },
    calendar: {
        icon: "fa-solid fa-calendar-days",
        title: "Integración Google Calendar",
        desc: "Conecta tu negocio con Google Calendar para que las citas y eventos se sincronicen automáticamente, sin duplicados ni confusiones.",
        features: [
            "Sincronización automática de citas",
            "Recordatorios directos en el calendario",
            "Evita reservas duplicadas",
            "Compatible con Google Workspace"
        ]
    },
    web: {
        icon: "fa-solid fa-laptop-code",
        title: "Páginas Web",
        desc: "Webs profesionales, rápidas y optimizadas para buscadores, adaptadas a cualquier dispositivo.",
        features: [
            "Diseño 100% personalizado",
            "Optimizada para SEO",
            "Rápida y adaptada a móvil",
            "Panel de edición sencillo (opcional)"
        ]
    }
};

// ===========================
// ELEMENTOS DEL DOM
// ===========================
const serviceCards = document.querySelectorAll(".service-card");
const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");
const modalIcon = document.getElementById("modal-icon");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalFeatures = document.getElementById("modal-features");

// Servicios que ya tienen una demo real (sección propia) en vez de solo el modal
const servicesWithDemo = {
    chatbot: "demo-chatbot"
    // cuando montemos la demo de reservas, añadiríamos: reservas: "demo-reservas"
};

// ===========================
// ABRIR MODAL (o la demo, si existe) AL HACER CLIC EN UNA TARJETA
// ===========================
serviceCards.forEach((card) => {
    card.addEventListener("click", () => {

        const key = card.getAttribute("data-service");

        // Si este servicio tiene una demo real, vamos directos a ella
        if (servicesWithDemo[key]) {
            window.showSection(servicesWithDemo[key]);
            return;
        }

        const data = servicesData[key];

        if (!data) return;

        // Rellenamos el modal con los datos del servicio
        modalIcon.className = "modal-icon " + data.icon;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;

        // Limpiamos y añadimos las características
        modalFeatures.innerHTML = "";
        data.features.forEach((feature) => {
            const li = document.createElement("li");
            li.innerHTML = `<i class="fa-solid fa-check"></i> ${feature}`;
            modalFeatures.appendChild(li);
        });

        // Mostramos el modal
        modalOverlay.classList.add("active");
    });
});

// ===========================
// CERRAR MODAL
// ===========================
modalClose.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
});

// Cerrar al hacer clic fuera del recuadro
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove("active");
    }
});

// Cerrar con la tecla ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        modalOverlay.classList.remove("active");
    }
});