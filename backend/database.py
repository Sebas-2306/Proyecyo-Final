"""
Módulo de conexión a la base de datos.

Este archivo contiene la función encargada de establecer la conexión
con la base de datos MySQL utilizada por el Sistema de Gestión de Inventario.
"""

import pymysql
from config import Config


def obtener_conexion():
    """
    Crea y devuelve una conexión con la base de datos MySQL.

    Returns:
        Connection: Objeto de conexión a la base de datos.
    """

    return pymysql.connect(
        host=Config.DB_HOST,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME,
        port=Config.DB_PORT,
        cursorclass=pymysql.cursors.DictCursor
    )