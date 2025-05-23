import { useState } from 'react';
import { NumberInput } from '../../../../components/Input';
import Select from '../../../../components/Select';
import Notifications from './Notifications';
import DiscordRoles from './DiscordRoles';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import FormInputDescription from '../../../../components/form/FormInputDescription';
import Divider from '../../../../components/divider/Divider';

const deviceOptions = {
    pc: 'PC',
    mobile: 'Mobile',
} as const;

export default function SubmissionSettings() {
    const [defaultFPS, setDefaultFPS] = useLocalStorage('settings.submissions.defaultFPS', 60);
    const [defaultDevice, setDefaultDevice] = useLocalStorage<keyof typeof deviceOptions>('defaultDevice', 'pc');
    const [FPSInvalid, setFPSInvalid] = useState(false);

    function updateFPS(e: React.ChangeEvent<HTMLInputElement>) {
        const parsed = parseInt(e.target.value);
        setDefaultFPS(parsed);
        setFPSInvalid(false);

        if (isNaN(parsed) || parsed < 30) {
            setFPSInvalid(true);
        }
    }

    return (
        <section>
            <h2 className='text-3xl mb-4'>Submission settings</h2>
            <div>
                <label htmlFor='defaultRefreshRateInput'><b>Default FPS</b></label>
                <NumberInput id='defaultRefreshRateInput' value={defaultFPS} onChange={updateFPS} invalid={FPSInvalid} />
                <FormInputDescription>This value will be used for every submission you send if you don't explicitly type the fps on the submission form</FormInputDescription>
            </div>
            <div>
                <label htmlFor='submitDevice'><b>Default device</b></label>
                <Select id='submitDevice' options={deviceOptions} activeKey={defaultDevice ?? 'pc'} onChange={setDefaultDevice} />
                <FormInputDescription>The default device for all your submissions</FormInputDescription>
            </div>
            <Notifications />
            <Divider />
            <DiscordRoles />
        </section>
    );
}
