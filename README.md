# Nombre del Proyecto

Descripción breve del proyecto.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes requisitos:

- Python 3.x: [Descargar Python](https://www.python.org/downloads/)
- PostgreSQL: [Descargar PostgreSQL](https://www.postgresql.org/download/)

## Configuración del Entorno

### Base de Datos

1. Instala PostgreSQL y configura un usuario y una base de datos. Puedes usar PgAdmin u otra herramienta de administración de PostgreSQL.

2. Crea un archivo `.env` en la raíz del proyecto y configura la URL de conexión a la base de datos. Ejemplo:

    ```
    DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_de_la_base_de_datos
    ```

3. Utiliza el siguiente script SQL para crear la tabla `usuarios` en tu base de datos:

    ```sql
    CREATE TABLE usuarios (
        id SERIAL PRIMARY KEY,
        cedula_identidad VARCHAR(50) NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        primer_apellido VARCHAR(100),
        segundo_apellido VARCHAR(100),
        fecha_nacimiento DATE NOT NULL
    );
    ```

### Entorno Virtual (Opcional)

Se recomienda crear un entorno virtual para este proyecto.

```bash
python -m venv venv
source venv/bin/activate  # En Windows, usa venv\Scripts\activate

```

### Instalación de Dependencias

Instala las dependencias de Python.

```bash

pip install -r requirements.txt

```
### Ejecución

Inicia la aplicación Flask.

```bash

flask run # o
py ./app.py

```
La aplicación estará disponible en http://localhost:5000.

### Contribuciones

Si deseas contribuir a este proyecto, sigue estos pasos:

Crea un fork del repositorio.
Clona tu repositorio fork en tu máquina local.
Crea una rama para tus cambios: git checkout -b feature/nueva-funcion.
Realiza tus cambios y realiza commit de los mismos: git commit -m 'Agrega nueva función'.
Sube tus cambios a tu repositorio fork: git push origin feature/nueva-funcion.
Crea un Pull Request en el repositorio original.

```

