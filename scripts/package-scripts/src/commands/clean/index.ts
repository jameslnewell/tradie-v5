import * as fs from "fs-extra";
import { Reporter } from "@tradie/reporter-utils";
import { outputDirectory } from "../../utils/paths";

export const command = "clean";
export const describe = "Clean the created assets.";
export const builder = {};
export const handler = async () => {
  const reporter = new Reporter();
  reporter.startTask("cleaning");
  try {
    await fs.remove(outputDirectory);
  } catch (error) {
    reporter.report("cleaning", {
      type: "error",
      message: error
    });
  }
  reporter.finishTask("cleaning");
};
