from flask import Blueprint, request, jsonify
from database import obtener_conexion

"""
Blueprint para los servicios web del módulo Productos.
"""

producto_api_bp = Blueprint("producto_api", __name__)
@producto_api_bp.route("/api/productos", methods=["GET"])
def obtener_productos():
    """
    Servicio web que obtiene todos los productos activos
    registrados en el sistema.
    """

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT
            p.id_producto,
            p.nombre,
            p.descripcion,
            p.codigo_barras,
            p.precio_compra,
            p.precio_venta,
            p.stock,
            p.stock_minimo,
            p.id_categoria,
            c.nombre AS categoria
        FROM productos p
        INNER JOIN categorias c
            ON p.id_categoria = c.id_categoria
        WHERE p.estado = 'Activo'
        ORDER BY p.nombre
    """)

    productos = cursor.fetchall()

    cursor.close()
    conexion.close()

    return jsonify(productos)
@producto_api_bp.route("/api/productos/<int:id_producto>", methods=["GET"])
def obtener_producto(id_producto):
    """
    Servicio web que obtiene la información
    de un producto específico.
    """

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT
            id_producto,
            nombre,
            descripcion,
            codigo_barras,
            precio_compra,
            precio_venta,
            stock,
            stock_minimo,
            id_categoria
        FROM productos
        WHERE id_producto = %s
        AND estado = 'Activo'
    """, (id_producto,))

    producto = cursor.fetchone()

    cursor.close()
    conexion.close()

    if producto is None:

        return jsonify({
            "mensaje": "Producto no encontrado."
        }), 404

    return jsonify(producto)
@producto_api_bp.route("/api/productos", methods=["POST"])
def crear_producto():
    """
    Servicio web para registrar un nuevo producto.
    """

    datos = request.get_json()

    nombre = datos.get("nombre")
    descripcion = datos.get("descripcion")
    codigo_barras = datos.get("codigo_barras")
    precio_compra = datos.get("precio_compra")
    precio_venta = datos.get("precio_venta")
    stock = datos.get("stock")
    stock_minimo = datos.get("stock_minimo")
    id_categoria = datos.get("id_categoria")

    if (
        not nombre or
        precio_compra is None or
        precio_venta is None or
        stock is None or
        stock_minimo is None or
        not id_categoria
    ):
        return jsonify({
            "mensaje": "Todos los campos obligatorios deben ser enviados."
        }), 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        INSERT INTO productos
        (
            nombre,
            descripcion,
            codigo_barras,
            precio_compra,
            precio_venta,
            stock,
            stock_minimo,
            id_categoria
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        nombre,
        descripcion,
        codigo_barras,
        precio_compra,
        precio_venta,
        stock,
        stock_minimo,
        id_categoria
    ))

    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({
        "mensaje": "Producto registrado correctamente."
    }), 201
@producto_api_bp.route("/api/productos/<int:id_producto>", methods=["PUT"])
def actualizar_producto(id_producto):
    """
    Servicio web para actualizar un producto existente.
    """

    datos = request.get_json()

    nombre = datos.get("nombre")
    descripcion = datos.get("descripcion")
    codigo_barras = datos.get("codigo_barras")
    precio_compra = datos.get("precio_compra")
    precio_venta = datos.get("precio_venta")
    stock = datos.get("stock")
    stock_minimo = datos.get("stock_minimo")
    id_categoria = datos.get("id_categoria")

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT id_producto
        FROM productos
        WHERE id_producto = %s
        AND estado = 'Activo'
    """, (id_producto,))

    if cursor.fetchone() is None:

        cursor.close()
        conexion.close()

        return jsonify({
            "mensaje": "Producto no encontrado."
        }), 404

    cursor.execute("""
        UPDATE productos
        SET
            nombre = %s,
            descripcion = %s,
            codigo_barras = %s,
            precio_compra = %s,
            precio_venta = %s,
            stock = %s,
            stock_minimo = %s,
            id_categoria = %s
        WHERE id_producto = %s
    """, (
        nombre,
        descripcion,
        codigo_barras,
        precio_compra,
        precio_venta,
        stock,
        stock_minimo,
        id_categoria,
        id_producto
    ))

    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({
        "mensaje": "Producto actualizado correctamente."
    }), 200
@producto_api_bp.route("/api/productos/<int:id_producto>", methods=["DELETE"])
def eliminar_producto(id_producto):
    """
    Servicio web para desactivar un producto.
    Realiza una eliminación lógica cambiando
    el estado a 'Inactivo'.
    """

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT id_producto
        FROM productos
        WHERE id_producto = %s
        AND estado = 'Activo'
    """, (id_producto,))

    if cursor.fetchone() is None:

        cursor.close()
        conexion.close()

        return jsonify({
            "mensaje": "Producto no encontrado."
        }), 404

    cursor.execute("""
        UPDATE productos
        SET estado = 'Inactivo'
        WHERE id_producto = %s
    """, (id_producto,))

    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({
        "mensaje": "Producto eliminado correctamente."
    }), 200