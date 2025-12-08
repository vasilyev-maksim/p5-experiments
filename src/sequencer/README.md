# Animations timing orchestrator

## Pain point:

Let’s assume that we have 3 divs (A,B,C) to animate, each starts after another, there are some delays in between, and OVERALL_DELAY:

Then, B should start after OVERALL_DELAY + A + DELAY_BETWEEN(A,B).
Then, C should start after….

So, we have to add new values to previous ones in order to compute when some element should be animated.
If we add another animation in between, the all others after this one should be recalculated.

There is no tools available rn solving this problem.

## Thoughts

- работать будет через реакт контекст
- дать возм дождаться от пользователя интеракции посередине последовательности (async)
- play/plause последовательность
- общий процент исполнения
- условное ветвление последовательности
- параллельные шаги в последовательности
- more complex "time-operators" like promise's "race", "all" etc.
- апи для обьединения 2ух последовательностей в одну
- проигрывание посл в обратную сторону
- готовые компоненты-хелперы
- не давать возможности при инциализации прописывать простые обьекты типа {delay: 1000}, а принудить использовать статичные конструкторы типа Step.delay(1000), Step.value(‘SOME_ANIMATION_STEP_ID’), Step.callback()
- схема шагов должна быть и источником инфы о длительностях анимаций для компонентов, чтоб все работало слажено

### TODO

- return class instance from hook: `useSeq('SEQ_ID', 'STEP_ID')` will return typed Step with duration, delay, `next` to call etc.
- get current step in component
- resolve current step (call next()) from component
  - I can use cancelation token for force next() call for ValueStep (in contrast with AsyncStep, which requires `next` to be called at some moment)
- read params from step in component
- “value” анимации
- conditional segments (to skip presets and controls if none)

* переименовать StepController в Step, Step в StepData

## Мой вариант из RTK:

export interface IStepData<T extends string | number> {
action?: (stepNumber: number) => void;
delay?: number;
skip?: boolean;
stepNumber?: T;
}

export function useSequencer<T extends string | number>(
stepsData: IStepData<T>[],
enabled: boolean = true
) {
const [currentStep, setCurrentStep] = useState<null | T>(null);
const steps = stepsData.filter((x) => !x.skip);
const [currIndex, setCurrIndex] = useState(-1);

useEffect(() => {
if (!enabled) return;
const stepNumber = steps[currIndex]?.stepNumber;
if (stepNumber != null) {
setCurrentStep(stepNumber);
}
}, [currIndex, enabled]);

useEffect(() => {
if (!enabled) return;
let cleanup;

    function schedule(step: number) {
      if (step <= steps.length - 1) {
        const id = setTimeout(() => {
          steps[step].action?.(step);
          setCurrIndex((x) => x + 1);
          schedule(step + 1);
        }, steps[step].delay || 0);

        cleanup = () => {
          clearTimeout(id);
        };
      }
    }

    schedule(currIndex + 1); // call with next to initial currentStep value
    return cleanup;

}, [enabled]);

return {
currentStep,
completed: currIndex === steps.length - 1,
};
}
