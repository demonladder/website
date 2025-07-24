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
import { TextInput } from '../../../components/Input';
import FormInputDescription from '../../../components/form/FormInputDescription';
import Heading1 from '../../../components/headings/Heading1';

export default function SignupLink() {
    const [result, setResult] = useState<TinyUser>();
    const [discordIDOverride, setDiscordIDOverride] = useState<string>();

    const genToken = useMutation({
        mutationFn: async (context: { userID: number; discordID?: string }) => toast.promise(CreateSignupToken(context), {
            pending: 'Generating...',
            success: 'Sent!',
            error: renderToastError,
        }),
    });

    function newLink() {
        if (result === undefined) return;

        genToken.mutate({ userID: result.ID, discordID: discordIDOverride });
    }

    return (
        <section>
            <Heading1>Password reset</Heading1>
            <p className='mb-4'>Send a one-time reset link to a user. The link will be sent through Discord so the target user should have DMs open and share a server with the bot.</p>
            <FormGroup>
                <FormInputLabel htmlFor='tokenReceiver'>User</FormInputLabel>
                <UserSearchBox setResult={setResult} id='tokenReceiver' />
            </FormGroup>
            <FormGroup>
                <FormInputLabel>Discord ID override</FormInputLabel>
                <TextInput value={discordIDOverride} onChange={(e) => setDiscordIDOverride(e.target.value)} />
                <FormInputDescription>Used for claiming accounts.</FormInputDescription>
            </FormGroup>
            <FormGroup>
                <PrimaryButton onClick={newLink} disabled={genToken.status === 'pending'}>Send</PrimaryButton>
            </FormGroup>
        </section>
    );
}
