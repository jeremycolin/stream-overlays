# Stream Overlays for Twitch

#### Environment variables

Create a file `.env` file at the root of the project containing the values for the following environment variables:

```
TWITCH_CLIENT_ID=YOUR_CLIENT_ID
TWITCH_CLIENT_SECRET=YOUR_DARKEST_SECRET
TWITCH_API_TOKEN=YOUR_API_TOKEN
TWITCH_OAUTH_REDIRECT_URL=http://localhost:5000/oauth

PGUSER=local_user
PGPASSWORD=local_password
PGDATABASE=local_db
SYM_ENCRYPTION_KEY=local_sym_key
```

### Setup

```shell
yarn install
```

#### Postgres

1. Create local_db and if you do not have one already, create a superuser role for your local user

```shell
createdb local_db
sudo -u postgres psql
```

In psql create superuser role for your local user:

```sql
CREATE ROLE %USERNAME% SUPERUSER LOGIN;
```

2. Connect to local_db and create local_user

```shell
psql -U %USERNAME% -d local_db
```

In psql:

```sql
CREATE USER local_user WITH PASSWORD 'local_password';
GRANT CREATE ON SCHEMA public TO local_user;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### Install project

```shell
yarn start
```

### Test locally

Start server:

```shell
cd packages/server && yarn start
```

Start client:

```shell
cd packages/client && yarn start
```

Examples:

For `samyz_`: `http://localhost:5000/samyz_/live`

```shell
./twitch event trigger follow -F http://localhost:3000/eventsub -s YOUR_DARKEST_SECRET --version 2 --to-user 151809327
```

For `askowbol`: `http://localhost:5000/askowbol/live`

```shell
./twitch event trigger follow -F http://localhost:3000/eventsub -s YOUR_DARKEST_SECRET --version 2 --to-user 44105925
```

### Test on live

For `samyz_`: `https://stream-overlays-production.up.railway.app/samyz_/live`

```shell
./twitch event trigger follow -F https://stream-overlays-production.up.railway.app/eventsub -s YOUR_DARKEST_SECRET --version 2 --to-user 151809327
```

For `askowbol`: `https://stream-overlays-production.up.railway.app/askowbol/live`

```shell
./twitch event trigger follow -F https://stream-overlays-production.up.railway.app/eventsub -s YOUR_DARKEST_SECRET --version 2 --to-user 44105925
```

Deployed on Railway.app
