import { AsyncStep } from "./AsyncStep";
import { Sequence } from "./Sequence";

const s = new Sequence<number>();
s.addStep(new AsyncStep(2000, (_, set) => set(1)));
s.addStep(new AsyncStep(1000, (_, set) => set(2)));
s.addStep(
  new AsyncStep(2000, (_, set) => {
    console.log("last step");
    set(3);
  })
);
s.onValueChange.addCallback((x) => console.log(`value cahnged: ${x}`));
s.start();
console.log(s.value);
