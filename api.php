<?php
ini_set('max_execution_time', 30);
ini_set('memory_limit', '128M');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

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
$host = "localhost";
$db   = "u330560936_banco_sangre";
$user = "u330560936_banco";
$pass = "41950361Cesar";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($metodo === 'GET') {
        // Leer (listar clientes)
        $pagina = isset($_GET['pagina']) ? (int)$_GET['pagina'] : 1;
        $limite = isset($_GET['limite']) ? (int)$_GET['limite'] : 10;
        $offset = ($pagina - 1) * $limite;
        $busqueda = isset($_GET['busqueda']) ? trim($_GET['busqueda']) : "";

        if ($busqueda !== "") {
            $sqlCount = "SELECT COUNT(*) as total FROM clientes WHERE nombre LIKE ? OR apellido LIKE ?";
            $like = "%$busqueda%";
            $stmtCount = $pdo->prepare($sqlCount);
            $stmtCount->execute([$like, $like]);
        } else {
            $sqlCount = "SELECT COUNT(*) as total FROM clientes";
            $stmtCount = $pdo->prepare($sqlCount);
            $stmtCount->execute();
        }
        $total = $stmtCount->fetch(PDO::FETCH_ASSOC)['total'];

        if ($busqueda !== "") {
            $sql = "SELECT * FROM clientes WHERE nombre LIKE ? OR apellido LIKE ? ORDER BY id DESC LIMIT $limite OFFSET $offset";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$like, $like]);
        } else {
            $sql = "SELECT * FROM clientes ORDER BY id DESC LIMIT $limite OFFSET $offset";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
        }
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'clientes' => $result,
            'total' => $total
        ]);

    } elseif ($metodo === 'POST') {
        // Crear cliente
        $nombre = isset($input["nombre"]) ? trim($input["nombre"]) : '';
        $apellido = isset($input["apellido"]) ? trim($input["apellido"]) : '';

        if ($nombre === '' || $apellido === '') {
            echo json_encode([
                "success" => false,
                "message" => "Nombre y apellido son obligatorios."
            ]);
            exit;
        }

        if (strlen($nombre) > 50 || strlen($apellido) > 50) {
            echo json_encode([
                "success" => false,
                "message" => "Nombre y apellido deben tener menos de 50 caracteres."
            ]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO clientes (nombre, apellido) VALUES (?, ?)");
        $stmt->execute([$nombre, $apellido]);

        echo json_encode([
            "success" => true,
            "message" => "Cliente creado"
        ]);

    } elseif ($metodo === 'PUT') {
        // Actualizar cliente
        $id = isset($input["id"]) ? (int)$input["id"] : 0;
        $nombre = isset($input["nombre"]) ? trim($input["nombre"]) : '';
        $apellido = isset($input["apellido"]) ? trim($input["apellido"]) : '';

        if ($id === 0 || $nombre === '' || $apellido === '') {
            echo json_encode([
                "success" => false,
                "message" => "ID, nombre y apellido son obligatorios."
            ]);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE clientes SET nombre = ?, apellido = ? WHERE id = ?");
        $stmt->execute([$nombre, $apellido, $id]);

        echo json_encode([
            "success" => true,
            "message" => "Cliente actualizado"
        ]);

    } elseif ($metodo === 'DELETE') {
        // Eliminar cliente
        $id = isset($input["id"]) ? (int)$input["id"] : 0;

        if ($id === 0) {
            echo json_encode([
                "success" => false,
                "message" => "ID es obligatorio para eliminar."
            ]);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM clientes WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode([
            "success" => true,
            "message" => "Cliente eliminado"
        ]);

    } else {
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
    }
} catch (PDOException $e) {
    registrar_error($e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Ocurrió un error interno. Intenta más tarde."
    ]);
}
?>
