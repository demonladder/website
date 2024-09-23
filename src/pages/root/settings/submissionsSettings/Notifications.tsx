import { useEffect, useState } from 'react';
import CheckBox from '../../../../components/input/CheckBox';
import { PrimaryButton } from '../../../../components/Button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import UpdateSubmissionSettings, { BitField } from '../../../../api/user/UpdateWants';
import renderToastError from '../../../../utils/renderToastError';
import { NumberInput } from '../../../../components/Input';
import { validateIntInputChange } from '../../../../utils/validators/validateIntChange';
import GetWants from '../../../../api/user/GetWants';
import useUser from '../../../../hooks/useUser';

enum NotificationsBitField {
    Accept = 2 ** 0,
    DMs = 2 ** 1,
}

export default function Notifications() {
    const session = useUser();

    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ['user', session.user?.ID, 'wants'],
        queryFn: GetWants,
    });

    const [acceptNotifs, setAcceptNotifs] = useState<boolean>(((data?.bitField || 0) & NotificationsBitField.Accept) !== 0);
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
            toast.error('An error ocurred');
            return;
        }

        acceptNotifs
            ? wantBitField.add(NotificationsBitField.Accept)
            : wantBitField.remove(NotificationsBitField.Accept);

        DMNotifs
            ? wantBitField.add(NotificationsBitField.DMs)
            : wantBitField.remove(NotificationsBitField.DMs);

        void toast.promise(UpdateSubmissionSettings(wantBitField, parseInt(DMTierLimit)).then(() => queryClient.invalidateQueries(['user', session.user?.ID, 'wants'])), {
            pending: 'Saving...',
            success: 'Saved',
            error: renderToastError,
        });
    }

    return (
        <>
            <div className='divider my-8 text-gray-400'></div>
            <b>Notifications</b>
            <div>
                <label className='flex items-center gap-2 mb-2'>
                    <CheckBox checked={acceptNotifs} onChange={(e) => setAcceptNotifs(e.target.checked)} disabled={session.user === undefined} />
                    Receive notifications when your submissions get accepted
                </label>
                <label className='flex items-center gap-2 mb-2'>
                    <CheckBox checked={DMNotifs} onChange={(e) => setDMNotifs(e.target.checked)} disabled={session.user === undefined} />
                    Receive DMs on Discord when your submissions get accepted
                </label>
                <div className='mb-2'>
                    <label htmlFor='submissionSettingsDMTierLimit'><b>Tier limit for Discord DMs</b></label>
                    <NumberInput id='submissionSettingsDMTierLimit' value={DMTierLimit} onChange={(e) => validateIntInputChange(e, setDMTierLimit)} />
                    <p className='text-sm text-gray-400'>You will only receive DMs if the level is above the specified tier</p>
                </div>
                {session.user &&
                    <PrimaryButton onClick={submit}>Save</PrimaryButton>
                }
            </div>
        </>
    );
}