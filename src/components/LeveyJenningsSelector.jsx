import React from "react";

function LeveyJenningsSelector({ pruebas, controles, prueba, control, onPrueba, onControl }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ marginRight: 8 }}>Prueba:</label>
      <select value={prueba} onChange={e => onPrueba(e.target.value)}>
        <option value="">-- Selecciona --</option>
        {pruebas.map((p, i) => <option key={i} value={p}>{p}</option>)}
      </select>
      <label style={{ margin: "0 8px 0 24px" }}>Control:</label>
      <select value={control} onChange={e => onControl(e.target.value)}>
        <option value="">-- Selecciona --</option>
        {controles.map((c, i) => <option key={i} value={c}>{c}</option>)}
      </select>
    </div>
  );
}
export default LeveyJenningsSelector;
