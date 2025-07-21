import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="bg-red-100 py-2 flex justify-center gap-4">
      <Link to="/" className="text-red-700 font-semibold hover:underline">Inicio</Link>
      <Link to="/" className="text-red-700 font-semibold hover:underline">Clientes</Link>
      <Link to="/donaciones" className="text-red-700 font-semibold hover:underline">Donaciones</Link>
      {/* Agrega más rutas según tu app */}
    </nav>
  );
}

export default NavBar;