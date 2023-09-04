from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import text
from flask_cors import CORS
from dotenv import load_dotenv
import os

# -*- coding: utf-8 -*-

# Cargar las Variables de entorno desde el archivo .env
load_dotenv()

# Determine the folder of the top-level directory of this project
BASEDIR = os.path.abspath(os.path.dirname(__file__))

# Define la configuración de la aplicación
class Config(object):
    FLASK_ENV = 'development'
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.getenv('SECRET_KEY', default='BAD_SECRET_KEY')
    # Since SQLAlchemy 1.4.x has removed support for the 'postgres://' URI scheme,
    # update the URI to the postgres database to use the supported 'postgresql://' scheme
    if os.getenv('DATABASE_URL'):
        SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL').replace("postgres://", "postgresql://", 1)
    else:
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASEDIR, 'instance', 'app.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Logging
    LOG_WITH_GUNICORN = os.getenv('LOG_WITH_GUNICORN', default=False)

# Define la configuración de producción
class ProductionConfig(Config):
    FLASK_ENV = 'production'

# Define la configuración de desarrollo
class DevelopmentConfig(Config):
    DEBUG = True

# Define la configuración de pruebas
class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv('TEST_DATABASE_URI',
                                        default=f"sqlite:///{os.path.join(BASEDIR, 'instance', 'test.db')}")
    WTF_CSRF_ENABLED = False

# Crea la aplicación Flask y establece su configuración

app = Flask(__name__)
CORS(app)
#database_uri = os.environ.get('DATABASE_URI')

app.config.from_object(DevelopmentConfig)

db = SQLAlchemy(app)

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True)
    cedula_identidad = db.Column(db.String(50), unique=True, nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    primer_apellido = db.Column(db.String(100))
    segundo_apellido = db.Column(db.String(100))
    fecha_nacimiento = db.Column(db.Date, nullable=False)

#Logica para crear un Usuario
@app.route('/usuarios', methods=['POST'])
def crear_usuario():
    data = request.get_json()
    nuevo_usuario = Usuario(
        cedula_identidad=data['cedula_identidad'],
        nombre=data['nombre'],
        primer_apellido=data.get('primer_apellido'),
        segundo_apellido=data.get('segundo_apellido',),
        fecha_nacimiento=datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d')
    )
    db.session.add(nuevo_usuario)
    db.session.commit()

    return jsonify({"message": "Usuario creado exitosamente"}), 201

#Logica para listar todos los Usuarios
@app.route('/usuarios', methods=['GET'])
def listar_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([usuario.as_dict() for usuario in usuarios])

#Logica para listar un Usuario Especifico
@app.route('/usuarios/<int:id_usuario>', methods=['GET'])
def listar_usuario(id_usuario):
    usuario = Usuario.query.get_or_404(id_usuario)
    return jsonify(usuario.as_dict())

#Logica para actualizar un usuario
@app.route('/usuarios/<int:id_usuario>', methods=['PUT'])
def actualizar_usuario(id_usuario):
    usuario = Usuario.query.get_or_404(id_usuario)
    data = request.get_json()
    for key, value in data.items():
        setattr(usuario, key, value)
    db.session.commit()

    return jsonify({"message": "Usuario actualizado exitosamente"})

#Logica para eliminar un Usuario
@app.route('/usuarios/<int:id_usuario>', methods=['DELETE'])
def eliminar_usuario(id_usuario):
    usuario = Usuario.query.get_or_404(id_usuario)
    db.session.delete(usuario)
    db.session.commit()

    return jsonify({"message": "Usuario eliminado exitosamente"})

#Logica para mostrar el promedio de edades
@app.route('/promedio-edad', methods=['GET'])
def promedio_edad():
    # Usar la consulta SQL directamente con la función text
    sql = text('SELECT AVG(EXTRACT(YEAR FROM AGE(NOW(), fecha_nacimiento))) AS promedio_edades FROM usuarios')
    result = db.session.execute(sql).first()
    
    promedio = result[0] #Acceder el resutlado por indice
    
    return jsonify({"promedioEdad": float(promedio)}), 200



# Helper para convertir un objeto de usuario a un diccionario
# Esto facilita la conversión a JSON
def as_dict(self):
    return {
        'id': self.id,
        'cedula_identidad': self.cedula_identidad,
        'nombre': self.nombre,
        'primer_apellido': self.primer_apellido,
        'segundo_apellido': self.segundo_apellido,
        'fecha_nacimiento': self.fecha_nacimiento.strftime('%Y-%m-%d')
    }

#Logica para mostrar el estado API-REST
@app.route('/estado', methods=['GET'])
def estado():
    data = {
        "nameSystem": "api-users",
        "version": "0.0.1",
        "developer": "ADRIAN VICTOR MONTESINOS SALINAS",
        "email": "adrianmontesinos98@gmail.com"
    }
    return jsonify(data), 200

# Agrega la función as_dict como un método del modelo Usuario
Usuario.as_dict = as_dict

if __name__ == '__main__':
    app.run(debug=True)