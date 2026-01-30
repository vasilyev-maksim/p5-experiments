// Types for grid1D and grid2D
interface Grid1DCallbackArgs {
  x: number;
  index: number;
  stepCount: number | undefined;
  stepLength: number;
}
interface Grid1DArgs {
  min: number;
  max: number;
  stepCount?: number;
  stepLength?: number;
  callback: (args: Grid1DCallbackArgs) => void;
}
interface Grid2DCallbackArgs {
  x: number;
  y: number;
  xIndex: number;
  yIndex: number;
  xStepCount: number | undefined;
  xStepLength: number;
  yStepCount: number | undefined;
  yStepLength: number;
}
interface Grid2DArgs {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  xStepCount?: number;
  xStepLength?: number;
  yStepCount?: number;
  yStepLength?: number;
  callback: (args: Grid2DCallbackArgs) => void;
}
interface GetGrid2DArgs {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  xStepCount?: number;
  xStepLength?: number;
  yStepCount?: number;
  yStepLength?: number;
}
// grid1D function

export function grid1D(args: Grid1DArgs): void {
  const { min, max, stepCount, stepLength, callback } = args;
  const length = max - min;
  const _stepLength = stepLength ?? Math.floor(length / (stepCount || 1));
  const padding = (length % _stepLength) / 2;
  const start = min + padding + _stepLength / 2;
  let i = 0;

  for (let x = start; x < max; x += _stepLength) {
    callback({ x, index: i++, stepCount, stepLength: _stepLength });
  }
}
// grid2D function

export function grid2D(args: Grid2DArgs): void {
  const {
    minX,
    maxX,
    minY,
    maxY,
    xStepCount,
    xStepLength,
    yStepCount,
    yStepLength,
    callback,
  } = args;

  if (xStepLength != null || xStepCount != null) {
    grid1D({
      min: minX,
      max: maxX,
      stepLength: xStepLength,
      stepCount: xStepCount,
      callback: ({
        x,
        index: xIndex,
        stepCount: _xStepCount,
        stepLength: _xStepLength,
      }) => {
        grid1D({
          min: minY,
          max: maxY,
          stepLength: yStepLength ?? _xStepLength,
          stepCount: yStepCount,
          callback: ({
            x: y,
            index: yIndex,
            stepCount: _yStepCount,
            stepLength: _yStepLength,
          }) => {
            callback({
              x,
              y,
              xIndex,
              yIndex,
              xStepCount: _xStepCount,
              xStepLength: _xStepLength,
              yStepCount: _yStepCount,
              yStepLength: _yStepLength,
            });
          },
        });
      },
    });
  } else {
    grid1D({
      min: minY,
      max: maxY,
      stepLength: yStepLength,
      stepCount: yStepCount,
      callback: ({
        x: y,
        index: yIndex,
        stepCount: _yStepCount,
        stepLength: _yStepLength,
      }) => {
        grid1D({
          min: minX,
          max: maxX,
          stepLength: xStepLength ?? _yStepLength,
          stepCount: xStepCount,
          callback: ({
            x,
            index: xIndex,
            stepCount: _xStepCount,
            stepLength: _xStepLength,
          }) => {
            callback({
              x,
              y,
              xIndex,
              yIndex,
              xStepCount: _xStepCount,
              xStepLength: _xStepLength,
              yStepCount: _yStepCount,
              yStepLength: _yStepLength,
            });
          },
        });
      },
    });
  }
}
// getGrid2D function

export function getGrid2D(args: GetGrid2DArgs): Grid2DCallbackArgs[] {
  const grid: Grid2DCallbackArgs[] = [];
  grid2D({
    ...args,
    callback: (cArgs) => {
      grid.push(cArgs);
    },
  });
  return grid;
}
