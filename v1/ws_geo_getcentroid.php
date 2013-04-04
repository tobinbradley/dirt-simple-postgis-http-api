<?php
/*
    Get Centroid
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
$table = $_REQUEST['table'];
$srid = isset($_REQUEST['srid']) ? $_REQUEST['srid'] : 4326;
$geometryfield = isset($_REQUEST['geometryfield']) ? $_REQUEST['geometryfield'] : "the_geom";
$parameters = isset($_REQUEST['parameters']) ? " where " . $_REQUEST['parameters'] : "";
$geofunction = isset($_REQUEST['forceonsurface']) ? 'ST_PointOnSurface' : 'ST_centroid';


# Performs the query and returns XML or JSON
$sql = "select ST_x(ST_transform(" . $geofunction . "(" . $geometryfield . "), " . $srid . ")) as x, ST_y(ST_transform(" . $geofunction . "(" . $geometryfield . "), " . $srid . ")) as y from " . $table . $parameters ;
$db = pgConnection();
$statement=$db->prepare( $sql );
$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);

# send return
$json= json_encode( $result );
echo isset($_GET['callback']) ? "{$_GET['callback']}($json)" : $json;

?>
