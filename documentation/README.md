# documentation

The Dirt-Simple PostGIS HTTP API serves Swagger documentation from here using `fastify-static` rather than using the default `fastify-swagger` documentation path, relying on `fastify-swagger` only to create the Swagger JSON. This yields several advantages:

- The default path gets you documentation, so you don't have to know where to go.
- You can customize and style your documentation as you see fit.
- Because `fastify-swagger` performs a `reply.redirect`, getting this to work with a partial proxy (i.e. `http://server.com/api` rather than `http://api.server.com`) extraordinarily frustrating. Having independent documentation makes a wide variety of configurations relatively easy.

If you prefer to use the `fastify-swagger` default documentation, you can find it at [http://127.0.0.1:3000/documentation](http://127.0.0.1:3000/documentation).
