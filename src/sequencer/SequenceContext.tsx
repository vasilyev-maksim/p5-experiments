import { createContext } from "react";
import type { Sequence } from "./Sequence";

export type SequenceContextValue = {
  sequences: Sequence[];
  registerSequence: (sequence: Sequence) => void;
};
export const SequenceContext = createContext<SequenceContextValue>({
  sequences: [],
  registerSequence: () => {},
});
