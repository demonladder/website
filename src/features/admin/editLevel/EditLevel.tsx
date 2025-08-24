import { useId, useState } from 'react';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { NumberInput, TextInput } from '../../../components/Input';
import { validateIntInputChange } from '../../../utils/validators/validateIntChange';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import { updateLevel } from './api/updateLevel';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import FormGroup from '../../../components/form/FormGroup';
import FormInputDescription from '../../../components/form/FormInputDescription';
import { recalculateLevelStats } from './api/recalculateStats';
import FormInputLabel from '../../../components/form/FormInputLabel';
import { removeLevel } from './api/removeLevel';
import { Link, useLoaderData } from 'react-router';
import Heading1 from '../../../components/headings/Heading1';
import type { FullLevel } from '../../../api/types/compounds/FullLevel';

export default function EditLevel() {
    const level = useLoaderData<FullLevel>();
    const [defaultRating, setDefaultRating] = useState(level.DefaultRating?.toString() ?? '');
    const defaultRatingID = useId();
    const [showcase, setShowcase] = useState(level.Showcase ?? '');
    const showcaseID = useId();
    const [confirmRemove, setConfirmRemove] = useState(false);
    const queryClient = useQueryClient();

    function onShowcase(e: React.ChangeEvent<HTMLInputElement>) {
        setShowcase(e.target.value);
    }

    const mutation = useMutation({
        mutationFn: ([levelID, data]: Parameters<typeof updateLevel>) => toast.promise(updateLevel(levelID, data), {
            pending: 'Updating...',
            success: 'Saved!',
            error: renderToastError,
        }),
        onSuccess: (data) => {
            level.Showcase = data.Showcase;
            level.DefaultRating = data.DefaultRating;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (levelID: number) => toast.promise(removeLevel(levelID), {
            pending: 'Removing...',
            success: 'Removed!',
            error: renderToastError,
        }),
        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: ['level', level.ID],
            });
        },
    });

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        mutation.mutate([level.ID, { defaultRating, showcase }]);
    }

    const recalculateMutation = useMutation({
        mutationFn: () => toast.promise(recalculateLevelStats(level.ID), {
            pending: 'Recalculating...',
            success: 'Recalculated!',
            error: renderToastError,
        }),
        onSettled: () => {
            setConfirmRemove(false);
        },
    });

    function onRemoveLevel() {
        if (!confirmRemove) {
            setConfirmRemove(true);
            return;
        }

        deleteMutation.mutate(level.ID);
    }

    return (
        <div>
            <Heading1>Edit Level</Heading1>
            <p>You're currently editing <Link to={`/level/${level.ID}`}><b>{level.Meta.Name}</b></Link> by {level.Meta.Publisher?.name ?? '(-)'}</p>
            <form onSubmit={onSubmit} className='mt-4'>
                <FormGroup>
                    <FormInputLabel htmlFor={defaultRatingID}>Default rating</FormInputLabel>
                    <NumberInput id={defaultRatingID} value={defaultRating} onChange={(e) => validateIntInputChange(e, setDefaultRating)} invalid={parseInt(defaultRating) > 35 || parseInt(defaultRating) < 1} />
                </FormGroup>
                <FormGroup className='mt-1'>
                    <FormInputLabel htmlFor={showcaseID}>Showcase</FormInputLabel>
                    <TextInput id={showcaseID} value={showcase} onChange={onShowcase} />
                    <FormInputDescription>- Must be a YouTube video <b>ID</b></FormInputDescription>
                    <FormInputDescription>- At least 720p</FormInputDescription>
                    <FormInputDescription>- No LDMs</FormInputDescription>
                    <FormInputDescription>- Must show the entire level, no intros</FormInputDescription>
                    <FormInputDescription>- Follows the main path</FormInputDescription>
                    <FormInputDescription>- No visual effect overlays</FormInputDescription>
                    <FormInputDescription>- No clicks</FormInputDescription>
                    <FormInputDescription>- No texture pack for level elements</FormInputDescription>
                    <FormInputDescription>- Uses the appropriate NONG if applicable</FormInputDescription>
                </FormGroup>
                <FormGroup>
                    <PrimaryButton type='submit' loading={mutation.isPending}>Save</PrimaryButton>
                </FormGroup>
            </form>
            <div className='my-8 border-theme-500 border-b-2' />
            <FormGroup>
                <PrimaryButton onClick={() => recalculateMutation.mutate()} disabled={recalculateMutation.status === 'pending'}>Re-calculate stats</PrimaryButton>
                <FormInputDescription>Should only really be used if an error has occurred in the stat calucation which happens when I do a lil oopsie.</FormInputDescription>
            </FormGroup>
            <FormGroup>
                <DangerButton onClick={onRemoveLevel} loading={deleteMutation.isPending}>{confirmRemove ? 'Confirm r' : 'R'}emove level</DangerButton>
                <FormInputDescription>If the level gets unrated.</FormInputDescription>
            </FormGroup>
        </div>
    );
}
