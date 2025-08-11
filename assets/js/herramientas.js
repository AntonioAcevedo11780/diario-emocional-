// Inicialización cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar herramienta de respiración
    const btnIniciarRespiracion = document.getElementById('btnIniciarRespiracion');
    const btnDetenerRespiracion = document.getElementById('btnDetenerRespiracion');
    const circuloRespiracion = document.getElementById('circuloRespiracion');
    const velocidadRespiracion = document.getElementById('velocidadRespiracion');
    
    let respiracionActiva = false;
    let animacionId = null;
    let fase = 'inhala'; // inhala o exhala
    
    btnIniciarRespiracion.addEventListener('click', function() {
        if (!respiracionActiva) {
            respiracionActiva = true;
            btnIniciarRespiracion.disabled = true;
            btnDetenerRespiracion.disabled = false;
            iniciarAnimacionRespiracion();
        }
    });
    
    btnDetenerRespiracion.addEventListener('click', function() {
        detenerAnimacionRespiracion();
    });
    
    function iniciarAnimacionRespiracion() {
        const duracion = 11 - parseInt(velocidadRespiracion.value); // Invertir escala para que mayor valor = más rápido
        const duracionMS = duracion * 1000; // Convertir a milisegundos
        
        circuloRespiracion.style.transition = `all ${duracionMS}ms ease-in-out`;
        
        if (fase === 'inhala') {
            // Fase de inhalación
            circuloRespiracion.style.transform = 'scale(1.5)';
            circuloRespiracion.style.backgroundColor = 'var(--emocion-calmado)';
            circuloRespiracion.textContent = 'Inhala';
            fase = 'exhala';
        } else {
            // Fase de exhalación
            circuloRespiracion.style.transform = 'scale(1)';
            circuloRespiracion.style.backgroundColor = 'var(--naranja-claro)';
            circuloRespiracion.textContent = 'Exhala';
            fase = 'inhala';
        }
        
        // Programar la siguiente fase
        animacionId = setTimeout(iniciarAnimacionRespiracion, duracionMS);
    }
    
    function detenerAnimacionRespiracion() {
        clearTimeout(animacionId);
        respiracionActiva = false;
        btnIniciarRespiracion.disabled = false;
        btnDetenerRespiracion.disabled = true;
        
        // Resetear círculo
        circuloRespiracion.style.transform = 'scale(1)';
        circuloRespiracion.style.backgroundColor = 'var(--naranja-claro)';
        circuloRespiracion.textContent = 'Inhala';
        fase = 'inhala';
    }
    
    // Herramienta de reestructuración de pensamientos
    const btnGuardarPensamiento = document.getElementById('btnGuardarPensamiento');
    
    btnGuardarPensamiento.addEventListener('click', function() {
        const situacion = document.getElementById('situacionPensamiento').value;
        const pensamientoNegativo = document.getElementById('pensamientoNegativo').value;
        const emocion = document.getElementById('emocionPensamiento').value;
        const intensidad = document.getElementById('intensidadPensamiento').value;
        const pensamientoAlternativo = document.getElementById('pensamientoAlternativo').value;
        
        if (!situacion || !pensamientoNegativo || !emocion || !intensidad || !pensamientoAlternativo) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        // Guardar el registro de reestructuración
        const registro = {
            tipo: 'reestructuracion',
            fecha: new Date().toISOString(),
            situacion,
            pensamientoNegativo,
            emocion,
            intensidad,
            pensamientoAlternativo
        };
        
        // Guardar en localStorage
        const reestructuraciones = JSON.parse(localStorage.getItem('reestructuraciones')) || [];
        reestructuraciones.push(registro);
        localStorage.setItem('reestructuraciones', JSON.stringify(reestructuraciones));
        
        // Mostrar mensaje de confirmación
        alert('¡Registro guardado con éxito!');
        
        // Limpiar formulario
        document.getElementById('situacionPensamiento').value = '';
        document.getElementById('pensamientoNegativo').value = '';
        document.getElementById('emocionPensamiento').value = '';
        document.getElementById('intensidadPensamiento').value = '';
        document.getElementById('pensamientoAlternativo').value = '';
    });
    
    // Herramienta de gratitud
    const btnGuardarGratitud = document.getElementById('btnGuardarGratitud');
    
    btnGuardarGratitud.addEventListener('click', function() {
        const naturaleza = document.getElementById('gratitudNaturaleza').value;
        const persona = document.getElementById('gratitudPersona').value;
        const propia = document.getElementById('gratitudPropia').value;
        const oportunidad = document.getElementById('gratitudOportunidad').value;
        const cotidiana = document.getElementById('gratitudCotidiana').value;
        
        if (!naturaleza || !persona || !propia || !oportunidad || !cotidiana) {
            alert('Por favor completa todos los campos de gratitud');
            return;
        }
        
        // Guardar el registro de gratitud
        const registro = {
            tipo: 'gratitud',
            fecha: new Date().toISOString(),
            naturaleza,
            persona,
            propia,
            oportunidad,
            cotidiana
        };
        
        // Guardar en localStorage
        const gratitudes = JSON.parse(localStorage.getItem('gratitudes')) || [];
        gratitudes.push(registro);
        localStorage.setItem('gratitudes', JSON.stringify(gratitudes));
        
        // Mostrar mensaje de confirmación
        alert('¡Práctica de gratitud guardada con éxito!');
        
        // Limpiar formulario
        document.getElementById('gratitudNaturaleza').value = '';
        document.getElementById('gratitudPersona').value = '';
        document.getElementById('gratitudPropia').value = '';
        document.getElementById('gratitudOportunidad').value = '';
        document.getElementById('gratitudCotidiana').value = '';
    });
    
    // Herramienta de rueda emocional
    const btnGuardarEmocionIdentificada = document.getElementById('btnGuardarEmocionIdentificada');
    
    btnGuardarEmocionIdentificada.addEventListener('click', function() {
        const emocion = document.getElementById('emocionIdentificada').value;
        const ubicacion = document.getElementById('ubicacionEmocion').value;
        
        if (!emocion || !ubicacion) {
            alert('Por favor completa ambos campos');
            return;
        }
        
        // Guardar el registro de emoción identificada
        const registro = {
            tipo: 'ruedaEmocional',
            fecha: new Date().toISOString(),
            emocion,
            ubicacion
        };
        
        // Guardar en localStorage
        const emociones = JSON.parse(localStorage.getItem('emocionesIdentificadas')) || [];
        emociones.push(registro);
        localStorage.setItem('emocionesIdentificadas', JSON.stringify(emociones));
        
        // Mostrar mensaje de confirmación
        alert(`¡Has registrado correctamente la emoción "${emocion}"!`);
        
        // Limpiar formulario
        document.getElementById('emocionIdentificada').value = '';
        document.getElementById('ubicacionEmocion').value = '';
    });
});

// Ejercicios rápidos para el bienestar
function ejercicioRapido(tipo) {
    switch(tipo) {
        case 'respiracion54321':
            mostrarEjercicio54321();
            break;
        case 'estiramientos':
            mostrarEjercicioEstiramientos();
            break;
        case 'afirmaciones':
            mostrarEjercicioAfirmaciones();
            break;
    }
}

function mostrarEjercicio54321() {
    const instrucciones = `
        🌟 TÉCNICA 5-4-3-2-1 PARA REDUCIR ANSIEDAD 🌟
        
        Esta técnica te ayuda a enfocarte en el presente:
        
        👁️ OBSERVA: 5 cosas que puedes VER a tu alrededor
        🤚 TOCA: 4 cosas que puedes TOCAR
        👂 ESCUCHA: 3 sonidos que puedes OÍR
        👃 HUELE: 2 olores que puedes PERCIBIR
        👅 SABOREA: 1 sabor que puedes NOTAR
        
        Tómate tu tiempo con cada paso. Respira profundo entre cada uno.
        
        ¿Te sientes más calmado/a ahora?
    `;
    
    alert(instrucciones);
}

function mostrarEjercicioEstiramientos() {
    const instrucciones = `
        🧘‍♀️ ESTIRAMIENTOS PARA LIBERAR TENSIÓN 🧘‍♂️
        
        Realiza cada estiramiento por 15-20 segundos:
        
        1. 🔄 Gira suavemente el cuello hacia ambos lados
        2. 🤲 Entrelaza los dedos y estira los brazos hacia arriba
        3. 👐 Abre el pecho llevando los brazos hacia atrás
        4. 🦵 Estira las piernas bajo el escritorio
        5. 💆‍♀️ Masajea suavemente las sienes y mandíbula
        
        Respira profundo durante cada estiramiento.
        
        ¡Tu cuerpo te lo agradecerá! 💪
    `;
    
    alert(instrucciones);
}

function mostrarEjercicioAfirmaciones() {
    const afirmaciones = [
        "Soy capaz de superar los desafíos que se presentan",
        "Merezco amor y respeto, empezando por mí mismo/a",
        "Cada día soy más fuerte y resiliente",
        "Confío en mi capacidad para tomar buenas decisiones",
        "Soy suficiente tal como soy en este momento",
        "Tengo el poder de elegir mis pensamientos y emociones",
        "Cada error es una oportunidad de aprendizaje",
        "Mi bienestar mental es importante y valioso"
    ];
    
    const afirmacionAleatoria = afirmaciones[Math.floor(Math.random() * afirmaciones.length)];
    
    const mensaje = `
        ✨ AFIRMACIÓN PERSONAL ✨
        
        Repite esta frase en voz alta o mentalmente 3 veces:
        
        💖 "${afirmacionAleatoria}" 💖
        
        Mientras la repites, respira profundo y realmente CREE en estas palabras.
        Tu mente necesita escuchar cosas positivas sobre ti.
        
        ¡Eres increíble! 🌟
    `;
    
    alert(mensaje);
}