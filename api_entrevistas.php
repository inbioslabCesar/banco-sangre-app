<?php
ini_set('max_execution_time', 30);
ini_set('memory_limit', '128M');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

$config = require __DIR__ . '/config.php';

// Preflight para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Detectar método simulado por _method
$metodo = $_SERVER['REQUEST_METHOD'];
$input = [];
if ($metodo === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    if (isset($input['_method'])) {
        $metodo = strtoupper($input['_method']);
    }
} elseif (in_array($metodo, ['PUT','DELETE'])) {
    $input = json_decode(file_get_contents("php://input"), true);
}

// Rate limiting simple por IP (solo para POST sin _method)
$ip = $_SERVER['REMOTE_ADDR'];
$limite_segundos = 3;
$archivo_temp = sys_get_temp_dir() . "/rate_limit_" . md5($ip);
if ($metodo === 'POST' && (!isset($input['_method']) || $input['_method'] !== 'PUT')) {
    if (file_exists($archivo_temp)) {
        $ultimo_acceso = (int)file_get_contents($archivo_temp);
        if (time() - $ultimo_acceso < $limite_segundos) {
            http_response_code(429);
            echo json_encode([
                "success" => false,
                "message" => "Demasiadas peticiones. Intenta de nuevo en unos segundos."
            ]);
            exit;
        }
    }
    file_put_contents($archivo_temp, time());
}

// Función para registrar errores en un archivo log
function registrar_error($mensaje) {
    $archivo_log = __DIR__ . '/errores.log';
    $fecha = date('Y-m-d H:i:s');
    file_put_contents($archivo_log, "[$fecha] $mensaje\n", FILE_APPEND);
}

// Configuración de la base de datos
$host = $config['host'];
$db   = $config['db'];
$user = $config['user'];
$pass = $config['pass'];

// Aquí puedes continuar con el bloque try/catch y la lógica CRUD para la tabla entrevistas
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // Obtener entrevista por cliente_id
    if ($metodo === 'GET' && isset($_GET['cliente_id'])) {
        $cliente_id = intval($_GET['cliente_id']);
        $stmt = $pdo->prepare("SELECT * FROM entrevistas WHERE cliente_id = :cliente_id LIMIT 1");
        $stmt->execute([':cliente_id' => $cliente_id]);
        $entrevista = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($entrevista) {
            echo json_encode(["success" => true, "entrevista" => $entrevista]);
        } else {
            echo json_encode(["success" => true, "entrevista" => null]);
        }
        exit;
    }

    // Insertar nueva entrevista
    if ($metodo === 'POST') {
        // Validación básica de campos requeridos
        if (
            empty($input['cliente_id']) ||
            empty($input['fecha']) ||
            empty($input['entrevistador'])
        ) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Faltan campos obligatorios"]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO entrevistas (cliente_id, fecha, entrevistador, salud, viajes, observaciones)
            VALUES (:cliente_id, :fecha, :entrevistador, :salud, :viajes, :observaciones)");
        $stmt->execute([
            ':cliente_id'    => $input['cliente_id'],
            ':fecha'         => $input['fecha'],
            ':entrevistador' => $input['entrevistador'],
            ':salud'         => $input['salud'] ?? null,
            ':viajes'        => $input['viajes'] ?? null,
            ':observaciones' => $input['observaciones'] ?? null
        ]);

        echo json_encode(["success" => true, "message" => "Entrevista guardada correctamente"]);
        exit;
    }

    // Actualizar entrevista existente
    if ($metodo === 'PUT') {
        if (empty($input['id'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Falta el ID de la entrevista"]);
            exit;
        }
        $stmt = $pdo->prepare("UPDATE entrevistas SET fecha = :fecha, entrevistador = :entrevistador, salud = :salud, viajes = :viajes, observaciones = :observaciones WHERE id = :id");
        $stmt->execute([
            ':fecha' => $input['fecha'],
            ':entrevistador' => $input['entrevistador'],
            ':salud' => $input['salud'],
            ':viajes' => $input['viajes'],
            ':observaciones' => $input['observaciones'],
            ':id' => $input['id']
        ]);
        echo json_encode(["success" => true, "message" => "Entrevista actualizada correctamente"]);
        exit;
    }

} catch (Exception $e) {
    registrar_error($e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error interno del servidor"]);
    exit;
}
