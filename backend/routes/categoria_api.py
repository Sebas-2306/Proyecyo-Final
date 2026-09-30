from flask import Blueprint, request, jsonify
from database import obtener_conexion

categoria_api_bp = Blueprint("categoria_api", __name__)

@categoria_api_bp.route("/api/categorias", methods=["GET"])
def obtener_categorias():

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT
            id_categoria,
            nombre,
            descripcion
        FROM categorias
        WHERE estado = 'Activo'
        ORDER BY nombre
    """)

    categorias = cursor.fetchall()

    cursor.close()
    conexion.close()

    return jsonify(categorias)
@categoria_api_bp.route("/api/categorias", methods=["POST"])
def crear_categoria():
    """
    Crea una nueva categoría desde React.
    """

    datos = request.get_json()

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        INSERT INTO categorias (nombre, descripcion)
        VALUES (%s, %s)
    """, (
        datos["nombre"],
        datos["descripcion"]
    ))

    conexion.commit()

    nuevo_id = cursor.lastrowid

    cursor.close()
    conexion.close()

    return jsonify({
        "mensaje": "Categoría creada correctamente",
        "id_categoria": nuevo_id
    }), 201
@categoria_api_bp.route("/api/categorias/<int:id_categoria>", methods=["PUT"])
def actualizar_categoria_api(id_categoria):

    datos = request.get_json()

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        UPDATE categorias
        SET nombre=%s,
            descripcion=%s
        WHERE id_categoria=%s
    """, (
        datos["nombre"],
        datos["descripcion"],
        id_categoria
    ))

    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({
        "mensaje": "Categoría actualizada correctamente."
    })
@categoria_api_bp.route("/api/categorias/<int:id_categoria>", methods=["DELETE"])
def eliminar_categoria_api(id_categoria):

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        UPDATE categorias
        SET estado='Inactivo'
        WHERE id_categoria=%s
    """, (id_categoria,))

    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({
        "mensaje": "Categoría eliminada correctamente."
    })
@categoria_api_bp.route("/api/categorias/<int:id_categoria>", methods=["GET"])
def obtener_categoria(id_categoria):

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT id_categoria, nombre, descripcion
        FROM categorias
        WHERE id_categoria = %s
    """, (id_categoria,))

    categoria = cursor.fetchone()

    cursor.close()
    conexion.close()

    if categoria:
        return jsonify(categoria)

    return jsonify({"mensaje": "Categoría no encontrada"}), 404