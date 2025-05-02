import { useState } from 'react';
import CheckBox from '../../../../components/input/CheckBox';
import Select from '../../../../components/Select';
import FormInputLabel from '../../../../components/form/FormInputLabel';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import StorageManager from '../../../../utils/StorageManager';

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
        <section>
            <h2 className='text-3xl mb-4'>Appearance</h2>
            <div className='border-b border-theme-500 pb-2'>
                <label className='flex items-center gap-2'>
                    <CheckBox checked={isBackgroundEnabled} onChange={(e) => setIsBackgroundEnabled(e.target.checked)} />
                    Animated background
                </label>
                <p className='text-theme-400 text-sm'>Get randomized lines that move around in the background, idrk how to describe it.</p>
                <PrimaryButton className='mt-2' onClick={saveBackground}>Save</PrimaryButton>
            </div>
            <div className='border-b border-theme-500 mt-8 pb-2'>
                <FormInputLabel htmlFor='fontTypeSelect'>Font</FormInputLabel>
                <Select id='fontTypeSelect' options={fontOptions} activeKey={fontKey} onChange={onFont} />
                <p className='text-theme-400 text-sm'>Choose between the default sans-serif, serif or a monospaced font.</p>
            </div>
            <div className='mt-12'>
                <p className='mb-2'>Beige, lilac, seaweed and peach by <b>@vindrue</b></p>
                <ul className='flex flex-wrap gap-4'>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--black-from) to-(--black-to) shadow' onClick={() => onTheme('black')} />
                        <p className='text-center'>Black</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--dark-from) to-(--dark-to) shadow' onClick={() => onTheme('dark')} />
                        <p className='text-center'>Dark</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--midnight-from) to-(--midnight-to) shadow' onClick={() => onTheme('midnight')} />
                        <p className='text-center'>Midnight</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--crimson-from) to-(--crimson-to) shadow' onClick={() => onTheme('crimson')} />
                        <p className='text-center'>Crimson</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--coffee-from) to-(--coffee-950) shadow' onClick={() => onTheme('coffee')} />
                        <p className='text-center'>Beige</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--lilac-theme-800) to-(--lilac-theme-900) shadow' onClick={() => onTheme('lilac')} />
                        <p className='text-center'>Lilac</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--rfmx-from) to-(--rfmx-to) shadow' onClick={() => onTheme('rfmx')} />
                        <p className='text-center'>@RFMX</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--blue-from) to-(--blue-to) shadow' onClick={() => onTheme('blue')} />
                        <p className='text-center'>Blue</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--citrus-from) to-(--citrus-to) shadow' onClick={() => onTheme('citrus')} />
                        <p className='text-center'>Citrus</p>
                    </li>
                    <li>
                        <button className='w-24 h-24 rounded-full bg-linear-to-br from-(--seaweed-from) to-(--seaweed-theme-800) shadow' onClick={() => onTheme('seaweed')} />
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
            </div>
        </section>
    );
}
