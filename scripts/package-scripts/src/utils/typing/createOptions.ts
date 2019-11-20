import * as ts from "typescript";

export interface CreateOptionsOptions {
  tsconfig?: string;
  rootDirectory: string;
  outputDirectory: string;
}

// TODO: check compiler options match the defaults
function checkConfig(config: { [name: string]: any }) {
  if (!Array.isArray(config.include) || !config.include.includes("src")) {
    throw new Error(`"include" must equal "src"`);
  }
}

export function createOptions({
  rootDirectory,
  outputDirectory,
  tsconfig
}: CreateOptionsOptions): ts.CompilerOptions {
  const defaultOptions = {
    esModuleInterop: true,
    noEmitOnError: true,
    declaration: true,
    emitDeclarationOnly: true,
    // TODO: only force if react is installed
    jsx: ts.JsxEmit.React,
    // lib: ["esnext", "dom"],
    outDir: outputDirectory
  };

  const configFilePath = ts.findConfigFile(
    rootDirectory,
    ts.sys.fileExists,
    tsconfig
  );

  if (configFilePath) {
    const configContent = ts.readConfigFile(configFilePath, ts.sys.readFile);
    checkConfig(configContent.config);
    const parseConfigHost: ts.ParseConfigHost = {
      fileExists: ts.sys.fileExists,
      readFile: ts.sys.readFile,
      readDirectory: ts.sys.readDirectory,
      useCaseSensitiveFileNames: true
    };
    const compilerOptions = ts.parseJsonConfigFileContent(
      configContent.config,
      parseConfigHost,
      rootDirectory
    );
    // TODO: check for errors
    return {
      ...compilerOptions.options,
      ...defaultOptions
    };
  }

  return defaultOptions;
}
