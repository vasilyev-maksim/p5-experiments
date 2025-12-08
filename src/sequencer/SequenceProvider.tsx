import { useState, type PropsWithChildren } from "react";
import { SequenceContext } from "./SequenceContext";
import { Sequence } from "./Sequence";

export const SequenceProvider = (props: PropsWithChildren) => {
  const [sequences, setSequences] = useState<Sequence[]>([]);

  const registerSequence = (sequence: Sequence) => {
    setSequences((s) => {
      if (s.find((x) => x.id === sequence.id)) {
        return s.map((x) => (x.id === sequence.id ? sequence : x));
      } else {
        return [...s, sequence];
      }
    });
  };

  return (
    <SequenceContext.Provider value={{ sequences, registerSequence }}>
      {props.children}
    </SequenceContext.Provider>
  );
};
