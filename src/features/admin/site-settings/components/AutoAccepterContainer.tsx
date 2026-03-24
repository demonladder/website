import { SubmitEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PrimaryButton } from '../../../../components/ui/buttons';
import { NumberInput } from '../../../../components/shared/input/Input';
import GetAutoAcceptSettings from '../../../../api/settings/autoAccept/GetAutoAcceptSettings';
import { ReactNode, useState } from 'react';
import CheckBox from '../../../../components/input/CheckBox';
import SaveAutoAcceptSettings from '../../../../api/settings/autoAccept/SaveAutoAcceptSettings';
import { toast } from 'react-toastify';
import renderToastError from '../../../../utils/renderToastError';
import { Heading3 } from '../../../../components/headings';
import { FormGroup, FormInputDescription, FormInputLabel } from '../../../../components/form';
import { AutoAcceptSettings } from '../../../../api/settings/autoAccept/AutoAcceptSettings.ts';
import InlineLoadingSpinner from '../../../../components/ui/InlineLoadingSpinner.tsx';

function AutoAccepterTemplate({ children }: { children: ReactNode }) {
    return (
        <section>
            <Heading3>Auto accept settings</Heading3>
            <p className='mb-2'>
                The auto accept system evaluates each incoming submission and accepts it if the level's tier is under a
                certain limit or if the submitted rating isn't too far off from the level's tier. Any submissions with
                proof links will not be accepted automatically.{' '}
            </p>
            {children}
        </section>
    );
}

export default function AutoAccepterContainer() {
    const { data, refetch, status } = useQuery({
        queryKey: ['site-settings', 'auto-accept'],
        queryFn: GetAutoAcceptSettings,
    });

    if (status === 'pending')
        return (
            <AutoAccepterTemplate>
                <InlineLoadingSpinner />
            </AutoAccepterTemplate>
        );
    if (status === 'error')
        return (
            <AutoAccepterTemplate>
                <p>An error occurred!</p>
            </AutoAccepterTemplate>
        );
    return <AutoAccepterPresenter data={data} refetch={refetch} />;
}

interface AutoAccepterPresenterProps {
    data: AutoAcceptSettings;
    refetch: () => Promise<unknown>;
}

function AutoAccepterPresenter({ data, refetch }: AutoAccepterPresenterProps) {
    const [enabled, setEnabled] = useState(data.enabled);
    const [maxTier, setMaxTier] = useState(data.maxTier);
    const [maxDeviation, setMaxDeviation] = useState(data.maxDeviation);

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

    function onSubmit(e: SubmitEvent) {
        e.preventDefault();
        if (status === 'pending') return;
        mutate();
    }

    return (
        <AutoAccepterTemplate>
            <form onSubmit={onSubmit}>
                <FormGroup>
                    <label className='flex gap-2 items-center'>
                        <CheckBox checked={enabled} onChange={(e) => setEnabled(e.target.checked)} /> Enabled
                    </label>
                </FormGroup>
                <FormGroup>
                    <FormInputLabel>Max tier</FormInputLabel>
                    <NumberInput value={maxTier} onChange={(e) => setMaxTier(parseInt(e.target.value))} />
                    <FormInputDescription>
                        Any submissions for levels above this tier will not be automatically accepted
                    </FormInputDescription>
                </FormGroup>
                <FormGroup>
                    <FormInputLabel>Max standard deviations</FormInputLabel>
                    <NumberInput value={maxDeviation} onChange={(e) => setMaxDeviation(parseInt(e.target.value))} />
                    <FormInputDescription>
                        Any submissions that deviate more than this value will not be automatically accepted
                    </FormInputDescription>
                </FormGroup>
                <FormGroup>
                    <PrimaryButton type='submit' loading={status === 'pending'}>
                        Save
                    </PrimaryButton>
                </FormGroup>
            </form>
        </AutoAccepterTemplate>
    );
}
