import { useQuery } from '@tanstack/react-query';
import Container from '../../../components/Container';
import DemonLogo from '../../../components/DemonLogo';
import { GetPlatformerList } from './GetPlatformerList';
import { ListEntry } from './GetPlatformerList';
import IDButton from '../../../components/IDButton';
import { Link } from 'react-router-dom';
import Heading1 from '../../../components/headings/Heading1';

export default function PlatformerList() {
    const { data } = useQuery({
        queryKey: ['platformerList'],
        queryFn: GetPlatformerList,
    });

    return (
        <Container>
            <Heading1>Platformer list</Heading1>
            <p className='mb-2'>As there currently aren't enough platformer levels to put them into tiers, we have created this temporary ranking of all the platformer demons. The position of each level is decided by our community until we're able to generalise the levels into tiers.</p>
            <div className='grid grid-cols-1 gap-3'>
                {data?.sort((a, b) => a.Position > b.Position ? 1 : -1).map((level) => (<Entry level={level} />))}
            </div>
        </Container>
    );
}

function Entry({ level }: { level: ListEntry }) {
    const fixedEnjoyment = level.Enjoyment?.toFixed(2);
    const roundedEnjoyment = level.Enjoyment !== null ? Math.round(level.Enjoyment) : -1;
    const enjoymentClass = 'enj-' + roundedEnjoyment;

    return (
        <div className='grid grid-cols-12 max-xl:gap-2'>
            <div className='self-center text-center col-span-1'>
                <b className='lg:text-6xl'>{level.Position}.</b>
            </div>
            <div className='col-span-11 flex grow gap-2 lg:gap-6 bg-gray-700'>
                <div className='w-3/12 lg:w-1/12 p-2 self-center'>
                    <DemonLogo diff={level.Difficulty} />
                </div>
                <div className='self-center text-sm lg:text-xl'>
                    <Link to={'/level/' + level.LevelID} className='font-bold underline break-all whitespace-pre-wrap'>{level.Name}</Link>
                    <p><i>{level.Creator}</i></p>
                    <IDButton id={level.LevelID} />
                </div>
                <div className={'ms-auto w-10 lg:w-32 lg:h-32 grid place-items-center group ' + enjoymentClass}>
                    <p className='text-3xl group-hover:hidden '>{level.Enjoyment !== null ? roundedEnjoyment : 'N/A'}</p>
                    <p className='text-3xl hidden group-hover:block '>{level.Enjoyment !== null ? fixedEnjoyment : 'N/A'}</p>
                </div>
            </div>
        </div>
    );
}