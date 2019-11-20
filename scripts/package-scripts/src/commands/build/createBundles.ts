import * as fs from "fs";
import * as path from "path";
import { rollup, InputOptions, OutputOptions } from "rollup";
import babel = require("rollup-plugin-babel");

export interface CreateBundlesOptions {
  rootDirectory: string;
  outputDirectory: string;
}

const createExternals = ({ rootDirectory }: { rootDirectory: string }) => {
  const manifest = require(path.resolve(rootDirectory, "package.json"));
  const regexps = [
    ...Object.keys(manifest.dependencies || {}),
    ...Object.keys(manifest.dependencies || {})
  ].map(dependency => new RegExp(`^${dependency}($|\/.+)`));
  return (source: string) => regexps.some(regexp => regexp.test(source));
};

const createInputOptions = ({
  rootDirectory
}: {
  rootDirectory: string;
}): InputOptions => {
  const extensions = [".ts", ".tsx", ".js"];
  return {
    cache: false,
    input: fs.existsSync("./src/index.tsx")
      ? "./src/index.tsx"
      : "./src/index.ts",
    external: createExternals({ rootDirectory }),
    plugins: [
      babel({
        extensions,
        exclude: "node_modules/**",
        babelrc: false,
        presets: ["@jameslnewell/babel-preset"]
      })
    ]
  };
};

const createOutputOptions = ({
  outputDirectory
}: {
  outputDirectory: string;
}): OutputOptions[] => {
  return [
    {
      file: `${outputDirectory}/index.cjs.js`,
      format: "cjs",
      sourcemap: true
    },
    {
      file: `${outputDirectory}/index.esm.js`,
      format: "es",
      sourcemap: true
    }
  ];
};

export async function createBundles({
  rootDirectory,
  outputDirectory
}: CreateBundlesOptions) {
  const bundle = await rollup(createInputOptions({ rootDirectory }));
  await Promise.all(
    createOutputOptions({ outputDirectory }).map(outputOptions =>
      bundle.write(outputOptions)
    )
  );
}
