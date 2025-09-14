export function decodeDate(date: string) {
    return new Date(date.replace(' +00:00', 'Z').replace(' ', 'T'));
}
