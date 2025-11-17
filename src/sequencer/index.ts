import { CallbackStep } from "./CallbackStep";
import { DelayStep } from "./DelayStep";
import { Sequence } from "./Sequence";
import { ValueStep } from "./ValueStep";

const s = new Sequence<number>();
s.addStep(new DelayStep(2000));
s.addStep(new ValueStep(1));
s.addStep(new DelayStep(1000));
s.addStep(new ValueStep(2));
s.addStep(
  new CallbackStep((get, set) => {
    console.log(get());
    set(7);
  })
);
s.onValueChange.addCallback((x) => console.log(`value cahnged: ${x}`));
s.start();
console.log(s.value);
