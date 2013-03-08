# Get Centroid
[Service URL](v1/ws_geo_getcentroid.php) |
[Demo URL](v1/ws_geo_getcentroid.php?table=voting_precincts&parameters=precno%3D%27100%27)

### Description
Get the centroid of a feature(s).

### Arguments
<table class="table table-bordered">
    <thead>
        <tr>
            <th>Argument</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>table</td>
            <td>The name of the table.</td>
        </tr>
        <tr class="success">
            <td>srid</td>
            <td>The SRID for the intersection point. The default is <strong>4326</strong> WGS84 Lat/Lng.</td>
        </tr>
        <tr class="success">
            <td>parameters</td>
            <td>Filtering parameters for a SQL <code>WHERE</code> statement. The default is <strong>no parameters</strong>.</td>
        </tr>
        <tr class="success">
           <td>geometryfield</td>
            <td>The name of the geometry column. The default is <strong>the_geom</strong>.</td>
        </tr>
        <tr class="success">
           <td>forceonsurface</td>
            <td>Passing anything to this argument will force the centroid returned to be on the surface of a feature. The default is <strong>the absolute centroid</strong>.</td>
        </tr>
    </tbody>
</table>

### Output
    [
        {
            "x": "-80.7893748153244",
            "y": "35.1066287971563"
        }
    ]
