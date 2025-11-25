import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Sequence } from "./Sequence";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SequenceContextValue = { seqs: Sequence<any>[] };
export const SequenceContext = createContext<SequenceContextValue>({
  seqs: [],
});

export function useSequence<T = void>(
  id: string,
  opts: { autoStart?: boolean; onValueChange?: (value: T | null) => void } = {
    autoStart: true,
  }
) {
  const { seqs } = useContext(SequenceContext);
  const seq = useMemo(
    () => seqs.find((x) => x.id === id),
    [seqs, id]
  ) as Sequence<T>;
  const [currentValue, setCurrentValue] = useState<T | null>();

  useEffect(() => {
    if (seq && opts?.autoStart) {
      const cleanup = seq.onValueChange.addCallback(setCurrentValue);
      const cleanup2 = seq.onValueChange.addCallback((val) =>
        opts?.onValueChange?.(val)
      );

      seq.start();

      return () => {
        cleanup();
        cleanup2();
      };
    }
  }, [seq, opts?.autoStart, opts?.onValueChange]);

  const next = () => seq.completeCurrentStep();

  return {
    currentValue,
    // next: s,
  };
}

// s.addStep(new AsyncStep(2000, (_, set) => set(1)));
// s.addStep(new AsyncStep(1000, (_, set) => set(2)));
// s.addStep(
//   new AsyncStep(2000, (_, set) => {
//     console.log("last step");
//     set(3);
//   })
// );
// s.onValueChange.addCallback((x) => console.log(`value changed: ${x}`));
// s.start();
// console.log(s.value);
