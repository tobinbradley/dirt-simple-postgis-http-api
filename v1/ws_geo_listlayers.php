<?php
/*
    List layers in geometry_columns
*/

# Includes
require("../inc/database.inc.php");
require("../inc/json.inc.php");

# Performs the query and returns XML or JSON
$sql = "select * from geometry_columns order by f_table_name";
$db = pgConnection();
$statement=$db->prepare( $sql );
$statement->execute();

# send JSON or JSONP results
sendJSON($statement);

?>
