// src/utils/factoryFocus.ts
// The machine a visitor last had open. Browser Back cannot carry state, and
// stepping between machines replaces history, so the factory reads this when
// it comes back to select the machine the visitor was actually looking at.
let lastViewed: number | undefined;

export const rememberMachine = (questId: number) => {
  lastViewed = questId;
};

// Read during render (safe to call twice), then forget once mounted.
export const peekRememberedMachine = (): number | undefined => lastViewed;

export const forgetRememberedMachine = () => {
  lastViewed = undefined;
};
