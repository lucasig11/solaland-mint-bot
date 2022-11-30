interface ISchedulerTask {
  startDate: Date;
}

export default class Scheduler<T extends ISchedulerTask> {
  private schedule: T[] = [];

  constructor(private readonly interval: number) {}

  public async run(callback: (task: T) => Promise<void>) {
    while (true) {
      const now = new Date();
      let task: T | undefined;

      while ((task = this.schedule.shift())) {
        if (task.startDate > now) continue;
        try {
          await callback(task);
        } catch (e) {
          console.error("Task failed:", e);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, this.interval));
    }
  }

  public add(...tasks: T[]) {
    this.schedule.push(...tasks);
  }
}
