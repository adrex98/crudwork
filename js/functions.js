//Funcion para Crear Usuarios
async function agregarUsuario() {
    const cedula = document.getElementById('cedula').value;
    const nombre = document.getElementById('nombre').value;
    const apellido1 = document.getElementById('apellido1').value;
    const apellido2 = document.getElementById('apellido2').value;
    const fechaNacimiento = document.getElementById('fecha-nacimiento').value;

    const nuevoUsuario = {
        cedula_identidad: cedula,
        nombre: nombre,
        primer_apellido: apellido1,
        segundo_apellido: apellido2,
        fecha_nacimiento: fechaNacimiento,
    };

    try {
        await crearUsuario(nuevoUsuario);
        cargarUsuarios();
        // Limpiar los campos del formulario después de agregar un usuario
        document.getElementById('cedula').value = '';
        document.getElementById('nombre').value = '';
        document.getElementById('apellido1').value = '';
        document.getElementById('apellido2').value = '';
        document.getElementById('fecha-nacimiento').value = '';
    } catch (error) {
        console.error('Error al agregar el usuario:', error);
    }
}

   //Funcion para Enlistar los Usuarios
    async function cargarUsuarios() {
        try {
            const usuarios = await listarUsuarios();
            const tablaUsuarios = document.getElementById('tabla-usuarios').getElementsByTagName('tbody')[0];
            tablaUsuarios.innerHTML = ''; // Limpiar la tabla antes de llenarla

            usuarios.forEach(usuario => {
                const tr = document.createElement('tr');

                // Crear celdas con los datos del usuario
                const datosUsuario = [
                    usuario.id,
                    usuario.nombre,
                    usuario.cedula_identidad,
                    usuario.primer_apellido,
                    usuario.segundo_apellido,
                    usuario.fecha_nacimiento,
                ];
                datosUsuario.forEach(dato => {
                    const td = document.createElement('td');
                    td.textContent = dato;
                    tr.appendChild(td);
                });

                // Crear botones de editar y eliminar en una celda separada
                const tdAcciones = document.createElement('td');
                const editarBtn = document.createElement('button');
                editarBtn.textContent = 'Editar';
                editarBtn.onclick = () => editarUsuario(usuario.id);
                const eliminarBtn = document.createElement('button');
                eliminarBtn.textContent = 'Eliminar';
                eliminarBtn.onclick = () => eliminarUsuarioPorId(usuario.id);
                tdAcciones.appendChild(editarBtn);
                tdAcciones.appendChild(eliminarBtn);
                tr.appendChild(tdAcciones);

                tablaUsuarios.appendChild(tr);
            });
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        }
    }


    //Funcion para Editar Usuario
        async function editarUsuario(id) {
    try {
        const usuario = await listarUsuarioPorId(id);
        const formularioEditar = document.createElement('div');

        const cedulaInput = document.createElement('input');
        cedulaInput.type = 'text';
        cedulaInput.value = usuario.cedula_identidad;
        formularioEditar.appendChild(cedulaInput);

        const nombreInput = document.createElement('input');
        nombreInput.type = 'text';
        nombreInput.value = usuario.nombre;
        formularioEditar.appendChild(nombreInput);

        const apellido1Input = document.createElement('input');
        apellido1Input.type = 'text';
        apellido1Input.value = usuario.primer_apellido;
        formularioEditar.appendChild(apellido1Input);

        const apellido2Input = document.createElement('input');
        apellido2Input.type = 'text';
        apellido2Input.value = usuario.segundo_apellido;
        formularioEditar.appendChild(apellido2Input);

        const fechaNacimientoInput = document.createElement('input');
        fechaNacimientoInput.type = 'date';
        fechaNacimientoInput.value = usuario.fecha_nacimiento;
        formularioEditar.appendChild(fechaNacimientoInput);

        const guardarBtn = document.createElement('button');
        guardarBtn.textContent = 'Guardar';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancelar';
        cancelBtn.onclick = () => {
            formularioEditar.remove();
        };

        guardarBtn.onclick = async () => {
            const datosActualizados = {
                cedula_identidad: cedulaInput.value,
                nombre: nombreInput.value,
                primer_apellido: apellido1Input.value,
                segundo_apellido: apellido2Input.value,
                fecha_nacimiento: fechaNacimientoInput.value,
            };

            try {
                await actualizarUsuarioPorId(id, datosActualizados);
                cargarUsuarios();
            } catch (error) {
                console.error('Error al actualizar usuario:', error);
            }

            formularioEditar.remove(); // Eliminar el formulario de edición
        };

        formularioEditar.appendChild(guardarBtn);
        formularioEditar.appendChild(cancelBtn);

        document.getElementById('formulario-editar').appendChild(formularioEditar);
    } catch (error) {
        console.error('Error al obtener usuario para editar:', error);
    }
}

    //Obtener promedio de edades
    async function promedioEdades() {
        const btnPromedioEdades = document.getElementById('btn-promedio-edades');
        const resultadoDiv = document.getElementById('resultado-promedio-edades');
        
        btnPromedioEdades.onclick = async () => {
            const promedio = await obtenerPromedioEdad();
            resultadoDiv.textContent = `El promedio de edades es: ${promedio}`;
        };
}

    //Obtener el Estado de la API
    async function estadoApi() {
        const btnEstadoApi = document.getElementById('btn-estado-api');
        const estadoDiv = document.getElementById('estado-api');

        btnEstadoApi.onclick = async () => {
            const estado = await obtenerVersionApi();
            estadoDiv.innerHTML = `
                    <strong>Nombre del sistema:</strong> ${estado.nameSystem}<br>
                    <strong>Versión:</strong> ${estado.version}<br>
                    <strong>Desarrollador:</strong> ${estado.developer}<br>
                    <strong>Email del desarrollador:</strong> ${estado.email}
                `;
        }
    }

    window.onload = async function () {
        await cargarUsuarios();
        promedioEdades();
        estadoApi();
    };