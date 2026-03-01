<?php
require_once("../config/database.php");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Acceso no permitido");
}

$pdo->beginTransaction();

try {

$stmt = $pdo->prepare("
INSERT INTO casos 
(delito, hay_indiciado, hay_victimas, cantidad_victimas, tipo_actuacion)
VALUES (?, ?, ?, ?, ?)
");

$stmt->execute([
$_POST['delito'],
$_POST['hay_indiciado'],
$_POST['hay_victimas'],
$_POST['cantidad_victimas'] ?? 0,
$_POST['tipo_actuacion']
]);

$caso_id = $pdo->lastInsertId();

if ($_POST['hay_indiciado'] === "si") {
    $stmt2 = $pdo->prepare("INSERT INTO indiciados (caso_id, nombre_completo) VALUES (?, ?)");
    $stmt2->execute([$caso_id, $_POST['nombre_indiciado']]);
}

if ($_POST['hay_victimas'] === "si" && !empty($_POST['victimas'])) {
    foreach ($_POST['victimas'] as $victima) {
        $stmt3 = $pdo->prepare("INSERT INTO victimas (caso_id, nombre_completo) VALUES (?, ?)");
        $stmt3->execute([$caso_id, $victima]);
    }
}

$pdo->commit();

echo "Caso guardado correctamente.";

} catch (Exception $e) {
$pdo->rollBack();
echo "Error al guardar.";
}