from flask import Blueprint, render_template, request, redirect, url_for, flash
from database import obtener_conexion
"""
Blueprint del módulo Categorías.

Este módulo administra todas las operaciones CRUD
relacionadas con las categorías del sistema.
"""
categoria_bp = Blueprint("categoria", __name__)

@categoria_bp.route("/categorias")
def listar_categorias():
    """
    Consulta y muestra todas las categorías activas
    registradas en la base de datos.
    """
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT *
        FROM categorias
        WHERE estado = 'Activo'
        ORDER BY nombre
    """)

    categorias = cursor.fetchall()

    cursor.close()
    conexion.close()

    return render_template(
        "categorias/listar.html",
        categorias=categorias
    )


@categoria_bp.route("/categorias/nueva")
def nueva_categoria():
    """
    Muestra el formulario para registrar
    una nueva categoría.
    """
    return render_template("categorias/nueva.html")


@categoria_bp.route("/categorias/guardar", methods=["POST"])
def guardar_categoria():
    """
    Guarda una nueva categoría en la base de datos
    utilizando la información enviada desde el formulario.
    """
    nombre = request.form["nombre"]
    descripcion = request.form["descripcion"]

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        INSERT INTO categorias (nombre, descripcion)
        VALUES (%s, %s)
    """, (nombre, descripcion))

    conexion.commit()

    cursor.close()
    conexion.close()

    flash("Categoría registrada correctamente.", "success")

    return redirect(url_for("categoria.listar_categorias"))


@categoria_bp.route("/categorias/editar/<int:id_categoria>")
def editar_categoria(id_categoria):
    """
    Obtiene una categoría específica para mostrarla
    en el formulario de edición.

    Args:
        id_categoria (int): Identificador de la categoría.
    """
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT *
        FROM categorias
        WHERE id_categoria = %s
    """, (id_categoria,))

    categoria = cursor.fetchone()

    cursor.close()
    conexion.close()

    return render_template(
        "categorias/editar.html",
        categoria=categoria
    )


@categoria_bp.route("/categorias/actualizar", methods=["POST"])
def actualizar_categoria():
    """
    Actualiza la información de una categoría existente.
    """
    id_categoria = request.form["id_categoria"]
    nombre = request.form["nombre"]
    descripcion = request.form["descripcion"]

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        UPDATE categorias
        SET nombre = %s,
            descripcion = %s
        WHERE id_categoria = %s
    """, (nombre, descripcion, id_categoria))

    conexion.commit()

    cursor.close()
    conexion.close()

    flash("Categoría actualizada correctamente.", "success")

    return redirect(url_for("categoria.listar_categorias"))


@categoria_bp.route("/categorias/eliminar/<int:id_categoria>")
def eliminar_categoria(id_categoria):
    """
    Realiza la eliminación lógica de una categoría
    cambiando su estado a Inactivo.

    Args:
        id_categoria (int): Identificador de la categoría.
    """
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("""
        UPDATE categorias
        SET estado = 'Inactivo'
        WHERE id_categoria = %s
    """, (id_categoria,))

    conexion.commit()

    cursor.close()
    conexion.close()
    
    flash("Categoría desactivada correctamente.", "warning")

    return redirect(url_for("categoria.listar_categorias"))