
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
    obtenerProducto,
    crearProducto,
    actualizarProducto
} from "../../services/productoService";
import { obtenerCategorias } from "../../services/categoriaService";

function ProductoForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const [producto, setProducto] = useState({
        nombre: "",
        descripcion: "",
        codigo_barras: "",
        precio_compra: "",
        precio_venta: "",
        stock: "",
        stock_minimo: "",
        id_categoria: ""
    });

    useEffect(() => {
        obtenerCategorias()
            .then((respuesta) => {
                setCategorias(respuesta.data);
            })
            .catch(() => {
                setError("No se pudieron cargar las categorías.");
            });

        if (id) {
            setCargando(true);

            obtenerProducto(id)
                .then((respuesta) => {
                    setProducto(respuesta.data);
                })
                .catch(() => {
                    setError("No se pudo cargar el producto.");
                })
                .finally(() => {
                    setCargando(false);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProducto({
            ...producto,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (producto.nombre.trim() === "") {
            Swal.fire({
                icon: "warning",
                title: "Nombre obligatorio",
                text: "Debes ingresar el nombre del producto.",
            });

            return;
        }

        if (producto.codigo_barras.trim() === "") {
            Swal.fire({
                icon: "warning",
                title: "Código obligatorio",
                text: "Debes ingresar el código de barras.",
            });

            return;
        }

        if (producto.precio_compra < 0 || producto.precio_venta < 0) {
            Swal.fire({
                icon: "warning",
                title: "Precio inválido",
                text: "Los precios no pueden ser negativos.",
            });

            return;
        }

        if (producto.stock < 0 || producto.stock_minimo < 0) {
            Swal.fire({
                icon: "warning",
                title: "Cantidad inválida",
                text: "El stock no puede tener valores negativos.",
            });

            return;
        }

        if (producto.stock_minimo > producto.stock) {
            Swal.fire({
                icon: "warning",
                title: "Stock mínimo inválido",
                text: "El stock mínimo no puede ser mayor que el stock disponible.",
            });

            return;
        }

        if (!producto.id_categoria) {
            Swal.fire({
                icon: "warning",
                title: "Categoría obligatoria",
                text: "Debes seleccionar una categoría.",
            });

            return;
        }

        const datos = {
            ...producto,
            precio_compra: Number(producto.precio_compra),
            precio_venta: Number(producto.precio_venta),
            stock: Number(producto.stock),
            stock_minimo: Number(producto.stock_minimo),
            id_categoria: Number(producto.id_categoria)
        };

        try {
            if (id) {
                await actualizarProducto(id, datos);

                await Swal.fire({
                    icon: "success",
                    title: "Producto actualizado",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                await crearProducto(datos);

                await Swal.fire({
                    icon: "success",
                    title: "Producto registrado",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }

            navigate("/productos");
        } catch (error) {
            console.error("Error al guardar el producto:", error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.mensaje || "No fue posible guardar el producto.",
            });
        }
    };

    if (cargando) {
        return <p className="text-center mt-4">Cargando producto...</p>;
    }

    return (
        <div className="container mt-4">

            <h2 className="mb-4">
                {id ? "Editar producto" : "Nuevo producto"}
            </h2>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <div className="row g-3">

                    <div className="col-md-6">
                        <label className="form-label">
                            Nombre
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            value={producto.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">
                            Código de barras
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="codigo_barras"
                            value={producto.codigo_barras}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-12">
                        <label className="form-label">
                            Descripción
                        </label>
                        <textarea
                            className="form-control"
                            name="descripcion"
                            value={producto.descripcion}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">
                            Precio de compra
                        </label>
                        <input
  type="number"
  min="0"
  step="0.01"
  className="form-control"
  value={producto.precio_compra}
  onChange={(e) =>
    setProducto({
      ...producto,
      precio_compra: Number(e.target.value),
    })
  }
/>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">
                            Precio de venta
                        </label>
                        <input
  type="number"
  min="0"
  step="0.01"
  className="form-control"
  value={producto.precio_venta}
  onChange={(e) =>
    setProducto({
      ...producto,
      precio_venta: Number(e.target.value),
    })
  }
/>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">
                            Stock
                        </label>
                        <input
  type="number"
  min="0"
  step="1"
  className="form-control"
  value={producto.stock}
  onChange={(e) =>
    setProducto({
      ...producto,
      stock: Number(e.target.value),
    })
  }
/>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">
                            Stock mínimo
                        </label>
                        <input
  type="number"
  min="0"
  step="1"
  className="form-control"
  value={producto.stock_minimo}
  onChange={(e) =>
    setProducto({
      ...producto,
      stock_minimo: Number(e.target.value),
    })
  }
/>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">
                            Categoría
                        </label>
                        <select
                            className="form-select"
                            name="id_categoria"
                            value={producto.id_categoria}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Seleccione una categoría
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

                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        className="btn btn-primary me-2"
                    >
                        {id ? "Actualizar" : "Guardar"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/productos")}
                    >
                        Cancelar
                    </button>
                </div>

            </form>
        </div>
    );
}

export default ProductoForm;
