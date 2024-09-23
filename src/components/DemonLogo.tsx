export default function DemonLogo({ diff }: { diff?: number | string }) {
    switch (diff) {
        default:
        case 'Easy':
        case 1:
            return (<img src='/assets/images/demon_logos/edemon.png' />);
        case 'Medium':
        case 2:
            return (<img src='/assets/images/demon_logos/mdemon.png' />);
        case 'Official':
        case 'Hard':
        case 3:
            return (<img src='/assets/images/demon_logos/hdemon.png' />);
        case 'Insane':
        case 4:
            return (<img src='/assets/images/demon_logos/idemon.png' />);
        case 'Extreme':
        case 5:
            return (<img src='/assets/images/demon_logos/exdemon.png' />);
    }
}

export function DifficultyToImgSrc(diff: string|number) {
    switch (diff) {
        case 'Easy':
        case 1:
            return '/assets/images/demon_logos/edemon.png';
        case 'Medium':
        case 2:
            return '/assets/images/demon_logos/mdemon.png';
        default:
        case 'Hard':
        case 3:
            return '/assets/images/demon_logos/hdemon.png';
        case 'Insane':
        case 4:
            return '/assets/images/demon_logos/idemon.png';
        case 'Extreme':
        case 5:
            return '/assets/images/demon_logos/exdemon.png';
    }
}