export class AnimatedValue {
  private prev: number | undefined;
  private interpolated: number | undefined;
  private next: number | undefined;
  private currentStep: number = 0;

  public constructor(
    private readonly stepsCount: number,
    initialValue?: number
  ) {
    if (initialValue) {
      this.prev = initialValue;
      this.interpolated = initialValue;
      this.next = initialValue;
    }
  }

  public animateTo(val: number) {
    this.prev = this.prev === undefined ? val : this.interpolated;
    this.interpolated = this.prev;
    this.next = val;
    this.currentStep = this.prev === this.next ? 0 : this.stepsCount;
  }

  public nextStep() {
    if (
      this.next !== undefined &&
      this.prev !== undefined &&
      this.next !== this.prev &&
      this.interpolated !== undefined &&
      this.currentStep > 0
    ) {
      const delta = (this.next - this.prev) / this.stepsCount;
      this.interpolated += delta;
      this.currentStep--;
    }
  }

  public getCurrentValue() {
    return this.interpolated;
  }

  public getNextValue() {
    return this.next;
  }
}
