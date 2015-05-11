<?php
/*
    Road Intersection
*/

# Includes
require("../inc/database.inc.php");
require("../inc/json.inc.php");

# Retrive URL arguments
$street1 = strtoupper($_REQUEST['street1']);
$street2 = strtoupper($_REQUEST['street2']);
$geometryfield = isset($_REQUEST['geometryfield']) ? $_REQUEST['geometryfield'] : "geom";
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

# send JSON or JSONP results
sendJSON($statement);

?>
