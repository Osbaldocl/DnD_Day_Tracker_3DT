// Encapsular el código para evitar variables globales
document.addEventListener('DOMContentLoaded', () => {
    const presetButtons = document.querySelectorAll('.preset-btn');
    const sessionInput = document.getElementById('session-time');
    const form = document.getElementById('session-form');

    // Asignar el valor de las horas al hacer clic en los botones predefinidos
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            sessionInput.value = button.getAttribute('data-time');
        });
    });

    // Manejar la transición a la pantalla del contador
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const sessionTime = parseInt(sessionInput.value, 10);
        if (sessionTime && sessionTime > 0) {
            // Almacenar la duración de la sesión en localStorage
            localStorage.setItem('sessionDuration', sessionTime);

            // Redirigir a la pantalla del contador
            window.location.href = 'contador.html';
        } else {
            alert('Por favor ingresa o selecciona una duración válida.');
        }
    });
});
