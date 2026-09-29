import { useEffect, useState } from "react";

import {
    obtenerProductos,
    eliminarProducto
} from "../../services/productoService";

import { obtenerCategorias } from "../../services/categoriaService";

import { useNavigate } from "react-router-dom";

function ProductoList() {

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [busqueda, setBusqueda] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const cargarProductos = () => {

        obtenerProductos()
            .then((respuesta) => {

                setProductos(respuesta.data);

                console.log(respuesta.data);

            })
            .catch(() => {

                setError("No se pudieron cargar los productos.");

            })
            .finally(() => {

                setCargando(false);

            });
    };

    const cargarCategorias = () => {

        obtenerCategorias()
            .then((respuesta) => {

                setCategorias(respuesta.data);

            })
            .catch(() => {

                console.error("No se pudieron cargar las categorías.");

            });
    };

    useEffect(() => {

        cargarProductos();
        cargarCategorias();

    }, []);

    const handleEliminar = (id) => {

        if (!window.confirm("¿Estás seguro de eliminar este producto?")) {
            return;
        }

        eliminarProducto(id)
            .then(() => {

                cargarProductos();

            })
            .catch(() => {

                setError("No se pudo eliminar el producto.");

            });
    };

    const productosFiltrados = productos.filter((producto) => {

        const textoBusqueda = busqueda.toLowerCase().trim();

        const coincideBusqueda =
            producto.nombre.toLowerCase().includes(textoBusqueda) ||
            producto.codigo_barras.toLowerCase().includes(textoBusqueda);

        const coincideCategoria =
            categoriaSeleccionada === "" ||
            producto.id_categoria.toString() === categoriaSeleccionada;

        return coincideBusqueda && coincideCategoria;

    });

    const limpiarFiltros = () => {

        setBusqueda("");
        setCategoriaSeleccionada("");

    };

    return (

        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>Listado de Productos</h2>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/productos/nuevo")}
                >
                    Nuevo producto
                </button>

            </div>

            {cargando && (
                <p className="text-center">
                    Cargando productos...
                </p>
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {!cargando && !error && (

                <>

                    {/* FILTROS */}

                    <div className="card shadow-sm mb-4">

                        <div className="card-body">

                            <div className="row g-3 align-items-end">

                                <div className="col-md-6">

                                    <label className="form-label">
                                        Buscar producto
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buscar por nombre o código de barras..."
                                        value={busqueda}
                                        onChange={(e) =>
                                            setBusqueda(e.target.value)
                                        }
                                    />

                                </div>

                                <div className="col-md-4">

                                    <label className="form-label">
                                        Filtrar por categoría
                                    </label>

                                    <select
                                        className="form-select"
                                        value={categoriaSeleccionada}
                                        onChange={(e) =>
                                            setCategoriaSeleccionada(e.target.value)
                                        }
                                    >

                                        <option value="">
                                            Todas las categorías
                                        </option>

                                        {categorias.map((categoria) => (

                                            <option
                                                key={categoria.id_categoria}
                                                value={categoria.id_categoria}
                                            >
                                                {categoria.nombre}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                                <div className="col-md-2">

                                    <button
                                        className="btn btn-secondary w-100"
                                        onClick={limpiarFiltros}
                                    >
                                        Limpiar
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* TABLA */}

                    <div className="table-responsive">

                        <table className="table table-bordered table-hover align-middle">

                            <thead className="table-dark">

                                <tr>

                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Acciones</th>

                                </tr>

                            </thead>

                            <tbody>

                                {productosFiltrados.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="text-center"
                                        >
                                            No se encontraron productos.
                                        </td>

                                    </tr>

                                ) : (

                                    productosFiltrados.map((producto) => (

                                        <tr key={producto.id_producto}
                                        className={
                                            producto.stock === 0
                                                ? "table-danger"
                                                : producto.stock <= producto.stock_minimo
                                                    ? "table-warning"
                                                    : ""
                                        }
                                        >

                                            <td>
                                                {producto.id_producto}
                                            </td>

                                            <td>
                                                {producto.nombre}
                                            </td>

                                            <td>
                                                {producto.categoria}
                                            </td>

                                            <td>
                                                ${producto.precio_venta}
                                            </td>

                                            <td>
    {producto.stock === 0 ? (
        <span className="badge bg-danger">
            Agotado
        </span>
    ) : producto.stock <= producto.stock_minimo ? (
        <span className="badge bg-warning text-dark">
            Stock bajo ({producto.stock})
        </span>
    ) : (
        <span className="badge bg-success">
            Disponible ({producto.stock})
        </span>
    )}
                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() =>
                                                        navigate(
                                                            `/productos/editar/${producto.id_producto}`
                                                        )
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        handleEliminar(
                                                            producto.id_producto
                                                        )
                                                    }
                                                >
                                                    Eliminar
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </>

            )}

        </div>

    );
}

export default ProductoList;