// Claude's work

import p5 from "p5";

// Creates p5 instances with workarounds for two p5 2.x leaks (both present in
// 2.3.4). Each leak keeps every removed instance in memory, together with its
// DOM subtree and its full-size canvas. Most p5 sketches create a single
// instance per page, so they never notice. Here every modal opening creates an
// instance and closing removes it, so memory grew with each opened sketch
// (6 open/close cycles left 6 extra canvases alive).
//
// 1. The constructor pushes a closure (it removes the instance's focus/blur
//    listeners and captures the instance) into the static
//    p5.lifecycleHooks.remove array and never takes it out.
//    Fixed upstream in https://github.com/processing/p5.js/pull/9085 (merged
//    into main, not released yet). Once released, this part can be dropped.
// 2. The color module's presetup wraps the shared p5.Color.prototype methods
//    (setRed(), _getRed() & co.) for each instance, and each wrapper captures
//    its instance to read its color maxes. The wrappers chain through all
//    instances ever created. As of now there's no upstream issue for this.
//    Note that, by design, p.red() & co. use the color maxes of the most
//    recently created instance, not their own (harmless while no sketch
//    calls colorMode() with custom maxes).

type P5Internals = {
  lifecycleHooks: { remove: unknown[] };
  Color: { prototype: Record<string, unknown> };
};

const p5Internals = p5 as unknown as P5Internals;

// captured on module load, before any instance runs its presetup, i.e. before
// any wrapping
const originalColorMethods = Object.entries(
  Object.getOwnPropertyDescriptors(p5Internals.Color.prototype),
).filter(([, d]) => typeof d.value === "function");

function resetColorPrototype() {
  const proto = p5Internals.Color.prototype;
  for (const [name, descriptor] of originalColorMethods) {
    if (proto[name] !== descriptor.value) {
      Object.defineProperty(proto, name, descriptor);
    }
  }
}

// createP5() calls made in one synchronous run (e.g. all tiles mounted in a
// single React commit) form a batch
let isBatchInProgress = false;

export function createP5(...args: ConstructorParameters<typeof p5>) {
  const removeHooks = p5Internals.lifecycleHooks.remove;
  const hooksCountBefore = removeHooks.length;

  // Leak 2: drops the wrappers of previous batches, so the prototype only
  // references the instances of the latest batch (once the modal is closed,
  // its instance stays referenced until the next createP5() call).
  // Within a batch the wrappers must stay chained: p5 gives instances their
  // renderers one by one after the batch is constructed, and a wrapper whose
  // instance has no renderer yet falls back to the inner (older) one. With
  // only the last instance's wrapper left, p.red() & co. in setup() of the
  // other ones would return 0..1 instead of 0..255 (that made tiles using
  // createAnimatedColors() black whenever they were mounted after the window
  // "load" event, as then p5 starts instances right in the constructor).
  if (!isBatchInProgress) {
    isBatchInProgress = true;
    queueMicrotask(() => {
      isBatchInProgress = false;
    });
    resetColorPrototype();
  }
  const instance = new p5(...args);
  // leak 1: the hooks the constructor has just added
  const ownRemoveHooks = removeHooks.slice(hooksCountBefore);

  const cleanup = async () => {
    // runs the hooks, so they can be dropped only afterwards
    await instance.remove();
    for (const hook of ownRemoveHooks) {
      const i = removeHooks.indexOf(hook);
      if (i !== -1) removeHooks.splice(i, 1);
    }
  };

  return { instance, cleanup };
}
