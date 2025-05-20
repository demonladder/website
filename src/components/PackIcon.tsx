import Pack from '../features/singlePack/types/Pack';

interface Props {
    pack: Pack,
    className?: string,
}

export default function PackIcon({ pack, className }: Props) {
    if (!pack.IconName) {
        return;
    }

    return (
        <img width='24px' height='24px' src={'/packIcons/' + pack.IconName} className={className} />
    );
}