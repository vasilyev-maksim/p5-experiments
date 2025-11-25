import type { Step } from "./models";
import { Pipeline } from "./Pipeline";
import { PipelineItem } from "./PipelineItem";
import { checkExhaustiveness, Event } from "../utils";
import { AsyncStep } from "./AsyncStep";
import { ValueStep } from "./ValueStep";

export class Sequence<ValueType = unknown> {
  private _currentValue: ValueType | null = null;
  private readonly _pipeline = new Pipeline();
  public readonly onValueChange = new Event<ValueType | null>();

  public get value() {
    return this._currentValue;
  }
  private set value(val) {
    this._currentValue = val;
    this.onValueChange.__invokeCallbacks(this._currentValue);
  }

  public constructor(public readonly id: string, steps: Step<ValueType>[]) {
    this.addSteps(steps);
  }

  public addStep(step: Step<ValueType>) {
    const item = this._convertStepToPipelineItem(step);
    this._pipeline.addItem(item);
  }

  public addSteps(steps: Step<ValueType>[]) {
    steps.forEach((step) => {
      const item = this._convertStepToPipelineItem(step);
      this._pipeline.addItem(item);
    });
  }

  public start = () => {
    this._pipeline.run();
  };

  public get activeRunner() {
    return this._pipeline.activeRunner;
  }

  // public completeCurrentStep = () => {
  //   this._pipeline.activeRunner?.forceComplete();
  // };

  public pause = () => {};

  public reset = () => {};

  private _convertStepToPipelineItem(step: Step<ValueType>): PipelineItem {
    switch (true) {
      case step instanceof AsyncStep:
        return new PipelineItem(async (next) => {
          await new Promise((r) => setTimeout(r, step.delayInMs));
          const promise =
            step.callback(
              () => this.value,
              (val: ValueType) => {
                this.value = val;
              }
            ) ?? Promise.resolve();
          await promise;
          next();
        });
      case step instanceof ValueStep:
        return new PipelineItem(async (next) => {
          if ((step.delayInMs ?? 0) > 0) {
            await new Promise((r) => setTimeout(r, step.delayInMs));
          }
          this.value = step.value;
          next();
        });
      default:
        checkExhaustiveness(step, "Unknown step type");
    }
    // switch (true) {
    //   case step instanceof CallbackStep:
    //     return new PipelineItem((next) => {
    //       const promise =
    //         step.callback(
    //           () => this.value,
    //           (val: ValueType) => {
    //             this.value = val;
    //           }
    //         ) ?? Promise.resolve();

    //       promise.then(next);
    //     });
    //   case step instanceof ValueStep:
    //     return new PipelineItem((next) => {
    //       this.value = step.value;
    //       next();
    //     });
    //   case step instanceof DelayStep:
    //     return new PipelineItem((next) => {
    //       setTimeout(() => {
    //         next();
    //       }, step.duration);
    //     });
    //   default:
    //     checkExhaustiveness(step, "Unknown step type");
    // }
  }
}
