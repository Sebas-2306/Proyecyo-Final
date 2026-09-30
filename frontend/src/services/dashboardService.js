
import axios from "axios";

// URL base de la API Flask
const API_URL = "https://proyecyo-final-production.up.railway.app/api/dashboard";

/**
 * Obtiene las estadísticas principales del Dashboard.
 */
export const obtenerEstadisticas = () => axios.get(API_URL);