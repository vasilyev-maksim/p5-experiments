import { type PropsWithChildren } from "react";
import { SequenceContext } from "./SequenceContext";
import { Sequence } from "./Sequence";

export const SequenceProvider = (
  props: PropsWithChildren<{ sequences: Sequence[] }>
) => {
  return (
    <SequenceContext.Provider value={{ sequences: props.sequences }}>
      {props.children}
    </SequenceContext.Provider>
  );
};
