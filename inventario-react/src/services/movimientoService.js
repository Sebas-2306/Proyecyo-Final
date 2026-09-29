import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/movimientos";

export const obtenerMovimientos = () =>
  axios.get(API_URL);

export const registrarMovimiento = (movimiento) =>
  axios.post(API_URL, movimiento);