// type Capitalize<T> = T extends `${infer Q}${infer R}` ? `${Q}${R}` : never;

export function capitalize<T extends string>(str: T): Capitalize<T> {
  return str.replace(
    /[A-Za-z]+/g,
    ($1) => $1[0].toUpperCase() + $1.slice(1)
  ) as Capitalize<T>;
}
