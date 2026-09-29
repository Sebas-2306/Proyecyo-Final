import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/categorias";

export const obtenerCategorias = () =>
  axios.get(API_URL);

export const obtenerCategoria = (id) =>
  axios.get(`${API_URL}/${id}`);

export const crearCategoria = (categoria) =>
  axios.post(API_URL, categoria);

export const actualizarCategoria = (id, categoria) =>
  axios.put(`${API_URL}/${id}`, categoria);

export const eliminarCategoria = (id) =>
  axios.delete(`${API_URL}/${id}`);