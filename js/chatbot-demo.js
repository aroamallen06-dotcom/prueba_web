// ===========================
// DATOS: precios por servicio
// (Edita aquí nombres, palabras clave y precios)
// ===========================
const services = [
    {
        id: "chatbot",
        keywords: ["chatbot", "bot", "asistente virtual"],
        precio: "xxx"
    },
    {
        id: "reservas",
        keywords: ["sistema de reservas", "reservas", "citas"],
        precio: "xxx"
    },
    {
        id: "calendar",
        keywords: ["google calendar", "calendario", "calendar", "integración calendar"],
        precio: "xxx"
    },
    {
        id: "web",
        keywords: ["web", "pagina web", "página web", "sitio web"],
        precio: "xxx"
    }
];

// Palabras que detectan un día (para la reserva)
const dayKeywords = [
    "lunes", "martes", "miércoles", "miercoles", "jueves",
    "viernes", "sábado", "sabado", "domingo", "mañana", "hoy"
];

// Detecta fechas tipo "15 de julio"
const dateRegex = /\d{1,2}\s*(de)?\s*(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i;

// Respuestas simples que no necesitan contexto
const simpleReplies = [
    { keywords: ["hola", "buenas", "hey"], reply: "¡Hola! Encantado de saludarte ¿Quieres saber sobre horarios, precios o reservas?" },
    { keywords: ["horario", "hora", "abierto", "cerrado"], reply: "Nuestro horario es de lunes a sábado, de 9:00 a 20:00h. ¡Los domingos descansamos! 🕒" },
    { keywords: ["gracias"], reply: "¡A ti por escribir! Si necesitas algo más, aquí estoy " },
    { keywords: ["adios", "adiós", "chao", "bye"], reply: "¡Hasta pronto! Que tengas un gran día " }
];

const defaultReply = "Entiendo. Un miembro de nuestro equipo revisará tu mensaje y te responderá enseguida. Mientras tanto, ¿puedo ayudarte con horarios, precios o reservas?";

// ===========================
// ESTADO DE LA CONVERSACIÓN
// pendingIntent: null | "precio" | "reserva"
// Esto es lo que le da "memoria" al bot entre un mensaje y el siguiente
// ===========================
let pendingIntent = null;

// ===========================
// FUNCIONES DE AYUDA
// ===========================

// Busca si el texto menciona alguno de los servicios definidos arriba
function findService(text) {
    return services.find((s) => s.keywords.some((k) => text.includes(k)));
}

// Busca si el texto menciona un día o una fecha
function findDay(text) {
    if (dateRegex.test(text)) return text.match(dateRegex)[0];
    return dayKeywords.find((d) => text.includes(d)) || null;
}

// ===========================
// LÓGICA PRINCIPAL: decide qué responder
// ===========================
function getBotReply(userText) {
    const text = userText.toLowerCase();

    // --- 1. Si el bot está esperando que le digan el SERVICIO (para dar el precio) ---
    if (pendingIntent === "precio") {
        const service = findService(text);
        if (service) {
            pendingIntent = null; // resuelto, reseteamos el contexto
            return `El precio de ${service.id === "chatbot" ? "los chatbots" : "ese servicio"} es de ${service.precio}. ¿Quieres que te pase más información? 💬`;
        }
        return "No he reconocido el servicio  ¿Te refieres a Chatbot, Reservas, Integración con Google Calendar o Página Web?";
    }

    // --- 2. Si el bot está esperando que le digan el DÍA (para la reserva) ---
    if (pendingIntent === "reserva") {
        const day = findDay(text);
        if (day) {
            pendingIntent = null;
            return `¡Reservado para el ${day}!  Te enviaremos un recordatorio antes de la cita.`;
        }
        return "No he pillado el día ¿Qué día te viene bien (por ejemplo, 'martes' o '15 de julio')?";
    }

    // --- 3. Sin contexto pendiente: analizamos el mensaje desde cero ---

    // ¿Pregunta por el precio?
    if (text.includes("precio") || text.includes("cuanto cuesta") || text.includes("cuánto cuesta") || text.includes("tarifa")) {
        const service = findService(text); // ¿ya especificó el servicio en el mismo mensaje?
        if (service) {
            return `El precio de ese servicio es de ${service.precio}. ¿Quieres que te pase más información? 💬`;
        }
        pendingIntent = "precio"; // nos quedamos esperando el servicio
        return "¡Claro! ¿De qué servicio quieres saber el precio? (Chatbot, Reservas, Integración con Google Calendar o Página Web)";
    }

    // ¿Quiere hacer una reserva?
    if (text.includes("reserva") || text.includes("cita") || text.includes("reservar")) {
        const day = findDay(text); // ¿ya dijo el día en el mismo mensaje?
        if (day) {
            return `¡Reservado para el ${day}!  Te enviaremos un recordatorio antes de la cita.`;
        }
        pendingIntent = "reserva"; // nos quedamos esperando el día
        return "¡Perfecto! ¿Qué día te viene bien?";
    }

    // Respuestas simples (hola, gracias, horario, adiós...)
    const match = simpleReplies.find((item) => item.keywords.some((k) => text.includes(k)));
    if (match) return match.reply;

    return defaultReply;
}

// ===========================
// ELEMENTOS DEL DOM
// ===========================
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const backToServicios = document.getElementById("back-to-servicios");

function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender); // sender = "bot" o "user"
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (text === "") return;

    addMessage(text, "user");
    chatInput.value = "";

    setTimeout(() => {
        const reply = getBotReply(text);
        addMessage(reply, "bot");
    }, 600);
}

chatSend.addEventListener("click", sendMessage);

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

backToServicios.addEventListener("click", () => {
    pendingIntent = null; // reseteamos el contexto al salir, para empezar de cero la próxima vez
    window.showSection("servicios");
});