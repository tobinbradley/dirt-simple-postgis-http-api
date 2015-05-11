<?php
/*
    Get Centroid
*/

# Includes
require("../inc/database.inc.php");
require("../inc/json.inc.php");

# Retrive URL arguments
$table = $_REQUEST['table'];
$srid = isset($_REQUEST['srid']) ? $_REQUEST['srid'] : 4326;
$geometryfield = isset($_REQUEST['geometryfield']) ? $_REQUEST['geometryfield'] : "geom";
$parameters = isset($_REQUEST['parameters']) ? " where " . $_REQUEST['parameters'] : "";
$geofunction = isset($_REQUEST['forceonsurface']) ? 'ST_PointOnSurface' : 'ST_centroid';


# Performs the query and returns XML or JSON
$sql = "select ST_x(ST_transform(" . $geofunction . "(" . $geometryfield . "), " . $srid . ")) as x, ST_y(ST_transform(" . $geofunction . "(" . $geometryfield . "), " . $srid . ")) as y from " . $table . $parameters ;
$db = pgConnection();
$statement=$db->prepare( $sql );
$statement->execute();

# send JSON or JSONP results
sendJSON($statement);

?>
