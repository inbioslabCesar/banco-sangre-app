---INCIO DEL PROYECTO BANCO DE SANGRE 06/07/2025---
src/
│
├── components/      # Aquí van todos tus componentes reutilizables
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── ...otros componentes
│
├── pages/           # (Opcional) Vistas principales o páginas completas
│   ├── Home.jsx
│   ├── Donantes.jsx
│   └── ...otras páginas
│
├── assets/          # Imágenes, íconos, logos, etc.
│
├── App.jsx          # Componente principal
├── main.jsx         # Punto de entrada
└── index.css        # Estilos globales (Tailwind)


// src/config/config.js
export const BASE_URL = "https://darkcyan-gnu-615778.hostingersite.com/"; // Cambia esto según tu dominio real

// src/config/config.js
export const BASE_URL = "http://localhost/banco-sangre-app/";
 // Cambia esto según tu dominio real


<?php
return [
    'host' => 'localhost',
    'db'   => 'banco-sangre',
    'user' => 'root',
    'pass' => ''
]


borrar en cascada
ALTER TABLE entrevistas
DROP FOREIGN KEY entrevistas_ibfk_1,
ADD CONSTRAINT entrevistas_cliente_id_foreign
FOREIGN KEY (cliente_id) REFERENCES clientes(id)
ON DELETE CASCADE;


HIV 1,2: CutOff= (NC1 + 0.120)
HBSAG: CutOff= (0.105)
ANTI-HBC: CutOff= (NC1 × 0.5)
HTLV I,II y SÍFILIS: CutOff= (NC1 + 0.180) 
ANTI-HCV: CutOff= (NC1 + 0.120)
INDEX = (Meas. Value / CutOff)
EN EL CASO DEL CHAGAS ESTA BIEN LA FORMULA NO CAMBIAR TIENE
UNA FORMA ESPECIAL PARA HACER EL CALCULO
¿Qué significa esto?El sistema debe poder asociar cada 
prueba a su fórmula de CutOff y aplicar la fórmula correcta 
automáticamente al calcular el índice.¿Cómo lo implementamos?
Podemos crear un arreglo PHP donde se define la fórmula para 
cada prueba, y el sistema la aplica según la prueba seleccionada.
¿Quieres que te ayude a estructurar ese arreglo y el código 
para que aplique la fórmula adecuada automáticamente según 
la prueba?, te paso el codigo completo por partes ver_columnas.php

¡Excelente trabajo, Cesar! Gracias a este recorrido, hemos confirmado que los valores numéricos que necesitas (por ejemplo, para Meas. Value y CutOff) aparecen juntos en una sola columna (por ejemplo: "3.363 27.490"). Esto indica que el archivo no separa cada valor en columnas individuales, sino que varios datos vienen en una misma celda.

Para extraer correctamente "Meas. Value" y "CutOff", debemos dividir esa celda usando un espacio como separador. ¿Te gustaría que te entregue el código actualizado para detectar estos controles, separar los valores y calcular el índice correctamente?


C:/laragon/www/banco-sangre-app/uploads/220219175048.txt


16-08-2025

 Estructura de Archivos Levey-Jennings
Copy
banco-sangre-app/
│
├── api_levey_jennings.php         # Backend PHP: procesa los archivos .txt y responde con datos para el gráfico
│
├── src/
│   ├── bd/
│   │   └── Data.jsx               # Funciones para consumir el backend desde React
│   │
│   ├── components/
│   │   ├── LeveyJenningsChart.jsx     # Componente para mostrar el gráfico Levey-Jennings (Chart.js)
│   │   ├── LeveyJenningsSelector.jsx  # Selector de prueba/control
│   │   └── LeveyJenningsUploader.jsx  # Componente para seleccionar/cambiar la carpeta de archivos .txt
│   │
│   ├── pages/
│   │   └── LeveyJenningsPage.jsx      # Página principal del flujo Levey-Jennings (integra selector, uploader y gráfico)
│   │
│   └── App.jsx                    # Enrutador principal; renderiza LeveyJenningsPage.jsx
│
├── uploads/                       # Carpeta donde el usuario coloca los archivos .txt del equipo ELISA
│
└── README.md                      # Documentación del proyecto
🔄 Flujo de funcionamiento
LeveyJenningsUploader.jsx
El usuario selecciona o escribe la carpeta donde están los archivos .txt.

LeveyJenningsSelector.jsx
El usuario elige la prueba y el control de entre los disponibles en los archivos de la carpeta seleccionada.

LeveyJenningsChart.jsx
Se muestra el gráfico Levey-Jennings con los datos filtrados.

LeveyJenningsPage.jsx
Orquesta el flujo: recibe la carpeta, consulta el backend, y pasa los datos a los componentes hijo.

api_levey_jennings.php
Recibe la ruta de la carpeta, procesa los archivos .txt y responde en JSON con pruebas, controles y datos para graficar.

⚙️ Notas
La carpeta de archivos .txt es configurable por el usuario.
Todo el procesamiento pesado (filtrado, agrupado, extracción de fechas y controles) se realiza en el backend.
El frontend React es responsable de la experiencia de usuario, selectores y visualización.