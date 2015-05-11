<?php
/*
    Project Point
*/

# Includes
require("../inc/database.inc.php");
require("../inc/json.inc.php");

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

# send JSON or JSONP results
sendJSON($statement);


?>
