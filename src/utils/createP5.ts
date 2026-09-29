// Claude's work

import p5 from "p5";

// Workarounds for two p5 (checked up to 2.3.4) leaks that keep every removed
// instance (and its whole DOM subtree) in memory:
// 1. the constructor pushes a closure capturing `this` into the static
//    p5.lifecycleHooks.remove array and never takes it out;
// 2. the color module's presetup re-wraps the shared p5.Color.prototype
//    methods for each instance, so wrappers chain through all instances ever
//    created (each wrapper closes over its own instance).

type P5Internals = {
  lifecycleHooks: { remove: unknown[] };
  Color: { prototype: Record<string, unknown> };
};

const p5Internals = p5 as unknown as P5Internals;

// captured before any instance runs its presetup, i.e. before any wrapping
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

export function createP5(...args: ConstructorParameters<typeof p5>) {
  const removeHooks = p5Internals.lifecycleHooks.remove;
  const hooksCountBefore = removeHooks.length;

  // drops wrappers of previous instances, the new one wraps the originals
  resetColorPrototype();
  const instance = new p5(...args);
  const ownRemoveHooks = removeHooks.slice(hooksCountBefore);

  const cleanup = async () => {
    await instance.remove();
    for (const hook of ownRemoveHooks) {
      const i = removeHooks.indexOf(hook);
      if (i !== -1) removeHooks.splice(i, 1);
    }
  };

  return { instance, cleanup };
}
