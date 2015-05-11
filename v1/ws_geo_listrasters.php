<?php
/*
    List layers in raster_columns
*/

# Includes
require("../inc/database.inc.php");
require("../inc/json.inc.php");

# Perform the query
$sql = "select * from raster_columns order by r_table_name";
$db = pgConnection();
$statement=$db->prepare( $sql );
$statement->execute();

# send JSON or JSONP results
sendJSON($statement);

?>
