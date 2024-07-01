export default function pluralS(count: number) {
    return count !== 1 ? 's' : '';
}

export function pluralWas(count: number) {
    return pluralS(count) + ' ' + (count !== 1 ? 'were' : 'was');
}