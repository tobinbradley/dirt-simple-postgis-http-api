# Buffer Point
[Service URL](v1/ws_geo_bufferpoint.php) | 
[Demo URL](v1/ws_geo_bufferpoint.php?x=1440901&y=479406&srid=2264&distance=20000&table=schools&fields=type,schlname,address&limit=3)

### Description
Buffer an XY coordinate by a specified distance and return selected features.

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
            <td>distance</td>
            <td>The number of units to be buffered.</td>
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
            <td>Limit the number of features returned. The default is <strong>no limit</strong>.</td>
        </tr>
    </tbody>
</table>

### Output
    [
        {
            "type": "Elementary",
            "schlname": "BALLANTYNE",
            "address": "15619 Lancaster Hy",
            "distance": "7211.16557846233"
        },
        {
            "type": "Elementary",
            "schlname": "ENDHAVEN",
            "address": "6815  Endhaven Lane",
            "distance": "11069.0386664853"
        },
        {
            "type": "Elementary",
            "schlname": "PINEVILLE",
            "address": "210  Lowery Street",
            "distance": "12232.7040346822"
        }
    ]
