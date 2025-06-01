import { average } from './average';
import standardDeviation from './standardDeviation';

export default function weightedAverage(points: number[], getWeight: (p: number) => number): number {
    let weightSum = 0;

    const sum = points.reduce((acc, cur) => {
        const weight = getWeight(cur);
        weightSum += weight;
        return acc + cur * weight;
    }, 0);

    return sum / weightSum;
}

export function ratingToWeight(rating: number, avg: number, standardDeviation: number): number {
    if (standardDeviation === 0) return 1;

    if (Math.abs(Math.round(avg) - rating) <= 2) return 1;

    const deviation = Math.abs(rating - avg) / standardDeviation;

    if (deviation <= 1.5) return 1;
    if (deviation <= 2) return 0.5;
    if (deviation <= 3) return 0.1;
    return 0;
}

export function weightedRatingAverage(ratings: number[]): number {
    if (ratings.length === 0) return 0;

    const avg = average(ratings);
    if (avg === null) throw new Error('Average should not be null');
    const stdDev = standardDeviation(ratings, avg);

    return weightedAverage(ratings, (p) => ratingToWeight(p, avg, stdDev));
}
