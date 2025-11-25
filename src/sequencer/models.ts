// import type { AsyncStep } from "./AsyncStep";
// import type { ValueStep } from "./ValueStep";
// import type { CallbackStep } from "./CallbackStep";
// import type { DelayStep } from "./DelayStep";
// import type { ValueStep } from "./ValueStep";

// export type Step<ValueType = unknown> =
//   | AsyncStep<ValueType>
//   | ValueStep<ValueType>;
// // | DelayStep
// // | CallbackStep<ValueType>
// // | ValueStep<ValueType>;

export class Step<ValueType = unknown, TimingPayload = unknown> {
  public constructor(
    public readonly delay: number,
    public readonly value: ValueType,
    public readonly duration?: number,
    public readonly payload?: TimingPayload
  ) {}
}

export class StepController<
  ValueType = unknown,
  TimingPayload = unknown
> extends Step<ValueType, TimingPayload> {
  public constructor(step: Step<ValueType, TimingPayload>) {
    super(step.delay, step.value, step.duration, step.payload);
  }

  public next() {
    
  }
}
