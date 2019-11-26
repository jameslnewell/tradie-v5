import { Reporter } from "../../utils/reporter";
import { rootDirectory, outputDirectory } from "../../utils/paths";
import { listFiles } from "./listFiles";
import { createBundles } from "./createBundles";
import { Linter } from "../../utils/linting";
import { Typechecker } from "../../utils/typing";

export const command = "build";
export const describe = "Build the package.";
export const builder = {
  // watch: {
  //   alias: 'w',
  //   default: false,
  //   describe: 'Watch files for changes and rebuild when files change.'
  // }
};
export const handler = async () => {
  // TODO: handle watching

  try {
    const reporter = new Reporter();

    const files = await listFiles({
      rootDirectory,
      include: ["src/**/*.{ts,tsx}", "typings/**/*.d.ts"]
    });

    const linter = new Linter({
      rootDirectory
    });

    const checker = new Typechecker({
      rootDirectory,
      outputDirectory,
      declaration: {
        include: ["src/**"],
        exclude: ["**/__tests__/**", "**/*.test{s,}.{ts,tsx}"]
      }
    });

    const bundleTask = async () => {
      const taskName = "bundling";
      reporter.startTask(taskName);
      await createBundles({ rootDirectory, outputDirectory });
      reporter.finishTask(taskName);
    };

    const typingTask = async () => {
      const taskName = "typing";
      reporter.startTask(taskName);
      reporter.report(taskName, checker.run(files));
      reporter.finishTask(taskName);
    };

    const lintingTask = async () => {
      const taskName = "linting";
      reporter.startTask(taskName);
      reporter.report(taskName, linter.lint(files));
      reporter.finishTask(taskName);
    };

    await Promise.all([bundleTask(), typingTask(), lintingTask()]);
  } catch (error) {
    console.error(error);
  }
};
