export class StaggerAnimation {
  constructor(public itemAnimationDuration: number) {}

  public getAnimationProgress(framesCount: number, itemIndex:number): number {
    const currentIndex = Math.floor(framesCount / this.itemAnimationDuration);
    if (currentIndex < itemIndex) {
      return 0;
    } else if (currentIndex === itemIndex) {
      const itemFrame = framesCount - this.itemAnimationDuration * currentIndex;
      return itemFrame / this.itemAnimationDuration;
    } else {
      return 1;
    }
  }
}
