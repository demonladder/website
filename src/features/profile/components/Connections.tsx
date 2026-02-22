import { useQuery } from '@tanstack/react-query';
import { ConnectableApps, connectionsClient } from '../../../api/connections/connectionsClient.ts';
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
                    <ul className='flex flex-wrap gap-2'>
                        {query.data.map((connection) => (
                            <Connection {...connection} key={connection.id} />
                        ))}
                    </ul>
                </>
            )}
        </section>
    );
}

function Connection({ accountName, appName }: { accountName: string; appName: ConnectableApps }) {
    let link: string | null = null;

    if (appName === ConnectableApps.GITHUB) {
        link = 'https://github.com/' + accountName;
    }

    return (
        <li className='flex items-center bg-theme-700 border border-theme-outline px-2 py-1 round:rounded-xl'>
            <AppToIcon app={appName} />
            {link ? (
                <a className='ms-2' href={link} referrerPolicy='no-referrer' target='_blank'>
                    {accountName}
                </a>
            ) : (
                <p className='ms-2'>{accountName}</p>
            )}
        </li>
    );
}
