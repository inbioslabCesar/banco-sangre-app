import React, { useState } from "react";
import { obtenerLineasArchivo } from "../bd/Data"; // Usa la función que ya tienes

function TablaArchivoTxt() {
  const [filePath, setFilePath] = useState("");
  const [lines, setLines] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLines([]);
    try {
      const data = await obtenerLineasArchivo(filePath);
      console.log("Respuesta del backend:", data);

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

  // Convierte cada línea en array de campos (separados por tabulador o por '<--->')
  const filas = lines.map((line) =>
    line.includes("<--->")
      ? line.split("<--->").map((f) => f.trim())
      : line.split("\t")
  );

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "2rem auto",
        background: "#fff6f6",
        padding: 24,
        borderRadius: 12,
      }}
    >
      <h2>Tabla de contenido de archivo .txt</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
          placeholder="Ruta completa del archivo en el servidor"
          style={{
            width: "80%",
            padding: 8,
            borderRadius: 6,
            border: "1px solid #b71c1c",
          }}
          required
        />
        <button
          type="submit"
          style={{
            marginLeft: 12,
            padding: "8px 16px",
            borderRadius: 6,
            background: "#b71c1c",
            color: "#fff",
            border: "none",
          }}
        >
          Ver archivo
        </button>
      </form>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      {filas.length > 0 && (
        <div
          style={{
            overflowX: "auto",
            background: "#fff",
            borderRadius: 6,
            padding: 16,
            border: "1px solid #eee",
          }}
        >
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
          >
            <tbody>
              {filas.map((cols, idx) => (
                <tr key={idx}>
                  {cols.map((col, cidx) => (
                    <td
                      key={cidx}
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px 8px",
                        background:
                          cidx === 1
                            ? "#e3f2fd"
                            : idx === 0
                            ? "#ffeaea"
                            : "#fff", // Resalta columna 2
                        color:
                          cidx === 1
                            ? "#1565c0"
                            : idx === 0
                            ? "#b71c1c"
                            : "#222",
                        fontWeight: cidx === 1 ? "bold" : "normal",
                      }}
                    >
                      {col}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TablaArchivoTxt;
