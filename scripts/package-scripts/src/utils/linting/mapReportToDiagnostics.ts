import { CLIEngine } from "eslint";
import { Diagnostic } from "../reporter";

export function mapReportToDiagnostics(
  report: CLIEngine.LintReport
): Diagnostic[] {
  return report.results.reduce<Diagnostic[]>((diagnostics, result) => {
    return [
      ...diagnostics,
      ...result.messages.map(message => {
        const diagnostic: Diagnostic = {
          type:
            message.severity === 2
              ? "error"
              : message.severity === 1
              ? "warning"
              : "information",
          message: message.ruleId
            ? `${message.ruleId}: ${message.message}`
            : message.message,
          location: {
            file: result.filePath,
            start: {
              line: message.line,
              column: message.column
            }
          },
          code: result.source
        };
        return diagnostic;
      })
    ];
  }, []);
}
