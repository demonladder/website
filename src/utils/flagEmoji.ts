export default function flagEmoji(code: string | null): string {
    if (!code) return '';
    if (!/^[A-Z]{2}$/.test(code)) return '';

    const codePoints = code
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));

    return String.fromCodePoint(...codePoints);
}
