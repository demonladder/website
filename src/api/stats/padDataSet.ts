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

    // Loop through and fill in any gaps
    data.reverse();
    // for (let i = 0; i < data.length - 1; i++) {
    //     const current = data[i];
    //     const next = data[i + 1];
    //     const difference = Math.abs(next.Timestamp - current.Timestamp);

    //     if (difference > ms('11m')) {
    //         data.splice(i + 1, 0, {
    //             Timestamp: current.Timestamp + ms('5m'),
    //             Value: null,
    //         });
    //     }
    // }

    return data;
}