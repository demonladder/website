import { useState } from 'react';
import CheckBox from '../../../../components/input/CheckBox';
import { PrimaryButton } from '../../../../components/ui/buttons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import UpdateSubmissionSettings, { BitField } from '../../../../api/user/UpdateWants';
import renderToastError from '../../../../utils/renderToastError';
import { NumberInput } from '../../../../components/shared/input/Input';
import { validateIntInputChange } from '../../../../utils/validators/validateIntChange';
import GetWants from '../../../../api/user/GetWants';
import useSession from '../../../../hooks/useSession';
import { FormInputDescription } from '../../../../components/form';
import Divider from '../../../../components/divider/Divider';
import InlineLoadingSpinner from '../../../../components/ui/InlineLoadingSpinner';
import { Heading2 } from '../../../../components/headings';

enum NotificationsBitField {
    Accept = 2 ** 0,
    DMs = 2 ** 1,
}

export default function Notifications() {
    const session = useSession();

    const { data, status } = useQuery({
        queryKey: ['user', session.user?.ID, 'wants'],
        queryFn: GetWants,
    });

    if (status === 'pending') return <InlineLoadingSpinner />;
    if (status === 'error' || data === undefined)
        return <p>'An error occurred while fetching your notification settings'</p>;

    return <NotificationsPresenter data={data} />;
}

interface NotificationsPresenterProps {
    data: Awaited<ReturnType<typeof GetWants>>;
}

function NotificationsPresenter({ data }: NotificationsPresenterProps) {
    const session = useSession();
    const queryClient = useQueryClient();

    const [wantBitField] = useState<BitField>(new BitField(data.bitField));
    const [acceptNotifs, setAcceptNotifs] = useState<boolean>(wantBitField.has(NotificationsBitField.Accept));
    const [DMNotifs, setDMNotifs] = useState<boolean>(wantBitField.has(NotificationsBitField.DMs));
    const [DMTierLimit, setDMTierLimit] = useState(`${data.DMTierLimit ?? 1}`);

    function submit() {
        if (data === undefined || wantBitField === undefined) {
            toast.error('An error occurred');
            return;
        }

        if (DMNotifs && !DMTierLimit) {
            toast.error('Please specify a tier limit');
            return;
        }

        if (acceptNotifs) wantBitField.add(NotificationsBitField.Accept);
        else wantBitField.remove(NotificationsBitField.Accept);

        if (DMNotifs) wantBitField.add(NotificationsBitField.DMs);
        else wantBitField.remove(NotificationsBitField.DMs);

        void toast.promise(
            UpdateSubmissionSettings(wantBitField, parseInt(DMTierLimit)).then(() =>
                queryClient.invalidateQueries({ queryKey: ['user', session.user?.ID, 'wants'] }),
            ),
            {
                pending: 'Saving...',
                success: 'Saved',
                error: renderToastError,
            },
        );
    }

    return (
        <>
            <Divider />
            <Heading2>Notifications</Heading2>
            <div>
                <label className='flex items-center gap-2 mb-2'>
                    <CheckBox
                        checked={acceptNotifs}
                        onChange={(e) => setAcceptNotifs(e.target.checked)}
                        disabled={session.user === undefined}
                    />
                    Receive notifications when your submissions get accepted
                </label>
                <label className='flex items-center gap-2 mb-2'>
                    <CheckBox
                        checked={DMNotifs}
                        onChange={(e) => setDMNotifs(e.target.checked)}
                        disabled={session.user === undefined}
                    />
                    Receive DMs on Discord when your submissions get accepted
                </label>
                <div className='mb-2'>
                    <label htmlFor='submissionSettingsDMTierLimit'>
                        <b>Tier limit for Discord DMs</b>
                    </label>
                    <NumberInput
                        id='submissionSettingsDMTierLimit'
                        value={DMTierLimit}
                        onChange={(e) => validateIntInputChange(e, setDMTierLimit)}
                    />
                    <FormInputDescription>
                        You will only receive DMs if the level is above the specified tier
                    </FormInputDescription>
                </div>
                {session.user && <PrimaryButton onClick={submit}>Save</PrimaryButton>}
            </div>
        </>
    );
}
