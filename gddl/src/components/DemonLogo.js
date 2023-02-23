import edemon from '../demon_logos/edemon.png';
import mdemon from '../demon_logos/mdemon.png';
import hdemon from '../demon_logos/hdemon.png';
import idemon from '../demon_logos/idemon.png';
import exdemon from '../demon_logos/exdemon.png';

export default function DemonLogo(diff) {
    let imgSrc = '';
    switch (diff) {
        case 'Easy':
        case 1:
            imgSrc = edemon;
            break;
        case 'Medium':
        case 2:
            imgSrc = mdemon;
            break;
        case 'Hard':
        case 3:
            imgSrc = hdemon;
            break;
        case 'Insane':
        case 4:
            imgSrc = idemon;
            break;
        case 'Extreme':
        case 5:
            imgSrc = exdemon;
            break;
        default:
            imgSrc = hdemon;
            break;
    }

    return imgSrc;
}

export function tierToIcon(tier) {
    if (!tier) return DemonLogo(1);

    return DemonLogo(Math.min(Math.floor(tier / 5), 4) + 1);
}