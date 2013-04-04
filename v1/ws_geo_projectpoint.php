<?php
/*
    Project Point
*/

# Return header
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");

# Includes
require("../inc/database.inc.php");
require("../inc/error_handler.inc.php");

# Time limit and error reporting level
# For debugging set error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
error_reporting(E_ERROR);
set_time_limit(5);

# Retrive URL arguments
$x = $_REQUEST['x'];
$y = $_REQUEST['y'];
$fromsrid = $_REQUEST['fromsrid'];
$tosrid = isset($_REQUEST['tosrid']) ? $_REQUEST['tosrid'] : 4326;

# Perform the query
$sql = "select ST_x(ST_transform(ST_GeomFromText('POINT(" . $x . " " . $y . ")', " . $fromsrid . "), " . $tosrid . ")) as x,
	ST_y(ST_transform(ST_GeomFromText('POINT(" . $x . " " . $y . ")', " . $fromsrid . "), " . $tosrid . ")) as y";
$db = pgConnection();
$statement=$db->prepare( $sql );
$statement->execute();
$result=$statement->fetchAll(PDO::FETCH_ASSOC);

# send return
$json= json_encode( $result );
echo isset($_GET['callback']) ? "{$_GET['callback']}($json)" : $json;

?>
