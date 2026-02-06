import { IDMapper } from './IDMapper';

export function getLevelThumbnailUrl(levelID: number) {
    return `https://levelthumbs.prevter.me/thumbnail/${IDMapper(levelID)}`;
}
