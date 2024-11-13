
<?php
 
	// connection details for MySQL database

	$cd_host = "127.0.0.1";
	$cd_port = 3306;
	$cd_socket = "";

	// database name, username and password

	$cd_dbname = "companydirectory";
	$cd_user = "companydirectory";
	$cd_password = "companydirectory";
	
// Create a connection to the MySQL database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check connection
if ($conn->connect_error) {
    
    $output = [
        'status' => [
            'code' => 300,
            'name' => 'failure',
            'description' => 'Database connection failed: ' . $conn->connect_error
        ],
        'data' => []
    ];
    echo json_encode($output);
    exit;
}


// Close the connection
$conn->close();

?>
