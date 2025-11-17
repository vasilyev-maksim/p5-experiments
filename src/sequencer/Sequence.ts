import { checkExhaustiveness } from "../utils";
import { CallbackStep } from "./CallbackStep";
import { DelayStep } from "./DelayStep";
import type { IPipelineItem, Step } from "./models";
import { Pipeline } from "./Pipeline";
import { PipelineItem } from "./PipelineItem";
import { ValueStep } from "./ValueStep";
import { Event } from "../utils";

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

  public addStep(step: Step<ValueType>) {
    const item = this._convertStepToPipelineItem(step);
    this._pipeline.addItem(item);
  }

  public start = () => {
    this._pipeline.run();
  };

  public pause = () => {};

  public reset = () => {};

  private _convertStepToPipelineItem(step: Step<ValueType>): IPipelineItem {
    switch (true) {
      case step instanceof CallbackStep:
        return new PipelineItem((next) => {
          step.callback(
            () => this.value,
            (val: ValueType) => {
              this.value = val;
            }
          );
          next();
        });
      case step instanceof ValueStep:
        return new PipelineItem((next) => {
          this.value = step.value;
          next();
        });
      case step instanceof DelayStep:
        return new PipelineItem((next) => {
          setTimeout(() => {
            next();
          }, step.duration);
        });
      default:
        checkExhaustiveness(step, "Unknown step type");
    }
  }
}
