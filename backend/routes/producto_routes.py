from flask import Blueprint, render_template, request, redirect, url_for, flash
from database import obtener_conexion

producto_bp = Blueprint("producto", __name__)
"""
Blueprint del módulo Productos.

Gestiona el registro, consulta, actualización
y desactivación de productos del inventario.
"""
@producto_bp.route("/productos")
def listar_productos():
    """
    Muestra el listado de productos activos
    registrados en el sistema.
    """
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT
            p.id_producto,
            p.nombre,
            c.nombre AS categoria,
            p.precio_compra,
            p.precio_venta,
            p.stock
        FROM productos p
        INNER JOIN categorias c
            ON p.id_categoria = c.id_categoria
        WHERE p.estado='Activo'
        ORDER BY p.nombre
    """)

    productos = cursor.fetchall()

    cursor.close()
    conexion.close()

    return render_template(
        "productos/listar.html",
        productos=productos
    )
@producto_bp.route("/productos/nuevo")
def nuevo_producto():
    """
    Muestra el formulario para registrar
    un nuevo producto.
    """
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT id_categoria, nombre
        FROM categorias
        WHERE estado='Activo'
        ORDER BY nombre
    """)

    categorias = cursor.fetchall()

    cursor.close()
    conexion.close()

    return render_template(
        "productos/nuevo.html",
        categorias=categorias
    )
@producto_bp.route("/productos/guardar", methods=["POST"])
def guardar_producto():
    """
    Registra un nuevo producto en la base
    de datos.
    """
    nombre = request.form["nombre"]
    descripcion = request.form["descripcion"]
    codigo_barras = request.form["codigo_barras"]
    precio_compra = request.form["precio_compra"]
    precio_venta = request.form["precio_venta"]
    stock = request.form["stock"]
    stock_minimo = request.form["stock_minimo"]
    id_categoria = request.form["id_categoria"]

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

    flash("Producto registrado correctamente.", "success")

    return redirect(url_for("producto.listar_productos"))
@producto_bp.route("/productos/editar/<int:id_producto>")
def editar_producto(id_producto):
    """
    Obtiene la información de un producto
    para editarla.

    Args:
        id_producto (int): Identificador del producto.
    """
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT *
        FROM productos
        WHERE id_producto=%s
    """, (id_producto,))

    producto = cursor.fetchone()

    cursor.execute("""
        SELECT id_categoria, nombre
        FROM categorias
        WHERE estado='Activo'
        ORDER BY nombre
    """)

    categorias = cursor.fetchall()

    cursor.close()
    conexion.close()

    return render_template(
        "productos/editar.html",
        producto=producto,
        categorias=categorias
    )
@producto_bp.route("/productos/actualizar", methods=["POST"])
def actualizar_producto():
    """
    Actualiza la información de un producto
    existente.
    """
    id_producto = request.form["id_producto"]
    nombre = request.form["nombre"]
    descripcion = request.form["descripcion"]
    codigo_barras = request.form["codigo_barras"]
    precio_compra = request.form["precio_compra"]
    precio_venta = request.form["precio_venta"]
    stock = request.form["stock"]
    stock_minimo = request.form["stock_minimo"]
    id_categoria = request.form["id_categoria"]

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        UPDATE productos
        SET
            nombre=%s,
            descripcion=%s,
            codigo_barras=%s,
            precio_compra=%s,
            precio_venta=%s,
            stock=%s,
            stock_minimo=%s,
            id_categoria=%s
        WHERE id_producto=%s
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

    flash("Producto actualizado correctamente.", "success")

    return redirect(url_for("producto.listar_productos"))
@producto_bp.route("/productos/eliminar/<int:id_producto>")
def eliminar_producto(id_producto):
    """
    Realiza la eliminación lógica de un producto
    cambiando su estado a Inactivo.

    Args:
        id_producto (int): Identificador del producto.
    """
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        UPDATE productos
        SET estado = 'Inactivo'
        WHERE id_producto = %s
    """, (id_producto,))

    conexion.commit()

    cursor.close()
    conexion.close()

    flash("Producto desactivado correctamente.", "warning")

    return redirect(url_for("producto.listar_productos"))