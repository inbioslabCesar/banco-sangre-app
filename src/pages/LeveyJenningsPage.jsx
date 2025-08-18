import React, { useState, useEffect } from "react";
import { obtenerDatosLJ } from "../bd/Data";
import LeveyJenningsUploader from "../components/LeveyJenningsUploader";
import LeveyJenningsSelector from "../components/LeveyJenningsSelector";
import LeveyJenningsChart from "../components/LeveyJenningsChart";

function LeveyJenningsPage() {
  const [folder, setFolder] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [pruebas, setPruebas] = useState([]);
  const [controles, setControles] = useState([]);
  const [prueba, setPrueba] = useState("");
  const [control, setControl] = useState("");
  const [indices, setIndices] = useState({});
  const [ds, setDs] = useState(null);
  const [archivosFiltrados, setArchivosFiltrados] = useState(0);
  const [datosFiltrados, setDatosFiltrados] = useState(0);
  const [error, setError] = useState("");

  // Buscar archivos y pruebas al seleccionar carpeta o fechas
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
        setArchivosFiltrados(data.archivosFiltrados || 0);
        setDatosFiltrados(data.datosFiltrados || 0);
      }
    } catch (err) {
      setError("Error de conexión o formato inesperado.");
    }
  };

  // Buscar controles cuando cambia la prueba
  useEffect(() => {
    if (folder && prueba) {
      setError("");
      setControles([]);
      setControl("");
      setIndices({});
      setDs(null);
      obtenerDatosLJ(folder, prueba, "", fromDate, toDate).then(data => {
        setControles(data.controles || []);
        setArchivosFiltrados(data.archivosFiltrados || 0);
        setDatosFiltrados(data.datosFiltrados || 0);
      });
    }
    // eslint-disable-next-line
  }, [prueba, fromDate, toDate]);

  // Buscar datos cuando cambia el control
  useEffect(() => {
    if (folder && prueba && control) {
      setError("");
      setIndices({});
      setDs(null);
      obtenerDatosLJ(folder, prueba, control, fromDate, toDate).then(data => {
        setIndices(data.indices || {});
        setDs(data.ds || null);
        setArchivosFiltrados(data.archivosFiltrados || 0);
        setDatosFiltrados(data.datosFiltrados || 0);
        if (!data.indices || Object.keys(data.indices).length === 0) {
          setError("No hay datos para graficar.");
        }
      });
    }
    // eslint-disable-next-line
  }, [control, fromDate, toDate]);

  return (
  <div style={{
    maxWidth: 900,
    margin: "2rem auto",
    background: "#fff6f6",
    padding: 32,
    borderRadius: 18,
    boxShadow: "0 4px 24px #e57373",
    fontFamily: "Arial, sans-serif"
  }}>
    <h2 style={{
      color: "#b71c1c",
      marginBottom: 24,
      letterSpacing: "1px",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "2.1rem"
    }}>
      Levey-Jennings QC — Banco de Sangre
    </h2>
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
    {(archivosFiltrados > 0 || datosFiltrados > 0) && (
      <div style={{
        margin: "18px 0",
        background: "#ffeaea",
        border: "1px solid #b71c1c",
        borderRadius: 10,
        padding: "14px 20px",
        color: "#b71c1c",
        fontWeight: "bold",
        fontSize: "1.15rem",
        boxShadow: "0 2px 8px #f8bbd0"
      }}>
        <span>Archivos encontrados: <b>{archivosFiltrados}</b></span><br />
        <span>Datos encontrados: <b>{datosFiltrados}</b></span>
      </div>
    )}
    {error && <div style={{
      color: "#fff",
      background: "#b71c1c",
      padding: "10px 18px",
      borderRadius: 8,
      margin: "14px 0",
      fontWeight: "bold"
    }}>{error}</div>}
    {Object.keys(indices).length > 0 && (
      <div style={{
        marginTop: 24,
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 2px 12px #e57373",
        padding: 24
      }}>
        <LeveyJenningsChart indices={indices} ds={ds} />
      </div>
    )}
  </div>
);
}

export default LeveyJenningsPage;
