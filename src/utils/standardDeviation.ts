import { average } from './average';
import { sum } from './sum';

export default function standardDeviation(data: number[], _avg?: number): number {
    if (data.length === 0) return 0;

    const avg = _avg ?? average(data);
    if (avg === null) throw new Error('Average should not be null');

    return Math.sqrt(sum(data.map((n) => (n - avg) ** 2)) / data.length);
}
