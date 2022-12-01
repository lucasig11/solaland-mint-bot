interface ISchedulerTask {
  startDate: Date;
}

export type SchedulerTaskResult = {
  status: "success" | "failure";
  data: any;
};

export class Scheduler<T extends ISchedulerTask> {
  public queue: T[] = [];

  constructor(
    private taskResultHandler?: (res: SchedulerTaskResult[]) => void
  ) {}

  public async run(callback: (task: T) => Promise<SchedulerTaskResult[]>) {
    while (true) {
      const now = new Date();
      let task: T | undefined;

      while ((task = this.queue.shift())) {
        if (task.startDate > now) {
          this.queue.push(task);
          break;
        }

        const res = await callback(task);
        if (this.taskResultHandler) {
          this.taskResultHandler(res);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}
