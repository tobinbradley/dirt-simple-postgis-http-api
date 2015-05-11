<?php
/*
    Buffer Feature
*/

# Includes
require("../inc/database.inc.php");
require("../inc/json.inc.php");

# Retrive URL arguments
$from_table = $_REQUEST['from_table'];
$to_table = $_REQUEST['to_table'];
$distance = $_REQUEST['distance'];
$from_geometryfield = isset($_REQUEST['from_geometryfield']) ? $_REQUEST['from_geometryfield'] : "geom";
$to_geometryfield = isset($_REQUEST['to_geometryfield']) ? $_REQUEST['to_geometryfield'] : "geom";
$fields = isset($_REQUEST['fields']) ? $_REQUEST['fields'] : 't.*';
$parameters = isset($_REQUEST['parameters']) ? " and " .$_REQUEST['parameters'] : '';
$order = isset($_REQUEST['order']) ? " order by " . $_REQUEST['order'] : '';
$limit = isset($_REQUEST['limit']) ? " limit " . $_REQUEST['limit'] : '';

# Perform the query
$sql = "select " . $fields . "	from " . $from_table . " as f, " . $to_table . " as t where
	ST_DWithin(f." . $from_geometryfield . ", t." . $to_geometryfield . ", " . $distance .  ") " . $parameters . $order . $limit;
$db = pgConnection();
$statement=$db->prepare( $sql );
$statement->execute();

# send JSON or JSONP results
sendJSON($statement);

?>
