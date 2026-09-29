import axios from "axios";

const API_URL = "https://proyecyo-final-production.up.railway.app/api/movimientos";

export const obtenerMovimientos = () =>
  axios.get(API_URL);

export const registrarMovimiento = (movimiento) =>
  axios.post(API_URL, movimiento);