import * as path from "path";
import chalk from "chalk";
import Spinnies from "spinnies";
import { codeFrameColumns } from "@babel/code-frame";
import { Diagnostic } from "./Reporter";

function formatType(diagnostic: Diagnostic) {
  switch (diagnostic.type) {
    case "error":
      return chalk.bold.bgRed("ERROR");
    case "warning":
      return chalk.bold.bgYellow("WARN");
    case "information":
      return chalk.bold.bgBlue("INFO");
  }
}

function formatTaskName(taskName: string) {
  return chalk.bold.cyan(taskName);
}

function formatLocation(diagnostic: Diagnostic) {
  if (diagnostic.location) {
    const file = diagnostic.location.file
      ? chalk.bold(path.relative(process.cwd(), diagnostic.location.file))
      : "";
    if (diagnostic.location.start) {
      return `${file}:${diagnostic.location.start.line}:${diagnostic.location.start.column}`;
    } else {
      return file;
    }
  }
  return "";
}

function findIndexOfOccurrence(
  string: string,
  pattern: RegExp,
  occurrence: number
): number | undefined {
  let count = 0;
  let match;
  do {
    match = pattern.exec(string);
    console.log(match);
    if (match && count === occurrence) {
      return match.index;
    }
    ++count;
  } while (match);
  return undefined;
}

function formatCode(diagnostic: Diagnostic) {
  if (!diagnostic.code) {
    return "";
  }
  if (!diagnostic.location) {
    return "";
  }
  if (!diagnostic.location.start) {
    return "";
  }

  const result = codeFrameColumns(
    diagnostic.code,
    {
      start: diagnostic.location.start,
      end: diagnostic.location.end
    },
    {
      highlightCode: true,
      linesAbove: 3,
      linesBelow: 3
    }
  );
  return result;
}

function getPrintMethod(diagnostic: Diagnostic) {
  if (diagnostic.type === "error") {
    return process.stderr.write.bind(process.stderr);
  } else {
    return process.stdout.write.bind(process.stdout);
  }
}

function printDiagnostic(taskName: string, diagnostic: Diagnostic) {
  const printMethod = getPrintMethod(diagnostic);
  printMethod(
    `${formatType(diagnostic)} ${formatTaskName(taskName)} ${formatLocation(
      diagnostic
    )}\n`
  );
  printMethod(`${diagnostic.message}\n`);
  printMethod(`${formatCode(diagnostic)}\n\n`);
}

export class Printer {
  private spinners = new Spinnies();
  private spinnerNames: string[] = [];

  public onTaskStart(taskName: string) {
    this.spinnerNames.push(taskName);
    this.spinners.add(taskName);
  }

  public onTaskFinish(taskName: string, diagnostics: Diagnostic[]) {
    const isFailure = diagnostics.some(d => d.type === "error");
    if (isFailure) {
      this.spinners.fail(taskName);
    } else {
      this.spinners.succeed(taskName);
    }
    diagnostics.forEach(diagnostic => printDiagnostic(taskName, diagnostic));
  }

  public onAllTasksStart() {
    // TODO: clear
    Object.keys(this.spinnerNames).forEach(taskName => {
      this.spinners.remove(taskName);
    });
    this.spinnerNames = [];
  }

  public onAllTasksFinish() {}
}
