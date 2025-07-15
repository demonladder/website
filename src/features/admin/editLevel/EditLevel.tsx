import { useEffect, useId, useState } from 'react';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { NumberInput, TextInput } from '../../../components/Input';
import useLevelSearch from '../../../hooks/useLevelSearch';
import { validateIntInputChange } from '../../../utils/validators/validateIntChange';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import UpdateLevel from '../../../api/level/UpdateLevel';
import useHash from '../../../hooks/useHash';
import { useMutation } from '@tanstack/react-query';
import FormGroup from '../../../components/form/FormGroup';
import FormInputDescription from '../../../components/form/FormInputDescription';
import RecalculateStats from '../../../api/level/RecalculateStats';
import FormInputLabel from '../../../components/form/FormInputLabel';
import RemoveLevel from '../../../api/level/RemoveLevel';
import { useLevel } from '../../level/hooks/useLevel';

export default function EditLevel() {
    const [hash, setHash] = useHash();
    const { activeLevel, SearchBox } = useLevelSearch({ ID: 'editLevelSearch', required: true, options: { defaultLevel: parseInt(hash) || null } });
    const [defaultRating, setDefaultRating] = useState('');
    const defaultRatingID = useId();
    const [showcase, setShowcase] = useState('');
    const showcaseID = useId();
    const [confirmRemove, setConfirmRemove] = useState(false);

    const { data: level } = useLevel(activeLevel?.ID ?? null);

    useEffect(() => {
        setDefaultRating(level?.DefaultRating?.toString() ?? '');
        setShowcase(level?.Showcase ?? '');
        if (level) setHash(level.ID.toString());
        setConfirmRemove(false);
    }, [activeLevel, setHash, level]);

    function onShowcase(e: React.ChangeEvent<HTMLInputElement>) {
        setShowcase(e.target.value);
    }

    const mutation = useMutation({
        mutationFn: ([levelID, data]: Parameters<typeof UpdateLevel>) => toast.promise(UpdateLevel(levelID, data), {
            pending: 'Updating...',
            success: 'Saved!',
            error: renderToastError,
        }),
    });

    const deleteMutation = useMutation({
        mutationFn: (levelID: number) => toast.promise(RemoveLevel(levelID), {
            pending: 'Removing...',
            success: 'Removed!',
            error: renderToastError,
        }),
    });

    function onSubmit() {
        if (!activeLevel) return;
        mutation.mutate([activeLevel.ID, { defaultRating, showcase }]);
    }

    const recalculateMutation = useMutation({
        mutationFn: () => toast.promise(RecalculateStats(activeLevel?.ID ?? 0), {
            pending: 'Recalculating...',
            success: 'Recalculated!',
            error: renderToastError,
        }),
        onSettled: () => {
            setConfirmRemove(false);
        },
    });

    function onRemoveLevel() {
        if (!activeLevel) return;
        if (!confirmRemove) {
            setConfirmRemove(true);
            return;
        }

        deleteMutation.mutate(activeLevel.ID);
    }

    return (
        <div>
            <h3 className='text-2xl mb-4'>Edit Level</h3>
            <div>
                <FormInputLabel>Level:</FormInputLabel>
                {SearchBox}
            </div>
            <div className='mt-4'>
                <FormGroup>
                    <FormInputLabel htmlFor={defaultRatingID}>Default rating</FormInputLabel>
                    <NumberInput id={defaultRatingID} value={defaultRating} onChange={(e) => validateIntInputChange(e, setDefaultRating)} invalid={parseInt(defaultRating) > 35 || parseInt(defaultRating) < 1} />
                </FormGroup>
                <FormGroup className='mt-1'>
                    <FormInputLabel htmlFor={showcaseID}>Showcase link</FormInputLabel>
                    <TextInput id={showcaseID} value={showcase} onChange={onShowcase} />
                    <FormInputDescription>- Must be a YouTube video ID</FormInputDescription>
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
                    <PrimaryButton onClick={onSubmit} loading={mutation.isPending}>Save</PrimaryButton>
                </FormGroup>
            </div>
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
