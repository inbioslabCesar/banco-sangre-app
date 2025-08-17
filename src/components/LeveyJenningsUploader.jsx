import React from "react";

function LeveyJenningsUploader({ folder, setFolder, fromDate, setFromDate, toDate, setToDate, onBuscar }) {
  return (
    <form onSubmit={e => { e.preventDefault(); onBuscar(); }} style={{
      marginBottom: 24, background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 2px 12px #eee"
    }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ color: "#b71c1c", fontWeight: "bold", marginRight: 8 }}>Carpeta de archivos (.txt):</label>
        <input
          type="text"
          value={folder}
          onChange={e => setFolder(e.target.value)}
          placeholder="Ejemplo: C:/laragon/www/banco-sangre-app/uploads"
          style={{ width: 350, padding: 8, borderRadius: 6, border: "1px solid #b71c1c" }}
          required
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ color: "#b71c1c", fontWeight: "bold", marginRight: 8 }}>Fecha inicio:</label>
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          style={{ marginRight: 24, borderRadius: 6, border: "1px solid #b71c1c", padding: 6 }}
        />
        <label style={{ color: "#b71c1c", fontWeight: "bold", marginRight: 8 }}>Fecha fin:</label>
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          style={{ borderRadius: 6, border: "1px solid #b71c1c", padding: 6 }}
        />
      </div>
      <button type="submit" style={{
        background: "#b71c1c", color: "#fff", border: "none", borderRadius: 8,
        padding: "10px 24px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 2px 8px #e57373"
      }}>
        Buscar archivos
      </button>
      <div style={{ marginTop: 12, fontSize: 13, color: "#b71c1c" }}>
        <b>¿Cómo obtener la ruta?</b> Abre el explorador de archivos, navega hasta la carpeta deseada, haz clic en la barra de dirección, copia la ruta y pégala aquí.
      </div>
    </form>
  );
}

export default LeveyJenningsUploader;
