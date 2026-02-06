import LevelMeta, { Difficulties, Rarity } from '../../features/level/types/LevelMeta';
import { DemonLogoSizes, difficultyToImgSrc } from '../../utils/difficultyToImgSrc';

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
    const size = props.size ?? DemonLogoSizes.MEDIUM;

    const r = ((rarity: Rarity) => {
        if (rarity == Rarity.FEATURE) return 'feature';
        if (rarity == Rarity.EPIC) return 'epic';
        if (rarity == Rarity.LEGENDARY) return 'legendary';
        if (rarity == Rarity.MYTHIC) return 'mythic';
    })(rarity);

    return (
        <div className='inline-block relative w-max'>
            {rarity !== Rarity.STAR && <img src={`/images/rarity/${r}_${size}.webp`} width={size} className='absolute' />}
            <img src={difficultyToImgSrc(diff, size)} width={size} className='absolute' />
            <img src={difficultyToImgSrc(diff, size)} width={size} className='opacity-0' />
        </div>
    );
}
