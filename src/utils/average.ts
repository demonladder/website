import { sum } from './sum';

export function average(values: number[]): number | null {
    if (values.length === 0) return null;
    return sum(values) / values.length;
}
