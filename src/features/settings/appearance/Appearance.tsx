import { useState } from 'react';
import CheckBox from '../../../components/input/CheckBox';
import Select from '../../../components/Select';
import Heading3 from '../../../components/headings/Heading3';
import Heading1 from '../../../components/headings/Heading1';
import FormInputDescription from '../../../components/form/FormInputDescription';
import CustomTheme from './components/CustomTheme';
import Divider from '../../../components/divider/Divider';
import ThemeSelect from './components/ThemeSelect';
import FormGroup from '../../../components/form/FormGroup';
import { useApp } from '../../../context/app/useApp';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';

const fontOptions = {
    default: 'Default',
    serif: 'Serif',
    mono: 'Monospace',
};
type FontOptionKey = keyof typeof fontOptions;

export default function Appearance() {
    const [fontKey, setFontKey] = useState<FontOptionKey>((localStorage.getItem('font') ?? 'default') as FontOptionKey);
    const app = useApp();
    const [enableBackgroundInitial] = useState(app.enableBackground);

    function onFont(type: FontOptionKey) {
        document.documentElement.setAttribute('data-font', type);
        localStorage.setItem('font', type);
        setFontKey(type);
    }

    return (
        <>
            <Heading1 className='mb-4'>Appearance</Heading1>
            <section className='pb-2'>
                <Heading3>Features</Heading3>
                <label className='flex items-center gap-2'>
                    <CheckBox checked={app.enableBackground} onChange={(e) => app.set('enableBackground', e.target.checked)} />
                    Animated background
                </label>
                <p className='text-theme-400 text-sm'>Get randomized lines that move around in the background, idrk how to describe it.</p>
                <FormGroup>
                    <label className='flex items-center gap-2'>
                        <CheckBox checked={app.isRounded} onChange={(e) => app.set('isRounded', e.target.checked)} />
                        Rounded corners
                    </label>
                    <FormInputDescription>Gives pretty much everything round corners.</FormInputDescription>
                </FormGroup>
                {app.enableBackground !== enableBackgroundInitial &&
                    <FormGroup>
                        <PrimaryButton onClick={() => window.location.reload()}>Reload</PrimaryButton>
                    </FormGroup>
                }
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
