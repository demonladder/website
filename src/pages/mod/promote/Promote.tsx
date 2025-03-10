import { useState } from 'react';
import UserSearchBox from '../../../components/UserSearchBox';
import { TinyUser } from '../../../api/types/TinyUser';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { toast } from 'react-toastify';
import Select from '../../../components/Select';
import renderToastError from '../../../utils/renderToastError';
import FormGroup from '../../../components/form/FormGroup';
import PromoteUser from '../../../api/user/PromoteUser';

const permissionOptions: {[key: string]: string} = {
    '0': 'No permissions',
    '1': 'List helper',
    '2': 'Developer',
    '3': 'Moderator',
    '4': 'Admin',
    '5': 'Co-Owner',
    '6': 'Owner',
};

export default function Promote() {
    const [result, setResult] = useState<TinyUser>();
    const [permissionKey, setPermissionKey] = useState('0');

    function submit() {
        if (result === undefined || result === null) {
            toast.error('Select a user first');
            return;
        };

        toast.promise(PromoteUser(result.ID, parseInt(permissionKey)), {
            pending: 'Saving',
            success: 'Promoted ' + result.Name,
            error: renderToastError,
        });
    }

    return (
        <div>
            <h3 className='text-2xl'>Promote User</h3>
            <p className='mb-3'>It's only possible to promote a user up to your own permission level.</p>
            <FormGroup>
                <label htmlFor='promoteUser' className='font-bold'>Username:</label>
                <UserSearchBox setResult={setResult} id='promoteUser' />
            </FormGroup>
            <FormGroup>
                <label htmlFor='permissionLevel' className='font-bold'>Permission level:</label>
                <Select options={permissionOptions} id='permissionSelect' activeKey={permissionKey} onChange={setPermissionKey} />
                <PrimaryButton onClick={submit}>Save</PrimaryButton>
            </FormGroup>
        </div>
    );
}