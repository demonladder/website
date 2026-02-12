import ms from 'ms';

export interface StatRecordNullable {
    Timestamp: number;
    Value: number | null;
}

export function padDataSet(data: StatRecordNullable[]) {
    const latest = data.at(0);
    if (latest === undefined) return [];
    const earliest = data.at(-1);
    if (earliest === undefined) return [];

    const estimatedEarliest = latest.Timestamp - ms('1d');
    const earliestDifference = Math.abs(estimatedEarliest - earliest.Timestamp);

    if (earliestDifference > 2000) {
        data.push({
            Timestamp: estimatedEarliest,
            Value: null,
        });
    }

    data.reverse();

    return data;
}
