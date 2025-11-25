export class AsyncStep<ValueType = unknown> {
  public constructor(
    public readonly delayInMs: number,
    public readonly callback: (
      getValue: () => ValueType | null,
      setValue: (val: ValueType) => void
    ) => Promise<unknown> | void
  ) {}
}


