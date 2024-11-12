
<?php
 
 
	// connection details for MySQL database

	$cd_host = "localhost";
	$cd_port = 3306;
	$cd_socket = "";

	// database name, username and password

	$cd_dbname = "`company directory`";
	$cd_user = "companydirectory";
	$cd_password = "companydirectory";
	
// Create a connection to the MySQL database
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

// Close the connection
$conn->close();

?>
