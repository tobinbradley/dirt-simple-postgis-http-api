# Point Overlay
[Service URL](v1/ws_geo_pointoverlay.php) |
[Demo URL](v1/ws_geo_pointoverlay.php?x=1440901&y=479406&srid=2264&table=voting_precincts&fields=precno,cc,school)

### Description
Do an intersection on a table using a point coordinate.

<div class="warning alert alert-info">
  <strong>Take  note!</strong> The default SRID of the table's geometry column is 2264.
</div>

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
            <td>geometrysrid</td>
            <td>The SRID of the table geometry column. The default is <strong>2264</strong>.</td>
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
            "precno": "140",
            "cc": "6",
            "school": "6"
        }
    ]
