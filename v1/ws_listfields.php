<?php
/*
    List Fields
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


# Perform the query
$sql = "SELECT attname as field_name, typname as field_type FROM pg_namespace, pg_attribute, pg_type, pg_class
	WHERE pg_type.oid = atttypid AND pg_class.oid = attrelid
	AND pg_namespace.nspname = 'public'
	AND relnamespace = pg_namespace.oid
	AND relname = :table
	AND attnum >= 1";
$db = pgConnection();
$statement=$db->prepare( $sql );
$statement->bindParam(":table", $table);
$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);

# send return
$json= json_encode( $result );
echo isset($_GET['callback']) ? "{$_GET['callback']}($json)" : $json;

?>
