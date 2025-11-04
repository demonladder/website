const acceptedHosts: string[] = [
    'www.youtube.com',
    'm.youtube.com',
    'youtube.com',
    'youtu.be',
    'www.twitch.tv',
    'twitch.tv',
    'www.bilibili.com',
    'm.bilibili.com',
    'bilibili.com',
    'drive.google.com',
];

export function validateLink(link: string): boolean {
    try {
        const url = new URL(link); // This will throw if the link is not a valid URL

        return acceptedHosts.includes(url.host);
    } catch {
        return false;
    }
}
