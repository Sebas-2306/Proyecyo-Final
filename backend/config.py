"""
Archivo de configuración del proyecto.

Contiene las variables de configuración necesarias para establecer
la conexión con la base de datos y otros parámetros del sistema.
"""

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """
    Clase que almacena la configuración general
    del Sistema de Gestión de Inventario.
    """
    DB_HOST = os.getenv("DB_HOST")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_NAME = os.getenv("DB_NAME")
    DB_PORT = int(os.getenv("DB_PORT"))