// Mensajes rotativos del día
const mensajes = [
    "Cuidar tu salud mental es tan importante como cuidar tu salud física. Cada paso que das hacia el autoconocimiento es valioso.",
    "No hay emociones 'buenas' o 'malas'. Todas tus emociones son información valiosa sobre tu estado interno.",
    "Buscar ayuda es una señal de fortaleza, no de debilidad. La comunidad UTEZ está aquí para apoyarte.",
    "Pequeños actos de autocuidado diarios pueden hacer una gran diferencia en tu bienestar general.",
    "Recuerda que es normal tener días difíciles. Lo importante es no enfrentarlos solo.",
    "La regulación emocional es una habilidad que se desarrolla con práctica y paciencia.",
    "Identifica tus emociones con precisión para comprender mejor tus necesidades.",
    "Conecta con otros cuando lo necesites. El apoyo social es clave para el bienestar."
];

// Registro rápido desde la página principal
function registroRapido(emocion) {
    const registro = {
        fecha: new Date().toISOString().split('T')[0],
        emocion: emocion,
        intensidad: 5,
        reflexion: 'Registro rápido desde página principal',
        timestamp: new Date().toISOString()
    };

    const registros = JSON.parse(localStorage.getItem('registrosEmociones')) || [];
    registros.push(registro);
    localStorage.setItem('registrosEmociones', JSON.stringify(registros));

    // Feedback visual
    const botones = document.querySelectorAll('#registroRapido button');
    botones.forEach(btn => btn.disabled = true);
    
    const botonClickeado = event.target.closest('button');
    botonClickeado.innerHTML = '<i class="fas fa-check"></i><br><small>¡Guardado!</small>';
    
    // Conservamos la clase de emoción específica
    if (!botonClickeado.classList.contains('btn-success')) {
        setTimeout(() => {
            alert('¡Emoción registrada! ¿Quieres hacer un registro más completo?');
            if (confirm('¿Te gustaría ir a la página de registro para agregar más detalles?')) {
                window.location.href = 'pages/registro.html';
            } else {
                // Resetear botones
                location.reload();
            }
        }, 1500);
    }
}

// Inicialización cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Mensaje del día
    const hoy = new Date().getDay();
    const mensajeDelDia = mensajes[hoy % mensajes.length];
    const mensajeElement = document.getElementById('mensajeDelDia');
    if (mensajeElement) {
        mensajeElement.textContent = '"' + mensajeDelDia + '"';
    }
    
    // Cargar tabla de registros en la página principal si existe
    const tablaRegistros = document.getElementById('tablaRegistrosRecientes');
    if (tablaRegistros) {
        cargarRegistrosRecientes();
    }
});

// Cargar registros recientes para la tabla en la página principal
function cargarRegistrosRecientes() {
    const tbody = document.getElementById('tablaRegistrosRecientes').querySelector('tbody');
    const registros = JSON.parse(localStorage.getItem('registrosEmociones')) || [];
    
    // Ordenar por fecha (más reciente primero)
    registros.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Mostrar solo los 3 registros más recientes
    const registrosMostrar = registros.slice(0, 3);
    
    // Limpiar tabla
    tbody.innerHTML = '';
    
    if (registrosMostrar.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 4;
        td.textContent = 'No hay registros aún';
        td.className = 'text-center';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }
    
    // Crear filas con los registros
    registrosMostrar.forEach(registro => {
        const tr = document.createElement('tr');
        
        // Fecha
        const tdFecha = document.createElement('td');
        const fecha = new Date(registro.timestamp);
        tdFecha.textContent = fecha.toLocaleDateString() + ' ' + fecha.toLocaleTimeString().substring(0, 5);
        
        // Emoción
        const tdEmocion = document.createElement('td');
        let emojiTexto = '';
        switch(registro.emocion) {
            case 'feliz': emojiTexto = '😊 Feliz'; break;
            case 'calmado': emojiTexto = '😌 Calmado'; break;
            case 'ansioso': emojiTexto = '😰 Ansioso'; break;
            case 'triste': emojiTexto = '😢 Triste'; break;
            case 'enojado': emojiTexto = '😠 Enojado'; break;
            case 'confundido': emojiTexto = '😕 Confundido'; break;
            default: emojiTexto = registro.emocion;
        }
        tdEmocion.textContent = emojiTexto;
        
        // Intensidad
        const tdIntensidad = document.createElement('td');
        tdIntensidad.textContent = registro.intensidad + '/10';
        
        // Estado
        const tdEstado = document.createElement('td');
        const badgeEstado = document.createElement('span');
        badgeEstado.className = 'status-badge status-pending';
        badgeEstado.textContent = 'Pendiente';
        tdEstado.appendChild(badgeEstado);
        
        // Añadir celdas a la fila
        tr.appendChild(tdFecha);
        tr.appendChild(tdEmocion);
        tr.appendChild(tdIntensidad);
        tr.appendChild(tdEstado);
        
        // Añadir fila a la tabla
        tbody.appendChild(tr);
    });
}