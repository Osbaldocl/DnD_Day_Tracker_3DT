document.addEventListener('DOMContentLoaded', () => {
    const sessionDuration = parseInt(localStorage.getItem('sessionDuration'), 10);

    if (isNaN(sessionDuration) || sessionDuration <= 0) {
        alert('No se ha definido una duración de la sesión válida.');
        window.location.href = 'index.html'; // Redirige a la pantalla de configuración si no hay valor válido
        return;
    }

    // Obtener los elementos del DOM
    const counterTime = document.getElementById('counter-time');
    const timeFormatText = document.getElementById('time-format');
    const pauseBtn = document.getElementById('pause-btn');
    const resumeBtn = document.getElementById('resume-btn');
    const resetBtn = document.getElementById('reset-btn');
    const toggleFormatBtn = document.getElementById('toggle-format-btn');
    const addHoursInput = document.getElementById('add-hours');
    const addMinutesInput = document.getElementById('add-minutes');
    const submitTimeBtn = document.getElementById('submit-time-btn');
    const suggestionButtons = document.querySelectorAll('.suggest-btn');
    const lastTime = document.getElementById('last-time'); // Registro de última hora
    const sun = document.getElementById('sun'); // Sol
    const moon = document.getElementById('moon'); // Luna
    const body = document.body; // Para fondo dinámico
    // Obtener el elemento del contador de días
    const dayCounter = document.getElementById('day-counter');

    let totalSeconds = 0;
    let isPaused = false;
    let totalDays = 0; // Inicializamos el contador de días
    let format24Hours = true;
    let interval;
    let days = 0;


    const dayDurationSeconds = 24 * 3600; // Duración de un día completo en segundos
    const sessionDurationSeconds = sessionDuration * 3600; // Duración total de la sesión en segundos
    const incrementPerSecond = dayDurationSeconds / sessionDurationSeconds; // Incremento por segundo

    // Ocultar el contador de días inicialmente
    dayCounter.style.display = 'none';

    // Función para iniciar el contador
    function startCounter() {
        interval = setInterval(() => {
            if (!isPaused) {
                totalSeconds += incrementPerSecond;
                // Si el contador supera 24 horas (en segundos), lo reiniciamos pero incrementamos los días
                if (totalSeconds >= dayDurationSeconds) {
                    totalSeconds -= dayDurationSeconds; // Reseteamos las horas al iniciar un nuevo día
                    totalDays++; // Incrementamos los días
                    updateDayCounter(); // Actualizamos el contador de días
                }
                updateCounter();
            }
        }, 1000);
    }

    // Función para actualizar el contador en pantalla
    function updateCounter() {
        let hours = Math.floor(totalSeconds / 3600) % 24;
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let displayHours = hours;
        let period = '';

        if (!format24Hours) {
            period = hours >= 12 ? ' PM' : ' AM';
            displayHours = hours % 12 || 12; // Convertir 0 a 12
        }

        counterTime.textContent = `${pad(displayHours)}:${pad(minutes)}:${pad(seconds)}${period}`;

        // Actualizar el ciclo de día/noche
        updateDayNightCycle(hours);
    }

    // Función para actualizar el contador de días en pantalla
    function updateDayCounter() {
        if (totalDays >= 1) {
            dayCounter.style.display = 'block'; // Mostrar el contador de días cuando sea >= 1
        }
        dayCounter.textContent = `Días transcurridos: ${totalDays}`;
    }


    function updateDayNightCycle(hours) {



        console.log(`Hora actual simulada: ${hours}`); // Verificar la hora actual simulada


        // Cambiar el fondo y mover el sol/luna según la hora del día
        if (hours >= 6 && hours < 12) {
            console.log('Amanecer: Mostrando el sol.');
            body.classList.remove('night', 'dusk');
            body.classList.add('dawn'); // Amanecer
            sun.classList.add('daytime'); // Sol moviéndose
            moon.classList.remove('nighttime'); // Ocultar la luna
        } else if (hours >= 12 && hours < 18) {
            console.log('Día: Sol visible.');
            body.classList.remove('dawn', 'night');
            body.classList.add('day'); // Día claro
            sun.classList.add('daytime'); // Sol moviéndose
            moon.classList.remove('nighttime'); // Ocultar la luna
        } else if (hours >= 18 && hours < 20) {
            console.log('Atardecer: Sol ocultándose.');
            body.classList.remove('day', 'night');
            body.classList.add('dusk'); // Atardecer
            sun.classList.remove('daytime'); // Ocultar el sol
            moon.classList.remove('nighttime'); // Ocultar la luna
        } else {
            console.log('Noche: Mostrando la luna.');
            body.classList.remove('dawn', 'day', 'dusk');
            body.classList.add('night'); // Noche
            sun.classList.remove('daytime'); // Ocultar el sol
            moon.classList.add('nighttime'); // Mostrar la luna
        }


        if (hours >= 6 && hours < 18) {
            // Día: Mostrar el sol, ocultar la luna
            console.log('Es de día, mostrando el sol.');
            body.classList.remove('night');
            sun.style.display = 'block';
            moon.style.display = 'none';

            // Cambiar color del texto durante el día
            counterTime.style.color = '#0a0a23'; // Texto oscuro
            dayCounter.style.color = '#0a0a23';  // Texto oscuro

            // Cambiar colores durante el día
            counterTime.style.color = '#0a0a23'; // Texto oscuro para el contador
            dayCounter.style.color = '#0a0a23';  // Texto oscuro para el contador de días
            document.getElementById('time-format').style.color = '#0a0a23'; // Texto oscuro para "Formato 24 horas"
            document.querySelector('.last-time-container h3').style.color = '#0a0a23'; // Texto oscuro para "Última hora registrada"
            document.getElementById('last-time').style.color = '#0a0a23'; // Texto oscuro para la última hora registrada


            // Mover el sol a lo largo de la pantalla
            const sunPosition = ((hours - 6) / 12) * 100; // Mover de 0% a 100% entre las 6 y las 18
            sun.style.left = `${sunPosition}%`;

            console.log(`Sol display: ${sun.style.display}, Posición del sol (left): ${sun.style.left}`);
        } else {
            // Noche: Mostrar la luna, ocultar el sol
            console.log('Es de noche, mostrando la luna.');
            body.classList.add('night');
            sun.style.display = 'none';
            moon.style.display = 'block';
            // Cambiar color del texto durante el día
            counterTime.style.color = '#0a0a23'; // Texto oscuro
            dayCounter.style.color = '#0a0a23';  // Texto oscuro

            // Cambiar colores durante la noche
            counterTime.style.color = '#fff'; // Texto blanco para el contador
            dayCounter.style.color = '#fff';  // Texto blanco para el contador de días
            document.getElementById('time-format').style.color = '#fff'; // Texto blanco para "Formato 24 horas"
            document.querySelector('.last-time-container h3').style.color = '#fff'; // Texto blanco para "Última hora registrada"
            document.getElementById('last-time').style.color = '#fff'; // Texto blanco para la última hora registrada

            // Mover la luna a lo largo de la pantalla
            const moonPosition = ((hours >= 18 ? hours - 18 : hours + 6) / 12) * 100; // Mover de 0% a 100% entre las 18 y las 6
            moon.style.left = `${moonPosition}%`;

            console.log(`Luna display: ${moon.style.display}, Posición de la luna (left): ${moon.style.left}`);
        }

        // Verificar si el sol y la luna están visibles
        console.log(`Sol display: ${sun.style.display}, Luna display: ${moon.style.display}`);

        // Verificar las posiciones de left
        console.log(`Posición del sol (left): ${sun.style.left}`);
        console.log(`Posición de la luna (left): ${moon.style.left}`);
    }


    // Función para pausar el contador
    pauseBtn.addEventListener('click', () => {
        isPaused = true;
        pauseBtn.style.display = 'none';
        resumeBtn.style.display = 'inline-block';
        updateLastTime(); // Actualizar el registro de la última hora
    });

    // Función para reanudar el contador
    resumeBtn.addEventListener('click', () => {
        isPaused = false;
        resumeBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
    });

    // Función para resetear el contador
    resetBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas resetear el contador?')) {
            totalDays = 0; // También reiniciamos los días al resetear
            totalSeconds = 0;
            updateDayCounter(); // Actualizar el contador de días
            updateLastTime(); // Actualizar el registro de la última hora al resetear
        }
    });

    // Función para cambiar el formato de 12/24 horas
    toggleFormatBtn.addEventListener('click', () => {
        format24Hours = !format24Hours;
        timeFormatText.textContent = format24Hours ? '(Formato 24 horas)' : '(Formato 12 horas)';
        updateCounter();
    });

    // Helper para formatear los números con dos dígitos
    function pad(number) {
        return number < 10 ? '0' + number : number;
    }

    // Función para agregar tiempo manualmente
    submitTimeBtn.addEventListener('click', () => {
        const addHours = parseInt(addHoursInput.value, 10) || 0;
        const addMinutes = parseInt(addMinutesInput.value, 10) || 0;

        // Sumar correctamente las horas y minutos
        totalSeconds += (addHours * 3600) + (addMinutes * 60);

        // Asegurarse de que no se exceda el día
        /*if (totalSeconds > dayDurationSeconds) {
            totalSeconds = dayDurationSeconds;
            clearInterval(interval);
            alert('La sesión ha alcanzado las 24 horas simuladas.');
        }*/

        updateCounter();
    });

    // Función para agregar tiempo con los botones de sugerencia
    suggestionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const timeToAdd = parseInt(button.getAttribute('data-time'), 10);

            if (timeToAdd < 3600) {
                // Si el tiempo es menor que 3600, lo tratamos como minutos
                totalSeconds += timeToAdd * 60;  // Multiplicamos minutos por 60 para convertir a segundos
            } else {
                // Si el tiempo es mayor o igual a 3600, lo tratamos como horas
                totalSeconds += timeToAdd;  // Ya está en segundos
            }

            updateCounter();
        });
    });

    // Función para actualizar el registro de la última hora
    function updateLastTime() {
        let hours = Math.floor(totalSeconds / 3600) % 24;
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = Math.floor(totalSeconds % 60);

        lastTime.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    // Iniciar el contador
    startCounter();
});
