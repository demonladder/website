export default function DemonLogo({ diff }: { diff: number|string }) {
    switch (diff) {
        default:
        case 'Easy':
        case 1:
            return (<img src='/assets/demon_logos/edemon.png' srcSet='/assets/demon_logos/edemon_xs.png 64w, /assets/demon_logos/edemon_sm.png 128w' />);
        case 'Medium':
        case 2:
            return (<img src='/assets/demon_logos/mdemon.png' srcSet='/assets/demon_logos/mdemon_xs.png 64w, /assets/demon_logos/mdemon_sm.png 128w' />);
        case 'Official':
        case 'Hard':
        case 3:
            return (<img src='/assets/demon_logos/hdemon.png' srcSet='/assets/demon_logos/hdemon_xs.png 64w, /assets/demon_logos/hdemon_sm.png 128w' />);
        case 'Insane':
        case 4:
            return (<img src='/assets/demon_logos/idemon.png' srcSet='/assets/demon_logos/idemon_xs.png 64w, /assets/demon_logos/idemon_sm.png 128w' />);
        case 'Extreme':
        case 5:
            return (<img src='/assets/demon_logos/exdemon.png' srcSet='/assets/demon_logos/exdemon_xs.png 64w, /assets/demon_logos/exdemon_sm.png 128w' />);
    }
}

export function DifficultyToImgSrc(diff: string|number) {
    switch (diff) {
        case 'Easy':
        case 1:
            return '/assets/demon_logos/edemon.png';
        case 'Medium':
        case 2:
            return '/assets/demon_logos/mdemon.png';
        default:
        case 'Hard':
        case 3:
            return '/assets/demon_logos/hdemon.png';
        case 'Insane':
        case 4:
            return '/assets/demon_logos/idemon.png';
        case 'Extreme':
        case 5:
            return '/assets/demon_logos/exdemon.png';
    }
}

export function tierToIcon(tier: number) {
    if (!tier) return <DemonLogo diff={tier} />;

    return <DemonLogo diff={Math.min(Math.floor(tier / 5), 4) + 1} />;
}