class Categoria:
    """
    Representa una categoría dentro del sistema de inventario.
    """

    def __init__(self, id_categoria, nombre, descripcion, fecha_creacion):

        self.id_categoria = id_categoria
        self.nombre = nombre
        self.descripcion = descripcion
        self.fecha_creacion = fecha_creacion