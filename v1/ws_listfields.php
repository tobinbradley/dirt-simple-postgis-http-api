<?php
/*
    List Fields
 */

# Includes
require("../inc/database.inc.php");
require("../inc/json.inc.php");

# Retrive URL arguments
$table = $_REQUEST['table'];

# Perform the query
$sql = "SELECT attname as field_name, typname as field_type FROM pg_namespace, pg_attribute, pg_type, pg_class
	WHERE pg_type.oid = atttypid AND pg_class.oid = attrelid
	AND relnamespace = pg_namespace.oid
	AND relname = :table
	AND attnum >= 1";
$db = pgConnection();
$statement=$db->prepare( $sql );
$statement->bindParam(":table", $table);
$statement->execute();

# send JSON or JSONP results
sendJSON($statement);

?>
