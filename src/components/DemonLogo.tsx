export default function DemonLogo({ diff, ...props }: { diff?: number | string } & React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <div className='relative'>
            <img src={DifficultyToImgSrc(diff)} {...props} className=' z-10' />
            {/* <img src='/images/feature.png' className='' /> */}
        </div>
    );
}

export function DifficultyToImgSrc(diff?: string | number) {
    switch (diff) {
        case 'Easy':
        case 1:
            return '/images/demon_logos/edemon.png';
        case 'Medium':
        case 2:
            return '/images/demon_logos/mdemon.png';
        default:
        case 'Hard':
        case 3:
            return '/images/demon_logos/hdemon.png';
        case 'Insane':
        case 4:
            return '/images/demon_logos/idemon.png';
        case 'Extreme':
        case 5:
            return '/images/demon_logos/exdemon.png';
    }
}
