<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();

$data = json_decode(file_get_contents('php://input'), true);
$dir = isset($data['folder']) ? $data['folder'] : (__DIR__ . '/uploads');
$prueba_seleccionada = isset($data['prueba']) ? $data['prueba'] : '';
$control_seleccionado = isset($data['control']) ? $data['control'] : '';
$fromDate = isset($data['fromDate']) ? $data['fromDate'] : '';
$toDate = isset($data['toDate']) ? $data['toDate'] : '';

function extraer_nombre_base($nombre_prueba) {
    return preg_replace('/[-_]\d.*/', '', $nombre_prueba);
}

$files = glob($dir . '/*.txt');
$pruebas_map = [];
$archivos_filtrados = 0;
$datos_filtrados = 0;

foreach ($files as $file) {
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $test_name = isset($lines[1]) ? trim($lines[1]) : 'Sin nombre';
    $nombre_base = extraer_nombre_base($test_name);
    $cols = explode("\t", $lines[0]);
    $fechaCompleta = isset($cols[1]) ? trim($cols[1]) : '';
    $soloFecha = explode(',', $fechaCompleta)[0];

    $timestamp = strtotime($soloFecha);
    if ($fromDate && $timestamp < strtotime($fromDate)) continue;
    if ($toDate && $timestamp > strtotime($toDate)) continue;

    $pruebas_map[$nombre_base][] = [
        'file' => basename($file),
        'fecha' => $soloFecha,
        'nombre_original' => $test_name
    ];
    $archivos_filtrados++;
}

$pruebas = array_keys($pruebas_map);
$controles_disponibles = [];
$indices_por_fecha = [];

if ($prueba_seleccionada && isset($pruebas_map[$prueba_seleccionada]) && is_array($pruebas_map[$prueba_seleccionada])) {
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
                        if (count($valores) === 2 && is_numeric($valores[1])) {
                            $index = $valores[1];
                            $indices_por_fecha[$fecha] = round($index, 3);
                            $datos_filtrados++;
                            break 2;
                        }
                    }
                }
            }
        }
        ksort($indices_por_fecha);
    }
}

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

echo json_encode([
    'pruebas' => $pruebas,
    'controles' => array_keys($controles_disponibles),
    'indices' => $indices_por_fecha,
    'ds' => $ds,
    'archivosFiltrados' => $archivos_filtrados,
    'datosFiltrados' => $datos_filtrados
]);
