import { Injectable } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  addCronJob(name: string, expression: CronExpression, cb: () => void) {
    const newCronJob = new CronJob(expression, cb);
    this.schedulerRegistry.addCronJob(name, newCronJob);

    newCronJob.start();
  }
}
