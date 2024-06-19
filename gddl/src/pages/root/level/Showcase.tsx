import { FullLevel } from '../../../api/types/compounds/FullLevel';
import NewLabel from '../../../components/NewLabel';

interface Props {
    level: FullLevel;
}

export default function Showcase({ level }: Props) {
    if (level.Showcase === null) return;

    return (
        <div className='mt-6'>
            <h2 className='text-3xl mb-2' id='levelShowcase'>Showcase <NewLabel ID='showcase' /></h2>
            <div className='relative w-full overflow-hidden pt-[56%]'>
                <iframe className='absolute inset-0 w-full h-full' src={`https://www.youtube-nocookie.com/embed/${level.Showcase}`} title={`Showcase video for ${level.Meta.Name}`} allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerPolicy='strict-origin-when-cross-origin' allowFullScreen={true} />
            </div>
        </div>
    );
}