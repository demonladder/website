import { useState } from 'react';
import CheckBox from '../../../components/input/CheckBox';
import Select from '../../../components/Select';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import StorageManager from '../../../utils/StorageManager';
import Heading3 from '../../../components/headings/Heading3';
import Heading2 from '../../../components/headings/Heading2';
import FormInputDescription from '../../../components/form/FormInputDescription';
import CustomTheme from './components/CustomTheme';
import Divider from '../../../components/divider/Divider';
import ThemeSelect from './components/ThemeSelect';

const fontOptions = {
    default: 'Default',
    serif: 'Serif',
    mono: 'Monospace',
};
type FontOptionKey = keyof typeof fontOptions;

export default function Appearance() {
    const [isBackgroundEnabled, setIsBackgroundEnabled] = useState(StorageManager.getUseBackground());
    const [fontKey, setFontKey] = useState<FontOptionKey>((localStorage.getItem('font') ?? 'default') as FontOptionKey);

    function saveBackground() {
        StorageManager.setUseBackground(isBackgroundEnabled);
        location.reload();
    }

    function onFont(type: FontOptionKey) {
        document.documentElement.setAttribute('data-font', type);
        localStorage.setItem('font', type);
        setFontKey(type);
    }

    return (
        <>
            <Heading2 className='mb-4'>Appearance</Heading2>
            <section className='pb-2'>
                <Heading3>Features</Heading3>
                <label className='flex items-center gap-2'>
                    <CheckBox checked={isBackgroundEnabled} onChange={(e) => setIsBackgroundEnabled(e.target.checked)} />
                    Animated background
                </label>
                <p className='text-theme-400 text-sm'>Get randomized lines that move around in the background, idrk how to describe it.</p>
                <PrimaryButton className='mt-2' onClick={saveBackground}>Save</PrimaryButton>
            </section>
            <Divider />
            <section>
                <Heading3>Font</Heading3>
                <Select id='fontTypeSelect' options={fontOptions} activeKey={fontKey} onChange={onFont} />
                <FormInputDescription>Choose between the default sans-serif, serif or a monospaced font.</FormInputDescription>
            </section>
            <Divider />
            <ThemeSelect />
            <Divider />
            <CustomTheme />
        </>
    );
}
