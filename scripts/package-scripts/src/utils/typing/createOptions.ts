import * as path from "path";
import debug from "debug";
import * as ts from "typescript";

export interface CreateOptionsOptions {
  tsconfig?: string;
  rootDirectory: string;
  outputDirectory: string;
}

const print = debug("@tradie/package-scripts:typescript");

// TODO: check compiler options match the defaults
function checkRawConfig(config: { [name: string]: any }) {
  if (!Array.isArray(config.include) || !config.include.includes("src")) {
    // throw new Error(`"include" must equal "src"`);
  }
}

function checkParsedConfig(config: { [name: string]: any }) {}

export function createOptions({
  rootDirectory,
  outputDirectory,
  tsconfig
}: CreateOptionsOptions): ts.CompilerOptions {
  const defaultOptions = {
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    isolatedModules: true,
    noEmitOnError: true,
    declaration: true,
    emitDeclarationOnly: true,
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    // TODO: only force if react is installed
    // jsx: ts.JsxEmit.React,
    // lib: ["esnext", "dom"],
    outDir: outputDirectory
  };

  const configFilePath = ts.findConfigFile(
    rootDirectory,
    ts.sys.fileExists,
    tsconfig
  );

  if (!configFilePath) {
    print("config not found - using defaults");
    return defaultOptions;
  }

  print("config found - using %s", path.normalize(configFilePath));
  const configContent = ts.readConfigFile(configFilePath, ts.sys.readFile);

  checkRawConfig(configContent.config);
  // TODO: check for errors - config.errors
  const parseResult = ts.parseJsonConfigFileContent(
    configContent.config,
    ts.sys,
    rootDirectory,
    {},
    configFilePath
  );
  checkParsedConfig(parseResult.options);
  // TODO: check for errors - parseResult.errors
  return {
    ...parseResult.options,
    ...defaultOptions
  };
}
