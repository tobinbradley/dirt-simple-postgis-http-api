<?php
/*
    Point Overlay
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
$srid = $_REQUEST['srid'];
$table = $_REQUEST['table'];
$geometryfield = isset($_REQUEST['geometryfield']) ? $_REQUEST['geometryfield'] : "the_geom";
$geometrysrid = isset($_REQUEST['geometrysrid']) ? $_REQUEST['geometrysrid'] : 2264;
$fields = isset($_REQUEST['fields']) ? $_REQUEST['fields'] : "*";
$parameters = isset($_REQUEST['parameters']) ? " and " . $_REQUEST['parameters'] : "";
$limit = isset($_REQUEST['limit']) ? " limit " . $_REQUEST['limit'] : '';

# Perform the query
$sql = "SELECT " . $fields ." FROM " . $table ." a WHERE
	st_within(ST_transform(ST_GeometryFromText('POINT(" . $x . " " . $y .  ")', " . $srid . ")," . $geometrysrid . "),a." . $geometryfield . ") " . $parameters . $limit;
$db = pgConnection();
$statement=$db->prepare( $sql );
$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);

# send return
$json= json_encode( $result );
echo isset($_GET['callback']) ? "{$_GET['callback']}($json)" : $json;

?>
