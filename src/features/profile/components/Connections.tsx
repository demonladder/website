import { useQuery } from '@tanstack/react-query';
import { ConnectableApps, connectionsClient } from '../../../api/connections/connectionsClient.ts';
import { AppToIcon } from '../../../components/shared/connections/AppToIcon.tsx';
import { EyeSlash } from '@boxicons/react';

interface Props {
    userId: number;
}

export function Connections({ userId }: Props) {
    const query = useQuery({
        queryKey: ['user', userId, 'connections', 'public'],
        queryFn: () => connectionsClient.listPublic(userId),
    });

    if (!query.data?.length) return;

    return (
        <ul className='flex flex-wrap gap-2 mt-2'>
            {query.data.map((connection) => (
                <Connection {...connection} hidden={connection.display === 0} key={connection.id} />
            ))}
        </ul>
    );
}

function Connection({
    accountName,
    appName,
    hidden,
}: {
    accountName: string;
    appName: ConnectableApps;
    hidden?: boolean;
}) {
    let link: string | null = null;

    if (appName === ConnectableApps.GITHUB) {
        link = 'https://github.com/' + accountName;
    } else if (appName === ConnectableApps.AREDL) {
        link = 'https://aredl.net/profile/user/' + accountName;
    }

    return (
        <li className='flex items-center bg-theme-700 border border-theme-outline px-2 py-1 round:rounded-xl'>
            <AppToIcon app={appName} />
            {link ? (
                <a className='ms-2' href={link} target='_blank' rel='noreferrer'>
                    {accountName}
                </a>
            ) : (
                <p className='ms-2'>{accountName} </p>
            )}
            {hidden && <EyeSlash className='ms-1' size='sm' />}
        </li>
    );
}
