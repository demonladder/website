import { useState } from 'react';
import CheckBox from '../../../../components/input/CheckBox';
import Select from '../../../../components/Select';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import StorageManager from '../../../../utils/StorageManager';
import Heading3 from '../../../../components/headings/Heading3';
import Heading2 from '../../../../components/headings/Heading2';
import FormInputDescription from '../../../../components/form/FormInputDescription';
import CustomTheme from './CustomTheme';

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

    function onTheme(theme: string) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    function onFont(type: FontOptionKey) {
        document.documentElement.setAttribute('data-font', type);
        localStorage.setItem('font', type);
        setFontKey(type);
    }

    return (
        <>
            <Heading2 className='mb-4'>Appearance</Heading2>
            <section className='border-b border-theme-500 pb-2'>
                <Heading3>Features</Heading3>
                <label className='flex items-center gap-2'>
                    <CheckBox checked={isBackgroundEnabled} onChange={(e) => setIsBackgroundEnabled(e.target.checked)} />
                    Animated background
                </label>
                <p className='text-theme-400 text-sm'>Get randomized lines that move around in the background, idrk how to describe it.</p>
                <PrimaryButton className='mt-2' onClick={saveBackground}>Save</PrimaryButton>
            </section>
            <div className='divider my-8' />
            <section>
                <Heading3>Font</Heading3>
                <Select id='fontTypeSelect' options={fontOptions} activeKey={fontKey} onChange={onFont} />
                <FormInputDescription>Choose between the default sans-serif, serif or a monospaced font.</FormInputDescription>
            </section>
            <div className='divider my-8' />
            <section className='mt-12'>
                <Heading3>Theme</Heading3>
                <p className='mb-2'>Beige, lilac, seaweed and peach by <b>@vindrue</b></p>
                <ul className='flex flex-wrap gap-4'>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-black-bg-from) to-(--theme-black-bg-to) shadow' onClick={() => onTheme('black')} />
                        <p className='text-center'>Black</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-dark-bg-from) to-(--theme-dark-bg-from) shadow' onClick={() => onTheme('dark')} />
                        <p className='text-center'>Dark</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-midnight-bg-from) to-(--theme-midnight-bg-to) shadow' onClick={() => onTheme('midnight')} />
                        <p className='text-center'>Midnight</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-crimson-bg-from) to-(--theme-crimson-bg-to) shadow' onClick={() => onTheme('crimson')} />
                        <p className='text-center'>Crimson</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-culob-bg-from) to-(--theme-culob-bg-to) shadow' onClick={() => onTheme('culob')} />
                        <p className='text-center'>Culob</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-coffee-bg-from) to-(--theme-coffee-bg-to) shadow' onClick={() => onTheme('coffee')} />
                        <p className='text-center'>Beige</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--lilac-theme-800) to-(--lilac-theme-900) shadow' onClick={() => onTheme('lilac')} />
                        <p className='text-center'>Lilac</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-rfmx-bg-from) to-(--theme-rfmx-bg-to) shadow' onClick={() => onTheme('rfmx')} />
                        <p className='text-center'>@RFMX</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-blue-bg-from) to-(--theme-blue-bg-to) shadow' onClick={() => onTheme('blue')} />
                        <p className='text-center'>Blue</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-citrus-bg-from) to-(--theme-citrus-bg-to) shadow' onClick={() => onTheme('citrus')} />
                        <p className='text-center'>Citrus</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-seaweed-bg-from) to-(--seaweed-theme-800) shadow' onClick={() => onTheme('seaweed')} />
                        <p className='text-center'>Seaweed</p>
                    </li>
                    {/* <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--culob-from) to-(--culob-theme-950) shadow' onClick={() => onTheme('culob')} />
                        <p className='text-center'>@Culob</p>
                    </li> */}
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--peach-from) to-(--peach-theme-950) shadow' onClick={() => onTheme('peach')} />
                        <p className='text-center'>Peach</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--june-from) to-(--june-theme-950) shadow' onClick={() => onTheme('june')} />
                        <p className='text-center'>@June</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--warm-from) to-(--warm-theme-950) shadow' onClick={() => onTheme('warm')} />
                        <p className='text-center'>Warm</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--white-from) to-(--white-to) shadow' onClick={() => onTheme('white')} />
                        <p className='text-center'>White</p>
                    </li>
                </ul>
            </section>
            <div className='divider my-8' />
            <CustomTheme />
        </>
    );
}
