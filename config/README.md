# Configuration Options

```json
{
  "schemes": ["http", "https"],
  "port": 3000,
  "cache": 3600,
  "swaggerpath": null,
  "db": "postgres://user:password@server/database"
}
```

### schemes

`schemes` sets the available route options as shown in the service documentation.

### port

`port` sets the port number the server runs on.

### cache

`cache` sets the expiration length of the server response, in seconds.

### swaggerpath

`swaggerpath` sets the base URL path the documentation will use when testing routes. This is handy when you're using an Apache or Nginx proxy path rather than an A-name. For example, if you are proxying the services at `http://server.com/api`, you would set `swaggerpath` to `"server.com/api"`. If set to `null` this value is ignored.

### db

`db` is the database connection string for Postgres.
