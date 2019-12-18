import {
  Diagnostic as TypeScriptDiagnostic,
  flattenDiagnosticMessageText
} from "typescript";
import { Diagnostic as ReporterDiagnostic } from "../../utils/reporter";

export const mapTypescriptDiagnosticToReporterDiagnostic = (
  diagnostic: TypeScriptDiagnostic
): ReporterDiagnostic => {
  let message = flattenDiagnosticMessageText(diagnostic.messageText, "\n");

  if (!diagnostic.file) {
    return {
      type: "error",
      message
    };
  }

  let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
    diagnostic.start!
  );

  return {
    type: "error",
    message,
    location: {
      file: diagnostic.file.fileName,
      start: {
        line: line + 1,
        column: character + 1
      }
    },
    code: diagnostic.file.text
  };
};
