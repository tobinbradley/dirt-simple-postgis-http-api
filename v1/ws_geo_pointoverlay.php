<?php
/*
    Point Overlay
*/

# Includes
require("../inc/database.inc.php");
require("../inc/json.inc.php");

# Retrive URL arguments
$x = $_REQUEST['x'];
$y = $_REQUEST['y'];
$srid = $_REQUEST['srid'];
$table = $_REQUEST['table'];
$geometryfield = isset($_REQUEST['geometryfield']) ? $_REQUEST['geometryfield'] : "geom";
$fields = isset($_REQUEST['fields']) ? $_REQUEST['fields'] : "*";
$parameters = isset($_REQUEST['parameters']) ? " and " . $_REQUEST['parameters'] : "";
$order = isset($_REQUEST['order']) ? " order by " . $_REQUEST['order'] : "";
$limit = isset($_REQUEST['limit']) ? " limit " . $_REQUEST['limit'] : '';

# Perform the query
$sql = "SELECT " . $fields ." FROM " . $table ." a WHERE
	st_within(ST_transform(ST_GeometryFromText('POINT(" . $x . " " . $y .  ")', " . $srid . "), find_srid('', '" . $table . "', '" . $geometryfield . "')),
	a." . $geometryfield . ") "
	. $parameters
	. $order
	. $limit;
$db = pgConnection();
$statement=$db->prepare( $sql );
$statement->execute();

# send JSON or JSONP results
sendJSON($statement);

?>
