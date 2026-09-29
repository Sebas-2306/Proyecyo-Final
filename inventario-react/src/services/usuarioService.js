import axios from "axios";

const API_URL = "https://proyecyo-final-production.up.railway.app/api/usuarios";

export const registrarUsuario = (datos) => {
    return axios.post(`${API_URL}/registro`, datos);
};

export const iniciarSesion = (datos) => {
    return axios.post(`${API_URL}/login`, datos);
};