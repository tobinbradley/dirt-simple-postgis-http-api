# Configuration Options

```json
{
  "schemes": ["http", "https"],
  "port": 3000,
  "cache": 3600,
  "db": "postgres://user:password@server/database"
}
```

### schemes

`schemes` sets the available route options as shown in the service documentation.

### port

`port` sets the port number the server runs on.

### cache

`cache` sets the expiration length of the server response, in seconds.

### db

`db` is the database connection string for Postgres.
