<?php
include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_error) {
    echo json_encode(["status" => ["code" => "300", "name" => "failure", "description" => "Database unavailable"]]);
    exit;
}
error_log("Received data: " . print_r($_POST, true));

if (empty($_POST['id']) || empty($_POST['firstName']) || empty($_POST['lastName']) || empty($_POST['jobTitle']) || empty($_POST['email']) || empty($_POST['departmentID'])) {
    echo json_encode([
        "status" => [
            "code" => "400",
            "name" => "failure",
            "description" => "Missing required POST data"
        ]
    ]);
    exit;
}


$id = intval($_POST['id']);
$firstName = trim($_POST['firstName']);
$lastName = trim($_POST['lastName']);
$jobTitle = trim($_POST['jobTitle']);
$email = trim($_POST['email']);
$departmentID = intval($_POST['departmentID']);

// Debug print to check received data
error_log("Received data - ID: $id, First Name: $firstName, Last Name: $lastName, Job Title: $jobTitle, Email: $email, Department ID: $departmentID");

$query = $conn->prepare("UPDATE personnel SET firstName = ?, lastName = ?, jobTitle = ?, email = ?, departmentID = ? WHERE id = ?");
$query->bind_param("ssssii", $firstName, $lastName, $jobTitle, $email, $departmentID, $id);

if ($query->execute()) {
    echo json_encode(["status" => ["code" => "200", "name" => "success", "description" => "Personnel updated successfully"]]);
} else {
    error_log("MySQL error: " . $conn->error); 
    echo json_encode(["status" => ["code" => "400", "name" => "failure", "description" => "Failed to update personnel"]]);
}


$conn->close();
?>
