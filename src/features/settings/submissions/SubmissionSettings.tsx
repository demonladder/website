import { useState } from 'react';
import { NumberInput } from '../../../components/Input';
import Select from '../../../components/Select';
import Notifications from './components/Notifications';
import DiscordRoles from './components/DiscordRoles';
import FormInputDescription from '../../../components/form/FormInputDescription';
import Divider from '../../../components/divider/Divider';
import { useApp } from '../../../context/app/useApp';
import { Device } from '../../../api/core/enums/device.enum';

const deviceOptions = {
    [Device.PC]: 'PC',
    [Device.MOBILE]: 'Mobile',
} as Record<Device, string>;

export default function SubmissionSettings() {
    const app = useApp();
    const [defaultFPS, setDefaultFPS] = useState(app.defaultRefreshRate ?? 60);
    const [FPSInvalid, setFPSInvalid] = useState(false);

    function updateFPS(e: React.ChangeEvent<HTMLInputElement>) {
        const parsed = parseInt(e.target.value);
        setDefaultFPS(parsed);
        setFPSInvalid(false);

        if (isNaN(parsed) || parsed < 30) {
            setFPSInvalid(true);
        } else {
            app.set('defaultRefreshRate', parsed);
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
                <Select id='submitDevice' options={deviceOptions} activeKey={app.defaultDevice ?? Device.PC} onChange={(device) => app.set('defaultDevice', device)} />
                <FormInputDescription>The default device for all your submissions</FormInputDescription>
            </div>
            <Notifications />
            <Divider />
            <DiscordRoles />
        </section>
    );
}
