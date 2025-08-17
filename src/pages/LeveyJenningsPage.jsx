import React, { useState, useEffect } from "react";
import { obtenerDatosLJ } from "../bd/Data";
import LeveyJenningsUploader from "../components/LeveyJenningsUploader";
import LeveyJenningsSelector from "../components/LeveyJenningsSelector";
import LeveyJenningsChart from "../components/LeveyJenningsChart";

function LeveyJenningsPage() {
  const [folder, setFolder] = useState("");
  const [pruebas, setPruebas] = useState([]);
  const [controles, setControles] = useState([]);
  const [prueba, setPrueba] = useState("");
  const [control, setControl] = useState("");
  const [indices, setIndices] = useState({});
  const [ds, setDs] = useState(null);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");


  // Buscar archivos y pruebas al seleccionar carpeta
  const onBuscar = async () => {
    setError("");
    setPruebas([]);
    setControles([]);
    setPrueba("");
    setControl("");
    setIndices({});
    setDs(null);
    try {
      const data = await obtenerDatosLJ(folder, "", "", fromDate, toDate);
      if (data.error) {
        setError(data.error);
      } else {
        setPruebas(data.pruebas || []);
        setControles(data.controles || []);
      }
    } catch (err) {
      setError("Error de conexión o formato inesperado.");
    }
  };

  
// Buscar controles cuando cambia la prueba o el rango de fechas
useEffect(() => {
  if (folder && prueba) {
    setError("");
    setControles([]);
    setControl("");
    setIndices({});
    setDs(null);
    obtenerDatosLJ(folder, prueba, "", fromDate, toDate).then(data => {
      setControles(data.controles || []);
    });
  }
  // eslint-disable-next-line
}, [prueba, fromDate, toDate]);

  
// Buscar datos cuando cambia el control o el rango de fechas
useEffect(() => {
  if (folder && prueba && control) {
    setError("");
    setIndices({});
    setDs(null);
    obtenerDatosLJ(folder, prueba, control, fromDate, toDate).then(data => {
      setIndices(data.indices || {});
      setDs(data.ds || null);
      if (!data.indices || Object.keys(data.indices).length === 0) {
        setError("No hay datos para graficar.");
      }
    });
  }
  // eslint-disable-next-line
}, [control, fromDate, toDate]);

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
      <h2>Levey-Jennings QC — Banco de Sangre</h2>
      <LeveyJenningsUploader
        folder={folder}
        setFolder={setFolder}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        onBuscar={onBuscar}
      />
      <LeveyJenningsSelector
        pruebas={pruebas}
        controles={controles}
        prueba={prueba}
        control={control}
        onPrueba={setPrueba}
        onControl={setControl}
      />
      {error && <div style={{ color: "red", margin: "12px 0" }}>{error}</div>}
      {Object.keys(indices).length > 0 && (
        <LeveyJenningsChart indices={indices} ds={ds} />
      )}
    </div>
  );
}

export default LeveyJenningsPage;
