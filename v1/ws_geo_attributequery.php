<?php
/*
    Attribute Query
    Performs attribute query on a table.
*/

# Includes
require("../inc/database.inc.php");
require("../inc/json.inc.php");

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

# send JSON or JSONP results
sendJSON($statement);

?>
