import { useEffect, useRef } from 'react';
import { PrimaryButton } from '../../../../components/Button';
import CheckBox from '../../../../components/input/CheckBox';
import StorageManager from '../../../../utils/StorageManager';
import FormGroup from '../../../../components/form/FormGroup';

export default function ClientSiteSettings() {
    const roundedRef = useRef<HTMLInputElement>(null);
    const highlightRef = useRef<HTMLInputElement>(null);
    const backgroundRef = useRef<HTMLInputElement>(null);
    const experimentalRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (roundedRef.current) roundedRef.current.checked = StorageManager.getIsRounded();
        if (highlightRef.current) highlightRef.current.checked = StorageManager.getHighlightCompleted();
        if (backgroundRef.current) backgroundRef.current.checked = StorageManager.getUseBackground();
        if (experimentalRef.current) experimentalRef.current.checked = StorageManager.getUseExperimental();
    }, []);
    
    function onSave(e: React.FormEvent) {
        e.preventDefault();

        if (roundedRef.current) StorageManager.setRounded(roundedRef.current.checked);
        if (highlightRef.current) StorageManager.setHighlightCompleted(highlightRef.current.checked);
        if (backgroundRef.current) StorageManager.setUseBackground(backgroundRef.current.checked);
        if (experimentalRef.current) StorageManager.setUseExperimental(experimentalRef.current.checked);
        location.reload();
    }

    return (
        <main>
            <h2 className='text-3xl'>Settings</h2>
            <p className='mb-4'>There's not much here yet, but have a cookie <span className='inline-block'><img width='32px' src='/assets/images/oreo.jpg' /></span></p>
            <form className='text-lg'>
                <FormGroup>
                    <label className='flex items-center gap-2'>
                        <CheckBox ref={roundedRef} />
                        Rounded corners
                    </label>
                    <p className='text-gray-400 text-sm'>Gives pretty much everything round corners.</p>
                </FormGroup>
                <FormGroup>
                    <label className='flex items-center gap-2'>
                        <CheckBox ref={highlightRef} />
                        Highlight completed levels
                    </label>
                    <p className='text-gray-400 text-sm'>Adds a checkmark and green background to levels in list view.</p>
                </FormGroup>
                <FormGroup>
                    <label className='flex items-center gap-2'>
                        <CheckBox ref={backgroundRef} />
                        Background feature
                    </label>
                    <p className='text-gray-400 text-sm'>Will lag your device and it doesn't even look that good!</p>
                </FormGroup>
                <FormGroup>
                <label className='flex items-center gap-2'>
                        <CheckBox ref={experimentalRef} />
                        Experimental features
                    </label>
                    <p className='text-gray-400 text-sm'>This unlocks beta features that are not yet fully polished!</p>
                </FormGroup>
                <div>
                    <PrimaryButton type='submit' onClick={onSave}>Save</PrimaryButton>
                </div>
            </form>
        </main>
    );
}