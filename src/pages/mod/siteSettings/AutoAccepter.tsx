import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PrimaryButton } from '../../../components/Button';
import { NumberInput } from '../../../components/Input';
import GetAutoAcceptSettings from '../../../api/settings/autoAccept/GetAutoAcceptSettings';
import { useEffect, useState } from 'react';
import { validateIntChange } from '../../../utils/validators/validateIntChange';
import CheckBox from '../../../components/input/CheckBox';
import SaveAutoAcceptSettings from '../../../api/settings/autoAccept/SaveAutoAcceptSettings';
import FloatingLoadingSpinner from '../../../components/FloatingLoadingSpinner';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';

export default function AutoAccepter() {
    const [enabled, setEnabled] = useState(true);
    const [maxTier, setMaxTier] = useState<number>();
    const [maxDeviation, setMaxDeviation] = useState<number>();

    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ['siteSettings', 'autoAccept'],
        queryFn: GetAutoAcceptSettings,
    });

    useEffect(() => {
        if (data === undefined) return;

        setEnabled(data.enabled);
        setMaxTier(data.maxTier);
        setMaxDeviation(data.maxDeviation);
    }, [data]);

    const { mutate, status } = useMutation(async () => {
        if (status === 'loading') return;
        if (maxTier === undefined || maxDeviation === undefined) return;

        await toast.promise(
            SaveAutoAcceptSettings({
                enabled,
                maxTier,
                maxDeviation,
            }).then(() => {
                queryClient.invalidateQueries(['siteSettings', 'autoAccept']);
            }),
            {
                pending: 'Saving...',
                success: 'Saved',
                error: renderToastError,
            },
        );
    });

    return (
        <div>
            <h3 className='text-2xl'>Auto accept settings</h3>
            <p className='mb-2'>The auto accept system evaluates each incoming submission and accepts it if the level's tier is under a certain limit or if the submitted rating isn't too far off from the level's tier. Any submissions with proof links will not be accepted automatically. </p>
            <div className='relative'>
                <div className='mb-2'>
                    <label className='flex gap-2 items-center'><CheckBox checked={enabled} onChange={(e) => setEnabled(e.target.checked)} /> Enabled</label>
                </div>
                <div className='mb-2'>
                    <p>Max tier: <span className='inline-block ms-2'><NumberInput value={maxTier} onChange={(e) => { setMaxTier(validateIntChange(e.target.value)) }} /></span></p>
                    <p className='text-gray-400 text-sm'>Any submissions for levels above this tier will not be automatically accepted</p>
                </div>
                <div className='mb-2'>
                    <p>Max Deviation: <span className='inline-block ms-2'><NumberInput value={maxDeviation} /></span></p>
                    <p className='text-gray-400 text-sm'>Any submissions that deviate from the level's tier more than this value will not be automatically accepted</p>
                </div>
                <PrimaryButton onClick={() => mutate()} disabled={status === 'loading'}>Save</PrimaryButton>
                <FloatingLoadingSpinner isLoading={data === undefined} />
            </div>
        </div>
    );
}