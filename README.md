Create a `packages/server/.env` file containing:

```
TWITCH_CLIENT_SECRET=YOUR_DARKEST_SECRET
```

Test

```
yarn start
```

```
./twitch event trigger follow -F http://localhost:8080/eventsub -s YOUR_DARKEST_SECRET
```
