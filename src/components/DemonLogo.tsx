import { Difficulties } from '../features/level/types/LevelMeta';

export default function DemonLogo({ diff, ...props }: { diff?: number | Difficulties } & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'>) {
    return (
        <img src={DifficultyToImgSrc(diff)} {...props} />
    );
}

export function DifficultyToImgSrc(diff?: Difficulties | number, size: '64' | '160' = '160') {
    switch (diff) {
        case Difficulties.Easy:
        case 1:
            return `/images/demon_logos/easy_${size}.png`;
        case Difficulties.Medium:
        case 2:
            return `/images/demon_logos/medium_${size}.png`;
        case Difficulties.Official:
        case Difficulties.Hard:
        case 3:
            return `/images/demon_logos/hard_${size}.png`;
        case Difficulties.Insane:
        case 4:
            return `/images/demon_logos/insane_${size}.png`;
        case Difficulties.Extreme:
        case 5:
            return `/images/demon_logos/extreme_${size}.png`;
    }
}
