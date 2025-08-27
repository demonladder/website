import FilledButton from '../../../components/input/buttons/filled/FilledButton';
import TonalButton from '../../../components/input/buttons/tonal/TonalButton';
import Checkbox from '../../../components/input/CheckBox';
import useSession from '../../../hooks/useSession';

export default function Authorize() {
    const session = useSession();

    return (
        <div className='bg-theme-800 rounded-2xl text-theme-text p-4 border border-theme-700 shadow-xl max-sm:w-full sm:min-w-md'>
            <div className='flex justify-center gap-6 mb-4'>
                <img src='https://globalstatsviewer.com/Logo-gsv.webp' width='80' height='80' className='rounded-full' />
                <p className='self-center'>...</p>
                <img src={`/api/user/${session.user?.ID}/pfp?size=80`} width='80' height='80' className='rounded-full' />
            </div>
            <p className='text-center'><b>GSV</b></p>
            <p className='text-center'>wants to access your GDDL account</p>
            <div className='my-4 px-6 py-8 bg-theme-700 rounded-lg border border-theme-600 max-h-[380px] overflow-y-scroll scrollbar-thin'>
                <p>Authorizing will allow this application to:</p>
                <ul className='mt-3 flex flex-col gap-3'>
                    <li className='flex items-center gap-1'>
                        <Checkbox checked />
                        <p>Submit for you</p>
                    </li>
                    <li className='flex items-center gap-1'>
                        <Checkbox checked />
                        <p>Update your profile</p>
                    </li>
                    <li className='flex items-center gap-1'>
                        <Checkbox />
                        <p>Beat a new hardest for you</p>
                    </li>
                </ul>
                <div className='border-b border-b-theme-500 my-6' />
                <div className='text-sm'>
                    <p>After you authorize, you will be redirected to:</p>
                    <p><b>https://globalstatsviewer.com/</b></p>
                </div>
            </div>
            <div className='grid grid-cols-2 gap-2'>
                <TonalButton size='sm' className='justify-center'>Cancel</TonalButton>
                <FilledButton sizeVariant='sm'>Authorize</FilledButton>
            </div>
        </div>
    );
}
