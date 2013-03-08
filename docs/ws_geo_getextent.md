# Get Extent
[Service URL](v1/ws_geo_getextent.php) |
[Demo URL](v1/ws_geo_getextent.php?table=tax_parcels&parameters=pid%3d%2711111111%27)

### Description
Get the extent of features from a geotable.

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
            <td>The table to get the extent from.</td>
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
    </tbody>
</table>

### Output
    [
        {
            "extent": "BOX(-80.6659403710486 35.2236653135653,-80.6650030794391 35.2245839518218)"
        }
    ]
