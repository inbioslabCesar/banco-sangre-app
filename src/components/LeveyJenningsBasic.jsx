import React, { useState } from "react";
import { obtenerArchivosLeveyJennings } from "../bd/Data";

function LeveyJenningsBasic() {
  const [folder, setFolder] = useState("");
  const [datos, setDatos] = useState([]);
  const [archivosIgnorados, setArchivosIgnorados] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setDatos([]);
    setArchivosIgnorados([]);
    try {
      const data = await obtenerArchivosLeveyJennings(folder);
      if (data.error) {
        setError(data.error);
      } else {
        setDatos(data.datos || []);
        setArchivosIgnorados(data.archivosIgnorados || []);
      }
    } catch (err) {
      setError("Error de conexión o formato inesperado.");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", background: "#fff6f6", padding: 24, borderRadius: 12 }}>
      <h2>Archivos Levey-Jennings (Básico)</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={folder}
          onChange={e => setFolder(e.target.value)}
          placeholder="Ruta de la carpeta uploads"
          style={{ width: "80%", padding: 8, borderRadius: 6, border: "1px solid #b71c1c" }}
          required
        />
        <button type="submit" style={{ marginLeft: 12, padding: "8px 16px", borderRadius: 6, background: "#b71c1c", color: "#fff", border: "none" }}>
          Ver archivos
        </button>
      </form>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      {datos.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#ffeaea", color: "#b71c1c" }}>
              <th>Archivo</th>
              <th>Fecha completa</th>
              <th>Solo fecha</th>
              <th>Primera línea</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((d, idx) => (
              <tr key={idx}>
                <td>{d.file}</td>
                <td>{d.fechaCompleta}</td>
                <td>{d.soloFecha}</td>
                <td>{d.linea0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {archivosIgnorados.length > 0 && (
        <div style={{ color: "#b71c1c", marginTop: 16 }}>
          <strong>Archivos ignorados:</strong>
          <ul>
            {archivosIgnorados.map((a, i) => (
              <li key={i}>{a.file}: {a.motivo}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LeveyJenningsBasic;
