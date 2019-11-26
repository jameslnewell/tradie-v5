import { CLIEngine } from "eslint";
import { mapReportToDiagnostics } from "./mapReportToDiagnostics";

export interface LinterOptions {
  rootDirectory: string;
}

export class Linter {
  private cli: CLIEngine;

  public constructor(options: LinterOptions) {
    this.cli = new CLIEngine({
      cwd: options.rootDirectory,
      baseConfig: require("../../../eslint-config"),
      useEslintrc: false
    });
  }

  public lint(files: string[]) {
    return mapReportToDiagnostics(this.cli.executeOnFiles(files));
  }
}
