import { useEffect, useState } from 'react';
import { DangerButton, PrimaryButton } from '../../../components/Button';
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

export default function EditLevel() {
    const [hash, setHash] = useHash();
    const { activeLevel, SearchBox } = useLevelSearch({ ID: 'editLevelSearch', required: true, options: { defaultLevel: parseInt(hash) || null } });
    const [defaultRating, setDefaultRating] = useState('');
    const [showcase, setShowcase] = useState('');
    const [confirmRemove, setConfirmRemove] = useState(false);

    useEffect(() => {
        setDefaultRating(activeLevel?.DefaultRating?.toString() ?? '');
        setShowcase(activeLevel?.Showcase ?? '');
        if (activeLevel) setHash(activeLevel.ID.toString());
        setConfirmRemove(false);
    }, [activeLevel?.ID, activeLevel, setHash]);

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
            <h3 className='text-2xl mb-3'>Edit Level</h3>
            <div>
                <FormInputLabel>Level:</FormInputLabel>
                {SearchBox}
            </div>
            <div className='mt-4'>
                <div>
                    <FormInputLabel>Default rating</FormInputLabel>
                    <NumberInput value={defaultRating} onChange={(e) => validateIntInputChange(e, setDefaultRating)} invalid={parseInt(defaultRating) > 35 || parseInt(defaultRating) < 1} />
                </div>
                <div className='mt-1'>
                    <FormInputLabel>Showcase link</FormInputLabel>
                    <TextInput value={showcase} onChange={onShowcase} />
                </div>
                <div>
                    <PrimaryButton onClick={onSubmit} loading={mutation.isLoading}>Save</PrimaryButton>
                </div>
            </div>
            <hr className='my-4' />
            <div>
                <FormGroup>
                    <PrimaryButton onClick={() => recalculateMutation.mutate()} disabled={recalculateMutation.status === 'loading'}>Re-calculate stats</PrimaryButton>
                    <FormInputDescription>Should only really be used if an error has occurred in the stat calucation which happens when I do a lil oopsie.</FormInputDescription>
                </FormGroup>
            </div>
            <hr className='my-4' />
            <div>
                <FormGroup>
                    <DangerButton onClick={onRemoveLevel} loading={deleteMutation.isLoading}>{confirmRemove ? 'Confirm r' : 'R'}emove level</DangerButton>
                    <FormInputDescription>If the level gets unrated.</FormInputDescription>
                </FormGroup>
            </div>
        </div>
    );
}