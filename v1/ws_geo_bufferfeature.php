<?php
/*
    Buffer Feature
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
$from_table = $_REQUEST['from_table'];
$to_table = $_REQUEST['to_table'];
$distance = $_REQUEST['distance'];
$from_geometryfield = isset($_REQUEST['from_geometryfield']) ? $_REQUEST['from_geometryfield'] : "the_geom";
$to_geometryfield = isset($_REQUEST['to_geometryfield']) ? $_REQUEST['to_geometryfield'] : "the_geom";
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
$result=$statement->fetchAll(PDO::FETCH_ASSOC);

# send return
$json= json_encode( $result );
echo isset($_GET['callback']) ? "{$_GET['callback']}($json)" : $json;

?>
