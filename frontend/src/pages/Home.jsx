import { useEffect, useState } from "react";
import { obtenerEstadisticas } from "../services/dashboardService";

function Home() {
  const [estadisticas, setEstadisticas] = useState({
    total_categorias: 0,
    total_productos: 0,
    stock_bajo: 0,
    total_movimientos: 0
  });

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerEstadisticas()
      .then((respuesta) => {
        setEstadisticas(respuesta.data);
      })
      .catch(() => {
        setError("No se pudieron cargar las estadísticas.");
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  return (
    <div className="container mt-4">

      <div className="text-center mb-4">
        <h1>Sistema de Gestión de Inventario</h1>
        <p className="lead">
          Bienvenido al sistema desarrollado con React y Flask.
        </p>
      </div>

      {cargando && (
        <p className="text-center">Cargando estadísticas...</p>
      )}

      {error && (
        <div className="alert alert-danger text-center">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <>
          <div className="row g-4">

            <div className="col-md-4">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Categorías</h5>
                  <h2 className="text-primary">
                    {estadisticas.total_categorias}
                  </h2>
                  <p className="card-text">Categorías activas</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Productos</h5>
                  <h2 className="text-success">
                    {estadisticas.total_productos}
                  </h2>
                  <p className="card-text">Productos activos</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Stock bajo</h5>
                  <h2 className="text-danger">
                    {estadisticas.stock_bajo}
                  </h2>
                  <p className="card-text">
                    Productos que necesitan reposición
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow h-100">
                <div className="card-body text-center">
                  <h5 className="card-title">Movimientos</h5>
                  <h2 className="text-primary">
                    {estadisticas.total_movimientos}
                  </h2>
                  <p className="card-text">Movimientos registrados</p>
                </div>
              </div>
            </div>

          </div>

          {estadisticas.stock_bajo > 0 && (
            <div className="alert alert-warning mt-4">
              <strong>Atención:</strong> Hay{" "}
              {estadisticas.stock_bajo} producto(s)
              con stock bajo.
            </div>
          )}
        </>
      )}

    </div>
  );
}

export default Home;