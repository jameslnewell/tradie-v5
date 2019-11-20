import glob = require("fast-glob");

export interface ListFilesOptions {
  rootDirectory: string;
  include: string[];
  exclude?: string[];
}

export async function listFiles({
  rootDirectory,
  include,
  exclude
}: ListFilesOptions) {
  return await glob(include, {
    cwd: rootDirectory,
    ignore: exclude
  });
}
