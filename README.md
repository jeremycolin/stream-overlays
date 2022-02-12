### Setup

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

Go to [http://localhost:5000/samyz\_/overlay](http://localhost:5000/samyz_/overlay)

```
./twitch event trigger follow -F http://localhost:3000/eventsub -s YOUR_DARKEST_SECRET
```

### Test on live

Go to [https://streamoverlays.herokuapp.com/samyz\_/overlay](https://streamoverlays.herokuapp.com/samyz_/overlay)

```
./twitch event trigger follow -F https://streamoverlays.herokuapp.com/eventsub -s YOUR_DARKEST_SECRET
```
