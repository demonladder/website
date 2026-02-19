import { Heading1, Heading2 } from '../../../components/headings';
import { DiscordAlt, X } from '@boxicons/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useSession from '../../../hooks/useSession.ts';
import { connectionsClient } from '../../../api/connections/connectionsClient.ts';
import Checkbox from '../../../components/input/CheckBox.tsx';
import { AppToIcon } from '../../../components/shared/connections/AppToIcon.tsx';
import { appToDisplayName } from '../../../components/shared/connections/AppToDisplayName.tsx';

export function Connections() {
    const session = useSession();
    const query = useQuery({
        queryKey: ['user', session.user?.ID, 'connections'],
        queryFn: () => connectionsClient.listPublic(session.user!.ID),
        enabled: session.user !== undefined,
    });

    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: (connectionId: string) => connectionsClient.delete(connectionId),
        onSuccess: (_, connectionId) => {
            queryClient.setQueryData(
                ['user', session.user?.ID, 'connections'],
                query.data?.filter((c) => c.id !== connectionId),
            );
        },
    });

    const updateDisplayMutation = useMutation({
        mutationFn: ([connectionId, display]: [string, boolean]) => connectionsClient.update(connectionId, { display }),
        onSuccess: (_, [connectionId, display]) => {
            query.data!.find((c) => c.id === connectionId)!.display = display ? 1 : 0;
            queryClient.setQueryData(['user', session.user?.ID, 'connections'], query.data!);
        },
    });

    return (
        <section>
            <Heading1 className='mb-4'>Connections</Heading1>
            <p className='mb-1'>
                You can connect external accounts belonging to you by clicking any of the icons below
            </p>
            <div className='flex gap-2'>
                <a
                    className='p-2 bg-theme-700 inline-block border border-theme-outline round:rounded-lg'
                    href='/api/connections/discord'
                >
                    <DiscordAlt size='lg' />
                </a>
                <button className='p-2 bg-theme-700 inline-block border border-theme-outline round:rounded-lg' disabled>
                    <img src='https://aredl.net/favicon.ico' width={48} height={48} className='rounded-full' />
                </button>
            </div>
            {query.isSuccess && (
                <section className='mt-8'>
                    <Heading2>Connected accounts</Heading2>
                    {query.data.length === 0 && (
                        <p>
                            <i>No connections</i>
                        </p>
                    )}
                    <ul className='grid grid-cols-2 gap-4'>
                        {query.data.map((connection) => (
                            <li
                                className='bg-theme-700 p-4 round:rounded-2xl border border-theme-outline'
                                key={connection.id}
                            >
                                <div className='flex items-center mb-1'>
                                    <AppToIcon app={connection.appName} />
                                    <div className='flex justify-between grow'>
                                        <div>
                                            <p>{connection.accountName}</p>
                                            <p className='text-xs'>{appToDisplayName(connection.appName)}</p>
                                        </div>
                                        <button
                                            onClick={() => deleteMutation.mutate(connection.id)}
                                            disabled={deleteMutation.isPending}
                                            title='Remove connection'
                                        >
                                            <X className='-me-1' />{' '}
                                        </button>
                                    </div>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <p>Display on your profile? </p>
                                    <Checkbox
                                        checked={connection.display === 1}
                                        onChange={(e) =>
                                            updateDisplayMutation.mutate([connection.id, e.target.checked])
                                        }
                                        disabled={updateDisplayMutation.isPending}
                                    />
                                </div>
                                <p className='text-sm text-theme-400'>
                                    Connected on {new Date(connection.createdAt!).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </section>
    );
}
