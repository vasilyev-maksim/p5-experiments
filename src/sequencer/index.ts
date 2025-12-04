import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  Sequence,
  type SegmentPhase,
  type Segment,
  SyncSegment,
  AsyncSegment,
} from "./Sequence";

export type SequenceContextValue = { sequences: Sequence[] };
export const SequenceContext = createContext<SequenceContextValue>({
  sequences: [],
});

export function useSequence<Id extends string = string>(id: string) {
  const { sequences } = useContext(SequenceContext);
  const seq = useMemo(
    () => sequences.find((x) => x.id === id)!,
    [sequences, id]
  ) as Sequence;
  // const [currentSegment, setCurrentSegment] = useState<Segment>();

  // useEffect(() => {
  //   if (opts?.autoStart) {
  //     // const cleanup = seq.onSegmentActivation.addCallback(setCurrentSegment);
  //     const cleanup2 = seq.onSegmentActivation.addCallback((seg) =>
  //       opts?.onSegmentActivation?.(seg)
  //     );

  //     seq.start();

  //     return () => {
  //       // cleanup();
  //       cleanup2();
  //     };
  //   }
  // }, [seq, opts?.autoStart, opts?.onSegmentActivation]);

  const useListener = (cb: (segment: Segment) => void) => {
    useEffect(() => {
      return seq.onSegmentActivation.addCallback(cb);
    }, [cb, seq]);
  };

  const useStart = (condition: boolean = true) => {
    useEffect(() => {
      if (condition) {
        seq.start();
      }
    }, [condition, seq]);
  };

  const useSegment = <
    P = void
    // T extends Segment = SyncSegment
  >(
    segmentId: Id
  ) => {
    const [, setPhase] = useState<SegmentPhase>();
    const segment = useMemo(
      () => seq.getSegmentById(segmentId)!,
      [segmentId, seq]
    );

    useEffect(() => {
      return segment.onPhaseChange.addCallback(setPhase);
    }, [segment]);

    return segment as P extends void ? SyncSegment : AsyncSegment<P>;
  };

  return {
    // currentSegment,
    // start: seq.start,
    useListener,
    useStart,
    useSegment,
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
