import {
  CompilerOptions,
  Program,
  CompilerHost,
  getPreEmitDiagnostics,
  sortAndDeduplicateDiagnostics
} from "typescript";
import { Diagnostic } from "../reporter";
import { createOptions } from "./createOptions";
import { createCompilerHost } from "./createCompilerHost";
import { createProgram } from "./createProgram";
import { mapTypescriptDiagnosticToReporterDiagnostic } from "./mapTypescriptDiagnosticToReporterDiagnostic";

export interface TypecheckerOptions {
  tsconfig?: string;
  rootDirectory: string;
  outputDirectory: string;
  declaration: {
    include: string[];
    exclude: string[];
  };
}

export class Typechecker {
  private options: CompilerOptions;
  private host: CompilerHost;
  private program: Program | undefined;

  public constructor(options: TypecheckerOptions) {
    this.options = createOptions({
      rootDirectory: options.rootDirectory,
      outputDirectory: options.outputDirectory,
      tsconfig: options.tsconfig
    });

    this.host = createCompilerHost({
      rootDirectory: options.rootDirectory,
      outputDirectory: options.outputDirectory,
      compilerOptions: this.options,
      declaration: options.declaration
    });
  }

  public run(files: string[]): Diagnostic[] {
    this.program = createProgram({
      files,
      options: this.options,
      host: this.host,
      program: this.program
    });

    // do the checking
    const result = this.program.emit();

    // return diagnostics
    return sortAndDeduplicateDiagnostics(
      getPreEmitDiagnostics(this.program).concat(result.diagnostics)
    ).map(diagnostic =>
      mapTypescriptDiagnosticToReporterDiagnostic(diagnostic)
    );
  }
}
