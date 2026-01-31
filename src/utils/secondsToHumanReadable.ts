import pluralS from './pluralS';

export function secondsToHumanReadable(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} year${pluralS(years)}`;
    if (months > 0) return `${months} month${pluralS(months)}`;
    if (days > 0) return `${days} day${pluralS(days)}`;
    if (hours > 0) return `${hours} hour${pluralS(hours)}`;
    if (minutes > 0) return `${minutes} minute${pluralS(minutes)}`;
    return 'just now';
}
