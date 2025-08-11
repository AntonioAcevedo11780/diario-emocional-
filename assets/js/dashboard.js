// Datos para las gráficas
let registros = [];

// Colores para las emociones (deben coincidir con los del CSS)
const coloresEmociones = {
    'feliz': '#2ECC71',
    'calmado': '#3498DB',
    'ansioso': '#F1C40F',
    'triste': '#9B59B6',
    'enojado': '#E74C3C',
    'confundido': '#95A5A6'
};

// Traducción de nombres de emociones
const nombreEmociones = {
    'feliz': 'Feliz',
    'calmado': 'Calmado',
    'ansioso': 'Ansioso',
    'triste': 'Triste',
    'enojado': 'Enojado',
    'confundido': 'Confundido'
};

// Inicialización cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar registros desde localStorage
    registros = JSON.parse(localStorage.getItem('registrosEmociones')) || [];
    
    // Ordenar registros por fecha (más reciente primero)
    registros.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    // Inicializar gráficas
    inicializarGraficas();
    
    // Cargar tabla de registros
    cargarTablaRegistros();
    
    // Eventos de filtros (solo si existen los elementos)
    const filtroSemana = document.getElementById('filtroSemana');
    const filtroMes = document.getElementById('filtroMes');
    const filtroPersonalizado = document.getElementById('filtroPersonalizado');
    
    if (filtroSemana) {
        filtroSemana.addEventListener('click', () => filtrarPorPeriodo(7));
    }
    if (filtroMes) {
        filtroMes.addEventListener('click', () => filtrarPorPeriodo(30));
    }
    if (filtroPersonalizado) {
        filtroPersonalizado.addEventListener('click', abrirFiltroPeriodo);
    }
    
    // Inicializar autoevaluación
    inicializarAutoevaluacion();
});

// Inicializar gráficas
function inicializarGraficas() {
    // Verificar si Chart.js está disponible
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js no está disponible. Las gráficas no se mostrarán.');
        return;
    }
    
    // Obtener datos para gráfica de tendencia
    const ultimos14Dias = obtenerUltimosNDias(registros, 14);
    const fechas = [...new Set(ultimos14Dias.map(r => formatearFecha(r.fecha)))];
    
    // Datos para la gráfica de línea (tendencia emocional por intensidad)
    const ctx = document.getElementById('emocionesChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [{
                label: 'Intensidad emocional',
                data: fechas.map(fecha => {
                    const registrosDia = ultimos14Dias.filter(r => formatearFecha(r.fecha) === fecha);
                    return registrosDia.length > 0 ? 
                        registrosDia.reduce((sum, r) => sum + r.intensidad, 0) / registrosDia.length : 
                        null;
                }),
                borderColor: '#E67E22',
                backgroundColor: 'rgba(230, 126, 34, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                pointBackgroundColor: '#E67E22',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    title: {
                        display: true,
                        text: 'Intensidad'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Fecha'
                    }
                }
            }
        }
    });
    
    // Datos para la gráfica de distribución de emociones
    const conteoEmociones = {};
    registros.forEach(registro => {
        conteoEmociones[registro.emocion] = (conteoEmociones[registro.emocion] || 0) + 1;
    });
    
    const ctxPie = document.getElementById('distribucionChart').getContext('2d');
    new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: Object.keys(conteoEmociones).map(e => nombreEmociones[e]),
            datasets: [{
                data: Object.values(conteoEmociones),
                backgroundColor: Object.keys(conteoEmociones).map(e => coloresEmociones[e]),
                borderWidth: 1,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

// Cargar tabla de registros
function cargarTablaRegistros() {
    const tbody = document.getElementById('tablaRegistros').querySelector('tbody');
    tbody.innerHTML = '';
    
    // Mostrar solo los últimos 10 registros
    const registrosMostrar = registros.slice(0, 10);
    
    registrosMostrar.forEach(registro => {
        const tr = document.createElement('tr');
        
        const tdFecha = document.createElement('td');
        tdFecha.textContent = formatearFechaHora(registro.fecha);
        
        const tdEmocion = document.createElement('td');
        const emocionSpan = document.createElement('span');
        emocionSpan.className = 'd-flex align-items-center';
        const emojiSpan = document.createElement('span');
        emojiSpan.style.marginRight = '5px';
        emojiSpan.style.fontSize = '1.2em';
        
        // Agregar emoji según la emoción
        switch(registro.emocion) {
            case 'feliz': emojiSpan.textContent = '😊'; break;
            case 'calmado': emojiSpan.textContent = '😌'; break;
            case 'ansioso': emojiSpan.textContent = '😰'; break;
            case 'triste': emojiSpan.textContent = '😢'; break;
            case 'enojado': emojiSpan.textContent = '😠'; break;
            case 'confundido': emojiSpan.textContent = '😕'; break;
            default: emojiSpan.textContent = '😐';
        }
        
        emocionSpan.appendChild(emojiSpan);
        emocionSpan.appendChild(document.createTextNode(nombreEmociones[registro.emocion]));
        tdEmocion.appendChild(emocionSpan);
        
        const tdIntensidad = document.createElement('td');
        const intensidadProgress = document.createElement('div');
        intensidadProgress.className = 'progress';
        intensidadProgress.style.height = '10px';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.width = `${registro.intensidad * 10}%`;
        progressBar.style.backgroundColor = intensidadAColor(registro.intensidad);
        
        intensidadProgress.appendChild(progressBar);
        tdIntensidad.appendChild(intensidadProgress);
        tdIntensidad.appendChild(document.createTextNode(` ${registro.intensidad}/10`));
        
        const tdSituacion = document.createElement('td');
        tdSituacion.textContent = registro.situacion ? 
            (registro.situacion.length > 40 ? registro.situacion.substring(0, 40) + '...' : registro.situacion) : 
            'Sin detalles';
        
        const tdAcciones = document.createElement('td');
        const btnVer = document.createElement('button');
        btnVer.className = 'btn btn-sm btn-outline-primary';
        btnVer.innerHTML = '<i class="fas fa-eye"></i>';
        btnVer.title = 'Ver detalles';
        btnVer.addEventListener('click', () => mostrarDetallesRegistro(registro));
        
        tdAcciones.appendChild(btnVer);
        
        tr.appendChild(tdFecha);
        tr.appendChild(tdEmocion);
        tr.appendChild(tdIntensidad);
        tr.appendChild(tdSituacion);
        tr.appendChild(tdAcciones);
        
        tbody.appendChild(tr);
    });
}

// Utilidades

// Formatear fecha para gráficos (DD/MM)
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return `${fecha.getDate()}/${fecha.getMonth() + 1}`;
}

// Formatear fecha y hora (DD/MM/YYYY HH:MM)
function formatearFechaHora(fechaStr) {
    const fecha = new Date(fechaStr);
    return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()} ${fecha.getHours()}:${String(fecha.getMinutes()).padStart(2, '0')}`;
}

// Obtener registros de los últimos N días
function obtenerUltimosNDias(registros, dias) {
    const hoy = new Date();
    const fechaLimite = new Date(hoy.setDate(hoy.getDate() - dias));
    return registros.filter(r => new Date(r.fecha) >= fechaLimite);
}

// Color según intensidad
function intensidadAColor(intensidad) {
    if (intensidad <= 3) return '#2ECC71'; // Verde - baja intensidad
    if (intensidad <= 7) return '#F1C40F'; // Amarillo - intensidad media
    return '#E74C3C'; // Rojo - alta intensidad
}

// Filtrar por período
function filtrarPorPeriodo(dias) {
    // Actualizar UI para mostrar el período seleccionado
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.backgroundColor = '';
    });
    
    if (dias === 7) {
        document.getElementById('filtroSemana').classList.add('active');
        document.getElementById('filtroSemana').style.backgroundColor = 'var(--naranja-claro)';
    } else if (dias === 30) {
        document.getElementById('filtroMes').classList.add('active');
        document.getElementById('filtroMes').style.backgroundColor = 'var(--naranja-claro)';
    }
    
    // Aquí iría la lógica para recargar las gráficas con el nuevo período
    // Por simplicidad, en este ejemplo no implementamos la recarga completa
    alert(`Mostrando datos de los últimos ${dias} días`);
}

// Abrir filtro personalizado
function abrirFiltroPeriodo() {
    // Implementación simplificada para este ejemplo
    alert('Función de filtro personalizado');
}

// Sistema de autoevaluación psicopedagógica
let autoevaluacion = {
    preguntas: [
        {
            pregunta: "En las últimas dos semanas, ¿con qué frecuencia has sentido tristeza persistente o vacío emocional?",
            opciones: [
                { texto: "Nunca o casi nunca", valor: 0 },
                { texto: "Algunos días", valor: 1 },
                { texto: "Más de la mitad de los días", valor: 2 },
                { texto: "Casi todos los días", valor: 3 }
            ]
        },
        {
            pregunta: "¿Has experimentado pérdida de interés en actividades que antes disfrutabas?",
            opciones: [
                { texto: "No, mantengo mis intereses", valor: 0 },
                { texto: "Ligera pérdida de interés", valor: 1 },
                { texto: "Notable pérdida de interés", valor: 2 },
                { texto: "Completa pérdida de interés", valor: 3 }
            ]
        },
        {
            pregunta: "¿Cómo describirías tu nivel de ansiedad en situaciones académicas o sociales?",
            opciones: [
                { texto: "Bajo, me siento cómodo/a", valor: 0 },
                { texto: "Moderado, algo nervioso/a", valor: 1 },
                { texto: "Alto, me causa mucho estrés", valor: 2 },
                { texto: "Extremo, evito estas situaciones", valor: 3 }
            ]
        },
        {
            pregunta: "¿Has tenido dificultades para concentrarte en tus estudios o trabajo?",
            opciones: [
                { texto: "No, mi concentración es normal", valor: 0 },
                { texto: "Ocasionalmente me distraigo", valor: 1 },
                { texto: "Frecuentemente me cuesta concentrarme", valor: 2 },
                { texto: "Es muy difícil mantener la concentración", valor: 3 }
            ]
        },
        {
            pregunta: "¿Cómo han sido tus patrones de sueño últimamente?",
            opciones: [
                { texto: "Duermo bien y me siento descansado/a", valor: 0 },
                { texto: "Algunos problemas ocasionales", valor: 1 },
                { texto: "Dificultades frecuentes para dormir", valor: 2 },
                { texto: "Insomnio severo o sueño excesivo", valor: 3 }
            ]
        },
        {
            pregunta: "¿Has tenido pensamientos de autolesión o sobre la muerte?",
            opciones: [
                { texto: "Nunca", valor: 0 },
                { texto: "Rara vez, pensamientos pasajeros", valor: 2 },
                { texto: "Ocasionalmente", valor: 4 },
                { texto: "Frecuentemente", valor: 5 }
            ]
        },
        {
            pregunta: "¿Sientes que puedes manejar el estrés de tu vida diaria?",
            opciones: [
                { texto: "Sí, manejo bien el estrés", valor: 0 },
                { texto: "La mayoría de las veces", valor: 1 },
                { texto: "Me cuesta trabajo manejarlo", valor: 2 },
                { texto: "Me siento abrumado/a constantemente", valor: 3 }
            ]
        },
        {
            pregunta: "¿Cómo valorarías tu red de apoyo social?",
            opciones: [
                { texto: "Tengo buen apoyo de amigos/familia", valor: 0 },
                { texto: "Apoyo moderado", valor: 1 },
                { texto: "Apoyo limitado", valor: 2 },
                { texto: "Me siento aislado/a", valor: 3 }
            ]
        }
    ],
    respuestas: [],
    preguntaActual: 0
};

function inicializarAutoevaluacion() {
    const btnIniciar = document.getElementById('btnIniciarAutoevaluacion');
    const container = document.getElementById('autoevaluacionContainer');
    const btnAnterior = document.getElementById('btnAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente');
    
    btnIniciar.addEventListener('click', function() {
        autoevaluacion.respuestas = [];
        autoevaluacion.preguntaActual = 0;
        btnIniciar.style.display = 'none';
        container.style.display = 'block';
        mostrarPregunta();
    });
    
    btnAnterior.addEventListener('click', function() {
        if (autoevaluacion.preguntaActual > 0) {
            autoevaluacion.preguntaActual--;
            mostrarPregunta();
        }
    });
    
    btnSiguiente.addEventListener('click', function() {
        const respuestaSeleccionada = document.querySelector('input[name="respuesta"]:checked');
        if (!respuestaSeleccionada) {
            alert('Por favor selecciona una respuesta');
            return;
        }
        
        // Guardar respuesta
        autoevaluacion.respuestas[autoevaluacion.preguntaActual] = parseInt(respuestaSeleccionada.value);
        
        if (autoevaluacion.preguntaActual < autoevaluacion.preguntas.length - 1) {
            autoevaluacion.preguntaActual++;
            mostrarPregunta();
        } else {
            finalizarAutoevaluacion();
        }
    });
}

function mostrarPregunta() {
    const container = document.getElementById('preguntaActual');
    const btnAnterior = document.getElementById('btnAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente');
    const progressBar = document.getElementById('progressBar');
    
    const pregunta = autoevaluacion.preguntas[autoevaluacion.preguntaActual];
    const progreso = ((autoevaluacion.preguntaActual + 1) / autoevaluacion.preguntas.length) * 100;
    
    progressBar.style.width = `${progreso}%`;
    progressBar.setAttribute('aria-valuenow', progreso);
    
    let html = `
        <h6 class="mb-3">Pregunta ${autoevaluacion.preguntaActual + 1} de ${autoevaluacion.preguntas.length}</h6>
        <p class="fw-bold mb-3">${pregunta.pregunta}</p>
        <div class="row">
    `;
    
    pregunta.opciones.forEach((opcion, index) => {
        const isChecked = autoevaluacion.respuestas[autoevaluacion.preguntaActual] === opcion.valor ? 'checked' : '';
        html += `
            <div class="col-12 mb-2">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="respuesta" value="${opcion.valor}" id="opcion${index}" ${isChecked}>
                    <label class="form-check-label" for="opcion${index}">
                        ${opcion.texto}
                    </label>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // Actualizar botones
    btnAnterior.disabled = autoevaluacion.preguntaActual === 0;
    btnSiguiente.textContent = autoevaluacion.preguntaActual === autoevaluacion.preguntas.length - 1 ? 
        'Finalizar Evaluación' : 'Siguiente';
}

function finalizarAutoevaluacion() {
    const puntuacionTotal = autoevaluacion.respuestas.reduce((sum, valor) => sum + valor, 0);
    const container = document.getElementById('autoevaluacionContainer');
    const btnIniciar = document.getElementById('btnIniciarAutoevaluacion');
    
    let mensaje, recomendacion, necesitaAyuda = false;
    
    if (puntuacionTotal <= 5) {
        mensaje = "¡Excelente! Tu bienestar emocional parece estar en un rango saludable.";
        recomendacion = "Continúa con tus hábitos actuales de autocuidado y mantén el registro de tus emociones para prevención.";
    } else if (puntuacionTotal <= 10) {
        mensaje = "Tu evaluación muestra algunos indicadores que ameritan atención.";
        recomendacion = "Te recomendamos utilizar más las herramientas de la aplicación y considerar técnicas de manejo del estrés.";
    } else if (puntuacionTotal <= 15) {
        mensaje = "Tu evaluación sugiere que podrías beneficiarte significativamente de apoyo profesional.";
        recomendacion = "Recomendamos encarecidamente que busques apoyo psicopedagógico.";
        necesitaAyuda = true;
    } else {
        mensaje = "Tu evaluación indica la necesidad urgente de apoyo psicopedagógico profesional.";
        recomendacion = "Es importante que busques ayuda profesional lo antes posible. No estás solo/a en esto.";
        necesitaAyuda = true;
    }
    
    // Mostrar resultado
    const resultadoHtml = `
        <div class="text-center">
            <h5 class="mb-3">Resultado de tu Autoevaluación</h5>
            <div class="alert ${necesitaAyuda ? 'alert-warning' : 'alert-success'} text-start">
                <strong>${mensaje}</strong><br><br>
                ${recomendacion}
            </div>
            ${necesitaAyuda ? `
                <div class="d-grid gap-2 mt-3">
                    <button class="btn btn-warning btn-lg" onclick="redirigirAyudaProfesional()">
                        <i class="fas fa-hands-helping me-2"></i>
                        Solicitar Cita con Psicopedagogía
                    </button>
                </div>
            ` : ''}
            <button class="btn btn-outline-primary mt-2" onclick="reiniciarAutoevaluacion()">
                Realizar Nueva Evaluación
            </button>
        </div>
    `;
    
    container.innerHTML = resultadoHtml;
    
    // Guardar resultado en localStorage para seguimiento
    const evaluacionResultado = {
        fecha: new Date().toISOString(),
        puntuacion: puntuacionTotal,
        necesitaAyuda: necesitaAyuda,
        respuestas: autoevaluacion.respuestas
    };
    
    const evaluaciones = JSON.parse(localStorage.getItem('autoevaluaciones')) || [];
    evaluaciones.push(evaluacionResultado);
    localStorage.setItem('autoevaluaciones', JSON.stringify(evaluaciones));
}

function redirigirAyudaProfesional() {
    if (confirm('Serás redirigido al formulario de solicitud de cita psicopedagógica de UTEZ. ¿Deseas continuar?')) {
        window.open('https://docs.google.com/forms/d/e/1FAIpQLSfbHway1TZ-PBDEkudxVHaPPcs902NCae1l6R3lg-8UNa3PjA/formResponse', '_blank');
    }
}

function reiniciarAutoevaluacion() {
    const container = document.getElementById('autoevaluacionContainer');
    const btnIniciar = document.getElementById('btnIniciarAutoevaluacion');
    
    container.style.display = 'none';
    btnIniciar.style.display = 'inline-block';
    autoevaluacion.respuestas = [];
    autoevaluacion.preguntaActual = 0;
}

// Función para mostrar detalles de un registro
function mostrarDetallesRegistro(registro) {
    const emocionEmoji = getEmocionEmoji(registro.emocion);
    const fechaFormateada = formatearFechaHora(registro.timestamp);
    
    const detalles = `
📊 DETALLES DEL REGISTRO EMOCIONAL

📅 Fecha: ${fechaFormateada}
${emocionEmoji} Emoción: ${registro.emocion.charAt(0).toUpperCase() + registro.emocion.slice(1)}
📈 Intensidad: ${registro.intensidad}/10

📝 Situación:
${registro.situacion || 'No especificada'}

💭 Pensamientos:
${registro.pensamientos || 'No especificados'}

🤔 Reflexión:
${registro.reflexion || 'No incluida'}
    `;
    
    alert(detalles);
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