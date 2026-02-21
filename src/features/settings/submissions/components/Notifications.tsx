import { useEffect, useState } from 'react';
import CheckBox from '../../../../components/input/CheckBox';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import UpdateSubmissionSettings, { BitField } from '../../../../api/user/UpdateWants';
import renderToastError from '../../../../utils/renderToastError';
import { NumberInput } from '../../../../components/shared/input/Input';
import { validateIntInputChange } from '../../../../utils/validators/validateIntChange';
import GetWants from '../../../../api/user/GetWants';
import useSession from '../../../../hooks/useSession';
import FormInputDescription from '../../../../components/form/FormInputDescription';
import Divider from '../../../../components/divider/Divider';

enum NotificationsBitField {
    Accept = 2 ** 0,
    DMs = 2 ** 1,
}

export default function Notifications() {
    const session = useSession();

    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ['user', session.user?.ID, 'wants'],
        queryFn: GetWants,
    });

    const [acceptNotifs, setAcceptNotifs] = useState<boolean>(
        ((data?.bitField || 0) & NotificationsBitField.Accept) !== 0,
    );
    const [DMNotifs, setDMNotifs] = useState<boolean>(((data?.bitField || 0) & NotificationsBitField.DMs) !== 0);
    const [DMTierLimit, setDMTierLimit] = useState(`${data?.DMTierLimit ?? 1}`);
    const [wantBitField, setWantBitField] = useState<BitField>();

    useEffect(() => {
        if (data === undefined) {
            setWantBitField(undefined);
            return;
        }

        setWantBitField(new BitField(data.bitField));
        setAcceptNotifs((data.bitField & NotificationsBitField.Accept) !== 0);
        setDMNotifs((data.bitField & NotificationsBitField.DMs) !== 0);
        if (data.DMTierLimit !== undefined) setDMTierLimit(`${data.DMTierLimit}`);
    }, [data]);

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
            <b>Notifications</b>
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
