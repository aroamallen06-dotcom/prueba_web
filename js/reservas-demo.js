// ===========================
// PERSISTENCIA: guardamos las reservas en el navegador (localStorage)
// para que sigan ahí aunque recargues la página.
// Formato guardado: { "2026-07-15_10:00": "Nombre de la persona", ... }
// ===========================
const STORAGE_KEY = "reservasDemoBookings";

function loadBookings() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        console.error("No se pudieron leer las reservas guardadas", e);
        return {};
    }
}

function saveBookings(bookings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
        console.error("No se pudo guardar la reserva", e);
    }
}

let bookings = loadBookings();

// Horas que se ofrecen cada día (edítalas aquí si quieres otro horario)
const availableHours = ["10:00", "11:00", "12:00", "16:00", "17:00", "18:00"];

// ===========================
// ESTADO DEL CALENDARIO
// ===========================
let viewDate = new Date();       // mes que se está mostrando
viewDate.setDate(1);

let selectedDateStr = null;      // día elegido, formato "YYYY-MM-DD"
let selectedTime = null;         // hora elegida, formato "HH:MM"

const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// ===========================
// ELEMENTOS DEL DOM
// ===========================
const calendarGrid = document.getElementById("calendar-grid");
const calMonthLabel = document.getElementById("cal-month-label");
const calPrev = document.getElementById("cal-prev");
const calNext = document.getElementById("cal-next");

const bookingPanel = document.getElementById("booking-panel");
const bookingPanelDate = document.getElementById("booking-panel-date");
const timeSlotsContainer = document.getElementById("time-slots");

const bookingName = document.getElementById("booking-name");
const bookingConfirmBtn = document.getElementById("booking-confirm");
const bookingConfirmation = document.getElementById("booking-confirmation");
const backToServiciosReservas = document.getElementById("back-to-servicios-reservas");

// ===========================
// UTILIDADES DE FECHA
// ===========================
function formatDateStr(year, month, day) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
}

function hasBookingOnDate(dateStr) {
    return Object.keys(bookings).some((key) => key.startsWith(dateStr));
}

// ===========================
// PINTAR EL CALENDARIO DEL MES ACTUAL
// ===========================
function renderCalendar() {
    calendarGrid.innerHTML = "";

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    calMonthLabel.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    // getDay(): 0=domingo...6=sábado → lo convertimos para que la semana empiece en lunes
    let startWeekday = firstDay.getDay();
    startWeekday = startWeekday === 0 ? 6 : startWeekday - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Huecos vacíos antes del día 1 (para alinear con el día de la semana correcto)
    for (let i = 0; i < startWeekday; i++) {
        const empty = document.createElement("div");
        empty.classList.add("cal-day", "empty");
        calendarGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("div");
        cell.classList.add("cal-day");
        cell.textContent = day;

        const dateStr = formatDateStr(year, month, day);
        const cellDate = new Date(year, month, day);
        cellDate.setHours(0, 0, 0, 0);

        if (cellDate < today) {
            cell.classList.add("disabled");
        } else {
            cell.addEventListener("click", () => selectDay(dateStr, cell));
        }

        if (dateStr === selectedDateStr) {
            cell.classList.add("selected");
        }

        if (hasBookingOnDate(dateStr)) {
            cell.classList.add("has-booking");
        }

        calendarGrid.appendChild(cell);
    }
}

// ===========================
// AL ELEGIR UN DÍA: mostramos el panel de horas
// ===========================
function selectDay(dateStr, cellEl) {
    selectedDateStr = dateStr;
    selectedTime = null;

    document.querySelectorAll(".cal-day").forEach((d) => d.classList.remove("selected"));
    cellEl.classList.add("selected");

    const [y, m, d] = dateStr.split("-");
    bookingPanelDate.textContent = `Horas disponibles: ${d}/${m}/${y}`;

    renderTimeSlots();
    bookingPanel.classList.add("show");
    bookingConfirmation.classList.remove("show");
}

// ===========================
// PINTAR LAS HORAS DISPONIBLES PARA EL DÍA ELEGIDO
// ===========================
function renderTimeSlots() {
    timeSlotsContainer.innerHTML = "";

    availableHours.forEach((time) => {
        const btn = document.createElement("button");
        btn.classList.add("slot");
        btn.textContent = time;

        const key = `${selectedDateStr}_${time}`;

        if (bookings[key]) {
            btn.classList.add("taken");
        } else {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".slot").forEach((s) => s.classList.remove("selected"));
                btn.classList.add("selected");
                selectedTime = time;
            });
        }

        timeSlotsContainer.appendChild(btn);
    });
}

// ===========================
// NAVEGAR ENTRE MESES
// ===========================
calPrev.addEventListener("click", () => {
    viewDate.setMonth(viewDate.getMonth() - 1);
    renderCalendar();
});

calNext.addEventListener("click", () => {
    viewDate.setMonth(viewDate.getMonth() + 1);
    renderCalendar();
});

// ===========================
// CONFIRMAR LA RESERVA
// ===========================
bookingConfirmBtn.addEventListener("click", () => {
    const name = bookingName.value.trim();

    if (!selectedDateStr) {
        showConfirmation("Elige primero un día en el calendario 📅", true);
        return;
    }
    if (!selectedTime) {
        showConfirmation("Elige una hora disponible 🕒", true);
        return;
    }
    if (!name) {
        showConfirmation("Escribe tu nombre antes de reservar 🙂", true);
        return;
    }

    const key = `${selectedDateStr}_${selectedTime}`;

    if (bookings[key]) {
        showConfirmation("Esa hora ya se acaba de reservar, elige otra 😅", true);
        renderTimeSlots();
        return;
    }

    // Guardamos la reserva (persistente en localStorage)
    bookings[key] = name;
    saveBookings(bookings);

    const [y, m, d] = selectedDateStr.split("-");
    showConfirmation(`¡Reserva confirmada, ${name}! Te esperamos el ${d}/${m}/${y} a las ${selectedTime}h ✅`, false);

    bookingName.value = "";
    selectedTime = null;
    renderTimeSlots();
    renderCalendar(); // para que aparezca el punto de "reserva" en ese día
});

function showConfirmation(text, isError) {
    bookingConfirmation.textContent = text;
    bookingConfirmation.classList.add("show");
    bookingConfirmation.classList.toggle("error", isError);
}

// ===========================
// BOTÓN "VOLVER A SERVICIOS"
// ===========================
backToServiciosReservas.addEventListener("click", () => {
    bookingConfirmation.classList.remove("show");
    window.showSection("servicios");
});

// ===========================
// PINTAMOS EL CALENDARIO AL CARGAR LA PÁGINA
// ===========================
renderCalendar();