<?php
/*
    Raster Geometry Overlay
*/

# Return header
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");

# Includes
require("../inc/database.inc.php");
require("../inc/error_handler.inc.php");

# Time limit and error reporting level
# For debugging set error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
error_reporting(E_ERROR);
set_time_limit(5);

# Retrive URL arguments
$wkt = $_REQUEST['wkt'];
$raster = $_REQUEST['raster'];

# Perform the query
$sql = " SELECT (gv).val as value, sum(st_area((gv).geom)) as area, sum(st_area((gv).geom)/thearea) as pct
		FROM
		(
		SELECT ST_Intersection(rast, st_geomfromewkt('" . $wkt . "')) AS gv,
		st_area(st_geomfromewkt('" . $wkt . "')) as thearea FROM $raster
		WHERE
		st_geomfromewkt('" . $wkt . "') && rast
		and ST_Intersects(rast, st_geomfromewkt('" . $wkt . "')) )
		foo group by value order by value ";
$db = pgConnection2();
$statement=$db->prepare( $sql );
$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);

# send return
$json= json_encode( $result );
echo isset($_GET['callback']) ? "{$_GET['callback']}($json)" : $json;

?>
