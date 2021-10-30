import got from 'got';
import async from 'async';
import express from 'express';
import { RequestHandler } from 'express';
import { maxSatisfying } from 'semver';

import { NPMPackage, RemotePackageRoot } from '../types';
import { Logger } from 'pino';

let queue: async.QueueObject<RemotePackageRoot>;
let dependencyTree: RemotePackageRoot;

const MAX_CONCURRENCY = process.env.MAX_CONCURRENCY ?? 10;

/**
 * Attempts to retrieve package data from the npm registry and return it
 */
export const getPackage: RequestHandler = async function (
  req: express.Request,
  res,
  next
) {
  const { log } = req;
  const { name, version } = req.params;

  log.info({
    message: 'Started retrieving dependencies',
  });

  queue = async.queue<RemotePackageRoot>((task, done) => {
    getDependencies(task, done, log);
  }, MAX_CONCURRENCY);

  try {
    const npmPackage = await got(
      `https://registry.npmjs.org/${name}`
    ).json<NPMPackage>();

    log.info({
      message: 'Fetching root dependencies',
    });

    const dependencies = npmPackage?.versions?.[version]?.dependencies ?? {};

    dependencyTree = {
      name,
      version,
      dependencies: {},
    };

    for (const [depName, depVersion] of Object.entries(dependencies)) {
      log.info({
        message: `Adding work to queue for dependency: ${depName}`,
      });

      queue.push({
        name: depName,
        version: depVersion,
        dependencies: dependencyTree.dependencies,
      });
    }

    if (queue.length() > 0) {
      await queue.drain();
    }

    log.info({
      message: 'Retrieved all dependencies',
    });

    return res.status(200).json(dependencyTree);
  } catch (error) {
    return next(error);
  }
};

async function getDependencies(
  task: RemotePackageRoot,
  done: async.ErrorCallback<Error>,
  log: Logger
) {
  const npmPackage = await got(
    `https://registry.npmjs.org/${task.name}`
  ).json<NPMPackage>();
  const selectedVersion = maxSatisfying(
    Object.keys(npmPackage.versions),
    task.version
  );

  if (selectedVersion) {
    const newDependencies =
      npmPackage.versions[selectedVersion].dependencies ?? {};

    task.dependencies[task.name] = {
      version: selectedVersion,
      dependencies: {},
    };

    for (const [name, version] of Object.entries(newDependencies)) {
      log.info({
        message: `Adding work to queue for dependency: ${name}`,
      });

      queue.push({
        name,
        version,
        dependencies: task.dependencies[task.name].dependencies,
      });
    }
  }

  done();
}
