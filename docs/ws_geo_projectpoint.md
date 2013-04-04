# Project Point
[Service URL](v1/ws_geo_projectpoint.php) |
[Demo URL](v1/ws_geo_projectpoint.php?x=1440901&y=479406&fromsrid=2264)

### Description
Project coordinates (XY) from one SRID to another.

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
            <td>X coordinate.</td>
        </tr>
        <tr>
            <td>y</td>
            <td>Y coordinate.</td>
        </tr>
        <tr>
            <td>fromsrid</td>
            <td>The SRID of the coordinate being passed.</td>
        </tr>
         <tr class="success">
            <td>srid</td>
            <td>The SRID for the intersection point. The default is <strong>4326</strong> WGS84 Lat/Lng.</td>
        </tr>
    </tbody>
</table>

### Output
    [
        {
            "x": "-80.8683045128463",
            "y": "35.052799481977"
        }
    ]
