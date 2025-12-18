# Animations timing orchestrator

## Pain point:

Let’s assume that we have 3 divs (A,B,C) to animate, each starts after another, there are some delays in between, and OVERALL_DELAY:

Then, B should start after OVERALL_DELAY + A + DELAY_BETWEEN(A,B).
Then, C should start after….

So, we have to add new values to previous ones in order to compute when some element should be animated.
If we add another animation in between, the all others after this one should be recalculated.

There is no tools available rn solving this problem.

Segment phases:

- "not_started"
- "delay"
- "running"
- "completed"

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

* не давать возможности при инциализации прописывать простые обьекты типа {delay: 1000}, а принудить использовать статичные конструкторы типа Step.delay(1000), Step.value(‘SOME_ANIMATION_STEP_ID’), Step.callback()
* схема шагов должна быть и источником инфы о длительностях анимаций для компонентов, чтоб все работало слажено

### TODO

- добавить возможность деактивировать всю последовательность для тестирования (все тайминги будут = 0)
- segment.wasRun ? ... : null - сделать компонент для этого
- delay (как и все остальное) должен быть динамическим и зависеть от контекста (и от payload)
  - чтоб можно было пропустить задержку если например предыдущий шаг бывает disabled
- что делать после окончания прогона? надо все ресетать? сейчас ресет происходит при новом запуске
  - наверно надо еще сделать один из конфигов запуска что то типа "animation-fill-mode"
- Пересмотреть API (сигнатуры и названия)
- Разделить понятия блупринта сегментов и непосредственно их исполнения
  - например disabled точно определеяется по ctx вызова, а не по блупринту
  - при прогоне последовательности назад тоже может понадобиться (чтоб хранить направление анимации или процент исполнения и тд)

### DONE

- перевести анимацию появления грида на sequencer
- нужно сделать phase > 'running'
- need to trigger `onSegmentActivation` on segment phase change too.
- return class instance from hook: `useSeq('SEQ_ID', 'STEP_ID')` will return typed Step with duration, delay, `next` to call etc.
- get current step in component
- resolve current step (call next()) from component
  - I can use cancelation token for force next() call for ValueStep (in contrast with AsyncStep, which requires `next` to be called at some moment)
- read params from step in component
- “value” анимации
- conditional segments (to skip presets and controls if none)
- переименовать StepController в Step, Step в StepData

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
