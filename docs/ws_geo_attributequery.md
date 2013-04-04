# Attribute Query
[Service URL](v1/ws_geo_attributequery.php) |
[Demo URL](v1/ws_geo_attributequery.php?table=schools&fields=schlname&parameters=type%3D%27High%27)

### Description
Perform a simple query on a table.

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
            <td>fields</td>
            <td>The fields to return. The default is <strong>all fields</strong>.</td>
        </tr>
        <tr class="success">
            <td>parameters</td>
            <td>Filtering parameters for a SQL <code>WHERE</code> statement. The default is <strong>no parameters</strong>.</td>
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
            "schlname": "ROCKY RIVER HIGH"
        },
        {
            "schlname": "HOPEWELL HIGH"
        },
        {
            "schlname": "NORTH MECKLENBURG HIGH"
        },
        {
            "schlname": "BERRY ACADEMY OF TECHNOLOGY"
        },
        {
            "schlname": "HARDING HIGH"
        },
        {
            "schlname": "MYERS PARK HIGH"
        },
        {
            "schlname": "SOUTH MECKLENBURG HIGH"
        },
        {
            "schlname": "EAST MECKLENBURG HIGH"
        },
        {
            "schlname": "PROVIDENCE HIGH"
        },
        {
            "schlname": "BUTLER HIGH"
        },
        {
            "schlname": "INDEPENDENCE HIGH"
        },
        {
            "schlname": "NORTHWEST HIGH"
        },
        {
            "schlname": "ARDREY KELL"
        },
        {
            "schlname": "MALLARD CREEK HIGH"
        },
        {
            "schlname": "WEST MECKLENBURG HIGH"
        },
        {
            "schlname": "E.E. WADDELL"
        },
        {
            "schlname": "GARINGER HIGH"
        },
        {
            "schlname": "WEST CHARLOTTE HIGH"
        },
        {
            "schlname": "MIDWOOD"
        },
        {
            "schlname": "CATO MIDDLE COLLEGE"
        },
        {
            "schlname": "PERFORMANCE LEARNING CTR"
        },
        {
            "schlname": "MARIE G. DAVIS"
        },
        {
            "schlname": "OLYMPIC HIGH"
        },
        {
            "schlname": "VANCE HIGH"
        },
        {
            "schlname": "W.A. HOUGH HIGH"
        }
    ]
