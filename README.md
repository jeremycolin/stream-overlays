# Stream Overlays for Twitch

### Setup

```
yarn install
```

#### Environment variables

Create a file `packages/server/.env` file containing the values for the following environment variables:

```
TWITCH_CLIENT_ID=YOUR_CLIENT_ID
TWITCH_CLIENT_SECRET=YOUR_DARKEST_SECRET
TWITCH_API_TOKEN=YOUR_API_TOKEN
```

### Install project

```
yarn start
```

### Test locally

Start server:

```
cd packages/server && yarn start
```

Start client:

```
cd packages/client && yarn start
```

Examples:

For `samyz_`: `http://localhost:5000/samyz_/live`

```
./twitch event trigger follow -F http://localhost:3000/eventsub -s YOUR_DARKEST_SECRET --to-user 151809327
```

For `askowbol`: `http://localhost:5000/askowbol/live`

```
./twitch event trigger follow -F http://localhost:3000/eventsub -s YOUR_DARKEST_SECRET --to-user 44105925
```

### Test on live

For `samyz_`: `https://stream-overlays-production.up.railway.app/samyz_/live`

```
./twitch event trigger follow -F https://stream-overlays-production.up.railway.app/eventsub -s YOUR_DARKEST_SECRET --to-user 151809327
```

For `askowbol`: `https://stream-overlays-production.up.railway.app/askowbol/live`

```
./twitch event trigger follow -F https://stream-overlays-production.up.railway.app/eventsub -s YOUR_DARKEST_SECRET --to-user 44105925
```
