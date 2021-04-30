let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp () {
    mostrarServicios();
    mostrarSeccion();
    cambiarSeccion();
    paginaSiguiente();
    paginaAnterior();
    botonesPaginador();
    mostrarResumen();
    nombreCita();
    fechaCita();
    deshabilitarFechaAnterior();
    horaCita();
};

function cambiarSeccion () {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            botonesPaginador();
        });
    });
};

function mostrarSeccion () {
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }
    
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
};


async function mostrarServicios () {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const {servicios} = db;

        // Generar HTML
        servicios.forEach( servicio => {
            const { id, nombre, precio } = servicio;

            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            const precioServicio = document.createElement('P');
            precioServicio.textContent = `${precio} €`;
            precioServicio.classList.add('precio-servicio');

            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            servicioDiv.onclick = seleccionarServicio;

            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            document.querySelector('#servicios').appendChild(servicioDiv);
        } );
    } catch (error) {
        console.log(error);
    };
};

function seleccionarServicio (e) {
    let elemento;

    if(e.target.tagName === 'P'){
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    };

    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        };

        agregarServicio(servicioObj);
    };

};

function paginaSiguiente () {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    });
};

function paginaAnterior () {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();
    });
};

function botonesPaginador () {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (pagina === 2) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        mostrarResumen();
    };

    mostrarSeccion();
};

function mostrarResumen () {
    const {nombre, fecha, hora, servicios} = cita;

    const resumenDiv = document.querySelector('.contenido-resumen');

    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    };

    if(Object.values(cita).includes('')){
        const noServicio = document.createElement('P');
        noServicio.textContent = "Faltan datos de nuestros servicios, fecha, hora o nombre";
        noServicio.classList.add('invalidar-cita');

        resumenDiv.appendChild(noServicio);
        return;
    };

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de sus Datos y Cita';

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    servicios.forEach(servicio => {
        const {nombre, precio} = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P')
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio')

        const totalServicio = precio.split(' €');
        cantidad += parseInt(totalServicio);

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    });

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total')
    cantidadPagar.innerHTML = `<span>Total a pagar:  </span> ${cantidad} €`;

    resumenDiv.appendChild(cantidadPagar);
};

function eliminarServicio (id) {
    const {servicios} = cita;

    cita.servicios = servicios.filter( servicio => servicio.id !== id);
};

function agregarServicio (servicioObj) {
    const {servicios} = cita;

    cita.servicios = [...servicios, servicioObj];
};

function nombreCita () {
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();

        if(nombreTexto === '' || nombreTexto.length < 3){
            mostrarAlerta('Nombre no válido', 'error');
        } else {
            const alertaPrevia = document.querySelector('.alerta');

            if(alertaPrevia) {
                alertaPrevia.remove();
            };        
            cita.nombre = nombreTexto;
        };
    });
};

function mostrarAlerta (mensaje, tipo) {
    const alertaPrevia = document.querySelector('.alerta');

    if(alertaPrevia) {
        return
    };

    const alerta = document.createElement('P');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error') {
        alerta.classList.add('error')
    };

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita () {
    const fechaInput = document.querySelector('#fecha')

    fechaInput.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDay();

        if([0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Cerramos los fines de semana', 'error');
        } else {
            cita.fecha = fechaInput.value;
        };
    });
};

function deshabilitarFechaAnterior () {
    const inputFecha = document.querySelector('#fecha');
    const fechaAhora = new Date();

    const year = fechaAhora.getUTCFullYear();
    let mes = fechaAhora.getMonth() + 1;
    let dia = fechaAhora.getDate();

    const fechaDeshabilitar = `${year}-${mes < 10 ? `0${mes}` : mes}-${dia < 10 ? `0${dia}` : dia}`;
    inputFecha.min = fechaDeshabilitar;
};

function horaCita () {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {
        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if (hora[0] < 9 || hora[1] > 20) {
            mostrarAlerta('Estamos cerrados a esa hora', 'error');
            setTimeout(() => {
                inputHora.value = '';   
            }, 3000);
        } else {
            cita.hora = horaCita;
        };
    });
};