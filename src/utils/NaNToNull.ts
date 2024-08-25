export function NaNToNull(value?: number) {
    return value === undefined || isNaN(value) ? null : value;
}
