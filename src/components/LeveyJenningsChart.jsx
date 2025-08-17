import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function LeveyJenningsChart({ indices, ds }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !indices || Object.keys(indices).length === 0) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const labels = Object.keys(indices);
    const values = Object.values(indices);
    const mean = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "Índice", data: values, borderColor: "#b71c1c", backgroundColor: "#ffeaea", fill: false, tension: 0.2, pointRadius: 4 },
          { label: "Media", data: Array(values.length).fill(mean), borderColor: "#388e3c", borderDash: [5,5], pointRadius: 0, fill: false },
          { label: "+1 DS", data: Array(values.length).fill(mean + ds), borderColor: "#ff9800", borderDash: [2,2], pointRadius: 0, fill: false },
          { label: "-1 DS", data: Array(values.length).fill(mean - ds), borderColor: "#ff9800", borderDash: [2,2], pointRadius: 0, fill: false },
        ],
      },
              options: {
          plugins: { legend: { position: "bottom" } },
          scales: {
            x: { title: { display: true, text: "Fecha" } },
            y: { title: { display: true, text: "Índice" } }
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    // Limpieza al desmontar
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [indices, ds]);

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 24, margin: "2rem 0", boxShadow: "0 0 12px #f5f5f5" }}>
      <canvas ref={chartRef} width={760} height={340} />
    </div>
  );
}

export default LeveyJenningsChart;

