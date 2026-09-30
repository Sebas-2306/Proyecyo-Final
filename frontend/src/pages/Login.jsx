import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { iniciarSesion } from "../services/usuarioService";

function Login() {

    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        const usuarioLimpio = usuario.trim();

        if (!usuarioLimpio || !password) {

            Swal.fire({
                icon: "warning",
                title: "Campos obligatorios",
                text: "Debes ingresar usuario y contraseña."
            });

            return;
        }

        try {

            const respuesta = await iniciarSesion({
                usuario: usuarioLimpio,
                password: password
            });

            localStorage.setItem(
                "usuario",
                JSON.stringify(respuesta.data.usuario)
            );

            await Swal.fire({
                icon: "success",
                title: "Bienvenido",
                text: `Hola, ${respuesta.data.usuario.nombre}`,
                timer: 1500,
                showConfirmButton: false
            });

            navigate("/");

        } catch (error) {

            if (error.response?.status === 401) {

                Swal.fire({
                    icon: "error",
                    title: "Error de autenticación",
                    text: "El usuario o la contraseña son incorrectos."
                });

            } else {

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No fue posible iniciar sesión."
                });

            }

        }

    };

    return (

        <div className="row justify-content-center">

            <div className="col-md-6 col-lg-5">

                <div className="card shadow">

                    <div className="card-header bg-primary text-white text-center">

                        <h4 className="mb-0">
                            Inicio de sesión
                        </h4>

                    </div>

                    <div className="card-body">

                        <form onSubmit={handleLogin}>

                            <div className="mb-3">

                                <label className="form-label">
                                    Usuario
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={usuario}
                                    onChange={(e) =>
                                        setUsuario(e.target.value)
                                    }
                                    maxLength="50"
                                    required
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Contraseña
                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    maxLength="255"
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                            >
                                Iniciar sesión
                            </button>

                        </form>

                        <div className="text-center mt-3">

                            <button
                                type="button"
                                className="btn btn-link"
                                onClick={() => navigate("/registro")}
                            >
                                ¿No tienes una cuenta? Regístrate
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;