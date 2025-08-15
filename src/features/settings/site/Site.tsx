import CheckBox from '../../../components/input/CheckBox';
import FormGroup from '../../../components/form/FormGroup';
import FormInputDescription from '../../../components/form/FormInputDescription';
import { useApp } from '../../../context/app/useApp';

export default function ClientSiteSettings() {
    const app = useApp();

    return (
        <main>
            <h2 className='text-3xl'>Settings</h2>
            <p className='mb-4'>There's not much here yet, but have a cookie <span className='inline-block'><img width='32px' src='/images/oreo.jpg' /></span></p>
            <form className='text-lg'>
                <FormGroup>
                    <label className='flex items-center gap-2'>
                        <CheckBox checked={app.enableLevelThumbnails} onChange={(e) => app.set('enableLevelThumbnails', e.target.checked)} />
                        Level thumbnails
                    </label>
                    <FormInputDescription>Replace the background of levels with a thumbnail of the level.</FormInputDescription>
                </FormGroup>
                <FormGroup>
                    <label className='flex items-center gap-2'>
                        <CheckBox checked={app.highlightCompleted} onChange={(e) => app.set('highlightCompleted', e.target.checked)} />
                        Highlight completed levels
                    </label>
                    <FormInputDescription>Adds a checkmark and green background to levels in list view.</FormInputDescription>
                </FormGroup>
            </form>
        </main>
    );
}
