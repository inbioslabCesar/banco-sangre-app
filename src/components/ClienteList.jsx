import { useEffect, useState } from "react";
import { FaRegFileAlt, FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  obtenerClientes,
  eliminarCliente,
  actualizarCliente,
} from "../bd/Data";
import Spinner from "./Spinner";
import ClienteSearch from "./ClienteSearch";
import EditarClienteModal from "./EditarClienteModal";

function ClienteList() {
  const [clientes, setClientes] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);
  const limite = 5;

  useEffect(() => {
    setCargando(true);
    setError(null);
    obtenerClientes(pagina, limite, search)
      .then((data) => {
        setClientes(Array.isArray(data.clientes) ? data.clientes : []);
        setTotal(data.total || 0);
      })
      .catch(() => setError("Ocurrió un error al cargar los clientes."))
      .finally(() => setCargando(false));
  }, [pagina, search]);

  const totalPaginas = Math.ceil(total / limite);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPagina(1);
  };

  // Eliminar cliente
  const handleEliminar = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este cliente?")) {
      eliminarCliente(id).then(() => {
        setClientes(clientes.filter((c) => c.id !== id));
        setTotal(total - 1);
      });
    }
  };

  // Abrir modal para editar
  const handleEditar = (cliente) => {
    setClienteEditar(cliente);
    setModalOpen(true);
  };

  // Guardar cambios desde el modal
  const handleGuardarEdicion = async (clienteActualizado) => {
    await actualizarCliente(
      clienteActualizado.id,
      clienteActualizado.nombre,
      clienteActualizado.apellido
    );
    setClientes(
      clientes.map((c) =>
        c.id === clienteActualizado.id
          ? {
              ...c,
              nombre: clienteActualizado.nombre,
              apellido: clienteActualizado.apellido,
            }
          : c
      )
    );
    setModalOpen(false);
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">
        Clientes Registrados
      </h2>
      <ClienteSearch search={search} setSearch={handleSearchChange} />
      {cargando ? (
        <Spinner />
      ) : error ? (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      ) : clientes.length === 0 ? (
        <p className="text-center">No hay clientes registrados.</p>
      ) : (
        <ul className="mb-4 divide-y">
          {clientes.map((cliente) => (
            <li
              key={cliente.id}
              className="py-2 flex items-center justify-between gap-2"
            >
              <span className="font-medium">
                {cliente.nombre} {cliente.apellido}
              </span>
              <span className="text-xs text-gray-400">{cliente.id}</span>
              <div className="flex gap-2 items-center">
                <button
                  className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  title="Entrevista"
                  onClick={() =>
                    (window.location.href = `/entrevista/${cliente.id}`)
                  }
                >
                  <FaRegFileAlt />
                </button>
                <button
                  className="p-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  title="Editar"
                  onClick={() => handleEditar(cliente)}
                >
                  <FaEdit />
                </button>
                <button
                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                  title="Eliminar"
                  onClick={() => handleEliminar(cliente.id)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col items-center gap-2 mt-4">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 rounded disabled:opacity-50"
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={pagina === 1}
          >
            Anterior
          </button>
          <span className="mx-2 font-semibold">
            Página {pagina} de {totalPaginas}
          </span>
          <button
            className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 rounded disabled:opacity-50"
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={pagina === totalPaginas || totalPaginas === 0}
          >
            Siguiente
          </button>
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Total de registros: {total}
        </div>
      </div>

      <EditarClienteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        cliente={clienteEditar}
        onSave={handleGuardarEdicion}
      />
    </div>
  );
}

export default ClienteList;
