import { useState, useEffect } from "react";
import Swal from "sweetalert2";

import {
  crearCategoria,
  actualizarCategoria,
} from "../../services/categoriaService";

function CategoriaForm({
  onCategoriaCreada,
  categoriaSeleccionada,
  limpiarSeleccion,
}) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    if (categoriaSeleccionada) {
      setNombre(categoriaSeleccionada.nombre);
      setDescripcion(categoriaSeleccionada.descripcion || "");
    } else {
      setNombre("");
      setDescripcion("");
    }
  }, [categoriaSeleccionada]);

  const guardarCategoria = async (e) => {
  e.preventDefault();

  const nombreLimpio = nombre.trim();
  const descripcionLimpia = descripcion.trim();

  if (nombreLimpio === "") {
    Swal.fire({
      icon: "warning",
      title: "Nombre obligatorio",
      text: "Debes ingresar el nombre de la categoría.",
    });

    return;
  }

  if (nombreLimpio.length < 3) {
    Swal.fire({
      icon: "warning",
      title: "Nombre muy corto",
      text: "El nombre debe tener mínimo 3 caracteres.",
    });

    return;
  }

  if (nombreLimpio.length > 30) {
    Swal.fire({
      icon: "warning",
      title: "Nombre muy largo",
      text: "El nombre no debe superar los 30 caracteres.",
    });

    return;
  }

  try {
    const datosCategoria = {
      nombre: nombreLimpio,
      descripcion: descripcionLimpia,
    };

    if (categoriaSeleccionada) {
      await actualizarCategoria(
        categoriaSeleccionada.id_categoria,
        datosCategoria
      );

      await Swal.fire({
        icon: "success",
        title: "Categoría actualizada",
        timer: 1500,
        showConfirmButton: false,
      });

      limpiarSeleccion();
    } else {
      await crearCategoria(datosCategoria);

      await Swal.fire({
        icon: "success",
        title: "Categoría registrada",
        timer: 1500,
        showConfirmButton: false,
      });
    }

    setNombre("");
    setDescripcion("");
    onCategoriaCreada();
  } catch (error) {
    console.error("Error al guardar la categoría:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No fue posible guardar la categoría.",
    });
  }
};

  return (
    <form onSubmit={guardarCategoria}>
      <div className="mb-3">
        <label className="form-label">
          Nombre
        </label>

        <input
          type="text"
          className="form-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Descripción
        </label>

        <textarea
          className="form-control"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      <button className="btn btn-success me-2" type="submit">
        {categoriaSeleccionada ? "Actualizar" : "Guardar"}
      </button>

      {categoriaSeleccionada && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={limpiarSeleccion}
        >
          Cancelar
        </button>
      )}
    </form>
  );
}

export default CategoriaForm;