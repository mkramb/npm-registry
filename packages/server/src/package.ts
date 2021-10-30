import got from 'got';
import * as async from 'async';
import { RequestHandler } from 'express';
import { maxSatisfying } from 'semver';
import { NPMPackage, RemotePackageRoot } from './types';

let queue: async.QueueObject<RemotePackageRoot>;
let dependencyTree: RemotePackageRoot;

const MAX_CONCURRENCY = process.env.MAX_CONCURRENCY ?? 10;

/**
 * Attempts to retrieve package data from the npm registry and return it
 */
export const getPackage: RequestHandler = async function (req, res, next) {
  const { name, version } = req.params;

  queue = async.queue<RemotePackageRoot>((task, done) => {
    getDependencies(task, done);
  }, MAX_CONCURRENCY);

  try {
    const npmPackage= await got(`https://registry.npmjs.org/${name}`).json<NPMPackage>();
    const dependencies = npmPackage?.versions?.[version]?.dependencies ?? {};

    dependencyTree = {
      name,
      version,
      dependencies: {},
    };

    for (const [ depName, depVersion ] of Object.entries(dependencies)) {
      queue.push({
        name: depName,
        version: depVersion,
        dependencies: dependencyTree.dependencies,
      });
    }

    if (queue.length() > 0) {
      await queue.drain();
    }

    return res
      .status(200)
      .json(dependencyTree);
  } catch (error) {
    return next(error);
  }
};

async function getDependencies(task: RemotePackageRoot, done: async.ErrorCallback<Error>) {
  const npmPackage = await got(`https://registry.npmjs.org/${task.name}`).json<NPMPackage>();
  const selectedVersion = maxSatisfying(Object.keys(npmPackage.versions), task.version);

  if (selectedVersion) {
    const newDependencies = npmPackage.versions[selectedVersion].dependencies ?? {};

    task.dependencies[task.name] = {
      version: selectedVersion,
      dependencies: {},
    };

    for (const [ name, version ] of Object.entries(newDependencies)) {
      queue.push({
        name,
        version,
        dependencies: task.dependencies[task.name].dependencies,
      });
    }
  }

  done();
}