<?php

    // Example use from browser: http://localhost/companydirectory/libs/php/getPersonnelByID.php?id=<id>

    $executionStartTime = microtime(true);

    include("config.php");

    header('Content-Type: application/json; charset=UTF-8');

    // Establish database connection
    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    // Check for database connection errors
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

    // Check if the 'id' is provided in the query string
    if (isset($_GET['id'])) {
        $id = $_GET['id'];  
    } else {
        // Return an error if 'id' is missing
        $output['status']['code'] = "400";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "ID parameter is required";
        $output['data'] = [];
        echo json_encode($output);
        exit;
    }

    // Prepare the query to fetch personnel by ID
    $query = $conn->prepare('SELECT `id`, `firstName`, `lastName`, `email`, `jobTitle`, `departmentID` FROM `personnel` WHERE `id` = ?');
    $query->bind_param("i", $id);

    if (!$query->execute()) {
        // Handle query execution failure
        $output['status']['code'] = "400";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "Query failed: " . $query->error;
        $output['data'] = [];
        mysqli_close($conn);
        echo json_encode($output);
        exit;
    }

    // Get the result of the personnel query
    $result = $query->get_result();
    $personnel = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $personnel[] = $row;
    }

    // Fetch the departments (this query does not need parameters)
    $query = 'SELECT id, name FROM department ORDER BY name';
    $result = $conn->query($query);

    if (!$result) {
        // Handle department query failure
        $output['status']['code'] = "400";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "Query failed: " . $conn->error;
        $output['data'] = [];
        mysqli_close($conn);
        echo json_encode($output);
        exit;
    }

    // Get the result of the department query
    $department = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $department[] = $row;
    }

    // Prepare the output data
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data']['personnel'] = $personnel;
    $output['data']['department'] = $department;

    // Close the database connection
    mysqli_close($conn);

    // Return the JSON response
    echo json_encode($output);

?>
