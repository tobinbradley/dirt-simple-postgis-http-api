# Nearest
[Service URL](v1/ws_geo_nearest.php) |
[Demo URL](v1/ws_geo_nearest.php?x=-80.757&y=35.249&srid=4326&table=parks&fields=prkname&limit=10)

### Description
Get the nearest features to a point ordered by distance.

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
            <td>x</td>
            <td>The X coordinate of the point to buffer.</td>
        </tr>
        <tr>
            <td>y</td>
            <td>The Y coordinate of the point to buffer.</td>
        </tr>
        <tr>
            <td>srid</td>
            <td>The SRID of the input point. <em>Tip: 2264 is NC State Plane NAD83 (feet), 4326 is LatLng.</em></td>
        </tr>
        <tr>
            <td>table</td>
            <td>The geotable to return features from.</td>
        </tr>
        <tr class="success">
            <td>geometryfield</td>
            <td>The name of the geometry column. The default is <strong>the_geom</strong>.</td>
        </tr>
        <tr class="success">
            <td>fields</td>
            <td>Comma delimited list of fields to return. The default is <strong>all fields</strong>.</td>
        </tr>
        <tr class="success">
            <td>parameters</td>
            <td>SQL where parameters to narrow down the return. The default is <strong>no parameters</strong>.</td>
        </tr>
        <tr class="success">
            <td>limit</td>
            <td>Limit the number of features returned. The default is <strong>10</strong>.</td>
        </tr>
    </tbody>
</table>

### Output
    [
        {
            "prkname": "JULIAN UNDERWOOD NEIGHBORHOOD PARK",
            "distance": "2172"
        },
        {
            "prkname": "UNITY NEIGHBORHOOD PARK",
            "distance": "2740"
        },
        {
            "prkname": "BRIARWOOD COMMUNITY PARK",
            "distance": "3463"
        },
        {
            "prkname": "DEVONSHIRE NEIGHBORHOOD PARK",
            "distance": "3456"
        },
        {
            "prkname": "VIEWMONT NEIGHBORHOOD PARK",
            "distance": "4514"
        },
        {
            "prkname": "METHODIST HOME CENTER",
            "distance": "6880"
        },
        {
            "prkname": "METHODIST HOME NEIGHBORHOOD PARK",
            "distance": "7526"
        },
        {
            "prkname": "HOWIE ACRES NEIGHBORHOOD PARK",
            "distance": "8183"
        },
        {
            "prkname": "SHAMROCK NEIGHBORHOOD PARK",
            "distance": "9448"
        },
        {
            "prkname": "KILBORNE COMMUNITY PARK",
            "distance": "11191"
        }
    ]
