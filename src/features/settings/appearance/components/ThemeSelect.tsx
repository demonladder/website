import { Heading3 } from '../../../../components/headings';
import { useTheme } from '../../../../context/theme/useTheme';

export default function ThemeSelect() {
    const theme = useTheme();

    function onTheme(themeName: string) {
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('theme', themeName);
        theme.setEnabled(false);
    }

    return (
        <section>
            <Heading3>Theme</Heading3>
            <p className='mb-2'>
                Beige, lilac, seaweed and peach by <b>@vindrue</b>
            </p>
            <ul className='flex flex-wrap gap-4'>
                <li>
                    <button
                        className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-black-bg-from) to-(--theme-black-bg-to) shadow'
                        onClick={() => onTheme('black')}
                    />
                    <p className='text-center'>Black</p>
                </li>
                <li>
                    <button
                        className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-dark-bg-from) to-(--theme-dark-bg-from) shadow'
                        onClick={() => onTheme('dark')}
                    />
                    <p className='text-center'>Dark</p>
                </li>
                <li>
                    <button
                        className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-midnight-700) to-(--theme-midnight-900) shadow'
                        onClick={() => onTheme('midnight')}
                    />
                    <p className='text-center'>Midnight</p>
                </li>
                <li>
                    <button
                        className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-crimson-bg-from) to-(--theme-crimson-bg-to) shadow'
                        onClick={() => onTheme('crimson')}
                    />
                    <p className='text-center'>Crimson</p>
                </li>
                <li>
                    <button
                        className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-culob-bg-from) to-(--theme-culob-bg-to) shadow'
                        onClick={() => onTheme('culob')}
                    />
                    <p className='text-center'>Culob</p>
                </li>
                <li>
                    <button
                        className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-coffee-bg-from) to-(--theme-coffee-bg-to) shadow'
                        onClick={() => onTheme('coffee')}
                    />
                    <p className='text-center'>Beige</p>
                </li>
                <li>
                    <button
                        className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-lilac-bg-from) to-(--theme-lilac-bg-to) shadow'
                        onClick={() => onTheme('lilac')}
                    />
                    <p className='text-center'>Lilac</p>
                </li>
                <li>
                    <button
                        className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-rfmx-bg-from) to-(--theme-rfmx-bg-to) shadow'
                        onClick={() => onTheme('rfmx')}
                    />
                    <p className='text-center'>@RFMX</p>
                </li>
                <li>
                    <button
                        className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-blue-bg-from) to-(--theme-blue-bg-to) shadow'
                        onClick={() => onTheme('blue')}
                    />
                    <p className='text-center'>Blue</p>
                </li>
                <li>
                    <button
                        className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-citrus-bg-from) to-(--theme-citrus-bg-to) shadow'
                        onClick={() => onTheme('citrus')}
                    />
                    <p className='text-center'>Citrus</p>
                </li>
                <li>
                    <button
                        className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-seaweed-bg-from) to-(--theme-seaweed-800) shadow'
                        onClick={() => onTheme('seaweed')}
                    />
                    <p className='text-center'>Seaweed</p>
                </li>
                <li>
                    <button
                        className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-peach-bg-from) to-(--theme-peach-bg-to) shadow'
                        onClick={() => onTheme('peach')}
                    />
                    <p className='text-center'>Peach</p>
                </li>
                <li>
                    <button
                        className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-june-800) to-(--theme-june-outline) shadow'
                        onClick={() => onTheme('june')}
                    />
                    <p className='text-center'>@June</p>
                </li>
                <li>
                    <button
                        className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-warm-bg-from) to-(--theme-warm-950) shadow'
                        onClick={() => onTheme('warm')}
                    />
                    <p className='text-center'>Warm</p>
                </li>
                <li>
                    <button
                        className='w-24 h-24 rounded-full bg-linear-to-br from-(--theme-white-bg-from) to-(--theme-white-bg-to) shadow'
                        onClick={() => onTheme('white')}
                    />
                    <p className='text-center'>White</p>
                </li>
            </ul>
        </section>
    );
}
