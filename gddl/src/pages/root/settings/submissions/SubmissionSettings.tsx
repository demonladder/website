import { useState } from 'react';
import { NumberInput } from '../../../../components/Input';
import StorageManager from '../../../../utils/StorageManager';

export default function SubmissionSettings() {
    const [defaultFPS, setDefaultFPS] = useState(StorageManager.getSettings().submission.defaultRefreshRate.toString());
    const [FPSInvalid, setFPSInvalid] = useState(false);

    function updateFPS(e: React.ChangeEvent<HTMLInputElement>) {
        const parsed = parseInt(e.target.value) as number;
        setDefaultFPS(e.target.value);
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
                <label htmlFor='defaultRefreshRateInput'><b>Default refresh rate</b></label>
                <NumberInput id='defaultRefreshRateInput' value={defaultFPS} onChange={updateFPS} invalid={FPSInvalid} />
                <p className='text-gray-400 text-sm'>This value will be used for every submission you send if you don't explicitly type the fps on the submission form</p>
            </div>
        </main>
    );
}