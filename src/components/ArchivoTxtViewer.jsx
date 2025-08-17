import React, { useState } from "react";
import { obtenerLineasArchivo } from "../bd/Data";

function ArchivoTxtViewer() {
  const [filePath, setFilePath] = useState("");
  const [lines, setLines] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLines([]);
    try {
      const data = await obtenerLineasArchivo(filePath);
      if (data.error) {
        setError(data.error);
      } else if (data.lines) {
        setLines(data.lines);
      } else {
        setError("No se encontraron líneas en el archivo.");
      }
    } catch (err) {
      setError("Error de conexión o formato inesperado.");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", background: "#fff6f6", padding: 24, borderRadius: 12 }}>
      <h2>Ver contenido de archivo .txt (backend)</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={filePath}
          onChange={e => setFilePath(e.target.value)}
          placeholder="Ruta completa del archivo en el servidor"
          style={{ width: "80%", padding: 8, borderRadius: 6, border: "1px solid #b71c1c" }}
          required
        />
        <button type="submit" style={{ marginLeft: 12, padding: "8px 16px", borderRadius: 6, background: "#b71c1c", color: "#fff", border: "none" }}>
          Ver archivo
        </button>
      </form>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      {lines.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 6, padding: 16, border: "1px solid #eee" }}>
          <h4>Contenido:</h4>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", fontSize: 15 }}>
            {lines.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ArchivoTxtViewer;
