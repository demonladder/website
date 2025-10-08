import { useQuery } from '@tanstack/react-query';
import Heading1 from '../../components/headings/Heading1';
import { PrimaryButton } from '../../components/ui/buttons/PrimaryButton';
import Page from '../../components/Page';
import { useCreateApplicationModal } from './hooks/useCreateApplicationModal';
import { getMyApps } from './api/getMyApps';
import { Link } from 'react-router';

export default function Applications() {
    const openCreateModal = useCreateApplicationModal();

    const { data, status } = useQuery({
        queryKey: ['applications', '@me'],
        queryFn: getMyApps,
    });

    return (
        <Page title='Applications'>
            <div className='flex justify-between items-center'>
                <Heading1>Applications</Heading1>
                <PrimaryButton size='md' onClick={() => openCreateModal()}>New application</PrimaryButton>
            </div>
            {status === 'success' &&
                <div className='flex flex-wrap gap-4 mt-8'>
                    {data.map((app) => (
                        <Link to={`${app.ID}`} className='bg-theme-700 p-2 round:rounded-lg shadow outline outline-white/15' key={app.ID}>
                            <img src={`/api/user/${app.botID}/pfp?size=128`} width='128' height='128' className='rounded-full' />
                            <p className='text-center mt-1'>{app.name}</p>
                        </Link>
                    ))}
                </div>
            }
        </Page>
    );
}
