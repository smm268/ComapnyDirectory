<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$executionStartTime = microtime(true);


include("config.php");

header('Content-Type: application/json; charset=UTF-8');


$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);


if ($conn->connect_errno) {
    // If connection fails, return a failure response
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    // Output JSON response and terminate the script
    echo json_encode($output);
    exit;
}

// Prepare the SQL query using a prepared statement
$query = $conn->prepare('
    SELECT p.lastName, p.firstName, p.jobTitle, p.email, 
           d.name as department, l.name as location 
    FROM personnel p 
    LEFT JOIN department d ON (d.id = p.departmentID) 
    LEFT JOIN location l ON (l.id = d.locationID) 
    ORDER BY p.lastName, p.firstName, d.name, l.name
');

// Check if the query preparation failed
if (!$query) {
    $output['status']['code'] = "500"; // Internal server error
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Failed to prepare the SQL query: " . $conn->error;
    $output['data'] = [];

    // Output JSON response and terminate the script
    echo json_encode($output);
    exit;
}


$query->execute();

$result = $query->get_result();

if (!$result) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "Query execution failed: " . $query->error;
    $output['data'] = [];

    
    echo json_encode($output);
    exit;
}


$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row; 
}

$output['status']['code'] = "200";
$output['status']['name'] = "success";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

// Close the database connection
$conn->close();

// Output the final JSON response
echo json_encode($output);

?>
