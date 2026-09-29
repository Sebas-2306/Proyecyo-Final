from flask import Blueprint, request, jsonify
from database import obtener_conexion
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

"""
Blueprint para los servicios web de usuarios.
Incluye el registro e inicio de sesión.
"""

usuario_api_bp = Blueprint("usuario_api", __name__)
"""
Servicio web para registrar un nuevo usuario.
Valida la información, cifra la contraseña
y almacena el usuario en la base de datos.
"""
@usuario_api_bp.route("/api/usuarios/registro", methods=["POST"])
def registrar_usuario():

    datos = request.get_json()

    nombre = datos.get("nombre")
    usuario = datos.get("usuario")
    password = datos.get("password")

    if not nombre or not usuario or not password:
        return jsonify({
            "mensaje": "Todos los campos son obligatorios."
        }), 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    # Verificar si el usuario ya existe
    cursor.execute("""
        SELECT id_usuario
        FROM usuarios
        WHERE usuario = %s
    """, (usuario,))

    existe = cursor.fetchone()

    if existe:

        cursor.close()
        conexion.close()

        return jsonify({
            "mensaje": "El usuario ya existe."
        }), 409

    # Cifrar contraseña
    password_cifrada = generate_password_hash(password)

    cursor.execute("""
        INSERT INTO usuarios
        (nombre, usuario, password)
        VALUES (%s, %s, %s)
    """, (
        nombre,
        usuario,
        password_cifrada
    ))

    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({
        "mensaje": "Usuario registrado correctamente."
    }), 201

"""
 Servicio web para autenticar usuarios.
 Verifica que el usuario exista y que
 la contraseña sea correcta.
 """
@usuario_api_bp.route("/api/usuarios/login", methods=["POST"])
def login_usuario():

    datos = request.get_json()

    usuario = datos.get("usuario")
    password = datos.get("password")

    if not usuario or not password:
        return jsonify({
            "mensaje": "Usuario y contraseña son obligatorios."
        }), 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT *
        FROM usuarios
        WHERE usuario = %s
        AND estado = 'Activo'
    """, (usuario,))

    usuario_db = cursor.fetchone()

    cursor.close()
    conexion.close()

    if usuario_db and check_password_hash(
    usuario_db["password"],
    password
):

       return jsonify({
        "mensaje": "Autenticación satisfactoria.",
        "usuario": {
            "id_usuario": usuario_db["id_usuario"],
            "nombre": usuario_db["nombre"],
            "usuario": usuario_db["usuario"]
        }
    }), 200

    return jsonify({
        "mensaje": "Error en la autenticación."
    }), 401