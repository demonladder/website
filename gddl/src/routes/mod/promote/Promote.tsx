import { useState } from 'react';
import UserSearchBox from '../../../components/UserSearchBox';
import { PromoteUser, TinyUser } from '../../../api/users';
import { PrimaryButton } from '../../../components/Button';
import { toast } from 'react-toastify';
import Select from '../../../components/Select';

export default function Promote() {
    const [result, setResult] = useState<TinyUser>();
    const [permissionLevel, setPermissionLevel] = useState(0);

    function submit() {
        if (result === undefined) {
            toast.error('Select a user first');
            return;
        };

        toast.promise(PromoteUser(result.ID, permissionLevel), {
            pending: 'Saving',
            success: 'Promoted ' + result.Name,
            error: 'An error occurred',
        }, { autoClose: false });
    }

    return (
        <div>
            <h3 className='mb-3 text-2xl'>Promote User</h3>
            <div className='mb-3'>
                <label htmlFor='promoteUser'>Username:</label>
                <UserSearchBox setResult={setResult} id='promoteUser' />
            </div>
            <div className='mb-3'>
                <label htmlFor='permissionLevel' className='block'>Permission level:</label>
                <Select options={[
                    { key: 0, value: 'No permissions' },
                    { key: 1, value: 'List helper' },
                    { key: 2, value: 'Developer' },
                    { key: 3, value: 'Moderator' },
                    { key: 4, value: 'Admin' },
                    { key: 5, value: 'Co-Owner' },
                    { key: 6, value: 'Owner' },
                ]} id='permissionSelect' onChange={(option) => setPermissionLevel(option.key)} />
                <PrimaryButton onClick={submit}>Save</PrimaryButton>
            </div>
            <div>
                <b className='mb-0'>Permission levels:</b>
                <ol start={0}>
                    <li>0. No permissions</li>
                    <li>1. List helper</li>
                    <li>2. Developer</li>
                    <li>3. Moderator</li>
                    <li>4. Admin</li>
                    <li>5. Co-owner</li>
                    <li>6. Owner</li>
                </ol>
            </div>
        </div>
    );
}