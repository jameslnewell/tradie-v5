process.env.BABEL_ENV = "test";

import { Arguments, Argv } from "yargs";
import jest from "jest";

export const command = "test";
export const describe = "Test the package.";
export const builder = (argv: Argv) => argv.strict(false);
export const handler = async (argv: Arguments) => {
  const jest_argv: string[] = [
    "--config",
    JSON.stringify({
      preset: "@jameslnewell/jest-preset-test",
      transform: {
        "^.+\\.(js|jsx|ts|tsx)$": [
          require.resolve("babel-jest"),
          {
            babelrc: false,
            presets: ["@jameslnewell/babel-preset"]
          }
        ]
      }
    })
  ];
  argv._.shift();
  argv._.forEach(key => jest_argv.push(key));
  await jest.run(jest_argv);
};
