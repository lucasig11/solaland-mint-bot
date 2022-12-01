interface ISchedulerTask {
  startDate: Date;
}

export default class Scheduler<T extends ISchedulerTask> {
  private queue: T[] = [];

  public async run(callback: (task: T) => Promise<void>) {
    while (true) {
      const now = new Date();
      let task: T | undefined;

      while ((task = this.queue.shift())) {
        if (task.startDate > now) {
          this.queue.push(task);
          break;
        }

        try {
          await callback(task);
        } catch (e) {
          console.error("Task failed:", e);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  public add(...tasks: T[]) {
    this.queue.push(...tasks);
  }
}
