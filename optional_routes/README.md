# Optional Routes

Here we have routes that, for various reasons, you may or may not want to use. Some will require installing additional dependencies through `npm` or `yarn` as noted. Other than that, drop them in to the routes folder and hang on to your hat.

## mvt_v1.js

This is the older version of this service, using `geojson-vt` and `vt-pbf` to generate tiles (the new one uses `st_asmvt` built in to PostGIS 2.4). You might want to use this route rather than the new version because:

* You may want to CPU slam the client rather than the database.
* The speeds are comparable and the file size is smaller.
* You might not be on PostGIS 2.4 yet.
* Getting ST_asMVT working isn’t necessarily as simple as installing PostGIS 2.4. On my Ubuntu 14.04 production server, ST_asMVT tells me libprotobuf isn’t up to snuff, takes its ball and goes home.

You will need to install the `geojson-vt` and `vt-pbf` libraries via npm or yarn.

```bash
yarn add geojson-vt vt-pbf@2.1.4
```

```bash
npm install geojson-vt vt-pbf@2.1.4
```

Note I'm using a specific `vt-pbf` version. There seems to be an [issue](https://github.com/mapbox/vt-pbf/issues/27) for some types of geometry with `vt-pbf` 3.0.1.
