// Inicialización cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Manejar envío del formulario de contacto
    const formContacto = document.getElementById('formContacto');
    
    formContacto.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const nombre = document.getElementById('nombreContacto').value;
        const email = document.getElementById('emailContacto').value;
        const asunto = document.getElementById('asuntoContacto').value;
        const mensaje = document.getElementById('mensajeContacto').value;
        
        // En un entorno real, aquí se enviaría la información al servidor
        // Para este ejemplo, simulamos el envío con un mensaje de confirmación
        
        // Registro de contacto (solo para fines de demostración)
        const contacto = {
            nombre,
            email,
            asunto,
            mensaje,
            fecha: new Date().toISOString()
        };
        
        // Guardar en localStorage (solo para demostración)
        const contactos = JSON.parse(localStorage.getItem('contactos')) || [];
        contactos.push(contacto);
        localStorage.setItem('contactos', JSON.stringify(contactos));
        
        // Mostrar mensaje de éxito
        alert('Tu mensaje ha sido enviado. Te contactaremos a la brevedad.');
        
        // Reiniciar formulario
        formContacto.reset();
    });
    
    // Manejar la navegación interna por anclajes de manera suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});