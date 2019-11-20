import * as path from "path";
import * as ts from "typescript";
import { isMatch } from "micromatch";

export interface CreateCompilerHostOptions {
  rootDirectory: string;
  outputDirectory: string;
  compilerOptions: ts.CompilerOptions;
  declaration: {
    include: string[];
    exclude: string[];
  };
}

export function createCompilerHost({
  rootDirectory,
  compilerOptions,
  declaration
}: CreateCompilerHostOptions) {
  const host = ts.createCompilerHost(compilerOptions);

  // don't emit/write declarations for supporting files like stories or tests
  const origWriteFile = host.writeFile;
  host.writeFile = (fileName, _2, _3, _4, sourceFiles) => {
    if (!sourceFiles) {
      origWriteFile(fileName, _2, _3, _4, sourceFiles);
      return;
    }

    // prevent declaration files from being written for certain files
    if (/\.d\.ts/.test(fileName)) {
      for (const sourceFile of sourceFiles) {
        const filePath = path.relative(rootDirectory, sourceFile.fileName);
        // TODO: remove casting when minimatch types are updated
        if (
          !isMatch(filePath, (declaration.include as unknown) as string) ||
          isMatch(filePath, (declaration.exclude as unknown) as string)
        ) {
          return;
        }
      }
    }

    origWriteFile(fileName, _2, _3, _4, sourceFiles);
  };

  return host;
}
