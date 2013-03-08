<?php
/*
    Road Intersection
*/

# Return header
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");

# Includes
require("../inc/database.inc.php");
require("../inc/error_handler.inc.php");

# Time limit and error reporting level
# For debugging set error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
set_time_limit(5);
error_reporting(E_ERROR);

# Retrive URL arguments
$street1 = strtoupper($_REQUEST['street1']);
$street2 = strtoupper($_REQUEST['street2']);
$geometryfield = isset($_REQUEST['geometryfield']) ? $_REQUEST['geometryfield'] : "the_geom";
$srid = isset($_REQUEST['srid']) ? $_REQUEST['srid'] : 4326;

# Perform the query
$sql = "select distinct ST_x(ST_transform(ST_intersection(b." . $geometryfield .", a." . $geometryfield ."), :srid)) as x,
ST_y(ST_transform(ST_intersection(b." . $geometryfield .", a." . $geometryfield ."), :srid)) as y from
(select * from roads where streetname = :street1 ) a,
(select * from roads where streetname = :street2 ) b
where ST_intersects(b." . $geometryfield .", a." . $geometryfield .")";
$db = pgConnection();
$statement=$db->prepare( $sql );
$statement->bindParam(":srid", $srid);
$statement->bindParam(":street1", $street1);
$statement->bindParam(":street2", $street2);
$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);

# send return
$json= json_encode( $result );
echo isset($_GET['callback']) ? "{$_GET['callback']}($json)" : $json;

?>
