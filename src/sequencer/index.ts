import { useContext, useEffect, useMemo, useState } from "react";
import { Sequence } from "./Sequence";
import { SyncSegment } from "./SyncSegment";
import { AsyncSegment } from "./AsyncSegment";
import type { Segment, SegmentPhase } from "./models";
import { SequenceContext } from "./SequenceContext";

export function useSequence<SId extends string = string>(id: string) {
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

  const useSegment = <P = void>(segmentId: SId) => {
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
    useSequence,
  };
}

export const useSequenceRegistry = <SId extends string = string>(
  sequenceId: string,
  segmentsFn: () => Segment[],
  deps: unknown[]
) => {
  const { registerSequence } = useContext(SequenceContext);

  useEffect(() => {
    const seq = new Sequence(sequenceId, segmentsFn());
    registerSequence(seq);
  }, deps);

  return useSequence<SId>(sequenceId);
};
