<?php
/*
    Ubersearch
    Autocomplete return for many different datasets
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
$requestTypes = isset($_REQUEST["searchtypes"]) ? explode(",", $_REQUEST["searchtypes"]) : ["address"];
$query = strtoupper(trim($_REQUEST['query']));

# Vars for the SQL calls
$query_array = explode(' ', $query);  // To get the number for an address
$sql = "";  // Container for the SQL query
$pos = strpos($query, "&"); // Check for intersection search

if ( is_numeric($_REQUEST['query']) ) {
    # Parcel ID
    if (is_numeric($query) and in_array("pid", $requestTypes) and strlen($query) == 8) {  // probably a parcel id
        if (strlen($sql) > 0) $sql .= " union all ";
        $sql .= "(select objectid as gid, num_parent_parcel as name, 'PID' as type, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat from master_address_table where num_parent_parcel = :query and num_x_coord > 0 and cde_status='A' order by name)";
    }
}

else {

    # Address
    if (is_numeric($query_array[0]) and !is_numeric($query) and in_array("address", $requestTypes)) {
        if (strlen($sql) > 0) $sql .= " union ";
        $sql .= "(select objectid as gid, full_address as name, 'ADDRESS' as type, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat from master_address_table where txt_street_number = :housenum and soundex(substring(full_address from 1 for "  . strlen($query)  . " )) = soundex(:query) and cde_status='A' and num_x_coord > 0 ORDER BY similarity(substring(full_address from 1 for "  . strlen($query)  . "), :query2) DESC limit 50)";
    }



    # Parks
    if (in_array("park", $requestTypes)) {
        if (strlen($sql) > 0) $sql .= " union ";
        $sql .= "(select gid, prkname as name, 'PARKS' as type, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat from parks where prkname ilike :like order by name limit 50)";
    }

    # Libraries
    if (in_array("library", $requestTypes)) {
        if (strlen($sql) > 0) $sql .= " union ";
        $sql .= "(select gid, name, 'LIBRARIES' as type, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat from libraries where name ilike :like order by name limit 50)";
    }

    # Schools
    if (in_array("school", $requestTypes)) {
        if (strlen($sql) > 0) $sql .= " union ";
        $sql .= "(select gid, schlname as name, 'SCHOOLS' as type, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat from schools_1112 where schlname ilike :like order by name limit 50)";
    }

    # NSA
    if (in_array("nsa", $requestTypes)) {
        if (strlen($sql) > 0) $sql .= " union ";
        $sql .= "(select gid, nsa_name as name, 'NSA' as type, round(ST_X(ST_Transform(ST_Centroid(the_geom), 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(ST_Centroid(the_geom), 4326))::NUMERIC,4) as lat from neighborhood_statistical_areas where nsa_name ilike :like order by name limit 50)";
    }

    # GeoNames
    if (in_array("geoname", $requestTypes)) {
        if (strlen($sql) > 0) $sql .= " union ";
        $sql .= "(select gid, name, 'GEONAMES' as type, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat from geonames where name ilike :like order by name limit 50)";
    }

    # Roads
    if (in_array("road", $requestTypes)) {
        if (strlen($sql) > 0) $sql .= " union ";
        $sql .= "(select
            9 as gid, streetname as name, 'ROAD' as type,
            round(ST_X(ST_transform(ST_PointOnSurface(the_geom), 4326))::NUMERIC,4) as lng,
            round(ST_Y(ST_transform(ST_PointOnSurface(the_geom), 4326))::NUMERIC,4) as lat
            from roads
            where streetname = :query
            order by ll_add limit 1)";
    }

    # Businesses
    if (in_array("business", $requestTypes)) {
        if (strlen($sql) > 0) $sql .= " union ";
        $sql .= "(select gid, company || ': ' || address as name, 'BUSINESS' as type, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat from businesswise_businesses where company ilike :like order by name limit 50)";
    }

    # CATS
    if (in_array("cats", $requestTypes)) {
        if (strlen($sql) > 0) $sql .= " union ";
        $sql .= "(select gid, name, 'CATS LIGHT RAIL' as type, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat from cats_light_rail_stations where name ilike :like order by name)";
        $sql .= " union ";
        $sql .= "(select gid, name, 'CATS PARK AND RIDE' as type, round(ST_X(ST_Transform(the_geom, 4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(the_geom, 4326))::NUMERIC,4) as lat from cats_park_and_ride where name ilike :like order by name limit 50)";
    }

    # Intersection
    if ($pos != false and in_array("intersection", $requestTypes)) {
        // get first and second strings
        $firstStreet = '%' . trim(substr($query, 0, $pos)) . '%';
        $secondStreet = '%' . trim(substr($query,$pos + 1, strlen($query) - $pos)) . '%';

        if (strlen($sql) > 0) $sql .= " union ";
        $sql .= "(select distinct 9 as gid, a.streetname || ' & ' || b.streetname as name, 'INTERSECTION' as type, round(ST_X(ST_Transform(ST_Intersection( a.the_geom, b.the_geom),4326))::NUMERIC,4) as lng, round(ST_Y(ST_Transform(ST_Intersection( a.the_geom, b.the_geom),4326))::NUMERIC,4) as lat from (select streetname, the_geom from roads where streetname ilike :firststreet ) a, (select streetname,the_geom from roads where streetname ilike :secondstreet) b where a.the_geom && b.the_geom and intersects(a.the_geom, b.the_geom) and b.streetname not ilike :firststreet limit 50)";
    }

}

$like = "%" . $query . "%";
$db = pgConnection();
$statement=$db->prepare( $sql );
if (strpos($sql, ":housenum")) $statement->bindParam(':housenum', $query_array[0], PDO::PARAM_STR);
if (strpos($sql, ":like")) $statement->bindParam(':like', $like, PDO::PARAM_STR);
if (strpos($sql, ":query")) $statement->bindParam(':query', $query, PDO::PARAM_STR);
if (strpos($sql, ":query2")) $statement->bindParam(':query2', $query, PDO::PARAM_STR);
if (strpos($sql, ":firststreet")) $statement->bindParam(':firststreet', $firstStreet, PDO::PARAM_STR);
if (strpos($sql, ":secondstreet")) $statement->bindParam(':secondstreet', $secondStreet, PDO::PARAM_STR);
$statement->execute();
$result=$statement->fetchAll(PDO::FETCH_ASSOC);

# send return
$json= json_encode( $result );
echo isset($_GET['callback']) ? "{$_GET['callback']}($json)" : $json;

?>
