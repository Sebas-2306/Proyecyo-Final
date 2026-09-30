import { useEffect, useState } from "react";
import {
    obtenerCategorias,
    eliminarCategoria
} from "../../services/categoriaService";

import CategoriaForm from "./CategoriaForm";
import Swal from "sweetalert2";

function CategoriaList() {

    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    useEffect(() => {
        cargarCategorias();
    }, []);
    /**
 * Obtiene todas las categorías
 */
    // Cargar categorías
    const cargarCategorias = async () => {

        try {

            const respuesta = await obtenerCategorias();

            setCategorias(respuesta.data);

        } catch (error) {

            console.error("Error al obtener categorías:", error);

        }

    };
/**
 * Elimina una categoría
 */
    // Eliminar categoría
    const eliminar = async (id) => {

        const resultado = await Swal.fire({
            title: "¿Eliminar categoría?",
            text: "Esta acción desactivará la categoría.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (!resultado.isConfirmed) return;

        try {

            await eliminarCategoria(id);

            Swal.fire({
                icon: "success",
                title: "Categoría eliminada",
                timer: 1500,
                showConfirmButton: false
            });

            cargarCategorias();

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No fue posible eliminar la categoría."
            });

        }

    };
const editar = (categoria) => {

    setCategoriaSeleccionada(categoria);

};
const limpiarSeleccion = () => {

    setCategoriaSeleccionada(null);

};
    return (

        <div className="card shadow">

            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">

                <h4 className="mb-0">
                    Gestión de Categorías
                </h4>

                <button className="btn btn-light">
                    Nueva Categoría
                </button>

            </div>

            <div className="card-body">
<CategoriaForm
    onCategoriaCreada={cargarCategorias}
    categoriaSeleccionada={categoriaSeleccionada}
    limpiarSeleccion={limpiarSeleccion}
/>

                <hr />

                <table className="table table-striped table-hover">

                    <thead className="table-dark">

                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th width="180">Acciones</th>
                        </tr>

                    </thead>

                    <tbody>

                        {categorias.map((categoria) => (

                            <tr key={categoria.id_categoria}>

                                <td>{categoria.id_categoria}</td>

                                <td>{categoria.nombre}</td>

                                <td>{categoria.descripcion}</td>

                                <td>
  <button
  className="btn btn-warning btn-sm me-2"
  onClick={() => editar(categoria)}
>
  Editar
</button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => eliminar(categoria.id_categoria)}
                                    >
                                        Eliminar
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default CategoriaList;