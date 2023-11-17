import { PackShell } from '../api/packs/types/PackShell';

interface Props {
    pack: PackShell,
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