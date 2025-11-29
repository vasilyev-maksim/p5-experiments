// import type { AsyncStep } from "./AsyncStep";
// import type { ValueStep } from "./ValueStep";
// import type { CallbackStep } from "./CallbackStep";
// import type { DelayStep } from "./DelayStep";
// import type { ValueStep } from "./ValueStep";

import type { PipelineItem } from "./PipelineItem";

// export type Step<ValueType = unknown> =
//   | AsyncStep<ValueType>
//   | ValueStep<ValueType>;
// // | DelayStep
// // | CallbackStep<ValueType>
// // | ValueStep<ValueType>;

export class StepData<ValueType = unknown> {
  public constructor(
    public readonly delay: number,
    public readonly value: ValueType,
    /** 0 by default */
    public readonly duration?: number
  ) {}
}

export class AsyncStepData<ValueType = unknown, TimingPayload = unknown> {
  public constructor(
    public readonly delay: number,
    public readonly value: ValueType,
    public readonly payload?: TimingPayload
  ) {}
}

export class StepController<ValueType = unknown> {
  public constructor(
    // public readonly pipelineItem: PipelineItem,
    public readonly delay: number,
    public readonly value: ValueType,
    /** 0 by default */
    public readonly duration?: number
  ) {}
}

export class AsyncStepController<ValueType = unknown, TimingPayload = unknown> {
  public constructor(
    // private readonly pipelineItem: PipelineItem,
    public readonly delay: number,
    public readonly value: ValueType,
    public readonly payload?: TimingPayload
  ) {}

  public next() {
    this.pipelineItem.next();
  }
}
