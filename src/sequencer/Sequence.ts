import {
  AsyncStepController,
  AsyncStepData,
  StepController,
  StepData,
} from "./models";
import { Pipeline } from "./Pipeline";
import { PipelineItem } from "./PipelineItem";
import { checkExhaustiveness, Event } from "../utils";

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

  public constructor(public readonly id: string, steps: StepData<ValueType>[]) {
    this.addSteps(steps);
  }

  public addStep(step: StepData<ValueType>) {
    const item = this._convertToStep(step);
    this._pipeline.addItem(item);
  }

  public addSteps(steps: StepData<ValueType>[]) {
    steps.forEach((step) => this.addStep(step));
  }

  public start = () => {
    this._pipeline.run();
  };

  public get activeRunner() {
    return this._pipeline.activeItem;
  }

  // public completeCurrentStep = () => {
  //   this._pipeline.activeRunner?.forceComplete();
  // };

  public pause = () => {};

  public reset = () => {};

  private _convertToStep(
    step: StepData<ValueType> | AsyncStepData<ValueType>
  ): StepController | AsyncStepController {
    switch (true) {
      case step instanceof AsyncStepData: {
        const pItem = new PipelineItem(async (next) => {
          await new Promise((r) => setTimeout(r, step.delay));
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
        return new AsyncStepController(step.delay, step.value, step.payload);
      }
      case step instanceof StepData: {
        const pItem = new PipelineItem(async (next) => {
          if ((step.delay ?? 0) > 0) {
            await new Promise((r) => setTimeout(r, step.delay));
          }
          this.value = step.value;
          next();
        });
        return new StepController(pItem, step.delay, step.value, step.duration);
      }
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
