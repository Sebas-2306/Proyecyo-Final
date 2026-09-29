import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RutaProtegida from "./components/RutaProtegida";

import Home from "./pages/Home";
import About from "./pages/About";

import Login from "./pages/Login";
import Registro from "./pages/Registro";

import CategoriaList from "./pages/categorias/CategoriaList";
import CategoriaForm from "./pages/categorias/CategoriaForm";

import ProductoList from "./pages/productos/ProductoList";
import ProductoForm from "./pages/productos/ProductoForm";

import MovimientoList from "./pages/movimientos/MovimientoList";

function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <div className="container mt-4">

                <Routes>

                    {/* Rutas públicas */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/registro"
                        element={<Registro />}
                    />

                    {/* Rutas protegidas */}

                    <Route
                        path="/"
                        element={
                            <RutaProtegida>
                                <Home />
                            </RutaProtegida>
                        }
                    />

                    <Route
                        path="/categorias"
                        element={
                            <RutaProtegida>
                                <CategoriaList />
                            </RutaProtegida>
                        }
                    />

                    <Route
                        path="/categorias/nueva"
                        element={
                            <RutaProtegida>
                                <CategoriaForm />
                            </RutaProtegida>
                        }
                    />

                    <Route
                        path="/categorias/editar/:id"
                        element={
                            <RutaProtegida>
                                <CategoriaForm />
                            </RutaProtegida>
                        }
                    />

                    <Route
                        path="/productos"
                        element={
                            <RutaProtegida>
                                <ProductoList />
                            </RutaProtegida>
                        }
                    />

                    <Route
                        path="/productos/nuevo"
                        element={
                            <RutaProtegida>
                                <ProductoForm />
                            </RutaProtegida>
                        }
                    />

                    <Route
                        path="/productos/editar/:id"
                        element={
                            <RutaProtegida>
                                <ProductoForm />
                            </RutaProtegida>
                        }
                    />

                    <Route
                        path="/movimientos"
                        element={
                            <RutaProtegida>
                                <MovimientoList />
                            </RutaProtegida>
                        }
                    />

                    <Route
                        path="/about"
                        element={
                            <RutaProtegida>
                                <About />
                            </RutaProtegida>
                        }
                    />

                </Routes>

            </div>

            <Footer />

        </BrowserRouter>

    );
}

export default App;