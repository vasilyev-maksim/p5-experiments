export class AnimatedValue {
  private start: number | undefined;
  private interpolated: number | undefined;
  private destination: number | undefined;
  private currentStep: number = 0;

  public constructor(
    private readonly stepsCount: number,
    initialValue?: number
  ) {
    if (initialValue) {
      this.start = initialValue;
      this.interpolated = initialValue;
      this.destination = initialValue;
    }
  }

  public animateTo(val: number) {
    this.start = this.start === undefined ? val : this.interpolated;
    this.interpolated = this.start;
    this.destination = val;
    this.currentStep = this.start === this.destination ? 0 : this.stepsCount;
  }

  public nextStep() {
    if (
      this.destination !== undefined &&
      this.start !== undefined &&
      this.destination !== this.start &&
      this.interpolated !== undefined &&
      this.currentStep > 0
    ) {
      const delta = (this.destination - this.start) / this.stepsCount;
      this.interpolated += delta;
      this.currentStep--;
    }
  }

  public getCurrentValue() {
    return this.interpolated;
  }

  public getDestinationValue() {
    return this.destination;
  }
}
