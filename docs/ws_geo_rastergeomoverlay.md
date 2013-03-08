# Raster Geometry Overlay
[Service URL](v1/ws_geo_rastergeomoverlay.php) | <a href="v1/ws_geo_rastergeomoverlay.php?raster=land_classification_2008&wkt=SRID%3D2264%3BMULTIPOLYGON(((1502717.37585601%20540685.81585601%2C1502568.24585602%20540502.995856017%2C1502498.12585601%20540575.31585601%2C1502670.62585601%20540786.625856012%2C1502710.12585601%20540834.995856017%2C1502781.24585602%20540763.875856012%2C1502717.37585601%20540685.81585601)))">Demo URL</a>

### Description
Return summary raster information from a WKT geometry.

<div class="warning alert alert-error">
  <strong>Warning!</strong> The geometry passed needs to have the same SRID as the raster.
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
            <td>wkt</td>
            <td>The WKT formatted geometry to overlay. Ex: <em>SRID=2264;MULTIPOLYGON(((1502717.37585601 540685.81585601,1502568.24585602 540502.995856017,1502498.12585601 540575.31585601,1502670.62585601 540786.625856012,1502710.12585601 540834.995856017,1502781.24585602 540763.875856012,1502717.37585601 540685.81585601)))</em>
            </td>
        </tr>
        <tr>
            <td>raster</td>
            <td>The name of the raster.</td>
        </tr>
    </tbody>
</table>

### Output
    [
        {
            "value": "1",
            "area": "4762.45251089639",
            "pct": "0.141718059550524"
        },
        {
            "value": "2",
            "area": "25881.3282376428",
            "pct": "0.770160250005002"
        },
        {
            "value": "3",
            "area": "2961.34005259465",
            "pct": "0.0881216904447344"
        }
    ]
