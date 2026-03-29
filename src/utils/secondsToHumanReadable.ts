import pluralS from './pluralS';

export function secondsToHumanReadable(_seconds: number, expand = false): string {
    const seconds = Math.floor(_seconds);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (expand) {
        if (years > 0) return `${years}y ${months - years * 12}mo`;
        if (months > 0) return `${months}mo ${days - months * 30}d`;
        if (days > 0) return `${days}d ${hours - days * 24}h`;
        if (hours > 0) return `${hours}h ${minutes - hours * 60}m`;
        if (minutes > 0) return `${minutes}m ${(seconds - minutes * 60).toFixed()}s`;
        return seconds.toFixed() + 's';
    }

    if (years > 0) return `${years} year${pluralS(years)}`;
    if (months > 0) return `${months} month${pluralS(months)}`;
    if (days > 0) return `${days} day${pluralS(days)}`;
    if (hours > 0) return `${hours} hour${pluralS(hours)}`;
    if (minutes > 0) return `${minutes} minute${pluralS(minutes)}`;
    return `${seconds} second${pluralS(seconds)}`;
}
