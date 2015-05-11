<?php
/*
    Nearest Features
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
$parameters = isset($_REQUEST['parameters']) ? " WHERE " . $_REQUEST['parameters'] : "";
$limit = isset($_REQUEST['limit']) ? " limit " . $_REQUEST['limit'] : '100';

# Perform the query
$sql = "SELECT " . $fields . ",
    round(ST_Distance(ST_Transform(st_setsrid(st_makepoint(" . $x . ", " . $y . ")," . $srid ."), find_srid('', '" . $table . "', '" . $geometryfield . "')),
    a." . $geometryfield . ")) as distance
    FROM " . $table . " a "
    . $parameters
    . " ORDER BY a." . $geometryfield . " <-> st_transform(st_setsrid(st_makepoint(" . $x . ", " . $y . ")," . $srid ."),
    find_srid('', '" . $table . "', '" . $geometryfield . "'))"
    . $limit;
$db = pgConnection();
$statement=$db->prepare( $sql );
$statement->execute();

# send JSON or JSONP results
sendJSON($statement);

?>
