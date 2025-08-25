import { Difficulties } from '../features/level/types/LevelMeta';

export enum DemonLogoSizes {
    SMALL = 64,
    MEDIUM = 128,
    LARGE = 160,
    EXTRA_LARGE = 190,
}

export function difficultyToImgSrc(diff?: Difficulties | number, size: DemonLogoSizes = DemonLogoSizes.EXTRA_LARGE) {
    switch (diff) {
        case Difficulties.Easy:
        case 1:
            return `/images/demon_logos/easy_${size}.webp`;
        case Difficulties.Medium:
        case 2:
            return `/images/demon_logos/medium_${size}.webp`;
        case Difficulties.Official:
        case Difficulties.Hard:
        case 3:
            return `/images/demon_logos/hard_${size}.webp`;
        case Difficulties.Insane:
        case 4:
            return `/images/demon_logos/insane_${size}.webp`;
        case Difficulties.Extreme:
        case 5:
            return `/images/demon_logos/extreme_${size}.webp`;
    }
}
