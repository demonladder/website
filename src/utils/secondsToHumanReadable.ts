import pluralS from './pluralS';

export function secondsToHumanReadable(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${pluralS(days)}`;
    if (hours > 0) return `${hours} hour${pluralS(hours)}`;
    if (minutes > 0) return `${minutes} minute${pluralS(minutes)}`;
    return `${seconds} second${pluralS(seconds)}`;
}
