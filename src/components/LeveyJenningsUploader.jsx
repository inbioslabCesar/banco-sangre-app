import React from "react";

function LeveyJenningsUploader({ folder, setFolder, onBuscar }) {
  // Función para abrir el explorador de archivos (solo para copiar la ruta manualmente)
  const abrirExplorador = () => {
    window.open("file:///", "_blank"); // Esto abre el explorador de archivos en Windows
  };

  return (
    <form onSubmit={e => { e.preventDefault(); onBuscar(); }} style={{ marginBottom: 20 }}>
      <label style={{ marginRight: 8 }}>Carpeta de archivos (.txt):</label>
      <input
        type="text"
        value={folder}
        onChange={e => setFolder(e.target.value)}
        placeholder="Ejemplo: C:/laragon/www/banco-sangre-app/uploads"
        style={{ width: 350, padding: 8, borderRadius: 6, border: "1px solid #b71c1c" }}
        required
      />
      <button type="button" onClick={abrirExplorador} style={{ marginLeft: 8, padding: "8px 12px", borderRadius: 6, background: "#e57373", color: "#fff", border: "none" }}>
        Abrir carpeta
      </button>
      <button type="submit" style={{ marginLeft: 12, padding: "8px 16px", borderRadius: 6, background: "#b71c1c", color: "#fff", border: "none" }}>
        Buscar archivos
      </button>
      <div style={{ marginTop: 8, fontSize: 13, color: "#b71c1c" }}>
  <b>¿Cómo obtener la ruta?</b> <br />
  1. Abre el explorador de archivos de tu PC.<br />
  2. Navega hasta la carpeta donde están los archivos .txt.<br />
  3. Haz clic en la barra de dirección, copia la ruta completa.<br />
  4. Pega la ruta aquí en el campo de texto.<br />
  <i>Ejemplo: C:/laragon/www/banco-sangre-app/uploads</i>
</div>
    </form>
  );
}

export default LeveyJenningsUploader;
