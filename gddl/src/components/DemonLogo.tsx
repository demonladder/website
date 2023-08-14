import edemonXS from '../assets/demon_logos/edemon_xs.png';
import edemonSM from '../assets/demon_logos/edemon_sm.png';
import edemon from '../assets/demon_logos/edemon.png';

import mdemonXS from '../assets/demon_logos/mdemon_xs.png';
import mdemonSM from '../assets/demon_logos/mdemon_sm.png';
import mdemon from '../assets/demon_logos/mdemon.png';

import hdemonXS from '../assets/demon_logos/hdemon_xs.png';
import hdemonSM from '../assets/demon_logos/hdemon_sm.png';
import hdemon from '../assets/demon_logos/hdemon.png';

import idemonXS from '../assets/demon_logos/idemon_xs.png';
import idemonSM from '../assets/demon_logos/idemon_sm.png';
import idemon from '../assets/demon_logos/idemon.png';

import exdemonXS from '../assets/demon_logos/exdemon_xs.png';
import exdemonSM from '../assets/demon_logos/exdemon_sm.png';
import exdemon from '../assets/demon_logos/exdemon.png';

export default function DemonLogo({ diff }: { diff: number|string }) {
    switch (diff) {
        case 'Easy':
        case 1:
            return (<img src={edemon} srcSet={`${edemonXS} 64w, ${edemonSM} 128w`} />);
        case 'Medium':
        case 2:
            return (<img src={mdemon} srcSet={`${mdemonXS} 64w, ${mdemonSM} 128w`} />);
        default:
        case 'Hard':
        case 3:
            return (<img src={hdemon} srcSet={`${hdemonXS} 64w, ${hdemonSM} 128w`} />);
        case 'Insane':
        case 4:
            return (<img src={idemon} srcSet={`${idemonXS} 64w, ${idemonSM} 128w`} />);
        case 'Extreme':
        case 5:
            return (<img src={exdemon} srcSet={`${exdemonXS} 64w, ${exdemonSM} 128w`} />);
    }
}

export function DifficultyToImgSrc(diff: string|number) {
    switch (diff) {
        case 'Easy':
        case 1:
            return edemon;
        case 'Medium':
        case 2:
            return mdemon;
        default:
        case 'Hard':
        case 3:
            return hdemon;
        case 'Insane':
        case 4:
            return idemon;
        case 'Extreme':
        case 5:
            return exdemon;
    }
}

export function tierToIcon(tier: number) {
    if (!tier) return <DemonLogo diff={tier} />;

    return <DemonLogo diff={Math.min(Math.floor(tier / 5), 4) + 1} />;
}