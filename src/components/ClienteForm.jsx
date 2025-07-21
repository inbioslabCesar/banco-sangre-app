import { useState } from "react";
import { insertarCliente } from "../bd/Data";
import Spinner from "./Spinner"; // Ajusta la ruta si es necesario

function ClienteForm({ onClienteCreado }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);
    try {
      const data = await insertarCliente(nombre, apellido);
      setMensaje(data.message);
      if (data.success) {
        setNombre("");
        setApellido("");
        onClienteCreado();
      }
    } catch {
      setMensaje("Ocurrió un error al guardar el cliente.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow mb-4">
      <h2 className="text-xl font-bold mb-4">Registrar Cliente</h2>
      <input
        className="block w-full mb-2 p-2 border rounded"
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        required
      />
      <input
        className="block w-full mb-2 p-2 border rounded"
        type="text"
        placeholder="Apellido"
        value={apellido}
        onChange={e => setApellido(e.target.value)}
        required
      />
      <button
        className="bg-red-600 text-white px-4 py-2 rounded"
        type="submit"
        disabled={cargando}
      >
        Guardar
      </button>
      {cargando && <Spinner />}
      {mensaje && <p className="mt-2">{mensaje}</p>}
    </form>
  );
}

export default ClienteForm;
