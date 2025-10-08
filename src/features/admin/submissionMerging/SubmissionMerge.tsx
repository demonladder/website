import { useState } from 'react';
import Heading2 from '../../../components/headings/Heading2';
import useUserSearch from '../../../hooks/useUserSearch';
import User from '../../../api/types/User';
import SegmentedButtonGroup from '../../../components/input/buttons/segmented/SegmentedButtonGroup';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { ModeType } from './api/enums/ModeType';
import { useMutation } from '@tanstack/react-query';
import { mergeSubmissions } from './api/mergeSubmissions';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import renderToastError from '../../../utils/renderToastError';
import UserPreview from './components/UserPreview';
import FormGroup from '../../../components/form/FormGroup';
import FormInputLabel from '../../../components/form/FormInputLabel';

const mergeOptions: Record<ModeType, string> = {
    [ModeType.OVERWRITE]: 'Overwrite',
    [ModeType.COMBINE]: 'Combine',
    [ModeType.SKIP]: 'Skip',
};

export default function SubmissionMerge() {
    const [sourceUser, setSourceUser] = useState<User>();
    const [targetUser, setTargetUser] = useState<User>();

    const [mergeMode, setMergeMode] = useState<ModeType>(ModeType.OVERWRITE);

    const searchUser = useUserSearch({
        ID: 'searchUser', onUserSelect: (user) => {
            if (!sourceUser) setSourceUser(user);
            else if (!targetUser) setTargetUser(user);
        },
    });

    const mergeMutation = useMutation({
        mutationFn: () => mergeSubmissions(sourceUser?.ID ?? 0, targetUser?.ID ?? 0, mergeMode),
        onSuccess: () => void toast.success('Submissions merged successfully!'),
        onError: (error: AxiosError) => void toast.error(renderToastError.render({ data: error })),
    });

    return (
        <>
            <Heading2>Merge Submissions</Heading2>
            <p>This tool allows you to merge submissions from one user into another. You can choose to overwrite, combine, or skip submissions based on the selected mode.</p>
            <p>The mode controls how each individual submission will be merged. Here's an explanation on each mode:</p>
            <ul>
                <li className='ms-4'><p>- <b>Overwrite</b>: Completely overwrites the targets submission if it exists.</p></li>
                <li className='ms-4'><p>- <b>Combine</b>: Attempts to merge the two submissions. The following fields will be taken from the source if the target is null: <code>Rating</code>, <code>Enjoyment</code>, <code>Proof</code> and <code>Attempts</code>,</p></li>
                <li className='ms-4'><p>- <b>Skip</b>: Skips the submission if the target already has a submission. Safest.</p></li>
            </ul>
            <FormGroup>
                <FormInputLabel>Select user</FormInputLabel>
                {searchUser.SearchBox}
            </FormGroup>
            <div className='my-4 grid grid-cols-5'>
                <div className='col-span-2 text-center'>{sourceUser && <UserPreview userID={sourceUser.ID} onUnSet={() => setSourceUser(undefined)} />}</div>
                <p className='text-9xl grid'><i className='bx bx-chevron-right place-self-center' /></p>
                <div className='col-span-2 text-center'>{targetUser && <UserPreview userID={targetUser.ID} onUnSet={() => setTargetUser(undefined)} />}</div>
            </div>
            <SegmentedButtonGroup options={mergeOptions} activeKey={mergeMode} onSetActive={setMergeMode} />
            <div className='mt-2 flex justify-end'>
                <PrimaryButton size='lg' onClick={() => mergeMutation.mutate()} disabled={mergeMutation.isPending}>Merge</PrimaryButton>
            </div>
        </>
    );
}
