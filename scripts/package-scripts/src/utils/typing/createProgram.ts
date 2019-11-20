import * as ts from "typescript";

export interface CreateProgramOptions {
  host: ts.CompilerHost;
  files: string[];
  options: ts.CompilerOptions;
  program?: ts.Program;
}

export function createProgram({
  files,
  options,
  host,
  program
}: CreateProgramOptions): ts.Program {
  return ts.createProgram(files, options, host, program);
}
