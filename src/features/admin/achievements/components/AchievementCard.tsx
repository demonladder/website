import { Achievement } from '../../../../api/types/Achievement';
import { useNow } from '../../../../hooks/useNow';
import { secondsToHumanReadable } from '../../../../utils/secondsToHumanReadable';
import { useMemo } from 'react';
import { Copy, DotsVerticalRounded, Trash } from '@boxicons/react';
import useContextMenu from '../../../../context/menu/useContextMenu';
import { copyText } from '../../../../utils/copyText';
import { useConfirmationModal } from '../../../../components/modals/confirmation/useConfirmationModal';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAchievement } from '../api/deleteAchievement';
import renderToastError from '../../../../utils/renderToastError';
import { AxiosError } from 'axios';
import Surface from '../../../../components/layout/Surface';

interface Props {
    achievement: Achievement;
}

export function AchievementCard({ achievement }: Props) {
    const now = useNow();
    const createdAt = useMemo(() => new Date(achievement.createdAt).getTime(), [achievement.createdAt]);
    const updatedAt = useMemo(() => new Date(achievement.updatedAt).getTime(), [achievement.updatedAt]);
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteAchievement(id),
        onMutate: () => toast.loading('Deleting...'),
        onSuccess: (_data, _vars, toastId) => {
            queryClient.setQueryData<Achievement[]>(['achievements'], (prev) =>
                prev?.filter((a) => a.id !== achievement.id),
            );
            toast.update(toastId, {
                render: 'Delete ' + achievement.name,
                type: 'success',
                isLoading: false,
                autoClose: 5000,
            });
        },
        onError: (error: AxiosError, _vars, toastId) => {
            renderToastError.error(toastId!, error);
        },
    });

    const confirmDelete = useConfirmationModal({
        prompt: (
            <p>
                Are you sure you want to delete the <b>{achievement.name}</b> achievement?
            </p>
        ),
        onConfirm: () => deleteMutation.mutate(achievement.id),
    });

    const onContextMenu = useContextMenu([
        { text: 'Copy ID', onClick: () => copyText(achievement.id), icon: <Copy size='sm' /> },
        { type: 'divider' },
        { type: 'danger', text: 'Delete', onClick: () => confirmDelete(), icon: <Trash size='sm' /> },
    ]);

    return (
        <Surface variant='700' size='sm' className='hover:bg-theme-600' onContextMenu={onContextMenu}>
            <div className='flex gap-1 justify-between items-center'>
                <p className='flex items-center'>
                    {achievement.iconSource && (
                        <img className='inline me-1' width={24} height={24} src={achievement.iconSource} />
                    )}
                    {achievement.name}
                </p>
                <button className='hover:bg-white/20 transition-colors rounded-full' onClick={onContextMenu}>
                    <DotsVerticalRounded pack='filled' size='base' />
                </button>{' '}
            </div>
            <div className='flex gap-2 mt-2'>
                <p
                    className='text-theme-400 text-sm'
                    title={`Created at ${new Date(achievement.createdAt).toLocaleString()}`}
                >
                    Created {secondsToHumanReadable((now - createdAt) / 1000)} ago
                </p>
                <p className='text-theme-400 text-sm'>-</p>
                <p
                    className='text-theme-400 text-sm'
                    title={`Updated at ${new Date(achievement.updatedAt).toLocaleString()}`}
                >
                    updated {secondsToHumanReadable((now - updatedAt) / 1000)} ago
                </p>
            </div>
        </Surface>
    );
}
