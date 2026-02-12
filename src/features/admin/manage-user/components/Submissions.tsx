import { toast } from 'react-toastify';
import { DangerButton } from '../../../../components/ui/buttons/DangerButton';
import FormInputDescription from '../../../../components/form/FormInputDescription';
import { useMutation } from '@tanstack/react-query';
import { deletePendingSubmissions } from '../../../../api/user/submissions/deletePendingSubmissions';
import User from '../../../../api/types/User';
import { AxiosError } from 'axios';
import renderToastError from '../../../../utils/renderToastError';
import { deleteSubmissions } from '../../../../api/user/submissions/deleteSubmissions';
import { Heading3, Heading4 } from '../../../../components/headings';
import { removeUserEnjoyments } from '../../../../api/user/submissions/removeUserEnjoyments';

interface Props {
    user: User;
}

export default function Submissions({ user }: Props) {
    const removeEnjoyments = useMutation({
        mutationFn: removeUserEnjoyments,
        onSuccess: () => void toast.success('Enjoyments removed!'),
        onError: (err: AxiosError) => {
            toast.error(renderToastError.render({ data: err }));
        },
    });

    const purgePendingSubmissions = useMutation({
        mutationFn: deletePendingSubmissions,
        onError: (err: AxiosError) => {
            toast.error(renderToastError.render({ data: err }));
        },
    });

    const purgeSubmissions = useMutation({
        mutationFn: deleteSubmissions,
        onError: (err: AxiosError) => {
            toast.error(renderToastError.render({ data: err }));
        },
    });

    return (
        <section className='bg-theme-700 border border-theme-outline p-4 round:rounded-xl'>
            <Heading3 className='mb-8'>Actions</Heading3>
            <div>
                <Heading4 className='border-theme-500 border-b pb-2'>Remove enjoyments</Heading4>
                <FormInputDescription>This action is irreversible! All the users submissions enjoyment will be set to null and any submissions with a null tier will be deleted.</FormInputDescription>
                <DangerButton onClick={() => removeEnjoyments.mutate(user.ID)}>Remove</DangerButton>
            </div>
            <div className='mt-12'>
                <Heading4 className='border-theme-500 border-b pb-2'>Purge pending submissions</Heading4>
                <FormInputDescription>This action is irreversible! All the users pending submissions will be deleted.</FormInputDescription>
                <DangerButton onClick={() => purgePendingSubmissions.mutate(user.ID)} loading={purgePendingSubmissions.isPending}>Purge</DangerButton>
            </div>
            <div className='mt-12'>
                <Heading4 className='border-theme-500 border-b pb-2'>Purge submissions</Heading4>
                <FormInputDescription>This action is irreversible! All the users submissions will be deleted. Might take a little while if the user has a lot of submissions.</FormInputDescription>
                <DangerButton onClick={() => purgeSubmissions.mutate(user.ID)} loading={purgeSubmissions.isPending}>Purge</DangerButton>
            </div>
        </section>
    );
}
