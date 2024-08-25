import { useState, useEffect } from 'react';
import { NumberInput } from '../../../../components/Input';
import StorageManager from '../../../../utils/StorageManager';
import Select from '../../../../components/Select';
import Notifications from './Notifications';
import DiscordRoles from './DiscordRoles';

const deviceOptions = {
    1: 'PC',
    2: 'Mobile',
};

export default function SubmissionSettings() {
    const [defaultFPS, setDefaultFPS] = useState(StorageManager.getSettings().submission.defaultRefreshRate);
    const [defaultDevice, setDefaultDevice] = useState(StorageManager.getSettings().submission.defaultDevice || '1');
    const [FPSInvalid, setFPSInvalid] = useState(false);

    useEffect(() => {
        StorageManager.setSetting({
            submission: {
                defaultDevice,
            },
        });
    }, [defaultDevice]);

    function updateFPS(e: React.ChangeEvent<HTMLInputElement>) {
        const parsed = parseInt(e.target.value) as number;
        setDefaultFPS(parsed);
        setFPSInvalid(false);

        if (!isNaN(parsed) && parsed >= 30) {
            StorageManager.setSetting({
                submission: {
                    defaultRefreshRate: parsed,
                },
            });
        } else {
            setFPSInvalid(true);
        }
    }

    return (
        <main>
            <h2 className='text-3xl mb-4'>Submission settings</h2>
            <div>
                <label htmlFor='defaultRefreshRateInput'><b>Default FPS</b></label>
                <NumberInput id='defaultRefreshRateInput' value={defaultFPS} onChange={updateFPS} invalid={FPSInvalid} />
                <p className='text-gray-400 text-sm'>This value will be used for every submission you send if you don't explicitly type the fps on the submission form</p>
            </div>
            <div>
                <label htmlFor='submitDevice'><b>Default device</b></label>
                <Select id='submitDevice' options={deviceOptions} activeKey={defaultDevice} onChange={setDefaultDevice} />
                <p className='text-gray-400 text-sm'>The default device for all your submissions</p>
            </div>
            <Notifications />
            <DiscordRoles />
        </main>
    );
}