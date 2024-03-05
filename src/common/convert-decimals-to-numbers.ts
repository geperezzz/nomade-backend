import { Decimal } from 'decimal.js';

export type WithDecimalsAsNumbers<T> = {
  [Key in keyof T]: T[Key] extends Decimal ? number : T[Key];
};

export function convertDecimalsToNumbers<T>(obj: T): WithDecimalsAsNumbers<T> {
  const result: any = {};
  for (const key in obj) {
    if (obj[key] instanceof Decimal) {
      result[key] = (obj[key] as Decimal).toNumber();
    } else {
      result[key] = obj[key];
    }
  }
  return result as WithDecimalsAsNumbers<T>;
}
