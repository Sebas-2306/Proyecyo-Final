"""
Sistema de Gestión de Inventario

Evidencia: GA7-220501096-AA3

Framework seleccionado: Flask

Justificación:
Se seleccionó Flask como framework para el desarrollo del proyecto web debido
a que es un framework ligero, flexible y de fácil integración con Python y
bases de datos MySQL. Además, permite organizar el proyecto mediante Blueprints,
facilitando la implementación de una arquitectura por módulos, el mantenimiento
del código y el desarrollo ágil de aplicaciones web.
"""

from flask import Flask, render_template
from flask_cors import CORS

from routes.categoria_routes import categoria_bp
from routes.producto_routes import producto_bp
from routes.usuario_api import usuario_api_bp
from routes.categoria_api import categoria_api_bp
from routes.producto_api import producto_api_bp
from routes.dashboard_api import dashboard_api_bp
from routes.movimiento_api import movimiento_api_bp

app = Flask(__name__)

CORS(
    app,
    origins=[
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)

from database import obtener_conexion

"""
Aplicación principal del sistema.

Aquí se inicializa Flask y se registran los Blueprints
correspondientes a cada módulo.
"""
app.secret_key = "inventario_sena_2026"

app.register_blueprint(categoria_bp)
app.register_blueprint(producto_bp)
app.register_blueprint(categoria_api_bp)
app.register_blueprint(usuario_api_bp)
app.register_blueprint(producto_api_bp)
app.register_blueprint(dashboard_api_bp)
app.register_blueprint(movimiento_api_bp)
@app.route("/")
def inicio():
 
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("SELECT COUNT(*) AS total FROM categorias WHERE estado='Activo'")
    total_categorias = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) AS total FROM productos WHERE estado='Activo'")
    total_productos = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) AS total FROM productos WHERE stock <= stock_minimo AND estado='Activo'")
    stock_bajo = cursor.fetchone()["total"]

    cursor.close()
    conexion.close()

    return render_template(
        "pages/index.html",
        total_categorias=total_categorias,
        total_productos=total_productos,
        stock_bajo=stock_bajo
    )

if __name__ == "__main__":
    app.run()
