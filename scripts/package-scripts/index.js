#!/usr/bin/env node
require("ts-node").register({ transpileOnly: true });
require("tsconfig-paths").register({
  baseUrl: "../..",
  paths: {
    // wildcards aren't supported unfortunately
    "@tradie/reporter-utils": ["utilities/reporter-utils/src"]
  }
});
require("./src");
