import { Arguments } from "yargs";

export const command = "test";
export const describe = "Test the package.";
export const builder = {};
export const handler = (argv: Arguments) => {
  console.log("test called", argv);
};
