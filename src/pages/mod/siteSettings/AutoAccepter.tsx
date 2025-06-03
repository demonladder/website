import { useMutation, useQuery } from '@tanstack/react-query';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { NumberInput } from '../../../components/Input';
import GetAutoAcceptSettings from '../../../api/settings/autoAccept/GetAutoAcceptSettings';
import { useEffect, useState } from 'react';
import { validateIntChange } from '../../../utils/validators/validateIntChange';
import CheckBox from '../../../components/input/CheckBox';
import SaveAutoAcceptSettings from '../../../api/settings/autoAccept/SaveAutoAcceptSettings';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import Heading3 from '../../../components/headings/Heading3';
import FormGroup from '../../../components/form/FormGroup';
import FormInputDescription from '../../../components/form/FormInputDescription';
import FormInputLabel from '../../../components/form/FormInputLabel';

export default function AutoAccepter() {
    const [enabled, setEnabled] = useState(true);
    const [maxTier, setMaxTier] = useState<number>();
    const [maxDeviation, setMaxDeviation] = useState<number>();

    const { data, refetch } = useQuery({
        queryKey: ['siteSettings', 'autoAccept'],
        queryFn: GetAutoAcceptSettings,
    });

    useEffect(() => {
        if (data === undefined) return;

        setEnabled(data.enabled);
        setMaxTier(data.maxTier);
        setMaxDeviation(data.maxDeviation);
    }, [data]);

    const { mutate, status } = useMutation({
        mutationFn: async () => {
            await toast.promise(
                SaveAutoAcceptSettings({
                    enabled,
                    maxTier,
                    maxDeviation,
                }),
                {
                    pending: 'Saving...',
                    success: 'Saved',
                    error: renderToastError,
                },
            );
            await refetch();
        },
    });

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (status === 'pending') return;
        mutate();
    }

    return (
        <section>
            <Heading3>Auto accept settings</Heading3>
            <p className='mb-2'>The auto accept system evaluates each incoming submission and accepts it if the level's tier is under a certain limit or if the submitted rating isn't too far off from the level's tier. Any submissions with proof links will not be accepted automatically. </p>
            <form onSubmit={onSubmit}>
                <FormGroup>
                    <label className='flex gap-2 items-center'><CheckBox checked={enabled} onChange={(e) => setEnabled(e.target.checked)} /> Enabled</label>
                </FormGroup>
                <FormGroup>
                    <FormInputLabel>Max tier</FormInputLabel>
                    <NumberInput value={maxTier} onChange={(e) => setMaxTier(validateIntChange(e.target.value))} />
                    <FormInputDescription>Any submissions for levels above this tier will not be automatically accepted</FormInputDescription>
                </FormGroup>
                <FormGroup>
                    <FormInputLabel>Max standard deviations</FormInputLabel>
                    <NumberInput value={maxDeviation} />
                    <FormInputDescription>Any submissions that deviate more than this value will not be automatically accepted</FormInputDescription>
                </FormGroup>
                <FormGroup>
                    <PrimaryButton type='submit' loading={status === 'pending'}>Save</PrimaryButton>
                </FormGroup>
            </form>
        </section>
    );
}
