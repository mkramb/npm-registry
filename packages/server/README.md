# @app/server

>  The server is implemented using `express`, `cors` is enabled and has basic security in place (using `helmet` middleware). API is completely **decoupled** from actual clients, which are only static resources and can be served and deployed separately (e.g. using a CDN).

## Local Development

To start locally:

```
npm run start
npm run test
```

## Production Build

```
npm run build
node ./dist/app.js
```
