import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

function EditarClienteModal({ isOpen, onClose, cliente, onSave }) {
  const [nombre, setNombre] = useState(cliente?.nombre || "");
  const [apellido, setApellido] = useState(cliente?.apellido || "");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    setNombre(cliente?.nombre || "");
    setApellido(cliente?.apellido || "");
  }, [cliente]);

  if (!isOpen) return null;

  const handleGuardar = async () => {
    setGuardando(true);
    await onSave({ ...cliente, nombre, apellido });
    setGuardando(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Fondo translúcido */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="relative bg-white p-6 rounded-xl shadow-2xl w-full max-w-xs animate-fade-in">
        {/* Ícono de cierre */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <AiOutlineClose size={24} />
        </button>
        <h3 className="text-lg font-bold mb-4 text-indigo-700 text-center">Editar Cliente</h3>
        <input
          className="border rounded px-2 py-1 w-full mb-2"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nombre"
        />
        <input
          className="border rounded px-2 py-1 w-full mb-4"
          value={apellido}
          onChange={e => setApellido(e.target.value)}
          placeholder="Apellido"
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 bg-gray-400 text-white rounded"
            onClick={onClose}
            disabled={guardando}
          >Cancelar</button>
          <button
            className="px-3 py-1 bg-indigo-600 text-white rounded"
            onClick={handleGuardar}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditarClienteModal;
