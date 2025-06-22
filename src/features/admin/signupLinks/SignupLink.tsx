import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import CreateSignupToken from '../../../api/signupToken/SignupToken';
import UserSearchBox from '../../../components/UserSearchBox';
import { TinyUser } from '../../../api/types/TinyUser';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import FormInputLabel from '../../../components/form/FormInputLabel';
import FormGroup from '../../../components/form/FormGroup';

export default function SignupLink() {
    const [result, setResult] = useState<TinyUser>();

    const genToken = useMutation({
        mutationFn: async (context: number) => toast.promise(CreateSignupToken(context), {
            pending: 'Generating...',
            success: 'Sent!',
            error: renderToastError,
        }),
    });

    function newLink() {
        if (result === undefined) return;

        genToken.mutate(result.ID);
    }

    return (
        <div>
            <h3 className='mb-4 text-2xl'>Password reset</h3>
            <p className='mb-4'>Send a one-time reset link to a user. The link will be sent through Discord so the target user should have DMs open and share a server with the bot.</p>
            <FormGroup>
                <FormInputLabel htmlFor='tokenReceiver'>User</FormInputLabel>
                <UserSearchBox setResult={setResult} id='tokenReceiver' />
                <PrimaryButton onClick={newLink} disabled={genToken.status === 'pending'}>Send</PrimaryButton>
            </FormGroup>
        </div>
    );
}
