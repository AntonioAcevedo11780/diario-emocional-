// Inicialización cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar el valor mostrado del rango de intensidad
    document.getElementById('intensidad').addEventListener('input', function() {
        document.getElementById('intensidadValor').textContent = this.value;
    });
    
    // Manejar el envío del formulario
    document.getElementById('registroEmocionalForm').addEventListener('submit', guardarRegistro);
});

// Selección de emoción
function seleccionarEmocion(emocion) {
    // Resetear todos los botones
    const botones = document.querySelectorAll('#seleccionEmocion button');
    botones.forEach(btn => {
        btn.classList.remove('active');
        btn.style.boxShadow = '';
    });
    
    // Obtener el color específico de la emoción
    const coloresEmociones = {
        'feliz': '#2ECC71',
        'calmado': '#3498DB',
        'ansioso': '#F1C40F',
        'triste': '#9B59B6',
        'enojado': '#E74C3C',
        'confundido': '#95A5A6'
    };
    
    // Activar el botón seleccionado con el color específico de la emoción
    const botonSeleccionado = document.querySelector(`#seleccionEmocion button[onclick*="${emocion}"]`);
    botonSeleccionado.classList.add('active');
    const colorEmocion = coloresEmociones[emocion] || '#E67E22';
    const colorRGBA = hexToRgba(colorEmocion, 0.5);
    botonSeleccionado.style.boxShadow = `0 0 0 3px ${colorRGBA}`;
    
    // Guardar la emoción seleccionada
    document.getElementById('emocionSeleccionada').value = emocion;
}

// Función auxiliar para convertir hex a rgba
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Guardar el registro
function guardarRegistro(event) {
    event.preventDefault();
    
    // Validar que se haya seleccionado una emoción
    const emocion = document.getElementById('emocionSeleccionada').value;
    if (!emocion) {
        alert('Por favor, selecciona una emoción');
        return;
    }
    
    // Obtener la fecha actual solo (sin hora) para comparar
    const fechaHoy = new Date().toISOString().split('T')[0];
    
    // Recopilar los datos del formulario
    const nuevoRegistro = {
        emocion: emocion,
        intensidad: parseInt(document.getElementById('intensidad').value),
        fecha: fechaHoy,
        situacion: document.getElementById('situacion').value,
        pensamientos: document.getElementById('pensamientos').value,
        reflexion: document.getElementById('reflexion').value,
        timestamp: new Date().toISOString()
    };
    
    // Cargar registros existentes
    const registros = JSON.parse(localStorage.getItem('registrosEmociones')) || [];
    
    // Buscar si ya existe un registro para hoy
    const indiceRegistroHoy = registros.findIndex(registro => {
        const fechaRegistro = new Date(registro.timestamp).toISOString().split('T')[0];
        return fechaRegistro === fechaHoy;
    });
    
    let accionRealizada = 'creado';
    
    if (indiceRegistroHoy !== -1) {
        // Confirmar si quiere actualizar el registro existente
        const confirmar = confirm('Ya tienes un registro emocional para hoy. ¿Deseas actualizarlo con la nueva información?');
        if (confirmar) {
            // Mantener timestamp original pero actualizar el resto de datos
            nuevoRegistro.timestampOriginal = registros[indiceRegistroHoy].timestamp;
            registros[indiceRegistroHoy] = nuevoRegistro;
            accionRealizada = 'actualizado';
        } else {
            return; // No hacer nada si el usuario cancela
        }
    } else {
        // Agregar nuevo registro
        registros.push(nuevoRegistro);
    }
    
    localStorage.setItem('registrosEmociones', JSON.stringify(registros));
    
    // Mostrar mensaje de confirmación mejorado
    const emocionEmoji = getEmocionEmoji(emocion);
    const mensajeConfirmacion = `¡Registro de emoción ${accionRealizada} con éxito! ${emocionEmoji}\n\n` +
        `Emoción: ${emocion.charAt(0).toUpperCase() + emocion.slice(1)}\n` +
        `Intensidad: ${nuevoRegistro.intensidad}/10\n` +
        `Fecha: ${new Date().toLocaleDateString()}\n\n` +
        `${accionRealizada === 'actualizado' ? 'Tu registro del día ha sido actualizado.' : 'Nuevo registro guardado exitosamente.'}`;
    
    alert(mensajeConfirmacion);
    
    // Redirigir al dashboard o reiniciar el formulario
    if (confirm('¿Deseas ver tus estadísticas en el dashboard?')) {
        window.location.href = 'dashboard.html';
    } else {
        // Resetear el formulario
        resetearFormulario();
        
        // Mostrar mensaje de aliento
        setTimeout(() => {
            alert('¡Excelente! Registrar tus emociones regularmente te ayuda a conocerte mejor. 💚');
        }, 500);
    }
}

// Función auxiliar para resetear el formulario
function resetearFormulario() {
    document.getElementById('registroEmocionalForm').reset();
    
    // Resetear botones de emoción
    const botones = document.querySelectorAll('#seleccionEmocion button');
    botones.forEach(btn => {
        btn.classList.remove('active');
        btn.style.boxShadow = '';
    });
    document.getElementById('emocionSeleccionada').value = '';
    
    // Resetear el valor del slider de intensidad
    document.getElementById('intensidad').value = 5;
    document.getElementById('intensidadValor').textContent = '5';
}

// Función auxiliar para obtener emoji de emoción
function getEmocionEmoji(emocion) {
    const emojis = {
        'feliz': '😊',
        'calmado': '😌',
        'ansioso': '😰',
        'triste': '😢',
        'enojado': '😠',
        'confundido': '😕'
    };
    return emojis[emocion] || '😐';
}