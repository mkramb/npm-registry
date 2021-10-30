import got from 'got';
import { Server } from 'http';
import { createApp } from '../src/app';
import { RemotePackageRoot } from '../src/types';

describe('/package/:name/:version endpoint', () => {
  let server: Server;
  let port: number;

  beforeAll(() => {
    return new Promise<void>((resolve, reject) => {
      server = createApp().listen(0, () => {
        const addr = server.address();

        if (addr && typeof addr === 'object') {
          port = addr.port;
          return resolve();
        }

        reject('Unexpected address ${addr} for server');
      });
    });
  });

  afterAll(() => {
    return new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('react 16.13.0', async () => {
    const packageName = 'react';
    const packageVersion = '16.13.0';

    const request = got(`http://localhost:${port}/package/${packageName}/${packageVersion}`);
    const toJSON = request.json<RemotePackageRoot>();

    const [ response, json ] = await Promise.all([ request, toJSON ]);

    expect(response.statusCode).toEqual(200);
    expect(json.name).toEqual(packageName);
    expect(json.version).toEqual(packageVersion);
    expect(json.dependencies).toMatchSnapshot();
  });
});