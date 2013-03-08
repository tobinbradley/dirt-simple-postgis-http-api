<?php
/*
    Attribute Query
    Performs attribute query on a table.
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
$table = $_REQUEST['table'];
$fields = isset($_REQUEST['fields']) ? $_REQUEST['fields'] : '*';
$parameters = isset($_REQUEST['parameters']) ? " where " . $_REQUEST['parameters'] : '';
$order = isset($_REQUEST['order']) ? " order by " . $_REQUEST['order'] : '';
$limit = isset($_REQUEST['limit']) ? " limit " . $_REQUEST['limit'] : '';

# Perform the query
$sql = "select " . $fields . " from " . $table . $parameters . $order . $limit;
$db = pgConnection();
$statement=$db->prepare( $sql );
$statement->execute();
$result=$statement->fetchAll(PDO::FETCH_ASSOC);

# send return
$json= json_encode( $result );
echo isset($_GET['callback']) ? "{$_GET['callback']}($json)" : $json;

?>
