# Getting Started
The Dirt-Simple PostGIS HTTP API is an easy way to expose geospatial functionality to your applications. It takes simple requests over HTTP (GET or POST) and returns JSON or JSONP to the requester. Although the focus of the project has generally been on exposing PostGIS functionality to web apps, you can use the framework to connect to any PHP PDO supported database (read: just about anything).

## Setup
#### Step 1 - PostgreSQL and PostGIS
You'll need PostgreSQL and PostGIS [set up](http://postgis.net/docs/manual-2.0/postgis_installation.html) with some data in it.

#### Step 2 - Your HTTP Server with PHP
* A HTTP server. Dealer's choice - it has been tested with Apache, Nginx, and IIS.
* [PHP](http://php.net/) has to be set up for your HTTP server. The setup process will vary depending on your OS and HTTP server.
* PHP needs PDO enabled in your php.ini for any database you want to latch on to. For PostgreSQL, uncomment php_pdo_pgsql. Note: make sure you bounce your HTTP server so it re-reads php.ini after a change!

To make sure your server is configured properly, make a test.php and slap this in it:

    <?php phpinfo(); ?>

Pull it in a web browser and you should see PHP's configuration report. Make sure `pdo_pgsql` is in there. If it isn't , or if you get your PHP file tossed back at you rather than the PHP configuration report, you have a server configuration problem. Get to Googling.

#### Step 3 - Setting Your Database Connection(s)
Once your server is configured properly, dump the __rest__ folder in your www path. Hit the folder with your web browser and you'll be seeing this page along with documentation on all the services.

The next step is to tell the framework how to connect to your database(s). All database connections are created in inc/database.inc.php, which won't exist yet. Rename inc/database.inc.txt to database.inc.php and put your server info in there, replacing `server_name`, `database_name`, `user_name`, and `password`.

    function pgConnection() {
        $conn = new PDO ("pgsql:host=server_name;dbname=database_name;port=5432","user_name","password", array(PDO::ATTR_PERSISTENT => true));
        return $conn;
    }

<div class="warning alert alert-error">
  <strong>Warning!</strong> Make sure you use a read-only login that only has access to resources you want to share. Because users pass information that can't be easily escaped, a crafty hacker could eat your lunch with admin access.
</div>

Now you're ready to go!

## Consuming Services
The services will take either `GET` or `POST` arguments, though for semantic reasons you should use `GET` unless the `GET` argument is exceeding your web server's limits. You're basically just building a URL. What you'll get back is JSON or JSONP. JSON is the most popular data exchange format in the known universe. JSONP is really JSON dressed up as JavaScript so you can use it without tripping on cross-domain browser issues.

#### JavaScript
Here is how you can consume this stuff via JavaScript and a little jQuery. You can run it in Chrome by hitting `CTRL-SHIFT-J` and pasting it in. What we're doing is calling the Buffer Point service, passing it some parameters, and processing the results. The results are being returned in JSONP so we don't get a cross-domain wedgie should our REST services be on a different server (though in this example they aren't).

    $.ajax({
        type: "GET",
        url: "v1/ws_geo_bufferpoint.php",
        data: {
            "x": 1440901,
            "y": 479406,
            "srid": 2264,
            "distance": 20000,
            "table": "schools",
            "fields": "type,schlname,address",
            "limit": 3
        },
        dataType: "jsonp",
        success: function(data) {
            $.each(data, function(i, row) {
                console.log(row.type, row.schlname, row.address);
            });
        },
        error: function(error, status, desc) {
            console.log(status, desc);
        }
    });

#### PHP
You can consume the services via any server-side language you like. Here we'll use PHP to grab the content as JSON and drop it into an array for easier PHP-munching. The URL in this case is dumped into a URL as a single string. Ugly, but short. Note you don't want JSONP here - server side code cares not about cross-domain problems.

    <?php

    $rawData = file_get_contents('http://localhost/code/rest/v1/ws_geo_bufferpoint.php?x=1440901&y=479406&srid=2264&distance=20000&table=schools&fields=type,schlname,address&limit=3');
    $dataArray = json_decode($rawData, true);

    foreach ($dataArray as $value) {
        echo $value["type"] . ",  " . $value["schlname"] . ", " . $value["address"] . "<br>";
    }

    ?>


## Tips
* Know your SRID's. The most common one would be WGS84 - `4326` - for lat/lng. `2264` is North Carolina State Plane NAD83 Feet for you North Carolina USA types.
* Most of the services are schema-agnostic. Two notable exceptions: `Ubersearch` and `Road Intersection`. You'll have to monkey with those to match your table schema up.
* If you want to modify the inputs or outputs of a service, put it in v2 (or whatever the next folder is) and update the docs to point to it. That way you're not breaking your user's stuff. Unless you just like to irritate people.
* You can rename fields in the return, ala `fields=precno as precinct_number`.
* If you know you're only getting 1 record back, it is still coming back as an array. In JavaScript use `data[0]` to grab the first sucker without looping.
* To get a count on your return in JavaScript (or to make sure it isn't empty), use `data.length`.
* You can leverage PostGIS functions to get goodies back, like `fields=st_asgeojson(the_geom) as geojson`.
* If you need to do something like pull geoJSON back in a return field like above, use something like `jQuery.parseJSON(the_json_value)` to set it proper.
* URL encode stuff that is going out in an argument to be safe. For example, the `parameter` argument can have `=` and `'` and similar nonsense. Here's some JavaScript functions to properly URL encode/decode a string (JavaScript's escape doesn't cover everything).

#### JavaScript
    // Properly URL encode or decode
    function urlencode(str) {
        str = escape(str);
        str = str.replace('+', '%2B');
        str = str.replace('%20', '+');
        str = str.replace('*', '%2A');
        str = str.replace('/', '%2F');
        str = str.replace('@', '%40');
        return str;
    }
    function urldecode(str) {
        str = str.replace('+', ' ');
        str = unescape(str);
        return str;
    }




