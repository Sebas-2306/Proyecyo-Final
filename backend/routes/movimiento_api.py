from flask import Blueprint, jsonify, request
from database import obtener_conexion

movimiento_api_bp = Blueprint(
    "movimiento_api",
    __name__
)


@movimiento_api_bp.route(
    "/api/movimientos",
    methods=["GET"]
)
def obtener_movimientos():
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT
            m.id_movimiento,
            m.id_producto,
            p.nombre AS producto,
            m.tipo_movimiento,
            m.cantidad,
            m.motivo,
            m.fecha_movimiento
        FROM movimientos_inventario m
        INNER JOIN productos p
            ON m.id_producto = p.id_producto
        ORDER BY m.fecha_movimiento DESC
    """)

    movimientos = cursor.fetchall()

    cursor.close()
    conexion.close()

    return jsonify(movimientos)


@movimiento_api_bp.route(
    "/api/movimientos",
    methods=["POST"]
)
def registrar_movimiento():
    datos = request.get_json()

    id_producto = datos.get("id_producto")
    tipo_movimiento = datos.get("tipo_movimiento")
    cantidad = datos.get("cantidad")
    motivo = datos.get("motivo", "")

    if not id_producto or not tipo_movimiento or not cantidad:
        return jsonify({
            "error": "Todos los campos obligatorios deben completarse."
        }), 400

    if tipo_movimiento not in ["Entrada", "Salida"]:
        return jsonify({
            "error": "El tipo de movimiento no es válido."
        }), 400

    if int(cantidad) <= 0:
        return jsonify({
            "error": "La cantidad debe ser mayor que cero."
        }), 400

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT stock
        FROM productos
        WHERE id_producto = %s
          AND estado = 'Activo'
    """, (id_producto,))

    producto = cursor.fetchone()

    if not producto:
        cursor.close()
        conexion.close()

        return jsonify({
            "error": "El producto no existe o está inactivo."
        }), 404

    stock_actual = producto["stock"]
    cantidad = int(cantidad)

    if tipo_movimiento == "Salida":
        if cantidad > stock_actual:
            cursor.close()
            conexion.close()

            return jsonify({
                "error": "No hay suficiente stock para realizar la salida."
            }), 400

        nuevo_stock = stock_actual - cantidad
    else:
        nuevo_stock = stock_actual + cantidad

    cursor.execute("""
        INSERT INTO movimientos_inventario (
            id_producto,
            tipo_movimiento,
            cantidad,
            motivo
        )
        VALUES (%s, %s, %s, %s)
    """, (
        id_producto,
        tipo_movimiento,
        cantidad,
        motivo
    ))

    cursor.execute("""
        UPDATE productos
        SET stock = %s
        WHERE id_producto = %s
    """, (
        nuevo_stock,
        id_producto
    ))

    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({
        "mensaje": "Movimiento registrado correctamente.",
        "stock_actualizado": nuevo_stock
    }), 201