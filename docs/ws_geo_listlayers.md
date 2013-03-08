# List Layers
[Service URL](v1/ws_geo_listlayers.php) |
[Demo URL](v1/ws_geo_listlayers.php)

### Description
List PostGIS layers in geometry_columns.

### Output
    [
        {
            "f_table_catalog": "GISData",
            "f_table_schema": "public",
            "f_table_name": "adopted_future_landuse",
            "f_geometry_column": "the_geom",
            "coord_dimension": 2,
            "srid": 2264,
            "type": "MULTIPOLYGON"
        },
        {
            "f_table_catalog": "GISData",
            "f_table_schema": "public",
            "f_table_name": "air_pollution_facilities",
            "f_geometry_column": "the_geom",
            "coord_dimension": 2,
            "srid": 2264,
            "type": "POINT"
        },
        {
            "f_table_catalog": "GISData",
            "f_table_schema": "public",
            "f_table_name": "air_quality_sites",
            "f_geometry_column": "the_geom",
            "coord_dimension": 2,
            "srid": 2264,
            "type": "POINT"
        },
        {
            "f_table_catalog": "GISData",
            "f_table_schema": "public",
            "f_table_name": "annexation_areas_2011",
            "f_geometry_column": "the_geom",
            "coord_dimension": 2,
            "srid": 2264,
            "type": "MULTIPOLYGON"
        }
    ]
