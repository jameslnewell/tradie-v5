import { Printer } from "./Printer";

export interface Diagnostic {
  type: "information" | "warning" | "error";
  message: string;
  location?: {
    file?: string;
    start?: { line: number; column: number };
    end?: { line: number; column: number };
  };
  code?: string; // see https://www.npmjs.com/package/babel-code-frame
}

export interface ReporterOptions {
  watching?: boolean;
}

export class Reporter {
  private watching: boolean;
  private runningTaskCount: number = 0;
  private runningTaskNames: string[] = [];
  private diagnosticsByTask: Record<string, Diagnostic[]> = {};

  private promise: Promise<void>;
  private resolve: undefined | (() => void) = undefined;
  // @ts-ignore
  private reject: undefined | (() => void) = undefined;

  private printer = new Printer();

  public constructor({ watching = false }: ReporterOptions = {}) {
    this.watching = watching;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  /**
   * Gets the number of tasks running
   */
  public get running(): number {
    return this.runningTaskCount;
  }

  /**
   * Gets whether errors have been reported
   */
  public get errored(): boolean {
    return Object.keys(this.diagnosticsByTask).reduce<boolean>(
      (error, task) =>
        error ||
        this.diagnosticsByTask[task].some(
          diagnostic => diagnostic.type === "error"
        ),
      false
    );
  }

  /**
   * Starts a task running
   * @param taskName
   */
  public startTask(taskName: string): void {
    // check if the task is already started??? or let multiple of the same task be started??
    const isFirstTaskToStart = this.runningTaskCount === 0;
    this.runningTaskCount++;

    if (!this.runningTaskNames.includes(taskName)) {
      this.runningTaskNames.push(taskName);
    }

    if (isFirstTaskToStart) {
      this.diagnosticsByTask = {};
      this.printer.onAllTasksStart();
    }

    this.diagnosticsByTask[taskName] = [];

    this.printer.onTaskStart(taskName);
  }

  /**
   * Finishes a task running
   * @param taskName
   */
  public finishTask(taskName: string): void {
    if (!this.runningTaskNames.includes) {
      throw new Error(`Task "${taskName} hasn't been started yet.`);
    }

    this.runningTaskCount--;
    this.runningTaskNames = this.runningTaskNames.filter(tn => tn !== taskName);

    this.printer.onTaskFinish(taskName, this.diagnosticsByTask[taskName]);

    setTimeout(() => {
      if (this.runningTaskCount === 0) {
        if (!this.watching && this.resolve) {
          this.resolve();
        }
        this.printer.onAllTasksFinish();
      }
    }, 0);
  }

  public report(taskName: string, diagnostic: Diagnostic | Diagnostic[]) {
    if (!this.runningTaskNames.includes(taskName)) {
      throw new Error(`Task "${taskName} hasn't been started yet.`);
    }
    this.diagnosticsByTask[taskName] = this.diagnosticsByTask[taskName].concat(
      diagnostic
    );
  }

  /**
   * Wait for the currently running tasks to complete or until we're no longer in watch mode
   */
  public wait(): Promise<void> {
    return this.promise;
  }

  /**
   * Stop watching so .wait() resolves after the currently running tasks are finished
   */
  public cancel(): void {
    this.watching = false;
  }
}
