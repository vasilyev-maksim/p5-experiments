import { useContext, useEffect, useMemo, useState } from "react";
import { Sequence } from "./Sequence";
import { SyncSegment } from "./SyncSegment";
import { AsyncSegment } from "./AsyncSegment";
import type { Segment, SegmentPhase } from "./models";
import { SequenceContext } from "./SequenceContext";

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
