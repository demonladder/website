import { useState } from 'react';
import { NumberInput, TextInput } from '../../../components/Input';
import Select from '../../../components/Select';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import renderToastError from '../../../utils/renderToastError';
import FloatingLoadingSpinner from '../../../components/FloatingLoadingSpinner';
import useLevelSearch from '../../../hooks/useLevelSearch';
import useUserSearch from '../../../hooks/useUserSearch';
import { FullLevel } from '../../../api/types/compounds/FullLevel';
import FormInputLabel from '../../../components/form/FormInputLabel';
import FormInputDescription from '../../../components/form/FormInputDescription';
import { Difficulties } from '../../level/types/LevelMeta';
import SendSubmission from '../../../api/submissions/SendSubmission';
import { Device } from '../../../api/core/enums/device.enum';

const deviceOptions: Record<Device, string> = {
    'pc': 'PC',
    'mobile': 'Mobile',
};

export default function AddSubmission() {
    const [deviceKey, setDeviceKey] = useState(Device.PC);
    const [isMutating, setIsMutating] = useState(false);

    const [rating, setRating] = useState<number>();
    const [enjoyment, setEnjoyment] = useState<number>();
    const [proof, setProof] = useState('');
    const [refreshRate, setRefreshRate] = useState<number>(60);

    const queryClient = useQueryClient();

    const { activeLevel, markInvalid: markInvalidLevel, SearchBox, clear: clearActiveLevel } = useLevelSearch({ ID: 'addSubmissionSearch' });
    const userSearch = useUserSearch({
        ID: 'addSubmissionUserSearch',
    });

    function submit() {
        // Validate
        if (!activeLevel || !userSearch.activeUser) {
            if (!activeLevel) {
                markInvalidLevel();
                toast.error('You must select a level!');
            }
            if (!userSearch.activeUser) {
                userSearch.markInvalid();
                toast.error('You must select a user!');
            }

            return;
        }

        const submission = {
            levelID: activeLevel.ID,
            userID: userSearch.activeUser.ID,
            rating: rating,
            enjoyment: enjoyment,
            refreshRate,
            device: deviceKey,
            proof: proof.length > 0 ? proof : undefined,
        };

        // Send
        setIsMutating(true);
        void toast.promise(
            SendSubmission(submission).then(() => {
                void queryClient.invalidateQueries({ queryKey: ['submissions'] });
                void queryClient.invalidateQueries({ queryKey: ['level', activeLevel.ID] });
                void queryClient.invalidateQueries({ queryKey: ['user', submission.userID] });
            }).finally(() => setIsMutating(false)),
            {
                pending: 'Sending...',
                success: 'Submission added',
                error: renderToastError,
            },
        );
    }

    function clear() {
        setRating(undefined);
        setEnjoyment(undefined);
        setRefreshRate(60);
        setDeviceKey(Device.PC);
        setProof('');
        clearActiveLevel();
        markInvalidLevel();
        userSearch.clear();
        userSearch.markInvalid();
    }

    const tierValid = validateTier(rating);
    const enjoymentValid = validateEnjoyment(enjoyment);
    const validOverride = tierValid || enjoymentValid;

    return (
        <div>
            <FloatingLoadingSpinner isLoading={isMutating} />
            <h3 className='text-2xl mb-3'>Add Submission</h3>
            <div className='flex flex-col gap-4'>
                <div>
                    <FormInputLabel htmlFor='addSubmissionSearch'>Level:</FormInputLabel>
                    {SearchBox}
                </div>
                <div>
                    <FormInputLabel htmlFor='addSubmissionUserSearch'>User:</FormInputLabel>
                    {userSearch.SearchBox}
                </div>
                <div>
                    <FormInputLabel htmlFor='addSubmissionTier'>Tier:</FormInputLabel>
                    <NumberInput id='addSubmissionTier' value={rating} onChange={(e) => setRating(parseInt(e.target.value))} invalid={!(tierValid || validOverride)} />
                </div>
                <div>
                    <FormInputLabel htmlFor='addSubmissionEnjoyment'>Enjoyment:</FormInputLabel>
                    <NumberInput id='addSubmissionEnjoyment' value={enjoyment} onChange={(e) => setEnjoyment(parseInt(e.target.value))} invalid={!(enjoymentValid || validOverride)} />
                </div>
                <div>
                    <FormInputLabel htmlFor='addSubmissionRefreshRate'>Refresh rate:</FormInputLabel>
                    <NumberInput id='addSubmissionRefreshRate' value={refreshRate} onChange={(e) => setRefreshRate(parseInt(e.target.value))} invalid={!validateRefreshRate(refreshRate)} />
                    <FormInputDescription>Defaults to 60 if empty.</FormInputDescription>
                </div>
                <div>
                    <FormInputLabel>Device:</FormInputLabel>
                    <Select id='submitDeviceMod' options={deviceOptions} activeKey={deviceKey} onChange={setDeviceKey} />
                </div>
                <div>
                    <FormInputLabel htmlFor='addSubmissionProof'>Proof:</FormInputLabel>
                    <TextInput id='addSubmissionProof' value={proof} onChange={(e) => setProof(e.target.value)} invalid={!validateProof(proof, activeLevel)} />
                    <FormInputDescription>Optional. Has to a valid URL.</FormInputDescription>
                </div>
            </div>
            <div className='flex justify-between mt-3'>
                <PrimaryButton onClick={submit} disabled={isMutating}>Add</PrimaryButton>
                <DangerButton onClick={clear}>Clear</DangerButton>
            </div>
        </div>
    );
}

function validateTier(tier?: number) {
    if (tier === undefined) return false;
    return !isNaN(tier) && tier >= 1 && tier <= 35;
}

function validateEnjoyment(enjoyment?: number) {
    if (enjoyment === undefined) return false;
    return !isNaN(enjoyment) && enjoyment >= 0 && enjoyment <= 10;
}

function validateRefreshRate(FPS: number) {
    return FPS >= 30;
}

function validateProof(proof: string, level?: FullLevel) {
    return !(level?.Meta.Difficulty === Difficulties.Extreme && proof.length === 0);
}
