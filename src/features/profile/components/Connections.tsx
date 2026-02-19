import { useQuery } from '@tanstack/react-query';
import { connectionsClient } from '../../../api/connections/connectionsClient.ts';
import { AppToIcon } from '../../../components/shared/connections/AppToIcon.tsx';
import { Heading2 } from '../../../components/headings';

interface Props {
    userId: number;
}

export function Connections({ userId }: Props) {
    const query = useQuery({
        queryKey: ['user', userId, 'connections', 'public'],
        queryFn: () => connectionsClient.listPublic(userId),
    });

    return (
        <section className='mt-4'>
            {query.isSuccess && (
                <>
                    <Heading2>Connections</Heading2>
                    <ul className='flex flex-wrap'>
                        {query.data.map((connection) => (
                            <li
                                className='flex items-center bg-theme-700 px-2 py-1 round:rounded-lg'
                                key={connection.id}
                            >
                                <AppToIcon app={connection.appName} />
                                <p>{connection.accountName}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </section>
    );
}
