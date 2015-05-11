<?php
	/*
		Fling JSON or JSONP back at the client.
	*/

	# Return header
	header('content-type: application/json; charset=utf-8');
	header("access-control-allow-origin: *");

	function sendJSON($statement) {
		if($statement->errorCode() == 0) {
		    $result=$statement->fetchAll(PDO::FETCH_ASSOC);
		    $json= json_encode( $result );
		} else {
		    $errors = $statement->errorInfo();
		    $json = json_encode(array( 'error' => $errors[2]) );
		}
		echo isset($_GET['callback']) ? "{$_GET['callback']}($json)" : $json;
	}

?>
