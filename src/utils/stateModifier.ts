export type StateModifier<T> = (current: T) => T;

export function stateModifierPipe<T>(init: T, ...modifiers: StateModifier<T>[]): T {
  return modifiers.reduce((a, f) => f(a), init);
}
