import { createApp } from './app';

const port = process.env.PORT ?? 4000;

async function main() {
  createApp().listen(port);
  console.info(`Server listening at http://localhost:${port}`);
}

main();
