import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerEntrevistaPorCliente, insertarEntrevista, actualizarEntrevista } from "../bd/Data";
import Swal from 'sweetalert2';

function EntrevistaForm() {
  const { id } = useParams();
  const [idEntrevista, setIdEntrevista] = useState(null);
  const [fecha, setFecha] = useState("");
  const [entrevistador, setEntrevistador] = useState("");
  const [salud, setSalud] = useState("");
  const [viajes, setViajes] = useState("");
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    async function cargarEntrevista() {
      const respuesta = await obtenerEntrevistaPorCliente(id);
      if (respuesta.success && respuesta.entrevista) {
        setIdEntrevista(respuesta.entrevista.id);
        setFecha(respuesta.entrevista.fecha);
        setEntrevistador(respuesta.entrevista.entrevistador);
        setSalud(respuesta.entrevista.salud);
        setViajes(respuesta.entrevista.viajes);
        setObservaciones(respuesta.entrevista.observaciones);
      }
    }
    cargarEntrevista();
  }, [id]);

const handleSubmit = async (e) => {
  e.preventDefault();
  const datosEntrevista = { cliente_id: id, fecha, entrevistador, salud, viajes, observaciones };
  let respuesta;
  if (idEntrevista) {
    respuesta = await actualizarEntrevista(idEntrevista, datosEntrevista);
  } else {
    respuesta = await insertarEntrevista(datosEntrevista);
  }
  if (respuesta.success) {
    Swal.fire({
      icon: 'success',
      title: idEntrevista ? '¡Entrevista actualizada!' : '¡Entrevista guardada!',
      showConfirmButton: false,
      timer: 1800
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: respuesta.message || 'Intenta de nuevo'
    });
  }
};


  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-indigo-700 text-center">
        Entrevista Cliente #{id}
      </h2>
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
      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        {idEntrevista ? "Actualizar" : "Guardar"}
      </button>
    </form>
  );
}

export default EntrevistaForm;
