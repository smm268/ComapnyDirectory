<?php

$executionStartTime = microtime(true);
include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Database unavailable: " . mysqli_connect_error();
    echo json_encode($output);
    exit;
}

$id = $_POST['id'];

$query = $conn->prepare('DELETE FROM location WHERE id = ?');
$query->bind_param("i", $id);

if (!$query->execute()) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Query failed: " . $query->error;
    echo json_encode($output);
    exit;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "Location deleted successfully";
echo json_encode($output);

$conn->close();
?>
