import { useContext, useEffect, useMemo, useState } from "react";
import { Sequence } from "./Sequence";
import { SyncSegment } from "./SyncSegment";
import { AsyncSegment } from "./AsyncSegment";
import type { SegmentPhase } from "./models";
import { SequenceContext } from "./SequenceContext";
import type { SegmentBase } from "./SegmentBase";

export function useSequence<Id extends string = string, Context = unknown>(
  id: string
) {
  const sequences = useContext(SequenceContext).sequences as Sequence[];
  const seq = useMemo(
    () => sequences.find((x) => x.id === id)!,
    [sequences, id]
  ) as Sequence;

  const useListener = (cb: (segment: SegmentBase) => void) => {
    useEffect(() => {
      return seq.onSegmentActivation.addCallback(cb);
    }, [cb, seq]);
  };

  const useStart = (
    opts: { condition?: boolean; ctx?: Context } = {
      condition: true,
      ctx: undefined,
    }
  ) => {
    useEffect(() => {
      if (opts.ctx ?? opts.condition ?? true) {
        seq.start(opts.ctx);
      }
    }, [opts.condition, opts.ctx, seq]);
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
