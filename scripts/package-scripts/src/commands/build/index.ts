import { Arguments } from "yargs";
import { Reporter } from "../../utils/reporter";
import { rootDirectory, outputDirectory } from "../../utils/paths";
import { Linter } from "../../utils/linting";
import { Typechecker } from "../../utils/typing";
import { listFiles } from "./listFiles";
import { createBundles } from "./createBundles";

export const command = "build";
export const describe = "Build the package.";
export const builder = {
  tsconfig: {
    describe: "Path to a tsconfig file"
  }
  // watch: {
  //   alias: 'w',
  //   default: false,
  //   describe: 'Watch files for changes and rebuild when files change.'
  // }
};
export const handler = async (args: Arguments<{ tsconfig?: string }>) => {
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
      tsconfig: args.tsconfig,
      rootDirectory,
      outputDirectory,
      declaration: {
        include: ["src/**"],
        exclude: [
          "**/__tests__/**",
          "**/__fixtures__/**",
          "**/*.test{s,}.{ts,tsx}"
        ]
      }
    });

    const bundleTask = async () => {
      const taskName = "bundling";
      try {
        reporter.startTask(taskName);
        await createBundles({ rootDirectory, outputDirectory });
      } catch (error) {
        console.log(error);
        reporter.report(taskName, {
          type: "error",
          message: String(error)
        });
      } finally {
        reporter.finishTask(taskName);
      }
    };

    const typingTask = async () => {
      const taskName = "typing";
      try {
        reporter.startTask(taskName);
        reporter.report(taskName, checker.run(files));
      } catch (error) {
        reporter.report(taskName, {
          type: "error",
          message: String(error)
        });
      } finally {
        reporter.finishTask(taskName);
      }
    };

    const lintingTask = async () => {
      const taskName = "linting";
      try {
        reporter.startTask(taskName);
        reporter.report(taskName, linter.lint(files));
      } catch (error) {
        reporter.report(taskName, {
          type: "error",
          message: String(error)
        });
      } finally {
        reporter.finishTask(taskName);
      }
    };

    await Promise.all([bundleTask(), typingTask(), lintingTask()]);

    if (reporter.errored) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error("FATAL ERROR:");
    console.error(error);
    process.exitCode = 1;
  }
};
