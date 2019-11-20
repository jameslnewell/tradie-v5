import * as Spinnies from "spinnies";
import { Diagnostic } from "./Reporter";

function getType(diagnostic: Diagnostic) {
  switch (diagnostic.type) {
    case "error":
      return "ERROR";
    case "warning":
      return "WARN";
    case "information":
      return "INFO";
  }
}

function getPrintMethod(diagnostic: Diagnostic) {
  if (diagnostic.type === "error") {
    return process.stderr.write.bind(process.stderr);
  } else {
    return process.stdout.write.bind(process.stdout);
  }
}

function printDiagnostic(diagnostic: Diagnostic) {
  const printMethod = getPrintMethod(diagnostic);
  if (diagnostic.location) {
    if (diagnostic.location.start) {
      printMethod(
        `${getType(diagnostic)} ${diagnostic.location.file}:${
          diagnostic.location.start.line
        }:${diagnostic.location.start.column}\n`
      );
    } else {
      printMethod(`${getType(diagnostic)} ${diagnostic.location.file}\n`);
    }
  }
  printMethod(`${diagnostic.message}\n`);
  if (diagnostic.code) {
    printMethod(`${diagnostic.code}\n`);
  }
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
    diagnostics.forEach(printDiagnostic);
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
