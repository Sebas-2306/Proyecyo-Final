import { useEffect, useState } from "react";

import MovimientoForm from "./MovimientoForm";

import { obtenerMovimientos } from "../../services/movimientoService";

function MovimientoList() {

    const [movimientos, setMovimientos] = useState([]);

    const [filtroTipo, setFiltroTipo] = useState("");

    useEffect(() => {

        cargarMovimientos();

    }, []);

    const cargarMovimientos = async () => {

        try {

            const respuesta = await obtenerMovimientos();

            setMovimientos(respuesta.data);

        } catch (error) {

            console.error(
                "Error al obtener movimientos:",
                error
            );

        }

    };

    const movimientosFiltrados = movimientos.filter((movimiento) => {

        if (filtroTipo === "") {
            return true;
        }

        return movimiento.tipo_movimiento === filtroTipo;

    });

    return (

        <div className="card shadow">

            <div className="card-header bg-primary text-white">

                <h4 className="mb-0">
                    Movimientos de Inventario
                </h4>

            </div>

            <div className="card-body">

                <MovimientoForm
                    onMovimientoRegistrado={cargarMovimientos}
                />

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5 className="mb-0">
                        Historial de movimientos
                    </h5>

                    <div>

                        <label className="form-label me-2">
                            Filtrar:
                        </label>

                        <select
                            className="form-select d-inline-block"
                            style={{ width: "180px" }}
                            value={filtroTipo}
                            onChange={(e) =>
                                setFiltroTipo(e.target.value)
                            }
                        >

                            <option value="">
                                Todos
                            </option>

                            <option value="Entrada">
                                Entradas
                            </option>

                            <option value="Salida">
                                Salidas
                            </option>

                        </select>

                    </div>

                </div>

                <div className="table-responsive">

                    <table className="table table-striped table-hover">

                        <thead className="table-dark">

                            <tr>

                                <th>ID</th>

                                <th>Producto</th>

                                <th>Tipo</th>

                                <th>Cantidad</th>

                                <th>Motivo</th>

                                <th>Fecha</th>

                            </tr>

                        </thead>

                        <tbody>

                            {movimientosFiltrados.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="text-center"
                                    >
                                        No hay movimientos para mostrar.
                                    </td>

                                </tr>

                            ) : (

                                movimientosFiltrados.map((movimiento) => (

                                    <tr key={movimiento.id_movimiento}>

                                        <td>
                                            {movimiento.id_movimiento}
                                        </td>

                                        <td>
                                            {movimiento.producto}
                                        </td>

                                        <td>

                                            {movimiento.tipo_movimiento === "Entrada" ? (

                                                <span className="badge bg-success">
                                                    Entrada
                                                </span>

                                            ) : (

                                                <span className="badge bg-danger">
                                                    Salida
                                                </span>

                                            )}

                                        </td>

                                        <td>
                                            {movimiento.cantidad}
                                        </td>

                                        <td>
                                            {movimiento.motivo}
                                        </td>

                                        <td>
                                            {movimiento.fecha_movimiento}
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default MovimientoList;