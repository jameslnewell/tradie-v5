import * as fs from 'fs';
import * as path from 'path';
import {rollup, InputOptions, OutputOptions} from 'rollup';
import * as babel from 'rollup-plugin-babel';

export interface CreateBundlesOptions {
  cwd: string;
}

const createExternals = ({cwd}: CreateBundlesOptions) => {
  const manifest = require(path.resolve(cwd, 'package.json'));
  const regexps = [
    ...Object.keys(manifest.dependencies || {}),
    ...Object.keys(manifest.dependencies || {}),
  ].map(dependency => new RegExp(`^${dependency}($|\/.+)`));
  return (source: string) => regexps.some(regexp => regexp.test(source));
}

const createInputOptions = ({cwd}: CreateBundlesOptions): InputOptions => {
  const extensions = ['.ts', '.tsx', '.js']
  return {
    cache: false,
    input: fs.existsSync('./src/index.tsx') ? './src/index.tsx' : './src/index.ts',
    external: createExternals({cwd}),
    plugins: [
      babel({
        extensions,
        exclude: 'node_modules/**',
        babelrc: false,
        presets: ['@jameslnewell/babel-preset']
      })
    ]
  };
}

const createOutputOptions = ({cwd}: CreateBundlesOptions): OutputOptions[] => {
  return [
    {
      file: `${cwd}/dist/index.cjs.js`,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: `${cwd}/dist/index.esm.js`,
      format: 'es',
      sourcemap: true
    }
  ];
}

export async function createBundles({cwd}: CreateBundlesOptions) {
  const bundle = await rollup(createInputOptions({cwd}));
  await Promise.all(createOutputOptions({cwd}).map(outputOptions => bundle.write(outputOptions)));
}
