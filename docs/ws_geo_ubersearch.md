# Ubersearch
[Service URL](v1/ws_geo_ubersearch.php) | [Demo URL](v1/ws_geo_ubersearch.php?searchtypes=address&query=5501+ru)

### Description
An autocomplete and search service.

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
            <td>query</td>
            <td>The query string. Must be at least 3 characters. Searches for intersections are detected by an ampersand. Example: query=ruth & dolphin. Note the ampersand in the query string will have to be URL encoded.</td>
        </tr>
        <tr class="success">
            <td>searchtypes</td>
            <td>
                    A comma delimited list of things to search for. The default value is <strong>address</strong>. Values can also include:
                    <ul>
                        <li>address</li>
                        <li>pid</li>
                        <li>park</li>
                        <li>library</li>
                        <li>school</li>
                        <li>nsa</li>
                        <li>business</li>
                        <li>geoname</li>
                        <li>cats</li>
                        <li>intersection</li>
                        <li>road</li>
                    </ul>
            </td>
        </tr>
    </tbody>
</table>

### Output
    [
        {
            "gid": 150776,
            "name": "5501 RUTH DR, CHARLOTTE NC 28215",
            "type": "ADDRESS",
            "lng": "-80.7594",
            "lat": "35.2486"
        },
        {
            "gid": 150772,
            "name": "5501 RACINE AVE, CHARLOTTE NC 28269",
            "type": "ADDRESS",
            "lng": "-80.8010",
            "lat": "35.2878"
        },
        {
            "gid": 150773,
            "name": "5501 RADFORD AVE, CHARLOTTE NC 28217",
            "type": "ADDRESS",
            "lng": "-80.8908",
            "lat": "35.1727"
        },
        {
            "gid": 150774,
            "name": "5501 ROBINHOOD RD, CHARLOTTE NC 28211",
            "type": "ADDRESS",
            "lng": "-80.7778",
            "lat": "35.1686"
        },
        {
            "gid": 150775,
            "name": "5501 ROCKWOOD RD, CHARLOTTE NC 28216",
            "type": "ADDRESS",
            "lng": "-80.8825",
            "lat": "35.2970"
        }
    ]
