import React from "react";

export default function ClienteSearch({ search, setSearch }) {
  return (
    <input
      type="text"
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder="Buscar cliente..."
      className="border rounded px-2 py-1 w-full mb-4"
    />
  );
}
