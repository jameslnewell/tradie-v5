import {createBundles} from './createBundles';
import {checkAndCreateTypings} from './checkAndCreateTypings';

export const command = 'build';
export const describe = 'Build the package.';
export const builder = {};
export const handler = async (argv) => {
  // TODO: handle watching
  await createBundles({cwd: process.cwd()}); // TODO: find dir up
  await checkAndCreateTypings({cwd: process.cwd()});
}

// reporter.notifyTaskStarted('bundling')
// reporter.notifyTaskStarted('linting')
// reporter.notifyTaskStarted('typing')

// reporter.notifyTaskFinished('bundling')
// reporter.notifyTaskFinished('linting')
// reporter.notifyTaskFinished('typing')

// reporter.notifyOfInformation(info_details)
// reporter.notifyOfWarning(warning_details)
// reporter.notifyOfError(error_details)

// reporter.active_task_count: number
// reporter.shouldWatch: boolean
// reporter.shouldClearScreen: boolean

// reporter.wait() // waits for any active tasks to finish
// reporter.stop()
