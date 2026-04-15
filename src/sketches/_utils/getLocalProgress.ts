export function getLocalProgress(
  totalProgress: number,
  itemsCount: number,
  itemIndex: number,
) {
  itemsCount = Math.round(itemsCount);
  itemIndex = Math.round(itemIndex);

  const curr = Math.abs(totalProgress) * itemsCount;
  let res;

  if (curr >= itemIndex + 1) {
    res = 1;
  } else if (curr < itemIndex + 1 && curr > itemIndex) {
    res = curr % 1;
  } else {
    res = 0;
  }

  return Math.sign(totalProgress) * res;
}
