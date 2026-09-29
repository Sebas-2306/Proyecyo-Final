
import axios from "axios";

// URL base de la API Flask
const API_URL = "http://127.0.0.1:5000/api/dashboard";

/**
 * Obtiene las estadísticas principales del Dashboard.
 */
export const obtenerEstadisticas = () => axios.get(API_URL);