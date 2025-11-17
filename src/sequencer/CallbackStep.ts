export class CallbackStep<ValueType = unknown> {
  public constructor(
    public readonly callback: (
      getValue: () => ValueType | null,
      setValue: (val: ValueType) => void
    ) => Promise<unknown> | void
  ) {}
}
