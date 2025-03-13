import { useState } from 'react';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import CheckBox from '../../../../components/input/CheckBox';
import StorageManager from '../../../../utils/StorageManager';
import FormGroup from '../../../../components/form/FormGroup';

export default function ClientSiteSettings() {
    const [isRounded, setIsRounded] = useState<boolean>(StorageManager.getIsRounded());
    const [highlightCompleted, setHighlightCompleted] = useState<boolean>(StorageManager.getHighlightCompleted());
    const [useExperimental, setUseExperimental] = useState<boolean>(StorageManager.getUseExperimental());

    function onSave(e: React.FormEvent) {
        e.preventDefault();

        StorageManager.setRounded(isRounded);
        StorageManager.setHighlightCompleted(highlightCompleted);
        StorageManager.setUseExperimental(useExperimental);
        location.reload();
    }

    return (
        <main>
            <h2 className='text-3xl'>Settings</h2>
            <p className='mb-4'>There's not much here yet, but have a cookie <span className='inline-block'><img width='32px' src='/assets/images/oreo.jpg' /></span></p>
            <form className='text-lg'>
                <FormGroup>
                    <label className='flex items-center gap-2'>
                        <CheckBox checked={isRounded} onChange={(e) => setIsRounded(e.target.checked)} />
                        Rounded corners
                    </label>
                    <p className='text-gray-400 text-sm'>Gives pretty much everything round corners.</p>
                </FormGroup>
                <FormGroup>
                    <label className='flex items-center gap-2'>
                        <CheckBox checked={highlightCompleted} onChange={(e) => setHighlightCompleted(e.target.checked)} />
                        Highlight completed levels
                    </label>
                    <p className='text-gray-400 text-sm'>Adds a checkmark and green background to levels in list view.</p>
                </FormGroup>
                <FormGroup>
                    <label className='flex items-center gap-2'>
                        <CheckBox checked={useExperimental} onChange={(e) => setUseExperimental(e.target.checked)} />
                        Experimental features
                    </label>
                    <p className='text-gray-400 text-sm'>This unlocks beta features that are not yet fully polished!</p>
                </FormGroup>
                <FormGroup>
                    <PrimaryButton type='submit' onClick={onSave}>Save</PrimaryButton>
                </FormGroup>
            </form>
        </main>
    );
}
