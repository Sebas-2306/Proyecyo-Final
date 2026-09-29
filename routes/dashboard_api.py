from flask import Blueprint, jsonify
from database import obtener_conexion

dashboard_api_bp = Blueprint("dashboard_api", __name__)


@dashboard_api_bp.route("/api/dashboard", methods=["GET"])
def obtener_estadisticas():

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM categorias
        WHERE estado = 'Activo'
    """)
    total_categorias = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM productos
        WHERE estado = 'Activo'
    """)
    total_productos = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM productos
        WHERE stock <= stock_minimo
        AND estado = 'Activo'
    """)
    stock_bajo = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM movimientos_inventario
    """)
    total_movimientos = cursor.fetchone()["total"]

    cursor.close()
    conexion.close()

    return jsonify({
        "total_categorias": total_categorias,
        "total_productos": total_productos,
        "stock_bajo": stock_bajo,
        "total_movimientos": total_movimientos
    })