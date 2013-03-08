# Road Intersection
[Service URL](v1/ws_geo_roadintersection.php) |
[Demo URL](v1/ws_geo_roadintersection.php?street1=ruth&street2=dolphin)

### Description
Find the point location of road intersections from a road line table.

<div class="warning alert alert-error">
  <strong>Warning!</strong> This service is schema-specific. You'll have to edit the service PHP file to get it to work with your data.
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
            <td>street1</td>
            <td>The first street.</td>
        </tr>
        <tr>
            <td>street2</td>
            <td>The second street.</td>
        </tr>
        <tr class="success">
            <td>srid</td>
            <td>The SRID for the intersection point. The default is <strong>WGS84 Lat/Lng</strong>.</td>
        </tr>
        <tr class="success">
            <td>geometryfield</td>
            <td>The name of the to_table geometry column. The default is <strong>the_geom</strong>.</td>
        </tr>
    </tbody>
</table>

### Output
    [
        {
            "x": "-80.7587994119038",
            "y": "35.2473435073095"
        }
    ]
