#!/usr/bin/env node
import "@babel/polyfill";
import yargs from "yargs";

yargs
  .scriptName("package-scripts")
  .usage("$0 <cmd> [args]")
  .demandCommand()
  .commandDir("./commands", { recurse: true, extensions: ["ts", "js"] })
  .strict()
  .version()
  .help().argv;
