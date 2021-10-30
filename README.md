# NPM Registry

This is monorepo which contains application `packages`:

- [@alias/server](./packages/server/README.md)
- [@alias/client-web](./packages/client-web/README.md)

## Prerequisite

- [Node.js](https://nodejs.org/en/download/)
- [nvm](https://github.com/nvm-sh/nvm/blob/master/README.md)

## Install dependencies

```
nvm install
npm install
```

## Local Development

To start locally, which uses docker (only) for mongodb:

```
npm run start
```

## Documentation

- [Existing exercise documentation](./docs/EXERCISE.md)
- [TODO and improvements](./docs/TODO.md)
