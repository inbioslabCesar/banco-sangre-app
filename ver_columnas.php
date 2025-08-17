<?php
$dir = __DIR__ . '/uploads';
$files = glob($dir . '/*.txt');
$pruebas_map = []; // nombre_base => [ [file, fecha, nombre_original], ... ]

function extraer_nombre_base($nombre_prueba) {
    // Extrae solo el nombre base antes del primer guion o número (ajusta según tus nombres)
    return preg_replace('/[-_]\d.*/', '', $nombre_prueba);
}
?>
<?php
// Indexar archivos por nombre base de prueba y fecha
foreach ($files as $file) {
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $test_name = isset($lines[1]) ? trim($lines[1]) : 'Sin nombre';
    $nombre_base = extraer_nombre_base($test_name);
    preg_match('/(\d{4}-\d{2}-\d{2}),(\d{2}:\d{2}:\d{2})/', $lines[0], $matches);
    $fecha = isset($matches[1]) ? $matches[1] : 'Sin fecha';
    $pruebas_map[$nombre_base][] = [
        'file' => basename($file),
        'fecha' => $fecha,
        'nombre_original' => $test_name
    ];
}

$pruebas = array_keys($pruebas_map);

$controles_disponibles = [];
$indices_por_fecha = [];
$control_seleccionado = $_POST['control'] ?? '';
$prueba_seleccionada = $_POST['prueba'] ?? '';
?>
<?php
if ($prueba_seleccionada && isset($pruebas_map[$prueba_seleccionada]) && is_array($pruebas_map[$prueba_seleccionada])) {
    // Buscar todos los controles disponibles en todos los archivos de la prueba seleccionada
    foreach ($pruebas_map[$prueba_seleccionada] as $info) {
        $file = $dir . '/' . $info['file'];
        $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $fields = explode('<--->', $line);
            $fields = array_map('trim', $fields);
            if (isset($fields[0]) && in_array($fields[0], ['BL', 'NC1', 'PC1', 'PC2', 'PC3'])) {
                $controles_disponibles[$fields[0]] = true;
            }
        }
    }
    ksort($controles_disponibles);

    // Si hay control seleccionado, recolectar índices de todos los archivos (ordenados por fecha)
    if ($control_seleccionado) {
        foreach ($pruebas_map[$prueba_seleccionada] as $info) {
            $file = $dir . '/' . $info['file'];
            $fecha = $info['fecha'];
            $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

            foreach ($lines as $line) {
                $fields = explode('<--->', $line);
                $fields = array_map('trim', $fields);
                if (isset($fields[0]) && $fields[0] == $control_seleccionado) {
                    foreach ($fields as $field) {
                        $valores = preg_split('/\s+/', trim($field));
                        // Tomamos directamente el índice como $valores[1]
                        if (count($valores) === 2 && is_numeric($valores[1])) {
                            $index = $valores[1];
                            $indices_por_fecha[$fecha] = round($index, 3);
                            break 2;
                        }
                    }
                }
            }
        }
        ksort($indices_por_fecha); // Ordenar por fecha
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Levey-Jennings por control y prueba</title>
    <style>
        body { font-family: Arial, sans-serif; }
        canvas { max-width: 400px; max-height: 250px; }
        .ds-info { margin: 10px 0; color: #2a7; font-weight: bold; }
    </style>
</head>
<body>
    <h2>Levey-Jennings: Selecciona prueba y control</h2>
    <form method="post">
        <label>Prueba:</label>
        <select name="prueba" onchange="this.form.submit()">
            <option value="">-- Selecciona --</option>
            <?php foreach($pruebas as $p): ?>
            <option value="<?= htmlspecialchars($p) ?>" <?= ($prueba_seleccionada == $p) ? 'selected' : '' ?>>
                <?= htmlspecialchars($p) ?>
            </option>
            <?php endforeach; ?>
        </select>
        <noscript><button type="submit">Ver controles</button></noscript>
    </form>

    <?php if ($prueba_seleccionada && !empty($controles_disponibles)): ?>
    <form method="post">
        <input type="hidden" name="prueba" value="<?= htmlspecialchars($prueba_seleccionada) ?>">
        <label>Control:</label>
        <select name="control" onchange="this.form.submit()">
            <option value="">-- Selecciona --</option>
            <?php foreach(array_keys($controles_disponibles) as $ctrl): ?>
            <option value="<?= htmlspecialchars($ctrl) ?>" <?= ($control_seleccionado == $ctrl) ? 'selected' : '' ?>>
                <?= htmlspecialchars($ctrl) ?>
            </option>
            <?php endforeach; ?>
        </select>
        <noscript><button type="submit">Ver gráfico</button></noscript>
    </form>
    <?php endif; ?>

    <?php
    // Cálculo de DS (Desviación estándar)
    function calcularDS($arr) {
        $arr = array_filter($arr, fn($v) => is_numeric($v));
        $n = count($arr);
        if ($n <= 1) return 0;
        $mean = array_sum($arr) / $n;
        $sum = 0;
        foreach ($arr as $v) { $sum += pow($v - $mean, 2); }
        return round(sqrt($sum / ($n - 1)), 3);
    }
    $ds = ($control_seleccionado && !empty($indices_por_fecha)) ? calcularDS(array_values($indices_por_fecha)) : null;
    ?>

    <?php if ($control_seleccionado && !empty($indices_por_fecha)): ?>
        <div class="ds-info">Desviación estándar (DS): <?= $ds ?></div>
        <h3>Gráfico LJ - <?= htmlspecialchars($prueba_seleccionada) ?> (<?= htmlspecialchars($control_seleccionado) ?>)</h3>
        <canvas id="ljChart" width="400" height="250"></canvas>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
        const labels = <?= json_encode(array_keys($indices_por_fecha)) ?>;
        const data = <?= json_encode(array_values($indices_por_fecha)) ?>;
        const mean = <?= count($indices_por_fecha) ? round(array_sum($indices_por_fecha)/count($indices_por_fecha),3) : 0 ?>;
        const ds = <?= json_encode($ds) ?>;
        new Chart(document.getElementById('ljChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Índice',
                    data: data,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0,0,255,0.1)',
                    fill: false,
                    tension: 0.2,
                    pointRadius: 4
                },
                {
                    label: 'Media',
                    data: Array(data.length).fill(mean),
                    borderColor: 'green',
                    borderDash: [5,5],
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: '+1 DS',
                    data: Array(data.length).fill(Number(mean)+Number(ds)),
                    borderColor: 'orange',
                    borderDash: [2,2],
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: '-1 DS',
                    data: Array(data.length).fill(Number(mean)-Number(ds)),
                    borderColor: 'orange',
                    borderDash: [2,2],
                    pointRadius: 0,
                    fill: false
                }]
            },
            options: {
                plugins: { legend: { position: 'bottom' } },
                scales: {
                    x: { title: { display: true, text: 'Fecha' } },
                    y: { title: { display: true, text: 'Índice' } }
                }
            }
        });
        </script>
    <?php endif; ?>
</body>
</html>
