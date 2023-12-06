import { useState } from 'react';
import CheckBox from '../../../../components/input/CheckBox';

export default function Notifications() {
    const [acceptNotifs, setAcceptNotifs] = useState(false);

    return (
        <>
            <div className='divider my-4 text-gray-400'></div>
            <b>Notifications</b>
            <div>
                <label className='flex items-center gap-2'>
                    <CheckBox checked={acceptNotifs} onChange={(e) => setAcceptNotifs(e.target.checked)} />
                    Receive notifications when your submissions get accepted
                </label>
            </div>
        </>
    );
}