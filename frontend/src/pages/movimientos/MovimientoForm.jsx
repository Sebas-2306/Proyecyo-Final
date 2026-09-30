import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { obtenerProductos } from "../../services/productoService";
import { registrarMovimiento } from "../../services/movimientoService";

function MovimientoForm({ onMovimientoRegistrado }) {
  const [productos, setProductos] = useState([]);

  const [movimiento, setMovimiento] = useState({
    id_producto: "",
    tipo_movimiento: "Entrada",
    cantidad: "",
    motivo: "",
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const respuesta = await obtenerProductos();
      setProductos(respuesta.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const handleChange = (e) => {
    setMovimiento({
      ...movimiento,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!movimiento.id_producto) {
      Swal.fire({
        icon: "warning",
        title: "Producto obligatorio",
        text: "Debes seleccionar un producto.",
      });

      return;
    }

    if (!movimiento.cantidad || Number(movimiento.cantidad) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Cantidad inválida",
        text: "La cantidad debe ser mayor que cero.",
      });

      return;
    }

    try {
      await registrarMovimiento({
        id_producto: Number(movimiento.id_producto),
        tipo_movimiento: movimiento.tipo_movimiento,
        cantidad: Number(movimiento.cantidad),
        motivo: movimiento.motivo.trim(),
      });

      await Swal.fire({
        icon: "success",
        title: "Movimiento registrado",
        text: "El stock fue actualizado correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });

      setMovimiento({
        id_producto: "",
        tipo_movimiento: "Entrada",
        cantidad: "",
        motivo: "",
      });

      onMovimientoRegistrado();
    } catch (error) {
      console.error("Error al registrar movimiento:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.error ||
          "No fue posible registrar el movimiento.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">
          Producto
        </label>

        <select
          className="form-select"
          name="id_producto"
          value={movimiento.id_producto}
          onChange={handleChange}
          required
        >
          <option value="">
            Seleccione un producto
          </option>

          {productos.map((producto) => (
            <option
              key={producto.id_producto}
              value={producto.id_producto}
            >
              {producto.nombre} - Stock: {producto.stock}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">
          Tipo de movimiento
        </label>

        <select
          className="form-select"
          name="tipo_movimiento"
          value={movimiento.tipo_movimiento}
          onChange={handleChange}
        >
          <option value="Entrada">
            Entrada
          </option>

          <option value="Salida">
            Salida
          </option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">
          Cantidad
        </label>

        <input
          type="number"
          className="form-control"
          name="cantidad"
          min="1"
          step="1"
          value={movimiento.cantidad}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Motivo
        </label>

        <input
          type="text"
          className="form-control"
          name="motivo"
          maxLength="255"
          value={movimiento.motivo}
          onChange={handleChange}
          placeholder="Ejemplo: Compra al proveedor"
        />
      </div>

      <button
        type="submit"
        className="btn btn-success"
      >
        Registrar movimiento
      </button>
    </form>
  );
}

export default MovimientoForm;