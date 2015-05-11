<?php
/*
    Get extent of feature(s)
*/

# Includes
require("../inc/database.inc.php");
require("../inc/json.inc.php");

# Retrive URL arguments
$table = $_REQUEST['table'];
$geometryfield = isset($_REQUEST['geometryfield']) ? $_REQUEST['geometryfield'] : "geom";
$srid = isset($_REQUEST['srid']) ? $_REQUEST['srid'] : 4326;
$parameters = isset($_REQUEST['parameters']) ? " where " . $_REQUEST['parameters'] : "";

# Perform the query
$sql = "select ST_extent(ST_transform(" . $geometryfield .", " . $srid . ")) as extent from " . $table . $parameters ;
$db = pgConnection();
$statement=$db->prepare( $sql );
$statement->execute();

# send JSON or JSONP results
sendJSON($statement);

?>
