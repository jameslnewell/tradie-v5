import { Reporter } from "./Reporter";

describe("Reporter", () => {
  test("task count increases and decreases when a task starts or finishes", async () => {
    const reporter = new Reporter();
    expect(reporter.running).toEqual(0);
    reporter.startTask("foo");
    expect(reporter.running).toEqual(1);
    reporter.startTask("bar");
    expect(reporter.running).toEqual(2);
    reporter.finishTask("bar");
    expect(reporter.running).toEqual(1);
    reporter.finishTask("foo");
    expect(reporter.running).toEqual(0);
    reporter.startTask("XYZ");
    expect(reporter.running).toEqual(1);
    reporter.finishTask("XYZ");
    expect(reporter.running).toEqual(0);
  });

  test.only("resolves when all tasks are finished", async () => {
    const reporter = new Reporter();
    setTimeout(() => {
      reporter.startTask("foobar");
      expect(reporter.running).toBeTruthy();
    }, 1);
    setTimeout(() => {
      expect(reporter.running).toBeTruthy();
      reporter.finishTask("foobar");
    }, 2);
    await reporter.wait();
    expect(reporter.running).toBeFalsy();
  });

  test("prints messages when all tasks are finished", async () => {
    const reporter = new Reporter({ watching: true });

    setTimeout(() => {
      reporter.startTask("linting");
      reporter.startTask("typing");
      reporter.startTask("bundling");
    }, 100);

    setTimeout(() => {
      reporter.finishTask("linting");
    }, 750);

    setTimeout(() => {
      reporter.finishTask("typing");
    }, 1500);

    setTimeout(() => {
      reporter.finishTask("bundling");
    }, 3000);

    await reporter.wait();
  });
});
