import type { AsyncStep } from "./AsyncStep";
import type { ValueStep } from "./ValueStep";
// import type { CallbackStep } from "./CallbackStep";
// import type { DelayStep } from "./DelayStep";
// import type { ValueStep } from "./ValueStep";

export type Step<ValueType = unknown> =
  | AsyncStep<ValueType>
  | ValueStep<ValueType>;
// | DelayStep
// | CallbackStep<ValueType>
// | ValueStep<ValueType>;
