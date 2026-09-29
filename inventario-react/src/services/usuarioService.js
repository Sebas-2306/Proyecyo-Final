import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/usuarios";

export const registrarUsuario = (datos) => {
    return axios.post(`${API_URL}/registro`, datos);
};

export const iniciarSesion = (datos) => {
    return axios.post(`${API_URL}/login`, datos);
};