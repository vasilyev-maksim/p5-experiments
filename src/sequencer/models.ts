import type { AsyncSegment } from "./AsyncSegment";
import type { SyncSegment } from "./SyncSegment";

export type SegmentPhase = "not_started" | "delay" | "running" | "completed";

export type Segment<Payload = unknown> = SyncSegment | AsyncSegment<Payload>;
