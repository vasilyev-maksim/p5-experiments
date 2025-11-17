import type { CallbackStep } from "./CallbackStep";
import type { DelayStep } from "./DelayStep";
import type { ValueStep } from "./ValueStep";

export interface IPipelineItem {
  run(): void;
  runBackwards(): void;
  bindNext(nextItem: IPipelineItem): void;
  bindPrev(nextItem: IPipelineItem): void;
}

export type Step<ValueType = unknown> =
  | DelayStep
  | CallbackStep<ValueType>
  | ValueStep<ValueType>;
