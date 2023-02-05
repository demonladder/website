import React from 'react';
import edemon from './demon_logos/edemon.png';
import mdemon from './demon_logos/mdemon.png';
import hdemon from './demon_logos/hdemon.png';
import idemon from './demon_logos/idemon.png';
import exdemon from './demon_logos/exdemon.png';

export default function DemonLogo({ diff }) {
    let imgSrc = '';
    switch (diff) {
        case 1:
            imgSrc = edemon;
            break;
        case 2:
            imgSrc = mdemon;
            break;
        case 3:
            imgSrc = hdemon;
            break;
        case 4:
            imgSrc = idemon;
            break;
        case 5:
            imgSrc = exdemon;
            break;
        default:
            imgSrc = hdemon;
            break;
    }

    return (
        <img src={imgSrc} alt='' width='100%'></img>
    );
}