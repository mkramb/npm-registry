import { getServerUrl } from "./getServerUrl";

async function getPackage(npmPackage: string) {
  const response = await fetch(`${getServerUrl()}/package/${npmPackage}`);
  const data = await response.json() as Record<string, unknown>;

  return data;
}

export { getPackage };
