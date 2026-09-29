import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const usuarioGuardado = localStorage.getItem("usuario");

    const usuario = usuarioGuardado
        ? JSON.parse(usuarioGuardado)
        : null;

    const cerrarSesion = () => {
        localStorage.removeItem("usuario");
        navigate("/login", { replace: true });
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">

            <div className="container">

                <Link className="navbar-brand" to="/">
                    Inventario SENA
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#menu"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="menu">

                    {usuario && (
                        <ul className="navbar-nav ms-auto">

                            <li className="nav-item">
                                <span className="nav-link">
                                    Hola, {usuario.nombre}
                                </span>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/">
                                    Inicio
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/categorias">
                                    Categorías
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/productos">
                                    Productos
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/movimientos">
                                    Movimientos
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/about">
                                    Acerca
                                </Link>
                            </li>

                            <li className="nav-item">
                                <button
                                    className="btn btn-outline-light ms-lg-2"
                                    onClick={cerrarSesion}
                                >
                                    Cerrar sesión
                                </button>
                            </li>

                        </ul>
                    )}

                </div>

            </div>

        </nav>
    );
}

export default Navbar;