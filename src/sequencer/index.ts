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

  const useSegment = <P = void>(segmentId: Id) => {
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
    useListener,
    useStart,
    useSegment,
  };
}
