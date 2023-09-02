  // URL base de tu API
  const apiUrl = 'http://127.0.0.1:5000'; // Cambia la URL según la ubicación de tu API

  // Función para crear un usuario
  async function crearUsuario(usuario) {
    try {
        const response = await axios.post(`${apiUrl}/usuarios`, usuario);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}


  // Función para listar todos los usuarios
async function listarUsuarios() {
    try {
        const response = await axios.get(`${apiUrl}/usuarios`);
        return response.data; // Debes retornar los datos, no hacer console.log
    } catch (error) {
        console.error(error);
    }
}


  // Función para listar un usuario específico por ID
  async function listarUsuarioPorId(id) {
    try {
      const response = await axios.get(`${apiUrl}/usuarios/${id}`);
      return response.data;
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  // Función para actualizar los datos de un usuario por ID
  async function actualizarUsuarioPorId(id, datosActualizados) {
    try {
        const response = await axios.put(`${apiUrl}/usuarios/${id}`, datosActualizados);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

  // Función para eliminar un usuario por ID
  async function eliminarUsuarioPorId(id) {
    try {
        const response = await axios.delete(`${apiUrl}/usuarios/${id}`);
        console.log(response.data);

        // Buscar la fila correspondiente en la tabla y eliminarla
        const tablaUsuarios = document.getElementById('tabla-usuarios').getElementsByTagName('tbody')[0];
        const filas = tablaUsuarios.getElementsByTagName('tr');
        
        for (let i = 0; i < filas.length; i++) {
            const fila = filas[i];
            const idUsuario = fila.getElementsByTagName('td')[0].textContent;

            if (idUsuario === id.toString()) {
                fila.remove();
                break; // Una vez encontrada y eliminada la fila, detén el bucle
            }
        }
    } catch (error) {
        console.error(error);
    }
}


  //Función para obtener el promedio de edades
  async function obtenerPromedioEdad() {
    try {
        const response = await axios.get(`${apiUrl}/promedio-edad`);
        const promedioEdad = response.data.promedioEdad;
        return promedioEdad; // Retornar el promedio de edades
    } catch (error) {
        console.error('Error al obtener el promedio de edades:', error);
    }
}

  // Función para obtener la versión del API
  async function obtenerVersionApi() {
    try {
      const response = await axios.get(`${apiUrl}/estado`);
      // const estado = response.data;
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el estado de la API:', error);
    }
  }