from database import obtener_conexion

try:

    conexion = obtener_conexion()

    print("✅ Conexión exitosa")

    conexion.close()

except Exception as e:

    print("❌ Error")

    print(e)