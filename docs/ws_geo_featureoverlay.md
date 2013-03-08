# Feature Overlay
[Service URL](v1/ws_geo_featureoverlay.php) |
[Demo URL](v1/ws_geo_featureoverlay.php?from_table=tax_parcels&to_table=voting_precincts&fields=f.pid,t.precno&parameters=f.pid%3D%2711111111%27)

### Description
Intersect feature(s) from one table with another table.

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
            <td>from_table</td>
            <td>The table with the feature(s) to buffer.</td>
        </tr>
        <tr>
            <td>to_table</td>
            <td>The table the buffer will be applied to.</td>
        </tr>
        <tr class="success">
            <td>from_geometryfield</td>
            <td>The name of the from_table geometry column. The default is <strong>the_geom</strong>.</td>
        </tr>
        <tr class="success">
            <td>to_geometryfield</td>
            <td>The name of the to_table geometry column. The default is <strong>the_geom</strong>.</td>
        </tr>
        <tr class="success">
            <td>fields</td>
            <td>The fields to return. Field names should be prefaced by a <em>f</em> for the from_table and a <em>t</em> for the to_table (ex: <em>f.pid, t.prkname</em>). The default is <strong>all fields from the TO table</strong>.</td>
        </tr>
        <tr class="success">
            <td>parameters</td>
            <td>Filtering parameters for a SQL <code>WHERE</code> statement. Field names should be prefaced by a <em>f</em> for the from_table and a <em>t</em> for the to_table (ex: <em>f.pid='11111111'</em>). The default is <strong>no parameters</strong>.</td>
        </tr>
        <tr class="success">
            <td>order</td>
            <td>A field or fields to sort the return by. The default is <strong>no sorting</strong>.</td>
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
            "pid": "11111111",
            "precno": "201"
        }
    ]
