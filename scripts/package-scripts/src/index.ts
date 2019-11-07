import yargs = require('yargs');

yargs
  .scriptName("package-scripts")
  .usage('$0 <cmd> [args]')
  .demandCommand()
  .commandDir('./commands', {extensions: ['ts']})
  .strict()
  .version()
  .help()
  .argv
