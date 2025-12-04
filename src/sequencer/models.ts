// import type { AsyncStep } from "./AsyncStep";
// import type { ValueStep } from "./ValueStep";
// import type { CallbackStep } from "./CallbackStep";
export type StepData<ValueType = unknown> =
  | AsyncStepData<ValueType>
  | SyncStepData<ValueType>;
// | DelayStep
// | CallbackStep<ValueType>
// | ValueStep<ValueType>;

export class SyncStepData<ValueType = unknown> {
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

export type StepController<ValueType = unknown, TimingPayload = unknown> =
  | SyncStepController<ValueType>
  | AsyncStepController<ValueType, TimingPayload>;

export class SyncStepController<ValueType = unknown> {
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
    // this.pipelineItem.next();
  }
}
