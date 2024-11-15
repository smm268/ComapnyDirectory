<?php

$executionStartTime = microtime(true);


include("config.php");

header('Content-Type: application/json; charset=UTF-8');


$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Database unavailable: " . mysqli_connect_error();
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);
    echo json_encode($output);
    exit;
}


if (isset($_POST['id'])) {
    $id = $_POST['id'];
} else {
  
    $output['status']['name'] = "failure";
    $output['status']['description'] = "ID parameter is required";
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Prepare the delete query to remove personnel by ID
$query = $conn->prepare('DELETE FROM personnel WHERE id = ?');
$query->bind_param("i", $id);

if (!$query->execute()) {

    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Query failed: " . $query->error;
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}


$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "Personnel deleted successfully";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

mysqli_close($conn);


echo json_encode($output);
?>
