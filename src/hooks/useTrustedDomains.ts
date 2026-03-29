import { useLocalStorage } from 'usehooks-ts';

export function useTrustedDomains() {
    return useLocalStorage<string[]>('trustedDomains', [
        'https://youtube.com',
        'https://www.youtube.com',
        'https://youtu.be',
    ]);
}
