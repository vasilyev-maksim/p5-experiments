import { useContext, useEffect, useMemo, useState } from "react";
import { Sequence } from "./Sequence";
import { SyncSegment } from "./SyncSegment";
import { AsyncSegment } from "./AsyncSegment";
import type { SegmentPhase } from "./models";
import { SequenceContext } from "./SequenceContext";
import type { SegmentBase } from "./SegmentBase";

export function useSequence(id: string) {
  const sequences = useContext(SequenceContext).sequences as Sequence[];
  return useMemo(
    () => sequences.find((x) => x.id === id)!,
    [sequences, id],
  ) as Sequence;
}

export function useSequenceListener(
  sequenceId: string,
  cb: (segment: SegmentBase) => void,
) {
  const seq = useSequence(sequenceId);

  useEffect(() => {
    return seq.onProgress.addListener(cb);
  }, [cb, seq]);
}

export function useSequenceStart<Context = unknown>(
  sequenceId: string,
  opts: { condition?: boolean; ctx?: Context } = {
    condition: true,
    ctx: undefined,
  },
) {
  const seq = useSequence(sequenceId);

  useEffect(() => {
    if (opts.ctx ?? opts.condition ?? true) {
      seq.start(opts.ctx);
    }
  }, [opts.condition, opts.ctx, seq]);
}

export function useSegment<Id extends string = string, P = void>(
  sequenceId: string,
  segmentId: Id,
) {
  const seq = useSequence(sequenceId);
  const [, setPhase] = useState<SegmentPhase>();
  const segment = useMemo(
    () => seq.getSegmentById(segmentId)!,
    [segmentId, seq],
  );

  useEffect(() => {
    return segment.onPhaseChange.addListener(setPhase);
  }, [segment]);

  return segment as P extends void ? SyncSegment : AsyncSegment<P>;
}
