import { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useUserSearch from '../../../hooks/useUserSearch';
import { GetBanHistory, BanUser } from './api';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { TextInput } from '../../../components/Input';
import useSelect from '../../../hooks/useSelect';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import BanRecord from '../manageUser/BanRecord';

export default function UserBans() {
    const userID = new URLSearchParams(window.location.search).get('userID');
    const user = useUserSearch({ ID: 'banUserSearch', userID: userID ? parseInt(userID) : undefined });

    const durationSelect = useSelect({
        ID: 'banDurationSelect',
        options: {
            1: '1 week',
            4: '1 month',
            13: '3 months',
            26: '6 months',
            10000: 'Permanent',
        },
    });

    const [isLoading, setIsloading] = useState(false);
    const reasonRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ['banHistory', user.activeUser?.ID],
        queryFn: () => GetBanHistory(user.activeUser?.ID),
        enabled: user.activeUser !== undefined,
    });

    function submit(e: React.MouseEvent) {
        e.preventDefault();

        if (user.activeUser === undefined || reasonRef.current === null) {
            return toast.error('An error occurred');
        }

        setIsloading(true);

        const promise = BanUser(user.activeUser.ID, parseInt(durationSelect.activeElement), reasonRef.current.value).then(() => {
            void queryClient.invalidateQueries(['banHistory', user.activeUser?.ID]);
        }).finally(() => {
            setIsloading(false);
        });

        void toast.promise(promise, {
            pending: 'Banning...',
            success: 'User banned!',
            error: renderToastError,
        });
    }

    return (
        <div>
            <h3 className='text-2xl mb-4'>Ban User</h3>
            <div className='mb-8'>
                <label htmlFor='banUserSearch'>Select user:</label>
                {user.SearchBox}
            </div>
            {data !== undefined && user.activeUser !== undefined &&
                <>
                    <div className='mb-8'>
                        <form>
                            <h4 className='text-xl'>Create new ban:</h4>
                            <div className='mb-2'>
                                <label htmlFor='banDurationSelect'>Select duration:</label>
                                {durationSelect.Select}
                            </div>
                            <div>
                                <label htmlFor='banReason'>Reason:</label>
                                <TextInput id='banReason' placeholder='Ban reason...' ref={reasonRef} />
                            </div>
                            <PrimaryButton onClick={submit} disabled={isLoading}>Submit</PrimaryButton>
                        </form>
                    </div>
                    <div>
                        <h4 className='text-xl'>Ban history:</h4>
                        <div>
                            {data.map((record) => (
                                <BanRecord record={record} key={record.BanID} />
                            ))}
                            {data.length === 0 &&
                                <p>Clean record :D</p>
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    );
}