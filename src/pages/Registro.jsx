import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { registrarUsuario } from "../services/usuarioService";

function Registro() {

    const [nombre, setNombre] = useState("");
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegistro = async (e) => {

        e.preventDefault();

        const nombreLimpio = nombre.trim();
        const usuarioLimpio = usuario.trim();

        if (!nombreLimpio || !usuarioLimpio || !password) {

            Swal.fire({
                icon: "warning",
                title: "Campos obligatorios",
                text: "Todos los campos son obligatorios."
            });

            return;
        }

        if (nombreLimpio.length < 3) {

            Swal.fire({
                icon: "warning",
                title: "Nombre inválido",
                text: "El nombre debe tener mínimo 3 caracteres."
            });

            return;
        }

        if (usuarioLimpio.length < 3) {

            Swal.fire({
                icon: "warning",
                title: "Usuario inválido",
                text: "El usuario debe tener mínimo 3 caracteres."
            });

            return;
        }

        if (password.length < 6) {

            Swal.fire({
                icon: "warning",
                title: "Contraseña inválida",
                text: "La contraseña debe tener mínimo 6 caracteres."
            });

            return;
        }

        try {

            await registrarUsuario({
                nombre: nombreLimpio,
                usuario: usuarioLimpio,
                password: password
            });

            await Swal.fire({
                icon: "success",
                title: "Registro exitoso",
                text: "El usuario fue registrado correctamente.",
                timer: 1800,
                showConfirmButton: false
            });

            setNombre("");
            setUsuario("");
            setPassword("");

            navigate("/login");

        } catch (error) {

            if (error.response?.status === 409) {

                Swal.fire({
                    icon: "warning",
                    title: "Usuario existente",
                    text: "El nombre de usuario ya está registrado."
                });

            } else {

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No fue posible registrar el usuario."
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
                            Crear cuenta
                        </h4>

                    </div>

                    <div className="card-body">

                        <form onSubmit={handleRegistro}>

                            <div className="mb-3">

                                <label className="form-label">
                                    Nombre completo
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={nombre}
                                    onChange={(e) =>
                                        setNombre(e.target.value)
                                    }
                                    maxLength="100"
                                    required
                                />

                            </div>

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
                                Registrarse
                            </button>

                        </form>

                        <div className="text-center mt-3">

                            <button
                                type="button"
                                className="btn btn-link"
                                onClick={() => navigate("/login")}
                            >
                                ¿Ya tienes una cuenta? Inicia sesión
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Registro;