import { useState } from "react";
import { useParams } from "react-router-dom";

function EntrevistaForm() {
  const { id } = useParams();
  const [fecha, setFecha] = useState("");
  const [entrevistador, setEntrevistador] = useState("");
  const [salud, setSalud] = useState(""); // Ejemplo de pregunta
  const [viajes, setViajes] = useState(""); // Ejemplo de pregunta
  const [observaciones, setObservaciones] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí envías los datos al backend
    alert("Entrevista guardada para cliente ID: " + id);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-indigo-700 text-center">Entrevista Cliente #{id}</h2>
      <label className="block mb-2 font-medium">Fecha:</label>
      <input type="date" className="border rounded px-2 py-1 w-full mb-4" value={fecha} onChange={e => setFecha(e.target.value)} required />

      <label className="block mb-2 font-medium">Entrevistador:</label>
      <input type="text" className="border rounded px-2 py-1 w-full mb-4" value={entrevistador} onChange={e => setEntrevistador(e.target.value)} required />

      <label className="block mb-2 font-medium">¿Goza de buena salud?</label>
      <select className="border rounded px-2 py-1 w-full mb-4" value={salud} onChange={e => setSalud(e.target.value)} required>
        <option value="">Seleccione...</option>
        <option value="si">Sí</option>
        <option value="no">No</option>
      </select>

      <label className="block mb-2 font-medium">¿Ha viajado fuera del país en el último año?</label>
      <select className="border rounded px-2 py-1 w-full mb-4" value={viajes} onChange={e => setViajes(e.target.value)} required>
        <option value="">Seleccione...</option>
        <option value="si">Sí</option>
        <option value="no">No</option>
      </select>

      <label className="block mb-2 font-medium">Observaciones:</label>
      <textarea className="border rounded px-2 py-1 w-full mb-4" value={observaciones} onChange={e => setObservaciones(e.target.value)} />

      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Guardar</button>
    </form>
  );
}

export default EntrevistaForm;
