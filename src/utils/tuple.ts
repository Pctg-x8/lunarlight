// translation from haskell tuple operations

export function fst<A, Rest extends readonly unknown[]>(values: readonly [A, ...Rest]): A {
  return values[0];
}

export function snd<A, B, Rest extends readonly unknown[]>(values: readonly [A, B, ...Rest]): B {
  return values[1];
}

export function nth<N extends number>(nth: N): <Tuple extends readonly unknown[]>(values: Tuple) => Tuple[N] {
  return values => values[nth];
}
