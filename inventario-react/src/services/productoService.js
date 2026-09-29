
import axios from "axios";

// URL base de la API Flask
const API_URL = "https://proyecyo-final-production.up.railway.app/api/productos";

/**
 * Obtiene todos los productos activos.
 */
export const obtenerProductos = () => axios.get(API_URL);

/**
 * Obtiene un producto por su ID.
 */
export const obtenerProducto = (id) =>
    axios.get(`${API_URL}/${id}`);

/**
 * Crea un nuevo producto.
 */
export const crearProducto = (producto) =>
    axios.post(API_URL, producto);

/**
 * Actualiza un producto.
 */
export const actualizarProducto = (id, producto) =>
    axios.put(`${API_URL}/${id}`, producto);

/**
 * Elimina un producto.
 */
export const eliminarProducto = (id) =>
    axios.delete(`${API_URL}/${id}`);