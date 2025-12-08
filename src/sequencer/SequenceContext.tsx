import { createContext } from "react";
import type { Sequence } from "./Sequence";

export type SequenceContextValue = {
  sequences: Sequence[];
};
export const SequenceContext = createContext<SequenceContextValue>({
  sequences: [],
});
