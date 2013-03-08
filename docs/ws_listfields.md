# List Fields
[Service URL](v1/ws_listfields.php) | 
[Demo URL](v1/ws_listfields.php?table=tax_parcels)

### Description
List the fields in a table or view.

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
            <td>The name of the table or view to retrieve fields from.</td>
        </tr>        
    </tbody>
</table>

### Output
    [
        {
            "field_name": "gid",
            "field_type": "int4"
        },
        {
            "field_name": "objectid",
            "field_type": "int8"
        },
        {
            "field_name": "map_book",
            "field_type": "varchar"
        },
        {
            "field_name": "map_page",
            "field_type": "varchar"
        },
        {
            "field_name": "map_block",
            "field_type": "varchar"
        },
        {
            "field_name": "lot_num",
            "field_type": "varchar"
        },
        {
            "field_name": "nc_pin",
            "field_type": "varchar"
        },
        {
            "field_name": "condo_town",
            "field_type": "numeric"
        },
        {
            "field_name": "parcel_typ",
            "field_type": "numeric"
        },
        {
            "field_name": "pid",
            "field_type": "varchar"
        },
        {
            "field_name": "the_geom",
            "field_type": "geometry"
        },
        {
            "field_name": "legal_from",
            "field_type": "date"
        }
    ]
