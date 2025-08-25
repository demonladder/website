import LevelMeta, { Difficulties, Rarity } from '../features/level/types/LevelMeta';
import { DemonLogoSizes, difficultyToImgSrc } from '../utils/difficultyToImgSrc';

interface Props {
    diff?: number | Difficulties;
    size?: DemonLogoSizes;
    rarity?: Rarity;
    meta?: {
        Difficulty: LevelMeta['Difficulty'];
        Rarity: LevelMeta['Rarity'];
    };
}

export default function DemonFace(props: Props) {
    const diff = props.diff ?? props.meta?.Difficulty;
    const rarity = props.rarity ?? props.meta?.Rarity ?? Rarity.STAR;
    const size = props.size ?? DemonLogoSizes.EXTRA_LARGE;

    const sizeClass = {
        [DemonLogoSizes.SMALL]: 'w-[71px] h-16',
        [DemonLogoSizes.MEDIUM]: 'w-[143px] h-32',
        [DemonLogoSizes.LARGE]: 'w-[179px] h-40',
        [DemonLogoSizes.EXTRA_LARGE]: 'w-[213px] h-48',
    }[size];

    const r = ((rarity: Rarity) => {
        if (rarity == Rarity.FEATURE) return 'feature';
        if (rarity == Rarity.EPIC) return 'epic';
        if (rarity == Rarity.LEGENDARY) return 'legendary';
        if (rarity == Rarity.MYTHIC) return 'mythic';
    })(rarity);

    return (
        <div className={`inline-block relative ${sizeClass}`}>
            {rarity !== Rarity.STAR && <img src={`/images/rarity/${r}_${size}.webp`} className='absolute' />}
            <img src={difficultyToImgSrc(diff, size)} className='absolute' />
        </div>
    );
}
