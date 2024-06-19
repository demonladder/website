import { useQuery } from '@tanstack/react-query';
import { FullLevel } from '../../../api/types/compounds/FullLevel';
import axios from 'axios';
import NewLabel from '../../../components/NewLabel';

interface Props {
    level: FullLevel;
}

function LinkButton({ link, message }: { link: string, message: string }) {
    return (
        <a href={link} target='_blank' rel='noopener noreferrer' className='px-4 py-2 bg-gray-500 round:rounded-md border border-white border-opacity-0 hover:border-opacity-100 transition-colors'>{message} <i className='bx bx-link-external float-right' /></a>
    );
}

export default function ExternalLinks({ level }: Props) {
    const { data: aredl } = useQuery({
        queryKey: ['aredl', level.ID],
        queryFn: () => axios.get(`https://api.aredl.net/api/aredl/levels/${level.ID}`).then((res) => res.data),
    });

    const { data: pointercrateData } = useQuery<{ position: number, level_id: number, publisher: { name: string } }[]>({
        queryKey: ['pointercrate', level.ID],
        queryFn: () => axios.get(`https://pointercrate.com/api/v2/demons?name=${level.Meta.Name}`).then((res) => res.data),
    });

    const pointercrate = pointercrateData?.find((l) => l.level_id === level.ID || l.publisher.name === level.Meta.Creator);

    return (
        <div className='mt-6'>
            <h2 className='text-3xl mb-2' id='levelShowcase'>External links <NewLabel ID='externalLinks' /></h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-2'>
                <LinkButton link={`https://gdbrowser.com/${level.ID}`} message='GDBrowser' />
                <LinkButton link={`https://www.youtube.com/results?search_query=geometry+dash+${level.Meta.Name.toLowerCase().replace(' ', '+')}`} message='Search on youtube' />
                {aredl !== undefined &&
                    <LinkButton link={`https://aredl.net/list/${level.ID}`} message={`AREDL - #${aredl.position}`} />
                }
                {pointercrate !== undefined &&
                    <LinkButton link={`https://pointercrate.com/demonlist/${pointercrate.position}`} message={`Pointercrate - #${pointercrate.position}`} />
                }
            </div>
        </div>
    );
}